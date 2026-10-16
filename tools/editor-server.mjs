import { createServer } from 'node:http'
import { readFile, rename, unlink, writeFile } from 'node:fs/promises'
import { execFile } from 'node:child_process'
import { createHash, randomBytes } from 'node:crypto'
import { promisify } from 'node:util'
import { fileURLToPath } from 'node:url'
import path from 'node:path'

const execFileAsync = promisify(execFile)
const root = fileURLToPath(new URL('../', import.meta.url))
const dataPath = path.join(root, 'map-data.json')
const port = 8765
const token = randomBytes(24).toString('hex')
const files = new Map([
  ['/', ['index.html', 'text/html; charset=utf-8']],
  ['/editor.html', ['tools/editor.html', 'text/html; charset=utf-8']],
  ['/editor.css', ['tools/editor.css', 'text/css; charset=utf-8']],
  ['/editor.js', ['tools/editor.js', 'text/javascript; charset=utf-8']],
  ['/app.js', ['app.js', 'text/javascript; charset=utf-8']],
  ['/style.css', ['style.css', 'text/css; charset=utf-8']],
  ['/map-data.json', ['map-data.json', 'application/json; charset=utf-8']],
  ['/favicon.svg', ['favicon.svg', 'image/svg+xml']]
])

class RequestError extends Error {
  constructor(message, status = 400, details = {}) {
    super(message)
    this.status = status
    this.details = details
  }
}

const hash = (content) => createHash('sha256').update(content).digest('hex')

function respond(response, status, body) {
  response.writeHead(status, {
    'Content-Type': 'application/json; charset=utf-8',
    'Cache-Control': 'no-store',
    'X-Content-Type-Options': 'nosniff'
  })
  response.end(JSON.stringify(body))
}

function validateTree(value) {
  const ids = new Set()
  let count = 0

  function validateNode(node, depth) {
    if (!node || typeof node !== 'object' || Array.isArray(node) || depth > 3) {
      throw new RequestError('节点层级无效，最多支持四层。')
    }
    const { id, title, description = '', children = [] } = node
    if (typeof id !== 'string' || !/^[a-z0-9-]{1,64}$/.test(id) || ids.has(id)) {
      throw new RequestError('节点 ID 必须唯一且格式有效。')
    }
    if (typeof title !== 'string' || !title.trim() || title.trim().length > 100) {
      throw new RequestError('每个节点都需要标题，且不能超过 100 字。')
    }
    if (typeof description !== 'string' || description.length > 240 || !Array.isArray(children)) {
      throw new RequestError('节点说明或子节点格式无效。')
    }
    if (depth === 3 && children.length) throw new RequestError('最末层节点不能再添加子节点。')
    ids.add(id)
    count += 1
    if (count > 300) throw new RequestError('节点数量不能超过 300 个。')

    const clean = { id, title: title.trim(), description: description.trim() }
    if (children.length) clean.children = children.map((child) => validateNode(child, depth + 1))
    return clean
  }

  const clean = validateNode(value, 0)
  if (clean.id !== 'attention' || clean.children?.length !== 2 ||
      clean.children[0].id !== 'architecture' || clean.children[1].id !== 'runtime') {
    throw new RequestError('请保留「模型结构」和「推理阶段」这两个主分支。')
  }
  return clean
}

async function readBody(request) {
  if (!request.headers['content-type']?.startsWith('application/json')) {
    throw new RequestError('请求格式必须是 JSON。', 415)
  }
  const chunks = []
  let size = 0
  for await (const chunk of request) {
    size += chunk.length
    if (size > 256_000) throw new RequestError('导图数据过大。', 413)
    chunks.push(chunk)
  }
  try {
    return JSON.parse(Buffer.concat(chunks).toString('utf8'))
  } catch {
    throw new RequestError('无法读取导图数据。')
  }
}

async function git(args, timeout = 30_000) {
  try {
    const { stdout } = await execFileAsync('git', args, {
      cwd: root,
      encoding: 'utf8',
      windowsHide: true,
      timeout,
      maxBuffer: 1024 * 1024
    })
    return stdout.trim()
  } catch (error) {
    const message = (error.stderr || error.message || '').trim().slice(-600)
    throw new RequestError(`Git 操作失败：${message}`, 409)
  }
}

async function publish() {
  const branch = await git(['branch', '--show-current'])
  if (branch !== 'main') throw new RequestError('当前不在 main 分支。草稿已保存，请联系我处理后再发布。', 409)

  const remoteLine = await git(['ls-remote', 'origin', 'refs/heads/main'], 60_000)
  const remoteHead = remoteLine.split(/\s+/)[0]
  const localHead = await git(['rev-parse', 'HEAD'])
  if (!remoteHead) throw new RequestError('无法读取 GitHub 的 main 分支。草稿已保存。', 409)

  if (localHead !== remoteHead) {
    const messages = await git(['log', '--format=%s', `${remoteHead}..HEAD`])
    const paths = await git(['log', '--format=', '--name-only', `${remoteHead}..HEAD`])
    const previousEditorCommits = messages && messages.split(/\r?\n/).every((line) => line === 'Update mind map via editor')
    const onlyMapData = paths && paths.split(/\r?\n/).filter(Boolean).every((line) => line === 'map-data.json')
    if (!previousEditorCommits || !onlyMapData) {
      throw new RequestError('本地与 GitHub 分支不一致。草稿已保存，请联系我同步仓库后再发布。', 409)
    }
  }

  if (await git(['status', '--porcelain', '--', 'map-data.json'])) {
    await git(['commit', '--only', '-m', 'Update mind map via editor', '--', 'map-data.json'])
  }
  const head = await git(['rev-parse', 'HEAD'])
  if (head !== remoteHead) await git(['push', 'origin', 'main'], 120_000)
  const verifiedLine = await git(['ls-remote', 'origin', 'refs/heads/main'], 60_000)
  if (verifiedLine.split(/\s+/)[0] !== head) {
    throw new RequestError('提交已完成，但远端校验失败。请稍后重试发布。', 409)
  }
  return head
}

let writing = false

const server = createServer(async (request, response) => {
  try {
    const host = request.headers.host
    if (host !== `127.0.0.1:${port}` && host !== `localhost:${port}`) {
      throw new RequestError('只允许从本机访问编辑器。', 403)
    }
    const origin = `http://${host}`
    const pathname = new URL(request.url, origin).pathname

    if (request.method === 'GET' && pathname === '/api/tree') {
      const raw = await readFile(dataPath, 'utf8')
      const unpublished = Boolean(await git(['status', '--porcelain', '--', 'map-data.json']))
      respond(response, 200, { tree: JSON.parse(raw), version: hash(raw), token, unpublished })
      return
    }

    if (request.method === 'POST' && (pathname === '/api/save' || pathname === '/api/publish')) {
      if (request.headers.origin !== origin || request.headers['x-editor-token'] !== token) {
        throw new RequestError('编辑会话无效，请刷新页面。', 403)
      }
      if (writing) throw new RequestError('上一次操作还未完成。', 409)
      writing = true
      try {
        const body = await readBody(request)
        const tree = validateTree(body.tree)
        const current = await readFile(dataPath, 'utf8')
        if (body.version !== hash(current)) {
          throw new RequestError('导图已在其他位置修改，请刷新编辑页后重试。', 409)
        }
        const next = `${JSON.stringify(tree, null, 2)}\n`
        if (next !== current) {
          const temporary = `${dataPath}.${randomBytes(6).toString('hex')}.tmp`
          try {
            await writeFile(temporary, next, { encoding: 'utf8', flag: 'wx' })
            await rename(temporary, dataPath)
          } finally {
            await unlink(temporary).catch(() => {})
          }
        }
        const version = hash(next)
        if (pathname === '/api/save') {
          respond(response, 200, { message: '已保存到本机，可以先打开预览检查。', version })
        } else {
          try {
            const commit = await publish()
            respond(response, 200, { message: '已提交并推送，GitHub Pages 稍后会更新。', version, commit })
          } catch (error) {
            respond(response, error.status || 500, { error: error.message, saved: true, version })
          }
        }
      } finally {
        writing = false
      }
      return
    }

    if (request.method === 'GET' && files.has(pathname)) {
      const [relativePath, contentType] = files.get(pathname)
      const content = await readFile(path.join(root, relativePath))
      response.writeHead(200, {
        'Content-Type': contentType,
        'Cache-Control': 'no-store',
        'X-Content-Type-Options': 'nosniff',
        ...(pathname === '/editor.html' ? {
          'Content-Security-Policy': "default-src 'self'; script-src 'self'; style-src 'self'; connect-src 'self'; base-uri 'none'; form-action 'none'; frame-ancestors 'none'"
        } : {})
      })
      response.end(content)
      return
    }
    throw new RequestError('页面不存在。', 404)
  } catch (error) {
    respond(response, error.status || 500, { error: error.message || '发生未知错误。' })
  }
})

server.on('error', (error) => {
  console.error(error.code === 'EADDRINUSE' ? `编辑器已在运行：http://127.0.0.1:${port}/editor.html` : error)
  process.exitCode = 1
})

server.listen(port, '127.0.0.1', () => {
  const url = `http://127.0.0.1:${port}/editor.html`
  console.log(`导图编辑器已启动：${url}`)
  console.log('关闭此窗口即可停止编辑器。')
  if (process.platform === 'win32' && process.env.EDITOR_NO_OPEN !== '1') {
    import('node:child_process').then(({ spawn }) => {
      const child = spawn('cmd.exe', ['/d', '/s', '/c', `start "" "${url}"`], {
        detached: true,
        stdio: 'ignore',
        windowsHide: true
      })
      child.unref()
    }).catch(() => {})
  }
})
