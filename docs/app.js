const NODE_WIDTH = 190;
const NODE_HEIGHT = 54;
const COLUMN_GAP = 255;
const ROW_GAP = 90;
const MARGIN = 48;

const viewport = document.getElementById("viewport");
const canvas = document.getElementById("canvas");
const links = document.getElementById("links");
const nodesHost = document.getElementById("nodes");
const nodeCount = document.getElementById("node-count");
const expanded = new Set(["root"]);

let tree;
let transform = { x: 0, y: 0, scale: 1 };

function collectVisible(node, depth, cursor, list, edges, parent) {
  const item = { node, depth, x: MARGIN + depth * COLUMN_GAP, y: 0 };
  list.push(item);
  if (parent) edges.push([parent, item]);

  const children = expanded.has(node.id) ? node.children || [] : [];
  if (children.length === 0) {
    item.y = MARGIN + cursor.value * ROW_GAP;
    cursor.value += 1;
  } else {
    const directChildren = children.map((child) =>
      collectVisible(child, depth + 1, cursor, list, edges, item)
    );
    item.y = (directChildren[0].y + directChildren.at(-1).y) / 2;
  }
  return item;
}

function applyTransform() {
  canvas.style.transform = `translate(${transform.x}px, ${transform.y}px) scale(${transform.scale})`;
}

function fit() {
  const width = canvas.offsetWidth;
  const height = canvas.offsetHeight;
  if (!width || !height) return;
  const scale = Math.max(0.35, Math.min(
    (viewport.clientWidth - 48) / width,
    (viewport.clientHeight - 48) / height,
    1.25
  ));
  transform = {
    scale,
    x: (viewport.clientWidth - width * scale) / 2,
    y: (viewport.clientHeight - height * scale) / 2
  };
  applyTransform();
}

function render(shouldFit = false) {
  const cursor = { value: 0 };
  const edges = [];
  const list = [];
  collectVisible(tree, 0, cursor, list, edges);
  const maxDepth = Math.max(...list.map((item) => item.depth));
  const width = MARGIN * 2 + maxDepth * COLUMN_GAP + NODE_WIDTH;
  const height = Math.max(MARGIN * 2 + (cursor.value - 1) * ROW_GAP + NODE_HEIGHT, 260);
  canvas.style.width = `${width}px`;
  canvas.style.height = `${height}px`;
  links.setAttribute("viewBox", `0 0 ${width} ${height}`);
  links.replaceChildren();
  nodesHost.replaceChildren();

  for (const [source, target] of edges) {
    const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
    const x1 = source.x + NODE_WIDTH;
    const x2 = target.x;
    const control = (x1 + x2) / 2;
    path.setAttribute("d", `M ${x1} ${source.y + NODE_HEIGHT / 2} C ${control} ${source.y + NODE_HEIGHT / 2}, ${control} ${target.y + NODE_HEIGHT / 2}, ${x2} ${target.y + NODE_HEIGHT / 2}`);
    links.append(path);
  }

  for (const item of list) {
    const button = document.createElement("button");
    const hasChildren = (item.node.children || []).length > 0;
    button.type = "button";
    button.className = `node depth-${item.depth}${item.depth === 0 ? " root" : ""}${hasChildren ? "" : " leaf"}`;
    button.style.left = `${item.x}px`;
    button.style.top = `${item.y}px`;
    button.style.height = `${NODE_HEIGHT}px`;

    const title = document.createElement("span");
    title.textContent = item.node.title;
    button.append(title);
    if (hasChildren) {
      const isExpanded = expanded.has(item.node.id);
      const toggle = document.createElement("span");
      toggle.className = "node-toggle";
      toggle.setAttribute("aria-hidden", "true");
      toggle.textContent = isExpanded ? "−" : "+";
      button.append(toggle);
      button.setAttribute("aria-expanded", String(isExpanded));
      button.setAttribute("aria-label", `${item.node.title}，${isExpanded ? "收起" : "展开"}下一级`);
      button.addEventListener("click", () => {
        if (isExpanded) expanded.delete(item.node.id);
        else expanded.add(item.node.id);
        render(true);
      });
    } else {
      button.setAttribute("aria-label", item.node.title);
    }
    nodesHost.append(button);
  }

  nodeCount.textContent = `${list.length} 个可见节点`;
  if (shouldFit) fit();
}

function walk(node, callback) {
  callback(node);
  for (const child of node.children || []) walk(child, callback);
}

function changeZoom(factor) {
  const next = Math.min(2, Math.max(0.3, transform.scale * factor));
  const cx = viewport.clientWidth / 2;
  const cy = viewport.clientHeight / 2;
  transform.x = cx - ((cx - transform.x) / transform.scale) * next;
  transform.y = cy - ((cy - transform.y) / transform.scale) * next;
  transform.scale = next;
  applyTransform();
}

document.getElementById("expand-all").addEventListener("click", () => {
  walk(tree, (node) => expanded.add(node.id));
  render(true);
});
document.getElementById("collapse-all").addEventListener("click", () => {
  expanded.clear();
  render(true);
});
document.getElementById("zoom-in").addEventListener("click", () => changeZoom(1.2));
document.getElementById("zoom-out").addEventListener("click", () => changeZoom(1 / 1.2));
document.getElementById("fit").addEventListener("click", fit);

let drag = null;
viewport.addEventListener("pointerdown", (event) => {
  if (event.target.closest("button")) return;
  drag = { x: event.clientX, y: event.clientY, startX: transform.x, startY: transform.y };
  viewport.setPointerCapture(event.pointerId);
  viewport.classList.add("dragging");
});
viewport.addEventListener("pointermove", (event) => {
  if (!drag) return;
  transform.x = drag.startX + event.clientX - drag.x;
  transform.y = drag.startY + event.clientY - drag.y;
  applyTransform();
});
function endDrag() {
  drag = null;
  viewport.classList.remove("dragging");
}
viewport.addEventListener("pointerup", endDrag);
viewport.addEventListener("pointercancel", endDrag);
viewport.addEventListener("wheel", (event) => {
  event.preventDefault();
  changeZoom(event.deltaY < 0 ? 1.1 : 1 / 1.1);
}, { passive: false });

fetch("./map.json")
  .then((response) => {
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    return response.json();
  })
  .then((data) => {
    tree = data;
    render(true);
    new ResizeObserver(() => fit()).observe(viewport);
  })
  .catch(() => {
    nodeCount.textContent = "知识图谱加载失败";
  });
