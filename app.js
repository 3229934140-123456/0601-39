// ====== 全局状态 ======
const state = {
  canvasWidth: 1080,
  canvasHeight: 1080,
  elements: [],
  selectedElementIds: [],
  zoom: 0.5,
  history: [],
  historyIndex: -1,
  maxHistory: 50,
  savedColors: JSON.parse(localStorage.getItem('savedColors') || '[]'),
  drafts: JSON.parse(localStorage.getItem('designDrafts') || '[]'),
  currentDraftId: null,
  clipboardColor: '#667eea'
};

let elementIdCounter = 1;
const genId = () => `el_${elementIdCounter++}_${Date.now()}`;

// ====== 尺寸预设 ======
const sizePresets = [
  { name: '手机竖版', width: 1080, height: 1920, value: '1080x1920' },
  { name: '方图', width: 1080, height: 1080, value: '1080x1080' },
  { name: '横版', width: 1920, height: 1080, value: '1920x1080' },
  { name: '小红书', width: 800, height: 800, value: '800x800' },
  { name: 'iPhone', width: 750, height: 1334, value: '750x1334' }
];

// ====== 模板数据 ======
const templates = [
  {
    id: 'tpl-1',
    name: '新品发布',
    bg: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    elements: [
      { type: 'text', x: 100, y: 200, text: '新品上市', fontSize: 80, fontWeight: 700, color: '#fff', textAlign: 'center', width: 880, fontFamily: "'PingFang SC', sans-serif" },
      { type: 'text', x: 100, y: 320, text: '限时特惠 即刻抢购', fontSize: 36, fontWeight: 400, color: 'rgba(255,255,255,0.85)', textAlign: 'center', width: 880, fontFamily: "'PingFang SC', sans-serif" },
      { type: 'shape', shapeType: 'rounded', x: 340, y: 450, width: 400, height: 100, fill: '#fff', borderRadius: 50 },
      { type: 'text', x: 340, y: 475, text: '立即购买', fontSize: 32, fontWeight: 600, color: '#667eea', textAlign: 'center', width: 400, fontFamily: "'PingFang SC', sans-serif" }
    ]
  },
  {
    id: 'tpl-2',
    name: '节日促销',
    bg: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
    elements: [
      { type: 'text', x: 50, y: 150, text: '🎉 大促狂欢节', fontSize: 64, fontWeight: 800, color: '#fff', textAlign: 'center', width: 980, fontFamily: "'PingFang SC', sans-serif" },
      { type: 'text', x: 50, y: 260, text: '全场低至3折起', fontSize: 48, fontWeight: 700, color: '#fff9c4', textAlign: 'center', width: 980, fontFamily: "'PingFang SC', sans-serif" },
      { type: 'text', x: 50, y: 350, text: '活动时间：6月1日-6月18日', fontSize: 24, fontWeight: 400, color: 'rgba(255,255,255,0.9)', textAlign: 'center', width: 980, fontFamily: "'PingFang SC', sans-serif" },
      { type: 'shape', shapeType: 'rounded', x: 290, y: 600, width: 500, height: 120, fill: '#fff', borderRadius: 60 },
      { type: 'text', x: 290, y: 635, text: '¥ 99 起', fontSize: 48, fontWeight: 800, color: '#f5576c', textAlign: 'center', width: 500, fontFamily: "'PingFang SC', sans-serif" }
    ]
  },
  {
    id: 'tpl-3',
    name: '简约商务',
    bg: 'linear-gradient(180deg, #f8f9fa 0%, #e9ecef 100%)',
    elements: [
      { type: 'shape', shapeType: 'rect', x: 0, y: 0, width: 1080, height: 300, fill: '#2c3e50' },
      { type: 'text', x: 80, y: 100, text: '企业品牌宣传', fontSize: 56, fontWeight: 700, color: '#fff', textAlign: 'left', width: 920, fontFamily: "'PingFang SC', sans-serif" },
      { type: 'text', x: 80, y: 180, text: '专业 · 高效 · 可信赖', fontSize: 24, fontWeight: 400, color: 'rgba(255,255,255,0.7)', textAlign: 'left', width: 920, fontFamily: "'PingFang SC', sans-serif" },
      { type: 'text', x: 80, y: 400, text: '核心优势', fontSize: 36, fontWeight: 600, color: '#2c3e50', textAlign: 'left', width: 920, fontFamily: "'PingFang SC', sans-serif" },
      { type: 'text', x: 80, y: 470, text: '✓ 十年行业经验\n✓ 专业服务团队\n✓ 定制化解决方案', fontSize: 28, fontWeight: 400, color: '#495057', textAlign: 'left', width: 920, lineHeight: 2, fontFamily: "'PingFang SC', sans-serif" }
    ]
  },
  {
    id: 'tpl-4',
    name: '清新自然',
    bg: 'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)',
    elements: [
      { type: 'text', x: 50, y: 180, text: '🌸 春日限定', fontSize: 72, fontWeight: 700, color: '#5d4e6d', textAlign: 'center', width: 980, fontFamily: "'KaiTi', serif" },
      { type: 'text', x: 50, y: 300, text: '遇见美好时光', fontSize: 32, fontWeight: 400, color: '#7c6a8c', textAlign: 'center', width: 980, fontFamily: "'KaiTi', serif" },
      { type: 'shape', shapeType: 'circle', x: 440, y: 500, width: 200, height: 200, fill: 'rgba(255,255,255,0.6)' },
      { type: 'text', x: 440, y: 570, text: '了解更多', fontSize: 24, fontWeight: 500, color: '#5d4e6d', textAlign: 'center', width: 200, fontFamily: "'PingFang SC', sans-serif" }
    ]
  },
  {
    id: 'tpl-5',
    name: '科技感',
    bg: 'linear-gradient(135deg, #0c0c0c 0%, #1a1a2e 50%, #16213e 100%)',
    elements: [
      { type: 'text', x: 50, y: 200, text: 'TECH', fontSize: 100, fontWeight: 900, color: '#00d9ff', textAlign: 'center', width: 980, letterSpacing: 10, fontFamily: "'Courier New', monospace" },
      { type: 'text', x: 50, y: 340, text: '创新科技 引领未来', fontSize: 32, fontWeight: 300, color: 'rgba(255,255,255,0.8)', textAlign: 'center', width: 980, letterSpacing: 4, fontFamily: "'PingFang SC', sans-serif" },
      { type: 'shape', shapeType: 'rect', x: 200, y: 550, width: 680, height: 4, fill: '#00d9ff' },
      { type: 'text', x: 50, y: 600, text: 'EXPLORE MORE →', fontSize: 20, fontWeight: 400, color: '#00d9ff', textAlign: 'center', width: 980, letterSpacing: 6, fontFamily: "'Courier New', monospace" }
    ]
  },
  {
    id: 'tpl-6',
    name: '活动邀请',
    bg: 'linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%)',
    elements: [
      { type: 'shape', shapeType: 'rounded', x: 80, y: 80, width: 920, height: 920, fill: 'rgba(255,255,255,0.5)', borderRadius: 20, stroke: '#fff', strokeWidth: 4 },
      { type: 'text', x: 80, y: 200, text: '诚邀您参加', fontSize: 28, fontWeight: 400, color: '#6b5b5b', textAlign: 'center', width: 920, fontFamily: "'KaiTi', serif" },
      { type: 'text', x: 80, y: 280, text: '年度盛典', fontSize: 80, fontWeight: 700, color: '#d4726a', textAlign: 'center', width: 920, fontFamily: "'PingFang SC', sans-serif" },
      { type: 'text', x: 80, y: 450, text: '2024年12月31日  19:00', fontSize: 28, fontWeight: 500, color: '#6b5b5b', textAlign: 'center', width: 920, fontFamily: "'PingFang SC', sans-serif" },
      { type: 'text', x: 80, y: 520, text: '北京国际会议中心', fontSize: 24, fontWeight: 400, color: '#8b7355', textAlign: 'center', width: 920, fontFamily: "'PingFang SC', sans-serif" }
    ]
  }
];

// ====== 素材数据 ======
const iconAssets = [
  '⭐', '❤️', '👍', '🎉', '🔥', '💡', '📱', '💻',
  '🎁', '🏆', '⭐', '✨', '🌸', '🍀', '🌙', '☀️',
  '👑', '💎', '🚀', '🎯', '📊', '💰', '🎵', '📷',
  '🏠', '✉️', '☎️', '📍', '🔔', '⚡', '🎨', '📌'
];

const shapeAssets = [
  { type: 'rect', name: '矩形', icon: '⬜' },
  { type: 'circle', name: '圆形', icon: '⭕' },
  { type: 'triangle', name: '三角形', icon: '🔺' },
  { type: 'rounded', name: '圆角矩形', icon: '▢' }
];

const brandColors = [
  '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4',
  '#FFEAA7', '#DDA0DD', '#98D8C8', '#F7DC6F',
  '#BB8FCE', '#85C1E9', '#F8B500', '#00C853'
];

const colorSchemes = [
  { name: '渐变紫', colors: ['#667eea', '#764ba2'] },
  { name: '日落橙', colors: ['#f093fb', '#f5576c'] },
  { name: '海洋蓝', colors: ['#4facfe', '#00f2fe'] },
  { name: '森林绿', colors: ['#11998e', '#38ef7d'] },
  { name: '暖阳黄', colors: ['#f7971e', '#ffd200'] },
  { name: '玫瑰粉', colors: ['#ff9a9e', '#fecfef'] },
  { name: '深邃蓝', colors: ['#0c0c0c', '#1a1a2e'] },
  { name: '薄荷绿', colors: ['#a8edea', '#fed6e3'] }
];

// ====== DOM 元素 ======
const $ = (id) => document.getElementById(id);
const canvas = $('designCanvas');
const canvasContainer = $('canvasContainer');
const canvasWrapper = $('canvasWrapper');

// ====== 初始化 ======
function init() {
  loadMyAssets();
  renderTemplates();
  renderAssets('images');
  renderBrandColors();
  renderColorSchemes();
  renderSavedColors();
  updateCanvasSize();
  updateZoom();
  saveHistory();
  bindEvents();
  
  // 默认加载一个模板
  applyTemplate(templates[0]);
  
  // 初始适配
  setTimeout(zoomFit, 100);
}

// ====== 画布系统 ======
function updateCanvasSize() {
  canvas.style.width = state.canvasWidth + 'px';
  canvas.style.height = state.canvasHeight + 'px';
  
  canvasContainer.style.width = state.canvasWidth + 'px';
  canvasContainer.style.height = state.canvasHeight + 'px';
  canvasContainer.style.transform = `translate(-50%, -50%) scale(${state.zoom})`;
  
  const wrapper = $('canvasWrapper');
  const minW = state.canvasWidth * state.zoom + 80;
  const minH = state.canvasHeight * state.zoom + 80;
  wrapper.style.minWidth = minW + 'px';
  wrapper.style.minHeight = minH + 'px';
  
  // 滚动到中心
  requestAnimationFrame(() => {
    wrapper.scrollLeft = (wrapper.scrollWidth - wrapper.clientWidth) / 2;
    wrapper.scrollTop = (wrapper.scrollHeight - wrapper.clientHeight) / 2;
  });
}

function updateZoom() {
  $('zoomLevel').textContent = Math.round(state.zoom * 100) + '%';
  updateCanvasSize();
}

function zoomIn() {
  state.zoom = Math.min(2, state.zoom + 0.1);
  updateZoom();
}

function zoomOut() {
  state.zoom = Math.max(0.1, state.zoom - 0.1);
  updateZoom();
}

function zoomFit() {
  const wrapper = $('canvasWrapper');
  const wrapperW = wrapper.clientWidth - 80;
  const wrapperH = wrapper.clientHeight - 80;
  if (wrapperW <= 0 || wrapperH <= 0) return;
  const scaleX = wrapperW / state.canvasWidth;
  const scaleY = wrapperH / state.canvasHeight;
  state.zoom = Math.min(1, Math.min(scaleX, scaleY));
  updateZoom();
}

// ====== 元素渲染 ======
function renderElements() {
  canvas.innerHTML = '';
  state.elements.forEach((el) => {
    const elDom = createElementDOM(el);
    if (elDom) {
      if (state.selectedElementIds.includes(el.id)) {
        elDom.classList.add('selected');
        addResizeHandles(elDom, el);
      }
      if (el.locked) elDom.classList.add('locked');
      if (el.hidden) elDom.style.visibility = 'hidden';
      canvas.appendChild(elDom);
    }
  });
  renderLayers();
}

function createElementDOM(el) {
  const div = document.createElement('div');
  div.className = 'canvas-element';
  div.dataset.id = el.id;
  div.style.left = el.x + 'px';
  div.style.top = el.y + 'px';
  div.style.width = (el.width || 100) + 'px';
  div.style.height = (el.height || 100) + 'px';
  div.style.opacity = (el.opacity !== undefined ? el.opacity : 100) / 100;
  if (el.rotation) {
    div.style.transform = `rotate(${el.rotation}deg)`;
    div.style.transformOrigin = 'center center';
  }
  
  if (el.type === 'text') {
    div.classList.add('text-element');
    div.textContent = el.text || '文本内容';
    div.style.fontSize = (el.fontSize || 32) + 'px';
    div.style.fontWeight = el.fontWeight || 400;
    div.style.color = el.color || '#333';
    div.style.textAlign = el.textAlign || 'left';
    div.style.fontFamily = el.fontFamily || "'PingFang SC', sans-serif";
    div.style.lineHeight = el.lineHeight || 1.4;
    div.style.letterSpacing = (el.letterSpacing || 0) + 'px';
    div.style.whiteSpace = 'pre-wrap';
    div.style.wordBreak = 'break-word';
    
    div.addEventListener('dblclick', (e) => {
      if (el.locked) return;
      e.stopPropagation();
      div.contentEditable = 'true';
      div.focus();
      const range = document.createRange();
      range.selectNodeContents(div);
      const sel = window.getSelection();
      sel.removeAllRanges();
      sel.addRange(range);
    });
    
    div.addEventListener('blur', () => {
      div.contentEditable = 'false';
      const element = getElementById(el.id);
      if (element) {
        element.text = div.textContent;
        saveHistory();
      }
    });
    
    div.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        div.blur();
      }
    });
  } else if (el.type === 'shape') {
    div.classList.add('shape-element');
    const shapeType = el.shapeType || 'rect';
    
    if (shapeType === 'rect') {
      div.style.background = el.fill || '#667eea';
      if (el.stroke) {
        div.style.border = `${el.strokeWidth || 2}px solid ${el.stroke}`;
      }
    } else if (shapeType === 'rounded') {
      div.style.background = el.fill || '#667eea';
      div.style.borderRadius = (el.borderRadius || 16) + 'px';
      if (el.stroke) {
        div.style.border = `${el.strokeWidth || 2}px solid ${el.stroke}`;
      }
    } else if (shapeType === 'circle') {
      div.style.background = el.fill || '#667eea';
      div.style.borderRadius = '50%';
      if (el.stroke) {
        div.style.border = `${el.strokeWidth || 2}px solid ${el.stroke}`;
      }
    } else if (shapeType === 'triangle') {
      div.style.width = '0';
      div.style.height = '0';
      div.style.borderLeft = (el.width / 2) + 'px solid transparent';
      div.style.borderRight = (el.width / 2) + 'px solid transparent';
      div.style.borderBottom = el.height + 'px solid ' + (el.fill || '#667eea');
      div.style.background = 'transparent';
    }
  } else if (el.type === 'image') {
    const img = document.createElement('img');
    img.className = 'image-element';
    img.src = el.src;
    img.draggable = false;
    div.appendChild(img);
  }
  
  div.addEventListener('mousedown', (e) => {
    if (el.locked) return;
    if (e.target.classList.contains('resize-handle')) return;
    if (div.contentEditable === 'true') return;
    if (e.target.classList.contains('rotate-handle')) return;
    
    e.stopPropagation();
    
    if (!e.shiftKey && !state.selectedElementIds.includes(el.id)) {
      selectElement(el.id);
    } else if (e.shiftKey) {
      toggleSelection(el.id);
    }
    
    startDrag(e, el);
  });
  
  return div;
}

function addResizeHandles(elDom, el) {
  const handles = ['nw', 'n', 'ne', 'e', 'se', 's', 'sw', 'w'];
  handles.forEach(pos => {
    const handle = document.createElement('div');
    handle.className = `resize-handle ${pos}`;
    handle.addEventListener('mousedown', (e) => {
      e.stopPropagation();
      e.preventDefault();
      startResize(e, el, pos);
    });
    elDom.appendChild(handle);
  });
  
  const rotateHandle = document.createElement('div');
  rotateHandle.className = 'rotate-handle';
  rotateHandle.innerHTML = '↻';
  rotateHandle.addEventListener('mousedown', (e) => {
    e.stopPropagation();
    e.preventDefault();
    startRotate(e, el);
  });
  elDom.appendChild(rotateHandle);
}

// ====== 拖拽功能 ======
let dragState = null;

function startDrag(e, el) {
  const rect = canvas.getBoundingClientRect();
  const startX = e.clientX;
  const startY = e.clientY;
  
  const selectedElements = state.selectedElementIds.map(id => getElementById(id)).filter(Boolean);
  const startPositions = selectedElements.map(e => ({ x: e.x, y: e.y }));
  
  function onMouseMove(ev) {
    const dx = (ev.clientX - startX) / state.zoom;
    const dy = (ev.clientY - startY) / state.zoom;
    
    selectedElements.forEach((selEl, i) => {
      selEl.x = Math.round(startPositions[i].x + dx);
      selEl.y = Math.round(startPositions[i].y + dy);
    });
    
    renderElements();
    updatePropertiesPanel();
  }
  
  function onMouseUp() {
    document.removeEventListener('mousemove', onMouseMove);
    document.removeEventListener('mouseup', onMouseUp);
    saveHistory();
  }
  
  document.addEventListener('mousemove', onMouseMove);
  document.addEventListener('mouseup', onMouseUp);
}

// ====== 缩放功能 ======
function startResize(e, el, position) {
  const startX = e.clientX;
  const startY = e.clientY;
  const startW = el.width;
  const startH = el.height;
  const startLeft = el.x;
  const startTop = el.y;
  const aspectRatio = startW / startH;
  
  function onMouseMove(ev) {
    let dx = (ev.clientX - startX) / state.zoom;
    let dy = (ev.clientY - startY) / state.zoom;
    
    let newW = startW;
    let newH = startH;
    let newX = startLeft;
    let newY = startTop;
    
    if (position.includes('e')) newW = Math.max(20, startW + dx);
    if (position.includes('w')) { newW = Math.max(20, startW - dx); }
    if (position.includes('s')) newH = Math.max(20, startH + dy);
    if (position.includes('n')) { newH = Math.max(20, startH - dy); }
    
    if (ev.shiftKey && (position.length === 2 || position === 'nw' || position === 'ne' || position === 'sw' || position === 'se')) {
      if (Math.abs(dx) > Math.abs(dy)) {
        newH = newW / aspectRatio;
      } else {
        newW = newH * aspectRatio;
      }
    }
    
    if (position.includes('w')) newX = startLeft + startW - newW;
    if (position.includes('n')) newY = startTop + startH - newH;
    
    el.x = Math.round(newX);
    el.y = Math.round(newY);
    el.width = Math.round(newW);
    el.height = Math.round(newH);
    
    renderElements();
    updatePropertiesPanel();
    updateTextProperties();
  }
  
  function onMouseUp() {
    document.removeEventListener('mousemove', onMouseMove);
    document.removeEventListener('mouseup', onMouseUp);
    saveHistory();
  }
  
  document.addEventListener('mousemove', onMouseMove);
  document.addEventListener('mouseup', onMouseUp);
}

// ====== 旋转功能 ======
function startRotate(e, el) {
  const startX = e.clientX;
  const startY = e.clientY;
  const element = getElementById(el.id);
  const startRotation = element.rotation || 0;
  
  const canvasRect = canvas.getBoundingClientRect();
  const centerX = (element.x + element.width / 2) * state.zoom + canvasRect.left;
  const centerY = (element.y + element.height / 2) * state.zoom + canvasRect.top;
  
  function onMouseMove(ev) {
    const angle1 = Math.atan2(startY - centerY, startX - centerX);
    const angle2 = Math.atan2(ev.clientY - centerY, ev.clientX - centerX);
    const deltaAngle = (angle2 - angle1) * 180 / Math.PI;
    
    let newRotation = startRotation + deltaAngle;
    if (ev.shiftKey) {
      newRotation = Math.round(newRotation / 15) * 15;
    }
    
    element.rotation = Math.round(newRotation);
    renderElements();
    updatePropertiesPanel();
  }
  
  function onMouseUp() {
    document.removeEventListener('mousemove', onMouseMove);
    document.removeEventListener('mouseup', onMouseUp);
    saveHistory();
  }
  
  document.addEventListener('mousemove', onMouseMove);
  document.addEventListener('mouseup', onMouseUp);
}

// ====== 选择功能 ======
function selectElement(id) {
  state.selectedElementIds = [id];
  renderElements();
  updateTextProperties();
  updatePropertiesPanel();
  updateImageActions();
}

function toggleSelection(id) {
  const idx = state.selectedElementIds.indexOf(id);
  if (idx > -1) {
    state.selectedElementIds.splice(idx, 1);
  } else {
    state.selectedElementIds.push(id);
  }
  renderElements();
  updateTextProperties();
  updatePropertiesPanel();
  updateImageActions();
}

function selectAll() {
  state.selectedElementIds = state.elements.map(e => e.id);
  renderElements();
  updateTextProperties();
  updatePropertiesPanel();
  updateImageActions();
}

function deselectAll() {
  state.selectedElementIds = [];
  renderElements();
  updateTextProperties();
  updatePropertiesPanel();
  updateImageActions();
}

function getElementById(id) {
  return state.elements.find(e => e.id === id);
}

// ====== 模板系统 ======
function renderTemplates() {
  const grid = $('templatesGrid');
  grid.innerHTML = '';
  const searchTerm = $('templateSearch').value.toLowerCase();
  
  templates.filter(t => t.name.toLowerCase().includes(searchTerm)).forEach(tpl => {
    const item = document.createElement('div');
    item.className = 'template-item';
    item.innerHTML = `
      <div class="template-thumb" style="background: ${tpl.bg};">📄</div>
      <div class="template-name">${tpl.name}</div>
    `;
    item.addEventListener('click', () => applyTemplate(tpl));
    grid.appendChild(item);
  });
}

function applyTemplate(tpl) {
  state.elements = [];
  state.selectedElementIds = [];
  elementIdCounter = 1;
  
  canvas.style.background = tpl.bg;
  state.canvasBg = tpl.bg;
  
  tpl.elements.forEach(el => {
    const newEl = JSON.parse(JSON.stringify(el));
    newEl.id = genId();
    newEl.opacity = 100;
    if (newEl.type === 'text') {
      if (!newEl.height) newEl.height = newEl.fontSize * 2;
    }
    state.elements.push(newEl);
  });
  
  renderElements();
  saveHistory();
  showToast(`已应用模板：${tpl.name}`);
}

// ====== 素材系统 ======
let currentAssetTab = 'images';
let currentImageTab = 'all';
let assetSearchKeyword = '';
let myImageAssets = [];

function loadMyAssets() {
  try {
    const saved = localStorage.getItem('myImageAssets');
    if (saved) {
      myImageAssets = JSON.parse(saved);
    }
  } catch (e) {
    myImageAssets = [];
  }
}

function saveMyAssets() {
  try {
    localStorage.setItem('myImageAssets', JSON.stringify(myImageAssets));
  } catch (e) {
    showToast('素材库保存失败，可能是存储已满', 'error');
  }
}

function isAssetFavorite(src) {
  return myImageAssets.some(a => a.src === src);
}

function toggleFavoriteAsset(src, name) {
  const idx = myImageAssets.findIndex(a => a.src === src);
  if (idx >= 0) {
    myImageAssets.splice(idx, 1);
    showToast('已取消收藏');
  } else {
    myImageAssets.unshift({
      id: 'my_' + Date.now(),
      src: src,
      name: name || '我的图片',
      createTime: Date.now()
    });
    showToast('已收藏到素材库');
  }
  saveMyAssets();
  if (currentAssetTab === 'images') {
    renderAssets('images');
  }
}

function deleteMyAsset(id) {
  const idx = myImageAssets.findIndex(a => a.id === id);
  if (idx >= 0) {
    myImageAssets.splice(idx, 1);
    saveMyAssets();
    showToast('已删除');
    if (currentImageTab === 'mine' || currentAssetTab === 'images') {
      renderAssets('images');
    }
  }
}

function renameMyAsset(id, newName) {
  const asset = myImageAssets.find(a => a.id === id);
  if (asset) {
    asset.name = newName;
    saveMyAssets();
    if (currentAssetTab === 'images') {
      renderAssets('images');
    }
  }
}

function renderAssets(type) {
  currentAssetTab = type;
  const grid = $('assetsGrid');
  grid.innerHTML = '';
  
  const searchBox = $('assetsSearchBox');
  const subTabs = $('imageSubTabs');
  
  if (type === 'images') {
    searchBox.style.display = 'block';
    subTabs.style.display = 'flex';
  } else {
    searchBox.style.display = 'none';
    subTabs.style.display = 'none';
  }
  
  if (type === 'icons') {
    iconAssets.forEach(icon => {
      const item = document.createElement('div');
      item.className = 'asset-item draggable-asset';
      item.textContent = icon;
      item.title = '点击或拖拽添加图标';
      item.draggable = true;
      item.dataset.assetType = 'icon';
      item.dataset.assetData = icon;
      item.addEventListener('click', () => addIconToCanvas(icon));
      item.addEventListener('dragstart', handleAssetDragStart);
      grid.appendChild(item);
    });
  } else if (type === 'shapes') {
    shapeAssets.forEach(shape => {
      const item = document.createElement('div');
      item.className = 'asset-item draggable-asset';
      item.textContent = shape.icon;
      item.title = shape.name + ' (点击或拖拽添加)';
      item.draggable = true;
      item.dataset.assetType = 'shape';
      item.dataset.assetData = shape.type;
      item.addEventListener('click', () => addShapeToCanvas(shape.type));
      item.addEventListener('dragstart', handleAssetDragStart);
      grid.appendChild(item);
    });
  } else if (type === 'images') {
    const sampleImages = [
      { bg: 'linear-gradient(135deg, #667eea, #764ba2)', name: '渐变紫', isSample: true },
      { bg: 'linear-gradient(135deg, #f093fb, #f5576c)', name: '渐变粉', isSample: true },
      { bg: 'linear-gradient(135deg, #4facfe, #00f2fe)', name: '渐变蓝', isSample: true },
      { bg: 'linear-gradient(135deg, #11998e, #38ef7d)', name: '渐变绿', isSample: true },
      { bg: 'linear-gradient(135deg, #f7971e, #ffd200)', name: '渐变橙', isSample: true },
      { bg: 'linear-gradient(135deg, #0c0c0c, #1a1a2e)', name: '深色', isSample: true },
      { bg: 'linear-gradient(135deg, #a8edea, #fed6e3)', name: '清新', isSample: true },
      { bg: 'linear-gradient(135deg, #ffecd2, #fcb69f)', name: '暖色', isSample: true },
      { bg: 'linear-gradient(180deg, #f8f9fa, #e9ecef)', name: '浅灰', isSample: true }
    ];
    
    let imageList = [];
    
    if (currentImageTab === 'all') {
      imageList = [...sampleImages, ...myImageAssets.map(a => ({ ...a, isMine: true }))];
    } else {
      imageList = myImageAssets.map(a => ({ ...a, isMine: true }));
    }
    
    if (assetSearchKeyword) {
      const keyword = assetSearchKeyword.toLowerCase();
      imageList = imageList.filter(img => 
        (img.name && img.name.toLowerCase().includes(keyword))
      );
    }
    
    if (imageList.length === 0) {
      grid.innerHTML = '<div style="text-align:center;color:#909399;padding:40px 0;font-size:13px;">暂无素材</div>';
      return;
    }
    
    imageList.forEach(img => {
      const item = document.createElement('div');
      item.className = 'asset-item draggable-asset';
      item.draggable = true;
      
      if (img.isMine) {
        item.style.backgroundImage = `url(${img.src})`;
        item.style.backgroundSize = 'cover';
        item.style.backgroundPosition = 'center';
        item.dataset.assetType = 'image';
        item.dataset.assetData = img.src;
        item.dataset.assetName = img.name;
        item.title = img.name + ' (点击设为背景，拖拽添加为图层)';
      } else {
        item.style.background = img.bg;
        item.dataset.assetType = 'imageBg';
        item.dataset.assetData = img.bg;
        item.dataset.assetName = img.name;
        item.title = img.name + ' (点击设为背景，拖拽添加为图层)';
      }
      
      const nameEl = document.createElement('div');
      nameEl.className = 'asset-name';
      nameEl.textContent = img.name;
      item.appendChild(nameEl);
      
      const favBtn = document.createElement('button');
      favBtn.className = 'asset-favorite-btn';
      const isFav = img.isMine || isAssetFavorite(img.bg || img.src);
      if (isFav) favBtn.classList.add('active');
      favBtn.innerHTML = isFav ? '⭐' : '☆';
      favBtn.title = img.isMine ? '已收藏' : '收藏到素材库';
      favBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        if (img.isMine) {
          deleteMyAsset(img.id);
        } else {
          toggleFavoriteAsset(img.bg, img.name);
        }
      });
      item.appendChild(favBtn);
      
      if (img.isMine) {
        const delBtn = document.createElement('button');
        delBtn.className = 'asset-delete-btn';
        delBtn.innerHTML = '🗑';
        delBtn.title = '删除';
        delBtn.addEventListener('click', (e) => {
          e.stopPropagation();
          if (confirm('确定要删除这个素材吗？')) {
            deleteMyAsset(img.id);
          }
        });
        item.appendChild(delBtn);
        
        item.addEventListener('dblclick', (e) => {
          e.stopPropagation();
          const newName = prompt('请输入新名称：', img.name);
          if (newName && newName.trim()) {
            renameMyAsset(img.id, newName.trim());
          }
        });
      }
      
      item.addEventListener('click', () => {
        if (img.isMine) {
          addImageToCanvas(img.src);
        } else {
          canvas.style.background = img.bg;
          state.canvasBg = img.bg;
          saveHistory();
          showToast('已设置为画布背景');
        }
      });
      item.addEventListener('dragstart', handleAssetDragStart);
      grid.appendChild(item);
    });
  }
}

function handleAssetDragStart(e) {
  e.dataTransfer.effectAllowed = 'copy';
  e.dataTransfer.setData('text/plain', JSON.stringify({
    type: e.target.dataset.assetType,
    data: e.target.dataset.assetData,
    name: e.target.dataset.assetName || ''
  }));
}

function addIconToCanvas(icon) {
  const element = {
    id: genId(),
    type: 'text',
    x: state.canvasWidth / 2 - 50,
    y: state.canvasHeight / 2 - 50,
    text: icon,
    fontSize: 80,
    fontWeight: 400,
    color: '#333',
    textAlign: 'center',
    width: 100,
    height: 100,
    lineHeight: 1,
    opacity: 100,
    fontFamily: "'PingFang SC', sans-serif"
  };
  state.elements.push(element);
  selectElement(element.id);
  saveHistory();
  showToast('已添加图标');
}

function addShapeToCanvas(shapeType) {
  const element = {
    id: genId(),
    type: 'shape',
    shapeType: shapeType,
    x: state.canvasWidth / 2 - 100,
    y: state.canvasHeight / 2 - 100,
    width: 200,
    height: 200,
    fill: state.clipboardColor || '#667eea',
    opacity: 100
  };
  state.elements.push(element);
  selectElement(element.id);
  saveHistory();
  showToast('已添加形状');
}

function handleImageUpload(files, position = null) {
  Array.from(files).forEach(file => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        const maxSize = Math.min(state.canvasWidth * 0.6, state.canvasHeight * 0.6);
        let w = img.width;
        let h = img.height;
        if (w > maxSize || h > maxSize) {
          const ratio = Math.min(maxSize / w, maxSize / h);
          w = w * ratio;
          h = h * ratio;
        }
        
        let x, y;
        if (position) {
          x = position.x - w / 2;
          y = position.y - h / 2;
        } else {
          x = (state.canvasWidth - w) / 2;
          y = (state.canvasHeight - h) / 2;
        }
        
        const element = {
          id: genId(),
          type: 'image',
          x: x,
          y: y,
          width: w,
          height: h,
          src: e.target.result,
          opacity: 100
        };
        state.elements.push(element);
        selectElement(element.id);
        saveHistory();
        showToast('图片已添加到画布');
      };
      img.src = e.target.result;
    };
    reader.readAsDataURL(file);
  });
}

function getCanvasPositionFromEvent(e) {
  const canvasRect = canvas.getBoundingClientRect();
  const x = (e.clientX - canvasRect.left) / state.zoom;
  const y = (e.clientY - canvasRect.top) / state.zoom;
  return { x, y };
}

function addImageToCanvas(src, position) {
  const img = new Image();
  img.onload = () => {
    let w = img.width;
    let h = img.height;
    const maxSize = 400;
    if (w > maxSize || h > maxSize) {
      const ratio = Math.min(maxSize / w, maxSize / h);
      w = w * ratio;
      h = h * ratio;
    }
    
    const element = {
      id: genId(),
      type: 'image',
      src: src,
      naturalWidth: img.width,
      naturalHeight: img.height,
      x: position ? position.x - w / 2 : (state.canvasWidth - w) / 2,
      y: position ? position.y - h / 2 : (state.canvasHeight - h) / 2,
      width: w,
      height: h,
      opacity: 100,
      rotation: 0
    };
    
    state.elements.push(element);
    selectElement(element.id);
    renderElements();
    saveHistory();
    showToast('已添加图片');
  };
  img.src = src;
}

function addAssetAtPosition(assetType, assetData, position) {
  if (assetType === 'icon') {
    const element = {
      id: genId(),
      type: 'text',
      x: position.x - 50,
      y: position.y - 50,
      text: assetData,
      fontSize: 80,
      fontWeight: 400,
      color: '#333',
      textAlign: 'center',
      width: 100,
      height: 100,
      lineHeight: 1,
      opacity: 100,
      fontFamily: "'PingFang SC', sans-serif"
    };
    state.elements.push(element);
    selectElement(element.id);
    saveHistory();
  } else if (assetType === 'shape') {
    const element = {
      id: genId(),
      type: 'shape',
      shapeType: assetData,
      x: position.x - 100,
      y: position.y - 100,
      width: 200,
      height: 200,
      fill: state.clipboardColor || '#667eea',
      opacity: 100
    };
    state.elements.push(element);
    selectElement(element.id);
    saveHistory();
  } else if (assetType === 'imageBg') {
    const element = {
      id: genId(),
      type: 'shape',
      shapeType: 'rect',
      x: position.x - 150,
      y: position.y - 100,
      width: 300,
      height: 200,
      fill: assetData,
      opacity: 100
    };
    state.elements.push(element);
    selectElement(element.id);
    saveHistory();
  } else if (assetType === 'image') {
    addImageToCanvas(assetData, position);
  }
}

function handleCanvasDragOver(e) {
  e.preventDefault();
  e.dataTransfer.dropEffect = 'copy';
  canvasWrapper.classList.add('drag-over');
}

function handleCanvasDragLeave(e) {
  canvasWrapper.classList.remove('drag-over');
}

function handleCanvasDrop(e) {
  e.preventDefault();
  canvasWrapper.classList.remove('drag-over');
  
  const position = getCanvasPositionFromEvent(e);
  
  const files = e.dataTransfer.files;
  if (files && files.length > 0) {
    const imageFiles = Array.from(files).filter(f => f.type.startsWith('image/'));
    if (imageFiles.length > 0) {
      handleImageUpload(imageFiles, position);
      return;
    }
  }
  
  try {
    const data = JSON.parse(e.dataTransfer.getData('text/plain'));
    if (data.type) {
      addAssetAtPosition(data.type, data.data, position);
      showToast('已添加元素');
    }
  } catch (err) {
    // ignore non-JSON data
  }
}

// ====== 图片裁剪 ======
let cropState = {
  imageSrc: '',
  imageWidth: 0,
  imageHeight: 0,
  cropX: 0,
  cropY: 0,
  cropW: 0,
  cropH: 0,
  imgX: 0,
  imgY: 0,
  imgScale: 1,
  elementId: null,
  isDragging: false,
  dragType: '',
  startX: 0,
  startY: 0,
  startImgX: 0,
  startImgY: 0,
  startCropX: 0,
  startCropY: 0,
  startCropW: 0,
  startCropH: 0,
  ratio: 'free'
};

function openCropModal(elementId) {
  const element = getElementById(elementId);
  if (!element || element.type !== 'image') return;
  
  cropState.elementId = elementId;
  cropState.imageSrc = element.src;
  
  const img = new Image();
  img.onload = () => {
    cropState.imageWidth = img.width;
    cropState.imageHeight = img.height;
    
    const cropArea = $('cropArea');
    const areaW = cropArea.clientWidth;
    const areaH = cropArea.clientHeight;
    
    const fitScale = Math.min(areaW / img.width, areaH / img.height) * 0.8;
    cropState.imgScale = fitScale;
    cropState.baseScale = fitScale;
    
    const scaledW = img.width * fitScale;
    const scaledH = img.height * fitScale;
    cropState.imgX = (areaW - scaledW) / 2;
    cropState.imgY = (areaH - scaledH) / 2;
    
    const cropW = Math.min(scaledW * 0.7, element.width * fitScale);
    const cropH = Math.min(scaledH * 0.7, element.height * fitScale);
    cropState.cropX = (areaW - cropW) / 2;
    cropState.cropY = (areaH - cropH) / 2;
    cropState.cropW = cropW;
    cropState.cropH = cropH;
    
    updateCropUI();
    bindCropEvents();
    
    cropState.ratio = 'free';
    document.querySelectorAll('.ratio-btn').forEach(btn => {
      btn.classList.toggle('active', btn.dataset.ratio === 'free');
    });
    
    $('cropImageModal').style.display = 'flex';
    $('cropZoomSlider').value = 100;
    $('cropZoomValue').textContent = '100%';
  };
  img.src = element.src;
  $('cropImage').src = element.src;
}

function bindCropEvents() {
  const cropImageWrapper = $('cropImageWrapper');
  const cropBox = $('cropBox');
  
  cropImageWrapper.onmousedown = (e) => {
    if (e.target.closest('.crop-handle') || e.target.closest('.crop-box')) return;
    startCropDrag(e, 'image');
  };
  
  cropBox.onmousedown = (e) => {
    if (e.target.classList.contains('crop-handle')) {
      startCropDrag(e, e.target.dataset.handle);
    } else {
      startCropDrag(e, 'crop');
    }
  };
  
  document.querySelectorAll('.crop-handle').forEach(handle => {
    handle.onmousedown = (e) => {
      e.stopPropagation();
      startCropDrag(e, handle.dataset.handle);
    };
  });
}

function updateCropUI() {
  const img = $('cropImage');
  img.style.transform = `translate(${cropState.imgX}px, ${cropState.imgY}px) scale(${cropState.imgScale})`;
  img.style.width = cropState.imageWidth + 'px';
  img.style.height = cropState.imageHeight + 'px';
  
  const cropBox = $('cropBox');
  cropBox.style.left = cropState.cropX + 'px';
  cropBox.style.top = cropState.cropY + 'px';
  cropBox.style.width = cropState.cropW + 'px';
  cropBox.style.height = cropState.cropH + 'px';
  
  const realCropW = Math.round(cropState.cropW / cropState.imgScale);
  const realCropH = Math.round(cropState.cropH / cropState.imgScale);
  $('cropSizeInfo').textContent = `${realCropW} × ${realCropH}`;
  
  const overlays = document.querySelectorAll('.crop-overlay');
  overlays.forEach(o => o.style.display = 'none');
  
  const topOverlay = document.querySelector('.crop-overlay-top');
  const bottomOverlay = document.querySelector('.crop-overlay-bottom');
  const leftOverlay = document.querySelector('.crop-overlay-left');
  const rightOverlay = document.querySelector('.crop-overlay-right');
  
  if (topOverlay) {
    topOverlay.style.display = 'block';
    topOverlay.style.height = cropState.cropY + 'px';
  }
  if (bottomOverlay) {
    bottomOverlay.style.display = 'block';
    bottomOverlay.style.top = (cropState.cropY + cropState.cropH) + 'px';
    bottomOverlay.style.height = `calc(100% - ${cropState.cropY + cropState.cropH}px)`;
  }
  if (leftOverlay) {
    leftOverlay.style.display = 'block';
    leftOverlay.style.width = cropState.cropX + 'px';
    leftOverlay.style.top = cropState.cropY + 'px';
    leftOverlay.style.height = cropState.cropH + 'px';
  }
  if (rightOverlay) {
    rightOverlay.style.display = 'block';
    rightOverlay.style.left = (cropState.cropX + cropState.cropW) + 'px';
    rightOverlay.style.width = `calc(100% - ${cropState.cropX + cropState.cropW}px)`;
    rightOverlay.style.top = cropState.cropY + 'px';
    rightOverlay.style.height = cropState.cropH + 'px';
  }
}

function startCropDrag(e, type) {
  e.preventDefault();
  e.stopPropagation();
  
  cropState.isDragging = true;
  cropState.dragType = type;
  cropState.startX = e.clientX;
  cropState.startY = e.clientY;
  cropState.startImgX = cropState.imgX;
  cropState.startImgY = cropState.imgY;
  cropState.startCropX = cropState.cropX;
  cropState.startCropY = cropState.cropY;
  cropState.startCropW = cropState.cropW;
  cropState.startCropH = cropState.cropH;
  
  document.addEventListener('mousemove', onCropDrag);
  document.addEventListener('mouseup', stopCropDrag);
}

function onCropDrag(e) {
  if (!cropState.isDragging) return;
  
  const dx = e.clientX - cropState.startX;
  const dy = e.clientY - cropState.startY;
  
  if (cropState.dragType === 'image') {
    cropState.imgX = cropState.startImgX + dx;
    cropState.imgY = cropState.startImgY + dy;
  } else if (cropState.dragType === 'crop') {
    let newX = cropState.startCropX + dx;
    let newY = cropState.startCropY + dy;
    
    newX = Math.max(0, Math.min(newX, $('cropArea').clientWidth - cropState.cropW));
    newY = Math.max(0, Math.min(newY, $('cropArea').clientHeight - cropState.cropH));
    
    cropState.cropX = newX;
    cropState.cropY = newY;
  } else {
    const ratio = getCropRatioValue();
    const minSize = 20;
    
    if (ratio) {
      const handle = cropState.dragType;
      const dx = e.clientX - cropState.startX;
      const dy = e.clientY - cropState.startY;
      
      const cropArea = $('cropArea');
      const areaW = cropArea.clientWidth;
      const areaH = cropArea.clientHeight;
      
      let newW = cropState.startCropW;
      let newH = cropState.startCropH;
      let newX = cropState.startCropX;
      let newY = cropState.startCropY;
      
      if (handle === 'se') {
        newW = cropState.startCropW + dx;
        newH = newW / ratio;
        if (newH < minSize) { newH = minSize; newW = newH * ratio; }
        if (newY + newH > areaH) { newH = areaH - newY; newW = newH * ratio; }
        if (newX + newW > areaW) { newW = areaW - newX; newH = newW / ratio; }
      } else if (handle === 'sw') {
        const anchorX = cropState.startCropX + cropState.startCropW;
        const anchorY = cropState.startCropY;
        newW = cropState.startCropW - dx;
        newH = newW / ratio;
        if (newH < minSize) { newH = minSize; newW = newH * ratio; }
        newX = anchorX - newW;
        newY = anchorY;
        if (newX < 0) { newX = 0; newW = anchorX; newH = newW / ratio; }
        if (newY + newH > areaH) { newH = areaH - newY; newW = newH * ratio; newX = anchorX - newW; }
      } else if (handle === 'ne') {
        const anchorX = cropState.startCropX;
        const anchorY = cropState.startCropY + cropState.startCropH;
        newW = cropState.startCropW + dx;
        newH = newW / ratio;
        if (newH < minSize) { newH = minSize; newW = newH * ratio; }
        newX = anchorX;
        newY = anchorY - newH;
        if (newX + newW > areaW) { newW = areaW - newX; newH = newW / ratio; newY = anchorY - newH; }
        if (newY < 0) { newY = 0; newH = anchorY; newW = newH * ratio; }
      } else if (handle === 'nw') {
        const anchorX = cropState.startCropX + cropState.startCropW;
        const anchorY = cropState.startCropY + cropState.startCropH;
        newW = cropState.startCropW - dx;
        newH = newW / ratio;
        if (newH < minSize) { newH = minSize; newW = newH * ratio; }
        newX = anchorX - newW;
        newY = anchorY - newH;
        if (newX < 0) { newX = 0; newW = anchorX; newH = newW / ratio; newY = anchorY - newH; }
        if (newY < 0) { newY = 0; newH = anchorY; newW = newH * ratio; newX = anchorX - newW; }
      } else if (handle === 'e') {
        newW = cropState.startCropW + dx;
        if (newW < minSize) newW = minSize;
        newH = newW / ratio;
        newY = cropState.startCropY + (cropState.startCropH - newH) / 2;
        if (newX + newW > areaW) { newW = areaW - newX; newH = newW / ratio; newY = cropState.startCropY + (cropState.startCropH - newH) / 2; }
        if (newY < 0) { newY = 0; newH = cropState.startCropY + cropState.startCropH; newW = newH * ratio; }
        if (newY + newH > areaH) { newH = areaH - newY; newW = newH * ratio; newY = cropState.startCropY + (cropState.startCropH - newH) / 2; }
      } else if (handle === 'w') {
        const anchorX = cropState.startCropX + cropState.startCropW;
        newW = cropState.startCropW - dx;
        if (newW < minSize) newW = minSize;
        newH = newW / ratio;
        newX = anchorX - newW;
        newY = cropState.startCropY + (cropState.startCropH - newH) / 2;
        if (newX < 0) { newX = 0; newW = anchorX; newH = newW / ratio; newY = cropState.startCropY + (cropState.startCropH - newH) / 2; }
        if (newY < 0) { newY = 0; newH = cropState.startCropY + cropState.startCropH; newW = newH * ratio; newX = anchorX - newW; }
        if (newY + newH > areaH) { newH = areaH - newY; newW = newH * ratio; newX = anchorX - newW; newY = cropState.startCropY + (cropState.startCropH - newH) / 2; }
      } else if (handle === 's') {
        newH = cropState.startCropH + dy;
        if (newH < minSize) newH = minSize;
        newW = newH * ratio;
        newX = cropState.startCropX + (cropState.startCropW - newW) / 2;
        if (newY + newH > areaH) { newH = areaH - newY; newW = newH * ratio; newX = cropState.startCropX + (cropState.startCropW - newW) / 2; }
        if (newX < 0) { newX = 0; newW = cropState.startCropX + cropState.startCropW; newH = newW / ratio; }
        if (newX + newW > areaW) { newW = areaW - newX; newH = newW / ratio; newX = cropState.startCropX + (cropState.startCropW - newW) / 2; }
      } else if (handle === 'n') {
        const anchorY = cropState.startCropY + cropState.startCropH;
        newH = cropState.startCropH - dy;
        if (newH < minSize) newH = minSize;
        newW = newH * ratio;
        newX = cropState.startCropX + (cropState.startCropW - newW) / 2;
        newY = anchorY - newH;
        if (newY < 0) { newY = 0; newH = anchorY; newW = newH * ratio; newX = cropState.startCropX + (cropState.startCropW - newW) / 2; }
        if (newX < 0) { newX = 0; newW = cropState.startCropX + cropState.startCropW; newH = newW / ratio; newY = anchorY - newH; }
        if (newX + newW > areaW) { newW = areaW - newX; newH = newW / ratio; newX = cropState.startCropX + (cropState.startCropW - newW) / 2; newY = anchorY - newH; }
      }
      
      cropState.cropX = newX;
      cropState.cropY = newY;
      cropState.cropW = newW;
      cropState.cropH = newH;
    } else {
      const handles = {
        nw: { x: dx, y: dy, w: -dx, h: -dy },
        n: { x: 0, y: dy, w: 0, h: -dy },
        ne: { x: 0, y: dy, w: dx, h: -dy },
        w: { x: dx, y: 0, w: -dx, h: 0 },
        e: { x: 0, y: 0, w: dx, h: 0 },
        sw: { x: dx, y: 0, w: -dx, h: dy },
        s: { x: 0, y: 0, w: 0, h: dy },
        se: { x: 0, y: 0, w: dx, h: dy }
      };
      
      const h = handles[cropState.dragType];
      if (h) {
        let newX = cropState.startCropX + h.x;
        let newY = cropState.startCropY + h.y;
        let newW = cropState.startCropW + h.w;
        let newH = cropState.startCropH + h.h;
        
        if (newW >= minSize) {
          cropState.cropX = Math.max(0, newX);
          cropState.cropW = newW;
        }
        if (newH >= minSize) {
          cropState.cropY = Math.max(0, newY);
          cropState.cropH = newH;
        }
      }
    }
  }
  
  updateCropUI();
}

function stopCropDrag() {
  cropState.isDragging = false;
  cropState.dragType = '';
  document.removeEventListener('mousemove', onCropDrag);
  document.removeEventListener('mouseup', stopCropDrag);
}

function getCropRatioValue() {
  if (cropState.ratio === 'free') return null;
  const [w, h] = cropState.ratio.split(':').map(Number);
  return w / h;
}

function setCropRatio(ratio) {
  cropState.ratio = ratio;
  
  document.querySelectorAll('.ratio-btn').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.ratio === ratio);
  });
  
  if (ratio === 'free') {
    updateCropUI();
    return;
  }
  
  const targetRatio = getCropRatioValue();
  const cropArea = $('cropArea');
  const areaW = cropArea.clientWidth;
  const areaH = cropArea.clientHeight;
  
  let newW, newH;
  if (areaW / areaH > targetRatio) {
    newH = areaH * 0.8;
    newW = newH * targetRatio;
  } else {
    newW = areaW * 0.8;
    newH = newW / targetRatio;
  }
  
  cropState.cropW = newW;
  cropState.cropH = newH;
  cropState.cropX = (areaW - newW) / 2;
  cropState.cropY = (areaH - newH) / 2;
  
  updateCropUI();
}

function confirmCrop() {
  const element = getElementById(cropState.elementId);
  if (!element) return;
  
  const srcX = (cropState.cropX - cropState.imgX) / cropState.imgScale;
  const srcY = (cropState.cropY - cropState.imgY) / cropState.imgScale;
  const srcW = cropState.cropW / cropState.imgScale;
  const srcH = cropState.cropH / cropState.imgScale;
  
  const canvas = document.createElement('canvas');
  canvas.width = srcW;
  canvas.height = srcH;
  const ctx = canvas.getContext('2d');
  
  const img = new Image();
  img.onload = () => {
    ctx.drawImage(img, srcX, srcY, srcW, srcH, 0, 0, srcW, srcH);
    
    element.src = canvas.toDataURL('image/png');
    element.width = srcW;
    element.height = srcH;
    
    renderElements();
    saveHistory();
    $('cropImageModal').style.display = 'none';
    showToast('图片裁剪完成');
  };
  img.src = cropState.imageSrc;
}

function resetCrop() {
  const img = new Image();
  img.onload = () => {
    const cropArea = $('cropArea');
    const areaW = cropArea.clientWidth;
    const areaH = cropArea.clientHeight;
    
    const fitScale = Math.min(areaW / img.width, areaH / img.height) * 0.8;
    cropState.imgScale = fitScale;
    cropState.baseScale = fitScale;
    
    const scaledW = img.width * fitScale;
    const scaledH = img.height * fitScale;
    cropState.imgX = (areaW - scaledW) / 2;
    cropState.imgY = (areaH - scaledH) / 2;
    
    cropState.cropX = (areaW - scaledW * 0.7) / 2;
    cropState.cropY = (areaH - scaledH * 0.7) / 2;
    cropState.cropW = scaledW * 0.7;
    cropState.cropH = scaledH * 0.7;
    
    cropState.ratio = 'free';
    document.querySelectorAll('.ratio-btn').forEach(btn => {
      btn.classList.toggle('active', btn.dataset.ratio === 'free');
    });
    
    $('cropZoomSlider').value = 100;
    $('cropZoomValue').textContent = '100%';
    
    updateCropUI();
  };
  img.src = cropState.imageSrc;
}

function replaceImage(file) {
  const element = getElementById(cropState.elementId || state.selectedElementIds[0]);
  if (!element || element.type !== 'image') return;
  
  const reader = new FileReader();
  reader.onload = (e) => {
    const img = new Image();
    img.onload = () => {
      element.src = e.target.result;
      element.naturalWidth = img.width;
      element.naturalHeight = img.height;
      
      renderElements();
      saveHistory();
      showToast('图片已替换');
    };
    img.src = e.target.result;
  };
  reader.readAsDataURL(file);
}

function updateImageActions() {
  const selected = getElementById(state.selectedElementIds[0]);
  const imageActions = $('imageActions');
  if (selected && selected.type === 'image') {
    imageActions.style.display = 'flex';
  } else {
    imageActions.style.display = 'none';
  }
}

// ====== 文字系统 ======
function addText(type) {
  const presets = {
    title: { text: '双击编辑大标题', fontSize: 48, fontWeight: 700, height: 80, width: 600 },
    subtitle: { text: '双击编辑副标题', fontSize: 28, fontWeight: 600, height: 50, width: 500 },
    body: { text: '双击编辑正文内容，可以换行输入更多文字信息。', fontSize: 18, fontWeight: 400, height: 80, width: 400 },
    caption: { text: '小字标注文字', fontSize: 14, fontWeight: 400, height: 30, width: 300, color: '#666' }
  };
  
  const preset = presets[type] || presets.body;
  const element = {
    id: genId(),
    type: 'text',
    x: state.canvasWidth / 2 - preset.width / 2,
    y: state.canvasHeight / 2 - preset.height / 2,
    width: preset.width,
    height: preset.height,
    text: preset.text,
    fontSize: preset.fontSize,
    fontWeight: preset.fontWeight,
    color: preset.color || '#333',
    textAlign: 'center',
    lineHeight: 1.4,
    letterSpacing: 0,
    opacity: 100,
    fontFamily: "'PingFang SC', sans-serif"
  };
  state.elements.push(element);
  selectElement(element.id);
  saveHistory();
}

function updateTextProperties() {
  const panel = $('textProperties');
  const selected = getElementById(state.selectedElementIds[0]);
  
  if (selected && selected.type === 'text') {
    panel.style.display = 'block';
    $('fontSizeSlider').value = selected.fontSize || 32;
    $('fontSizeValue').textContent = (selected.fontSize || 32) + 'px';
    $('fontWeightSelect').value = selected.fontWeight || 400;
    $('fontFamilySelect').value = selected.fontFamily || "'PingFang SC', sans-serif";
    $('textColorPicker').value = rgbToHex(selected.color || '#333');
    $('lineHeightSlider').value = selected.lineHeight || 1.4;
    $('lineHeightValue').textContent = selected.lineHeight || 1.4;
    $('letterSpacingSlider').value = selected.letterSpacing || 0;
    $('letterSpacingValue').textContent = (selected.letterSpacing || 0) + 'px';
    
    document.querySelectorAll('.align-btns .mini-btn').forEach(btn => {
      btn.classList.toggle('active', btn.dataset.align === (selected.textAlign || 'center'));
    });
  } else {
    panel.style.display = 'none';
  }
}

function rgbToHex(color) {
  if (color.startsWith('#')) return color;
  const rgb = color.match(/\d+/g);
  if (!rgb) return '#333333';
  return '#' + rgb.slice(0, 3).map(x => parseInt(x).toString(16).padStart(2, '0')).join('');
}

// ====== 属性面板 ======
function updatePropertiesPanel() {
  const selected = getElementById(state.selectedElementIds[0]);
  
  if (selected) {
    $('posXInput').value = Math.round(selected.x);
    $('posYInput').value = Math.round(selected.y);
    $('widthInput').value = Math.round(selected.width || 100);
    $('heightInput').value = Math.round(selected.height || 100);
    $('opacitySlider').value = selected.opacity !== undefined ? selected.opacity : 100;
    $('opacityValue').textContent = (selected.opacity !== undefined ? selected.opacity : 100) + '%';
    $('rotationInput').value = selected.rotation || 0;
  }
}

// ====== 配色系统 ======
function renderBrandColors() {
  const palette = $('brandPalette');
  palette.innerHTML = '';
  brandColors.forEach(color => {
    const item = document.createElement('div');
    item.className = 'color-item';
    item.style.background = color;
    item.title = color + ' (点击应用到选中元素)';
    item.addEventListener('click', () => {
      state.clipboardColor = color;
      $('mainColorPicker').value = color;
      $('colorHex').textContent = color;
      applyColorToSelection(color);
    });
    palette.appendChild(item);
  });
}

function renderColorSchemes() {
  const container = $('popularSchemes');
  container.innerHTML = '';
  colorSchemes.forEach(scheme => {
    const item = document.createElement('div');
    item.className = 'color-scheme-item';
    item.title = scheme.name + ' (点击设为画布背景)';
    
    const color1 = document.createElement('span');
    color1.style.background = scheme.colors[0];
    const color2 = document.createElement('span');
    color2.style.background = scheme.colors[1];
    
    item.appendChild(color1);
    item.appendChild(color2);
    
    item.addEventListener('click', () => {
      const gradient = `linear-gradient(135deg, ${scheme.colors.join(', ')})`;
      canvas.style.background = gradient;
      state.canvasBg = gradient;
      saveHistory();
      showToast(`已应用配色：${scheme.name}`);
    });
    
    container.appendChild(item);
  });
}

function renderSavedColors() {
  const palette = $('savedColors');
  palette.innerHTML = '';
  state.savedColors.forEach((color, index) => {
    const item = document.createElement('div');
    item.className = 'color-item';
    item.style.background = color;
    item.title = color + ' (右键删除)';
    item.addEventListener('click', () => {
      state.clipboardColor = color;
      $('mainColorPicker').value = color;
      $('colorHex').textContent = color;
      applyColorToSelection(color);
    });
    item.addEventListener('contextmenu', (e) => {
      e.preventDefault();
      if (confirm('删除这个收藏的颜色？')) {
        state.savedColors.splice(index, 1);
        localStorage.setItem('savedColors', JSON.stringify(state.savedColors));
        renderSavedColors();
        showToast('已删除');
      }
    });
    palette.appendChild(item);
  });
}

function saveCurrentColor() {
  const color = $('mainColorPicker').value;
  if (!state.savedColors.includes(color)) {
    state.savedColors.push(color);
    localStorage.setItem('savedColors', JSON.stringify(state.savedColors));
    renderSavedColors();
    showToast('已保存到我的收藏');
  } else {
    showToast('颜色已存在');
  }
}

function applyColorToSelection(color) {
  let applied = false;
  state.selectedElementIds.forEach(id => {
    const el = getElementById(id);
    if (el) {
      if (el.type === 'text') {
        el.color = color;
        applied = true;
      } else if (el.type === 'shape') {
        el.fill = color;
        applied = true;
      }
    }
  });
  if (applied) {
    renderElements();
    saveHistory();
  }
}

// ====== 图层系统 ======
function renderLayers() {
  const list = $('layersList');
  list.innerHTML = '';
  
  [...state.elements].reverse().forEach(el => {
    const item = document.createElement('div');
    item.className = 'layer-item';
    if (state.selectedElementIds.includes(el.id)) item.classList.add('selected');
    if (el.hidden) item.classList.add('hidden-layer');
    
    let icon = '📄';
    if (el.type === 'text') icon = '📝';
    else if (el.type === 'shape') icon = '⬜';
    else if (el.type === 'image') icon = '🖼';
    
    const name = el.name || getElementName(el);
    
    item.innerHTML = `
      <span class="layer-icon">${icon}</span>
      <span class="layer-name" title="${name}">${name}</span>
      <div class="layer-controls">
        <button class="layer-control-btn ${el.locked ? 'active' : ''}" data-action="lock" title="${el.locked ? '解锁' : '锁定'}">${el.locked ? '🔒' : '🔓'}</button>
        <button class="layer-control-btn ${!el.hidden ? 'active' : ''}" data-action="visibility" title="${el.hidden ? '显示' : '隐藏'}">${el.hidden ? '👁' : '👁‍🗨'}</button>
      </div>
    `;
    
    item.addEventListener('click', (e) => {
      if (e.target.closest('.layer-control-btn')) return;
      if (e.shiftKey) {
        toggleSelection(el.id);
      } else {
        selectElement(el.id);
      }
    });
    
    item.querySelector('[data-action="lock"]').addEventListener('click', (e) => {
      e.stopPropagation();
      el.locked = !el.locked;
      renderElements();
      saveHistory();
    });
    
    item.querySelector('[data-action="visibility"]').addEventListener('click', (e) => {
      e.stopPropagation();
      el.hidden = !el.hidden;
      renderElements();
      saveHistory();
    });
    
    const nameEl = item.querySelector('.layer-name');
    nameEl.addEventListener('dblclick', (e) => {
      e.stopPropagation();
      const newName = prompt('重命名图层：', el.name || name);
      if (newName !== null && newName.trim()) {
        el.name = newName.trim();
        renderLayers();
        saveHistory();
      }
    });
    
    list.appendChild(item);
  });
  
  if (state.elements.length === 0) {
    list.innerHTML = '<div style="text-align:center; color:#909399; padding:30px 0; font-size:12px;">暂无图层</div>';
  }
}

function getElementName(el) {
  if (el.type === 'text') {
    const text = (el.text || '文字').replace(/\n/g, ' ').substring(0, 12);
    return text + (el.text && el.text.length > 12 ? '...' : '');
  } else if (el.type === 'shape') {
    const names = { rect: '矩形', circle: '圆形', triangle: '三角形', rounded: '圆角矩形' };
    return names[el.shapeType] || '形状';
  } else if (el.type === 'image') {
    return '图片';
  }
  return '元素';
}

function moveLayerUp() {
  if (state.selectedElementIds.length !== 1) {
    showToast('请选择一个图层');
    return;
  }
  const id = state.selectedElementIds[0];
  const index = state.elements.findIndex(e => e.id === id);
  if (index < state.elements.length - 1) {
    [state.elements[index], state.elements[index + 1]] = [state.elements[index + 1], state.elements[index]];
    renderElements();
    saveHistory();
  }
}

function moveLayerDown() {
  if (state.selectedElementIds.length !== 1) {
    showToast('请选择一个图层');
    return;
  }
  const id = state.selectedElementIds[0];
  const index = state.elements.findIndex(e => e.id === id);
  if (index > 0) {
    [state.elements[index], state.elements[index - 1]] = [state.elements[index - 1], state.elements[index]];
    renderElements();
    saveHistory();
  }
}

function deleteSelected() {
  if (state.selectedElementIds.length === 0) {
    showToast('请先选择元素');
    return;
  }
  if (!confirm('确定删除选中的元素吗？')) return;
  state.elements = state.elements.filter(e => !state.selectedElementIds.includes(e.id));
  state.selectedElementIds = [];
  renderElements();
  saveHistory();
  showToast('已删除选中元素');
}

// ====== 对齐分布功能 ======
function alignElements(direction) {
  if (state.selectedElementIds.length === 0) {
    showToast('请先选择元素');
    return;
  }
  
  const elements = state.selectedElementIds.map(id => getElementById(id)).filter(Boolean);
  if (elements.length === 0) return;
  
  const bounds = getElementsBounds(elements);
  
  elements.forEach(el => {
    switch(direction) {
      case 'left':
        el.x = bounds.left;
        break;
      case 'center':
        el.x = bounds.left + (bounds.width - el.width) / 2;
        break;
      case 'right':
        el.x = bounds.left + bounds.width - el.width;
        break;
      case 'top':
        el.y = bounds.top;
        break;
      case 'middle':
        el.y = bounds.top + (bounds.height - el.height) / 2;
        break;
      case 'bottom':
        el.y = bounds.top + bounds.height - el.height;
        break;
    }
  });
  
  renderElements();
  saveHistory();
  showToast('已对齐');
}

function getElementsBounds(elements) {
  let left = Infinity, right = -Infinity, top = Infinity, bottom = -Infinity;
  elements.forEach(el => {
    left = Math.min(left, el.x);
    right = Math.max(right, el.x + el.width);
    top = Math.min(top, el.y);
    bottom = Math.max(bottom, el.y + el.height);
  });
  return {
    left, right, top, bottom,
    width: right - left,
    height: bottom - top
  };
}

function distributeElements(direction) {
  if (state.selectedElementIds.length < 3) {
    showToast('请至少选择3个元素');
    return;
  }
  
  const elements = state.selectedElementIds.map(id => getElementById(id)).filter(Boolean);
  if (elements.length < 3) return;
  
  const bounds = getElementsBounds(elements);
  
  if (direction === 'horizontal') {
    elements.sort((a, b) => a.x - b.x);
    const totalWidth = elements.reduce((sum, el) => sum + el.width, 0);
    const space = (bounds.width - totalWidth) / (elements.length - 1);
    let currentX = bounds.left;
    elements.forEach(el => {
      el.x = Math.round(currentX);
      currentX += el.width + space;
    });
  } else {
    elements.sort((a, b) => a.y - b.y);
    const totalHeight = elements.reduce((sum, el) => sum + el.height, 0);
    const space = (bounds.height - totalHeight) / (elements.length - 1);
    let currentY = bounds.top;
    elements.forEach(el => {
      el.y = Math.round(currentY);
      currentY += el.height + space;
    });
  }
  
  renderElements();
  saveHistory();
  showToast('已分布');
}

// ====== 历史记录（撤销/重做）======
function saveHistory() {
  const snapshot = {
    elements: JSON.parse(JSON.stringify(state.elements)),
    canvasWidth: state.canvasWidth,
    canvasHeight: state.canvasHeight,
    canvasBg: state.canvasBg
  };
  
  state.history = state.history.slice(0, state.historyIndex + 1);
  state.history.push(snapshot);
  
  if (state.history.length > state.maxHistory) {
    state.history.shift();
  } else {
    state.historyIndex++;
  }
}

function undo() {
  if (state.historyIndex > 0) {
    state.historyIndex--;
    const snapshot = state.history[state.historyIndex];
    state.elements = JSON.parse(JSON.stringify(snapshot.elements));
    state.canvasWidth = snapshot.canvasWidth;
    state.canvasHeight = snapshot.canvasHeight;
    if (snapshot.canvasBg) {
      canvas.style.background = snapshot.canvasBg;
      state.canvasBg = snapshot.canvasBg;
    }
    state.selectedElementIds = [];
    renderElements();
    updateCanvasSize();
    showToast('已撤销');
  }
}

function redo() {
  if (state.historyIndex < state.history.length - 1) {
    state.historyIndex++;
    const snapshot = state.history[state.historyIndex];
    state.elements = JSON.parse(JSON.stringify(snapshot.elements));
    state.canvasWidth = snapshot.canvasWidth;
    state.canvasHeight = snapshot.canvasHeight;
    if (snapshot.canvasBg) {
      canvas.style.background = snapshot.canvasBg;
      state.canvasBg = snapshot.canvasBg;
    }
    state.selectedElementIds = [];
    renderElements();
    updateCanvasSize();
    showToast('已重做');
  }
}

// ====== 尺寸切换 ======
function setCanvasSize(width, height) {
  state.canvasWidth = width;
  state.canvasHeight = height;
  updateCanvasSize();
  zoomFit();
  saveHistory();
}

// ====== 智能批量导出 ======
let batchState = {
  currentSizeIndex: 0,
  sizeData: [],
  selectedSizeIndices: [],
  draggingElementIndex: -1,
  selectedElementIndex: -1,
  dragStartX: 0,
  dragStartY: 0,
  dragStartElX: 0,
  dragStartElY: 0,
  previewScale: 1
};

function renderBatchSizes() {
  const list = $('batchSizesList');
  list.innerHTML = '';
  
  batchState.sizeData = [];
  batchState.selectedSizeIndices = [];
  batchState.selectedElementIndex = -1;
  
  sizePresets.forEach((preset, index) => {
    const elements = generateSizeElements(preset.width, preset.height);
    batchState.sizeData.push({
      width: preset.width,
      height: preset.height,
      name: preset.name,
      elements: elements
    });
    
    const item = document.createElement('div');
    item.className = 'batch-size-item';
    item.dataset.index = index;
    item.innerHTML = `
      <input type="checkbox" value="${preset.value}" data-index="${index}" ${index < 3 ? 'checked' : ''}>
      <div style="flex:1;">
        <div class="size-name">${preset.name}</div>
        <div class="size-dimensions">${preset.width} × ${preset.height}</div>
      </div>
    `;
    
    item.addEventListener('click', (e) => {
      if (e.target.type === 'checkbox') {
        const idx = parseInt(e.target.dataset.index);
        if (e.target.checked) {
          if (!batchState.selectedSizeIndices.includes(idx)) {
            batchState.selectedSizeIndices.push(idx);
          }
        } else {
          batchState.selectedSizeIndices = batchState.selectedSizeIndices.filter(i => i !== idx);
        }
      }
      selectBatchSize(index);
    });
    
    list.appendChild(item);
    
    if (index < 3) {
      batchState.selectedSizeIndices.push(index);
    }
  });
  
  batchState.currentSizeIndex = 0;
  updateBatchSizeSelection();
  renderBatchPreview();
}

function generateSizeElements(targetWidth, targetHeight) {
  const originalWidth = state.canvasWidth;
  const originalHeight = state.canvasHeight;
  const originalElements = JSON.parse(JSON.stringify(state.elements));
  
  const scaleX = targetWidth / originalWidth;
  const scaleY = targetHeight / originalHeight;
  const scale = Math.min(scaleX, scaleY);
  
  return originalElements.map(el => ({
    ...el,
    x: el.x * scale + (targetWidth - originalWidth * scale) / 2,
    y: el.y * scale + (targetHeight - originalHeight * scale) / 2,
    width: el.width * scale,
    height: el.height * scale,
    fontSize: el.fontSize ? el.fontSize * scale : undefined
  }));
}

function selectBatchSize(index) {
  batchState.currentSizeIndex = index;
  batchState.selectedElementIndex = -1;
  updateBatchSizeSelection();
  renderBatchPreview();
}

function updateBatchSizeSelection() {
  document.querySelectorAll('#batchSizesList .batch-size-item').forEach((item, idx) => {
    item.classList.toggle('active', idx === batchState.currentSizeIndex);
    const checkbox = item.querySelector('input[type="checkbox"]');
    if (checkbox) {
      checkbox.checked = batchState.selectedSizeIndices.includes(idx);
    }
  });
  
  const sizeData = batchState.sizeData[batchState.currentSizeIndex];
  if (sizeData) {
    $('batchPreviewSizeName').textContent = `${sizeData.name} (${sizeData.width}×${sizeData.height})`;
  }
}

function renderBatchPreview() {
  const previewCanvas = $('batchPreviewCanvas');
  const sizeData = batchState.sizeData[batchState.currentSizeIndex];
  if (!sizeData) return;
  
  const wrapper = $('batchPreviewWrapper');
  const wrapperW = wrapper.clientWidth - 40;
  const wrapperH = wrapper.clientHeight - 40;
  
  const scale = Math.min(wrapperW / sizeData.width, wrapperH / sizeData.height);
  batchState.previewScale = scale;
  
  previewCanvas.style.width = sizeData.width + 'px';
  previewCanvas.style.height = sizeData.height + 'px';
  previewCanvas.style.transform = `scale(${scale})`;
  previewCanvas.style.transformOrigin = 'center center';
  
  if (state.canvasBg) {
    previewCanvas.style.background = state.canvasBg;
  } else {
    previewCanvas.style.background = '#fff';
  }
  
  previewCanvas.innerHTML = '<div class="safe-zone" id="safeZoneOverlay"></div>';
  
  sizeData.elements.forEach((el, idx) => {
    const elDom = document.createElement('div');
    elDom.className = 'preview-element';
    elDom.dataset.index = idx;
    elDom.style.left = el.x + 'px';
    elDom.style.top = el.y + 'px';
    elDom.style.width = el.width + 'px';
    elDom.style.height = el.height + 'px';
    elDom.style.opacity = (el.opacity || 100) / 100;
    
    if (idx === batchState.selectedElementIndex) {
      elDom.style.outline = '2px solid #667eea';
      elDom.style.outlineOffset = '1px';
    }
    
    if (el.rotation) {
      elDom.style.transform = `rotate(${el.rotation}deg)`;
    }
    
    if (el.type === 'text') {
      elDom.style.fontSize = (el.fontSize || 16) + 'px';
      elDom.style.fontWeight = el.fontWeight || 400;
      elDom.style.color = el.color || '#333';
      elDom.style.textAlign = el.textAlign || 'left';
      elDom.style.lineHeight = el.lineHeight || 1.4;
      elDom.style.fontFamily = el.fontFamily || "'PingFang SC', sans-serif";
      elDom.style.letterSpacing = (el.letterSpacing || 0) + 'px';
      elDom.style.whiteSpace = 'pre-wrap';
      elDom.style.wordBreak = 'break-word';
      elDom.style.display = 'flex';
      elDom.style.alignItems = 'center';
      elDom.style.justifyContent = el.textAlign === 'left' ? 'flex-start' : (el.textAlign === 'right' ? 'flex-end' : 'center');
      elDom.textContent = el.text;
    } else if (el.type === 'image') {
      elDom.style.backgroundImage = `url(${el.src})`;
      elDom.style.backgroundSize = 'cover';
      elDom.style.backgroundPosition = 'center';
    } else if (el.type === 'shape') {
      elDom.style.background = el.fill || '#667eea';
      if (el.shapeType === 'circle') {
        elDom.style.borderRadius = '50%';
      } else if (el.shapeType === 'rounded') {
        elDom.style.borderRadius = (el.borderRadius || 10) + 'px';
      }
      if (el.stroke) {
        elDom.style.border = `${el.strokeWidth || 2}px solid ${el.stroke}`;
      }
    }
    
    elDom.addEventListener('mousedown', (e) => startBatchDrag(e, idx));
    previewCanvas.appendChild(elDom);
  });
  
  updateSafeZoneDisplay();
  checkOverflowForCurrentSize();
}

function startBatchDrag(e, elementIndex) {
  e.preventDefault();
  e.stopPropagation();
  
  batchState.selectedElementIndex = elementIndex;
  batchState.draggingElementIndex = elementIndex;
  batchState.dragStartX = e.clientX;
  batchState.dragStartY = e.clientY;
  
  const sizeData = batchState.sizeData[batchState.currentSizeIndex];
  const element = sizeData.elements[elementIndex];
  batchState.dragStartElX = element.x;
  batchState.dragStartElY = element.y;
  
  renderBatchPreview();
  
  document.addEventListener('mousemove', onBatchDrag);
  document.addEventListener('mouseup', stopBatchDrag);
}

function onBatchDrag(e) {
  if (batchState.draggingElementIndex < 0) return;
  
  const dx = (e.clientX - batchState.dragStartX) / batchState.previewScale;
  const dy = (e.clientY - batchState.dragStartY) / batchState.previewScale;
  
  const sizeData = batchState.sizeData[batchState.currentSizeIndex];
  const element = sizeData.elements[batchState.draggingElementIndex];
  
  element.x = batchState.dragStartElX + dx;
  element.y = batchState.dragStartElY + dy;
  
  const previewEl = document.querySelector(`.batch-preview-canvas .preview-element[data-index="${batchState.draggingElementIndex}"]`);
  if (previewEl) {
    previewEl.style.left = element.x + 'px';
    previewEl.style.top = element.y + 'px';
  }
}

function stopBatchDrag() {
  batchState.draggingElementIndex = -1;
  document.removeEventListener('mousemove', onBatchDrag);
  document.removeEventListener('mouseup', stopBatchDrag);
  checkOverflowForCurrentSize();
}

function getSafeZoneMargin(sizeWidth, sizeHeight) {
  const ratio = sizeWidth / sizeHeight;
  if (ratio > 1.5) {
    return { left: sizeWidth * 0.15, top: sizeHeight * 0.1, right: sizeWidth * 0.15, bottom: sizeHeight * 0.1 };
  } else if (ratio < 0.7) {
    return { left: sizeWidth * 0.1, top: sizeHeight * 0.15, right: sizeWidth * 0.1, bottom: sizeHeight * 0.15 };
  } else {
    return { left: sizeWidth * 0.12, top: sizeHeight * 0.12, right: sizeWidth * 0.12, bottom: sizeHeight * 0.12 };
  }
}

function getSafeZoneRect(sizeWidth, sizeHeight) {
  const margin = getSafeZoneMargin(sizeWidth, sizeHeight);
  return {
    x: margin.left,
    y: margin.top,
    width: sizeWidth - margin.left - margin.right,
    height: sizeHeight - margin.top - margin.bottom
  };
}

function isElementOverflow(element, sizeWidth, sizeHeight) {
  const safeZone = getSafeZoneRect(sizeWidth, sizeHeight);
  const elRight = element.x + element.width;
  const elBottom = element.y + element.height;
  
  return element.x < safeZone.x ||
         element.y < safeZone.y ||
         elRight > safeZone.x + safeZone.width ||
         elBottom > safeZone.y + safeZone.height;
}

function getOverflowElements(elements, sizeWidth, sizeHeight) {
  return elements.filter(el => isElementOverflow(el, sizeWidth, sizeHeight));
}

function updateSafeZoneDisplay() {
  const sizeData = batchState.sizeData[batchState.currentSizeIndex];
  if (!sizeData) return;
  
  const safeZoneEl = $('safeZoneOverlay');
  const showSafe = $('showSafeZone').checked;
  
  if (showSafe) {
    const safeZone = getSafeZoneRect(sizeData.width, sizeData.height);
    safeZoneEl.style.display = 'block';
    safeZoneEl.style.left = safeZone.x + 'px';
    safeZoneEl.style.top = safeZone.y + 'px';
    safeZoneEl.style.width = safeZone.width + 'px';
    safeZoneEl.style.height = safeZone.height + 'px';
  } else {
    safeZoneEl.style.display = 'none';
  }
}

function checkOverflowForCurrentSize() {
  const sizeData = batchState.sizeData[batchState.currentSizeIndex];
  if (!sizeData) return;
  
  const overflowEls = getOverflowElements(sizeData.elements, sizeData.width, sizeData.height);
  const warningEl = $('overflowWarning');
  
  if (overflowEls.length > 0) {
    warningEl.style.display = 'inline-block';
    warningEl.textContent = `⚠ ${overflowEls.length} 个元素越界`;
  } else {
    warningEl.style.display = 'none';
  }
  
  document.querySelectorAll('.preview-element').forEach((el, idx) => {
    if (isElementOverflow(sizeData.elements[idx], sizeData.width, sizeData.height)) {
      el.classList.add('overflow');
    } else {
      el.classList.remove('overflow');
    }
  });
  
  updateSizeListOverflowBadges();
}

function updateSizeListOverflowBadges() {
  batchState.sizeData.forEach((sizeData, idx) => {
    const itemEl = document.querySelector(`.batch-size-item[data-index="${idx}"]`);
    if (!itemEl) return;
    
    let badgeEl = itemEl.querySelector('.overflow-badge');
    const overflowEls = getOverflowElements(sizeData.elements, sizeData.width, sizeData.height);
    
    if (overflowEls.length > 0) {
      if (!badgeEl) {
        badgeEl = document.createElement('span');
        badgeEl.className = 'overflow-badge';
        itemEl.querySelector('.size-name').appendChild(badgeEl);
      }
      badgeEl.textContent = overflowEls.length;
    } else {
      if (badgeEl) badgeEl.remove();
    }
  });
}

function snapElementToSafeZone(element, sizeWidth, sizeHeight) {
  const safeZone = getSafeZoneRect(sizeWidth, sizeHeight);
  const safeRight = safeZone.x + safeZone.width;
  const safeBottom = safeZone.y + safeZone.height;
  
  if (element.x < safeZone.x) {
    element.x = safeZone.x;
  }
  if (element.y < safeZone.y) {
    element.y = safeZone.y;
  }
  if (element.x + element.width > safeRight) {
    element.x = safeRight - element.width;
  }
  if (element.y + element.height > safeBottom) {
    element.y = safeBottom - element.height;
  }
}

function snapCurrentSizeToSafeZone() {
  const sizeData = batchState.sizeData[batchState.currentSizeIndex];
  if (!sizeData) return;
  
  let snappedCount = 0;
  
  if (batchState.selectedElementIndex >= 0) {
    const el = sizeData.elements[batchState.selectedElementIndex];
    if (el && isElementOverflow(el, sizeData.width, sizeData.height)) {
      snapElementToSafeZone(el, sizeData.width, sizeData.height);
      snappedCount = 1;
    }
  } else {
    sizeData.elements.forEach(el => {
      if (isElementOverflow(el, sizeData.width, sizeData.height)) {
        snapElementToSafeZone(el, sizeData.width, sizeData.height);
        snappedCount++;
      }
    });
  }
  
  renderBatchPreview();
  
  if (snappedCount > 0) {
    showToast(`已吸附 ${snappedCount} 个元素到安全区`);
  } else {
    showToast('所有元素都在安全区内');
  }
}

function resetCurrentSize() {
  const sizeData = batchState.sizeData[batchState.currentSizeIndex];
  if (!sizeData) return;
  
  sizeData.elements = generateSizeElements(sizeData.width, sizeData.height);
  renderBatchPreview();
  showToast('已重置此尺寸');
}

function applyToAllSizes() {
  const currentData = batchState.sizeData[batchState.currentSizeIndex];
  if (!currentData) return;
  
  const originalElements = JSON.parse(JSON.stringify(state.elements));
  
  batchState.sizeData.forEach((sizeData, idx) => {
    if (idx === batchState.currentSizeIndex) return;
    
    const scaleX = sizeData.width / state.canvasWidth;
    const scaleY = sizeData.height / state.canvasHeight;
    const scale = Math.min(scaleX, scaleY);
    const offsetX = (sizeData.width - state.canvasWidth * scale) / 2;
    const offsetY = (sizeData.height - state.canvasHeight * scale) / 2;
    
    sizeData.elements = currentData.elements.map((el, i) => {
      const originalEl = originalElements[i];
      if (!originalEl) return { ...el };
      
      const relX = (el.x - offsetX) / scale;
      const relY = (el.y - offsetY) / scale;
      
      const newScale = scale;
      return {
        ...el,
        x: relX * newScale + (sizeData.width - state.canvasWidth * newScale) / 2,
        y: relY * newScale + (sizeData.height - state.canvasHeight * newScale) / 2
      };
    });
  });
  
  renderBatchPreview();
  showToast('已应用到全部尺寸');
}

function batchExport() {
  if (batchState.selectedSizeIndices.length === 0) {
    showToast('请选择至少一个尺寸', 'error');
    return;
  }
  
  const originalWidth = state.canvasWidth;
  const originalHeight = state.canvasHeight;
  const originalElements = JSON.parse(JSON.stringify(state.elements));
  
  let exported = 0;
  let failed = 0;
  const total = batchState.selectedSizeIndices.length;
  const failedSizes = [];
  
  const validSizes = [];
  batchState.selectedSizeIndices.forEach(sizeIdx => {
    const sizeData = batchState.sizeData[sizeIdx];
    const w = Number(sizeData.width);
    const h = Number(sizeData.height);
    if (!w || !h || w <= 0 || h <= 0 || isNaN(w) || isNaN(h)) {
      failed++;
      failedSizes.push(sizeData.name || `尺寸${sizeIdx + 1}`);
    } else {
      validSizes.push(sizeIdx);
    }
  });
  
  if (validSizes.length === 0) {
    showToast('所有选中的尺寸数据无效，无法导出', 'error');
    return;
  }
  
  if (failed > 0) {
    showToast(`已跳过 ${failed} 个无效尺寸：${failedSizes.join('、')}`, 'warning');
  }
  
  validSizes.forEach((sizeIdx, i) => {
    setTimeout(() => {
      const sizeData = batchState.sizeData[sizeIdx];
      
      state.canvasWidth = Number(sizeData.width);
      state.canvasHeight = Number(sizeData.height);
      state.elements = JSON.parse(JSON.stringify(sizeData.elements));
      
      if (state.canvasBg) {
        canvas.style.background = state.canvasBg;
      }
      
      generateCanvasImage().then(dataUrl => {
        if (!dataUrl || dataUrl.indexOf('data:image') !== 0) {
          throw new Error('生成的图片数据无效');
        }
        
        const link = document.createElement('a');
        link.download = `design_${sizeData.name}_${Date.now()}.png`;
        link.href = dataUrl;
        link.click();
        
        exported++;
        checkDone();
      }).catch(err => {
        failed++;
        failedSizes.push(sizeData.name);
        checkDone();
      });
      
      function checkDone() {
        if (exported + failed === validSizes.length) {
          state.canvasWidth = originalWidth;
          state.canvasHeight = originalHeight;
          state.elements = originalElements;
          updateCanvasSize();
          renderElements();
          $('batchExportModal').style.display = 'none';
          
          if (failed === 0) {
            showToast(`批量导出完成，共 ${exported} 张图片`);
          } else {
            showToast(`导出完成：成功 ${exported} 张，失败 ${failed} 张（${failedSizes.slice(-failed).join('、')}）`, 'warning');
          }
        }
      }
    }, i * 600);
  });
}

// ====== 导出功能 ======
function exportPNG() {
  generateCanvasImage().then(canvasData => {
    const link = document.createElement('a');
    link.download = `design_${Date.now()}.png`;
    link.href = canvasData;
    link.click();
    showToast('PNG 导出成功');
  }).catch(err => {
    showToast('导出失败：' + err.message, 'error');
  });
}

function exportPDF() {
  generateCanvasImage().then(imageDataUrl => {
    const printWindow = window.open('', '_blank');
    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
      <head>
        <title>设计稿导出为PDF</title>
        <style>
          @page { 
            size: ${state.canvasWidth}px ${state.canvasHeight}px; 
            margin: 0; 
          }
          * { margin: 0; padding: 0; }
          body { 
            width: ${state.canvasWidth}px; 
            height: ${state.canvasHeight}px; 
            display: flex;
            align-items: center;
            justify-content: center;
          }
          img { 
            width: 100%; 
            height: 100%; 
            object-fit: contain;
          }
          .tip {
            position: fixed;
            top: 20px;
            left: 50%;
            transform: translateX(-50%);
            background: rgba(0,0,0,0.8);
            color: #fff;
            padding: 12px 24px;
            border-radius: 8px;
            font-family: sans-serif;
            z-index: 100;
          }
        </style>
      </head>
      <body>
        <div class="tip">请使用浏览器打印功能 (Ctrl+P) 保存为 PDF</div>
        <img src="${imageDataUrl}" alt="设计稿">
        <script>
          setTimeout(function() {
            window.print();
          }, 500);
        <\/script>
      </body>
      </html>
    `);
    printWindow.document.close();
    showToast('已打开打印预览，请选择"保存为PDF"');
  }).catch(err => {
    showToast('导出失败：' + err.message, 'error');
  });
}

function generateCanvasImage() {
  return new Promise((resolve, reject) => {
    const w = Number(state.canvasWidth);
    const h = Number(state.canvasHeight);
    
    if (!w || !h || w <= 0 || h <= 0 || isNaN(w) || isNaN(h)) {
      reject(new Error('画布尺寸无效'));
      return;
    }
    
    const offscreenCanvas = document.createElement('canvas');
    offscreenCanvas.width = w;
    offscreenCanvas.height = h;
    const ctx = offscreenCanvas.getContext('2d');
    
    // 绘制背景
    if (state.canvasBg) {
      if (state.canvasBg.startsWith('linear-gradient')) {
        const colors = state.canvasBg.match(/#[a-fA-F0-9]{3,8}|rgba?\([^)]+\)/g);
        if (colors && colors.length >= 2) {
          const gradient = ctx.createLinearGradient(0, 0, state.canvasWidth, state.canvasHeight);
          colors.forEach((color, i) => {
            gradient.addColorStop(i / (colors.length - 1), color);
          });
          ctx.fillStyle = gradient;
        } else {
          ctx.fillStyle = '#fff';
        }
      } else {
        ctx.fillStyle = state.canvasBg;
      }
      ctx.fillRect(0, 0, state.canvasWidth, state.canvasHeight);
    } else {
      ctx.fillStyle = '#fff';
      ctx.fillRect(0, 0, state.canvasWidth, state.canvasHeight);
    }
    
    const elements = state.elements.filter(e => !e.hidden);
    
    let completed = 0;
    let total = elements.length;
    
    if (total === 0) {
      resolve(offscreenCanvas.toDataURL('image/png'));
      return;
    }
    
    elements.forEach((el) => {
      const x = el.x;
      const y = el.y;
      const w = el.width;
      const h = el.height;
      const opacity = (el.opacity !== undefined ? el.opacity : 100) / 100;
      
      if (el.type === 'text') {
        ctx.save();
        ctx.globalAlpha = opacity;
        
        if (el.rotation) {
          const centerX = x + w / 2;
          const centerY = y + h / 2;
          ctx.translate(centerX, centerY);
          ctx.rotate(el.rotation * Math.PI / 180);
          ctx.translate(-centerX, -centerY);
        }
        
        ctx.font = `${el.fontWeight || 400} ${el.fontSize || 32}px ${el.fontFamily || 'sans-serif'}`;
        ctx.fillStyle = el.color || '#333';
        ctx.textAlign = el.textAlign || 'left';
        ctx.textBaseline = 'top';
        
        const lines = (el.text || '').split('\n');
        const lineHeight = (el.fontSize || 32) * (el.lineHeight || 1.4);
        const letterSpacing = el.letterSpacing || 0;
        
        lines.forEach((line, i) => {
          if (letterSpacing !== 0 && letterSpacing !== '0') {
            let currentX = x;
            if (el.textAlign === 'center') {
              let totalWidth = 0;
              for (let j = 0; j < line.length; j++) {
                totalWidth += ctx.measureText(line[j]).width;
              }
              totalWidth += (line.length - 1) * letterSpacing;
              currentX = x + (w - totalWidth) / 2;
            } else if (el.textAlign === 'right') {
              let totalWidth = 0;
              for (let j = 0; j < line.length; j++) {
                totalWidth += ctx.measureText(line[j]).width;
              }
              totalWidth += (line.length - 1) * letterSpacing;
              currentX = x + w - totalWidth;
            }
            
            for (let j = 0; j < line.length; j++) {
              ctx.fillText(line[j], currentX, y + i * lineHeight);
              currentX += ctx.measureText(line[j]).width + letterSpacing;
            }
          } else {
            let textX = x;
            if (el.textAlign === 'center') textX = x + w / 2;
            else if (el.textAlign === 'right') textX = x + w;
            ctx.fillText(line, textX, y + i * lineHeight);
          }
        });
        
        ctx.restore();
        completed++;
        if (completed === total) resolve(offscreenCanvas.toDataURL('image/png'));
      } else if (el.type === 'shape') {
        ctx.save();
        ctx.globalAlpha = opacity;
        
        if (el.rotation) {
          const centerX = x + w / 2;
          const centerY = y + h / 2;
          ctx.translate(centerX, centerY);
          ctx.rotate(el.rotation * Math.PI / 180);
          ctx.translate(-centerX, -centerY);
        }
        
        const shapeType = el.shapeType || 'rect';
        ctx.fillStyle = el.fill || '#667eea';
        
        if (shapeType === 'rect') {
          ctx.fillRect(x, y, w, h);
        } else if (shapeType === 'rounded') {
          const r = Math.min(el.borderRadius || 16, w / 2, h / 2);
          ctx.beginPath();
          ctx.moveTo(x + r, y);
          ctx.lineTo(x + w - r, y);
          ctx.quadraticCurveTo(x + w, y, x + w, y + r);
          ctx.lineTo(x + w, y + h - r);
          ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
          ctx.lineTo(x + r, y + h);
          ctx.quadraticCurveTo(x, y + h, x, y + h - r);
          ctx.lineTo(x, y + r);
          ctx.quadraticCurveTo(x, y, x + r, y);
          ctx.closePath();
          ctx.fill();
        } else if (shapeType === 'circle') {
          ctx.beginPath();
          ctx.ellipse(x + w / 2, y + h / 2, w / 2, h / 2, 0, 0, Math.PI * 2);
          ctx.fill();
        } else if (shapeType === 'triangle') {
          ctx.beginPath();
          ctx.moveTo(x + w / 2, y);
          ctx.lineTo(x + w, y + h);
          ctx.lineTo(x, y + h);
          ctx.closePath();
          ctx.fill();
        }
        
        if (el.stroke) {
          ctx.strokeStyle = el.stroke;
          ctx.lineWidth = el.strokeWidth || 2;
          ctx.stroke();
        }
        
        ctx.restore();
        completed++;
        if (completed === total) resolve(offscreenCanvas.toDataURL('image/png'));
      } else if (el.type === 'image') {
        const img = new Image();
        img.crossOrigin = 'anonymous';
        img.onload = () => {
          ctx.save();
          ctx.globalAlpha = opacity;
          
          if (el.rotation) {
            const centerX = x + w / 2;
            const centerY = y + h / 2;
            ctx.translate(centerX, centerY);
            ctx.rotate(el.rotation * Math.PI / 180);
            ctx.translate(-centerX, -centerY);
          }
          
          ctx.beginPath();
          ctx.rect(x, y, w, h);
          ctx.clip();
          
          const imgRatio = img.width / img.height;
          const targetRatio = w / h;
          
          let sx, sy, sw, sh;
          let dx = x, dy = y, dw = w, dh = h;
          
          if (imgRatio > targetRatio) {
            sh = img.height;
            sw = img.height * targetRatio;
            sx = (img.width - sw) / 2;
            sy = 0;
          } else {
            sw = img.width;
            sh = img.width / targetRatio;
            sx = 0;
            sy = (img.height - sh) / 2;
          }
          
          ctx.drawImage(img, sx, sy, sw, sh, dx, dy, dw, dh);
          ctx.restore();
          
          completed++;
          if (completed === total) resolve(offscreenCanvas.toDataURL('image/png'));
        };
        img.onerror = () => {
          completed++;
          if (completed === total) resolve(offscreenCanvas.toDataURL('image/png'));
        };
        img.src = el.src;
      }
    });
    
    if (elements.some(e => e.type === 'text' || e.type === 'shape')) {
      // nothing extra needed
    }
  });
}

// ===== 草稿系统增强 =====

// ====== 移动端预览 ======
function showMobilePreview() {
  const modal = $('mobilePreviewModal');
  const screen = $('mobilePreviewScreen');
  
  generateCanvasImage().then(dataUrl => {
    screen.innerHTML = `<img src="${dataUrl}" style="width:100%; height:100%; object-fit:contain; display:block;">`;
    modal.style.display = 'flex';
  });
}

// ====== 草稿管理 ======
let draftSearchKeyword = '';

function saveDraft() {
  if (state.currentDraftId) {
    const draft = state.drafts.find(d => d.id === state.currentDraftId);
    if (draft) {
      $('draftNameInput').value = draft.name;
    } else {
      $('draftNameInput').value = `草稿_${formatDate(new Date())}`;
    }
  } else {
    $('draftNameInput').value = `草稿_${formatDate(new Date())}`;
  }
  
  $('saveDraftModal').style.display = 'flex';
}

function formatDate(date) {
  const pad = n => n.toString().padStart(2, '0');
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())} ${pad(date.getHours())}-${pad(date.getMinutes())}`;
}

function doSaveDraft(overwrite = false) {
  const name = $('draftNameInput').value.trim();
  if (!name) {
    showToast('请输入草稿名称', 'error');
    return;
  }
  
  generateCanvasImage().then(thumb => {
    const draftData = {
      elements: JSON.parse(JSON.stringify(state.elements)),
      canvasWidth: state.canvasWidth,
      canvasHeight: state.canvasHeight,
      canvasBg: state.canvasBg
    };
    
    if (overwrite && state.currentDraftId) {
      const draftIndex = state.drafts.findIndex(d => d.id === state.currentDraftId);
      if (draftIndex > -1) {
        state.drafts[draftIndex].name = name;
        state.drafts[draftIndex].date = new Date().toISOString();
        state.drafts[draftIndex].thumbnail = thumb;
        state.drafts[draftIndex].data = draftData;
        
        const draft = state.drafts.splice(draftIndex, 1)[0];
        state.drafts.unshift(draft);
      }
    } else {
      const draft = {
        id: Date.now().toString(),
        name: name,
        date: new Date().toISOString(),
        thumbnail: thumb,
        data: draftData
      };
      state.drafts.unshift(draft);
      state.currentDraftId = draft.id;
    }
    
    if (state.drafts.length > 50) state.drafts = state.drafts.slice(0, 50);
    localStorage.setItem('designDrafts', JSON.stringify(state.drafts));
    
    $('saveDraftModal').style.display = 'none';
    showToast('草稿已保存');
  });
}

function showDrafts() {
  draftSearchKeyword = '';
  if ($('draftSearch')) {
    $('draftSearch').value = '';
  }
  renderDraftsList();
  $('draftsModal').style.display = 'flex';
}

function loadDraft(id) {
  const draft = state.drafts.find(d => d.id === id);
  if (!draft) return;
  
  state.elements = JSON.parse(JSON.stringify(draft.data.elements));
  state.canvasWidth = draft.data.canvasWidth;
  state.canvasHeight = draft.data.canvasHeight;
  state.canvasBg = draft.data.canvasBg;
  state.currentDraftId = id;
  state.selectedElementIds = [];
  
  if (draft.data.canvasBg) {
    canvas.style.background = draft.data.canvasBg;
  }
  
  const sizeStr = `${state.canvasWidth}x${state.canvasHeight}`;
  const select = $('canvasSizeSelect');
  if ([...select.options].some(opt => opt.value === sizeStr)) {
    select.value = sizeStr;
  } else {
    select.value = 'custom';
  }
  
  renderElements();
  updateCanvasSize();
  saveHistory();
  $('draftsModal').style.display = 'none';
  showToast(`已加载草稿：${draft.name}`);
}

function duplicateDraft(id, event) {
  event.stopPropagation();
  const draft = state.drafts.find(d => d.id === id);
  if (!draft) return;
  
  const newDraft = JSON.parse(JSON.stringify(draft));
  newDraft.id = Date.now().toString();
  newDraft.name = draft.name + ' 副本';
  newDraft.date = new Date().toISOString();
  
  const index = state.drafts.findIndex(d => d.id === id);
  state.drafts.splice(index + 1, 0, newDraft);
  
  localStorage.setItem('designDrafts', JSON.stringify(state.drafts));
  renderDraftsList();
  showToast('草稿已复制');
}

function deleteDraft(id, event) {
  event.stopPropagation();
  if (!confirm('确定删除这个草稿吗？')) return;
  state.drafts = state.drafts.filter(d => d.id !== id);
  localStorage.setItem('designDrafts', JSON.stringify(state.drafts));
  if (state.currentDraftId === id) {
    state.currentDraftId = null;
  }
  renderDraftsList();
  showToast('草稿已删除');
}

function renderDraftsList() {
  const list = $('draftsList');
  let filteredDrafts = state.drafts;
  
  if (draftSearchKeyword) {
    const keyword = draftSearchKeyword.toLowerCase();
    filteredDrafts = state.drafts.filter(d => 
      d.name.toLowerCase().includes(keyword)
    );
  }
  
  if (filteredDrafts.length === 0) {
    if (state.drafts.length === 0) {
      list.innerHTML = '<div class="empty-drafts">暂无草稿，点击"保存草稿"创建第一个吧~</div>';
    } else {
      list.innerHTML = '<div class="empty-drafts">没有找到匹配的草稿</div>';
    }
    return;
  }
  
  list.innerHTML = '';
  filteredDrafts.forEach(draft => {
    const card = document.createElement('div');
    card.className = 'draft-card';
    const date = new Date(draft.date);
    const dateStr = formatDateTime(date);
    const isCurrent = draft.id === state.currentDraftId;
    
    card.innerHTML = `
      <div class="draft-thumb"><img src="${draft.thumbnail}" style="width:100%; height:100%; object-fit:cover;"></div>
      <div class="draft-info">
        <div class="draft-name">${draft.name}${isCurrent ? ' <span style="color:#667eea; font-size:11px; font-weight:normal;">(当前)</span>' : ''}</div>
        <div class="draft-date">最近编辑：${dateStr}</div>
        <div class="draft-actions">
          <button class="btn-secondary" data-action="load" data-id="${draft.id}">加载</button>
          <button class="btn-secondary" data-action="duplicate" data-id="${draft.id}">复制</button>
          <button class="btn-danger" data-action="delete" data-id="${draft.id}">删除</button>
        </div>
      </div>
    `;
    
    card.addEventListener('click', (e) => {
      const actionBtn = e.target.closest('button');
      if (actionBtn) {
        const action = actionBtn.dataset.action;
        const id = actionBtn.dataset.id;
        if (action === 'load') loadDraft(id);
        else if (action === 'duplicate') duplicateDraft(id, e);
        else if (action === 'delete') deleteDraft(id, e);
      } else {
        loadDraft(draft.id);
      }
    });
    
    list.appendChild(card);
  });
}

function formatDateTime(date) {
  const now = new Date();
  const diff = now - date;
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);
  
  if (minutes < 1) return '刚刚';
  if (minutes < 60) return `${minutes}分钟前`;
  if (hours < 24) return `${hours}小时前`;
  if (days < 7) return `${days}天前`;
  
  return date.toLocaleString('zh-CN', { 
    month: '2-digit', 
    day: '2-digit', 
    hour: '2-digit', 
    minute: '2-digit' 
  });
}

// ====== Toast 提示 ======
let toastTimer = null;
function showToast(message, type = 'success') {
  const toast = $('toast');
  toast.textContent = message;
  toast.className = `toast show ${type}`;
  
  if (toastTimer) clearTimeout(toastTimer);
  toastTimer = setTimeout(() => {
    toast.className = 'toast';
  }, 2000);
}

// ====== 复制颜色 ======
function copyColor() {
  const color = $('colorHex').textContent;
  navigator.clipboard.writeText(color).then(() => {
    showToast('颜色已复制');
  }).catch(() => {
    showToast('复制失败', 'error');
  });
}

// ====== 事件绑定 ======
function bindEvents() {
  // 左侧面板 Tab 切换
  document.querySelectorAll('.tab-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
      document.querySelectorAll('.panel-content').forEach(p => p.classList.remove('active'));
      btn.classList.add('active');
      $(`${btn.dataset.tab}-panel`).classList.add('active');
    });
  });
  
  // 素材子 Tab
  document.querySelectorAll('.assets-tabs .sub-tab-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.assets-tabs .sub-tab-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      renderAssets(btn.dataset.asset);
    });
  });
  
  // 图片子 Tab（全部/我的素材）
  document.querySelectorAll('.assets-sub-tabs .sub-tab-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.assets-sub-tabs .sub-tab-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      currentImageTab = btn.dataset.imagesTab;
      renderAssets('images');
    });
  });
  
  // 素材搜索
  if ($('assetsSearch')) {
    $('assetsSearch').addEventListener('input', (e) => {
      assetSearchKeyword = e.target.value;
      renderAssets('images');
    });
  }
  
  // 收藏当前选中的图片
  if ($('favoriteImageBtn')) {
    $('favoriteImageBtn').addEventListener('click', () => {
      const selected = getElementById(state.selectedElementIds[0]);
      if (!selected || selected.type !== 'image') return;
      
      const name = prompt('请输入素材名称：', '我的图片');
      if (name && name.trim()) {
        toggleFavoriteAsset(selected.src, name.trim());
      }
    });
  }
  
  // 模板搜索
  $('templateSearch').addEventListener('input', renderTemplates);
  
  // 文字预设
  document.querySelectorAll('.text-preset-btn').forEach(btn => {
    btn.addEventListener('click', () => addText(btn.dataset.type));
  });
  
  // 文字属性
  $('fontSizeSlider').addEventListener('input', (e) => {
    const val = parseInt(e.target.value);
    $('fontSizeValue').textContent = val + 'px';
    const el = getElementById(state.selectedElementIds[0]);
    if (el && el.type === 'text') {
      el.fontSize = val;
      renderElements();
    }
  });
  $('fontSizeSlider').addEventListener('change', saveHistory);
  
  $('fontWeightSelect').addEventListener('change', (e) => {
    const el = getElementById(state.selectedElementIds[0]);
    if (el && el.type === 'text') {
      el.fontWeight = parseInt(e.target.value);
      renderElements();
      saveHistory();
    }
  });
  
  $('fontFamilySelect').addEventListener('change', (e) => {
    const el = getElementById(state.selectedElementIds[0]);
    if (el && el.type === 'text') {
      el.fontFamily = e.target.value;
      renderElements();
      saveHistory();
    }
  });
  
  $('textColorPicker').addEventListener('input', (e) => {
    const el = getElementById(state.selectedElementIds[0]);
    if (el && el.type === 'text') {
      el.color = e.target.value;
      renderElements();
    }
  });
  $('textColorPicker').addEventListener('change', saveHistory);
  
  $('lineHeightSlider').addEventListener('input', (e) => {
    const val = parseFloat(e.target.value);
    $('lineHeightValue').textContent = val;
    const el = getElementById(state.selectedElementIds[0]);
    if (el && el.type === 'text') {
      el.lineHeight = val;
      renderElements();
    }
  });
  $('lineHeightSlider').addEventListener('change', saveHistory);
  
  $('letterSpacingSlider').addEventListener('input', (e) => {
    const val = parseInt(e.target.value);
    $('letterSpacingValue').textContent = val + 'px';
    const el = getElementById(state.selectedElementIds[0]);
    if (el && el.type === 'text') {
      el.letterSpacing = val;
      renderElements();
    }
  });
  $('letterSpacingSlider').addEventListener('change', saveHistory);
  
  // 对齐按钮
  document.querySelectorAll('.align-btns .mini-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const el = getElementById(state.selectedElementIds[0]);
      if (el && el.type === 'text') {
        el.textAlign = btn.dataset.align;
        document.querySelectorAll('.align-btns .mini-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        renderElements();
        saveHistory();
      }
    });
  });
  
  // 配色面板
  $('addSavedColorBtn').addEventListener('click', saveCurrentColor);
  $('copyColorBtn').addEventListener('click', copyColor);
  $('mainColorPicker').addEventListener('input', (e) => {
    $('colorHex').textContent = e.target.value;
    state.clipboardColor = e.target.value;
  });
  
  // 图层面板按钮
  $('moveUpBtn').addEventListener('click', moveLayerUp);
  $('moveDownBtn').addEventListener('click', moveLayerDown);
  $('deleteLayerBtn').addEventListener('click', deleteSelected);
  
  // 属性面板
  $('posXInput').addEventListener('change', (e) => {
    const el = getElementById(state.selectedElementIds[0]);
    if (el) { el.x = parseInt(e.target.value) || 0; renderElements(); saveHistory(); }
  });
  $('posYInput').addEventListener('change', (e) => {
    const el = getElementById(state.selectedElementIds[0]);
    if (el) { el.y = parseInt(e.target.value) || 0; renderElements(); saveHistory(); }
  });
  $('widthInput').addEventListener('change', (e) => {
    const el = getElementById(state.selectedElementIds[0]);
    if (el) { el.width = Math.max(20, parseInt(e.target.value) || 20); renderElements(); saveHistory(); }
  });
  $('heightInput').addEventListener('change', (e) => {
    const el = getElementById(state.selectedElementIds[0]);
    if (el) { el.height = Math.max(20, parseInt(e.target.value) || 20); renderElements(); saveHistory(); }
  });
  $('opacitySlider').addEventListener('input', (e) => {
    const val = parseInt(e.target.value);
    $('opacityValue').textContent = val + '%';
    const el = getElementById(state.selectedElementIds[0]);
    if (el) { el.opacity = val; renderElements(); }
  });
  $('opacitySlider').addEventListener('change', saveHistory);
  $('rotationInput').addEventListener('change', (e) => {
    const el = getElementById(state.selectedElementIds[0]);
    if (el) { el.rotation = parseInt(e.target.value) || 0; renderElements(); saveHistory(); }
  });
  
  // 顶部工具栏
  $('undoBtn').addEventListener('click', undo);
  $('redoBtn').addEventListener('click', redo);
  $('alignLeftBtn').addEventListener('click', () => alignElements('left'));
  $('alignCenterBtn').addEventListener('click', () => alignElements('center'));
  $('alignRightBtn').addEventListener('click', () => alignElements('right'));
  $('alignTopBtn').addEventListener('click', () => alignElements('top'));
  $('alignMiddleBtn').addEventListener('click', () => alignElements('middle'));
  $('alignBottomBtn').addEventListener('click', () => alignElements('bottom'));
  $('distributeHBtn').addEventListener('click', () => distributeElements('horizontal'));
  $('distributeVBtn').addEventListener('click', () => distributeElements('vertical'));
  $('mobilePreviewBtn').addEventListener('click', showMobilePreview);
  $('draftsBtn').addEventListener('click', showDrafts);
  $('saveDraftBtn').addEventListener('click', saveDraft);
  $('exportPngBtn').addEventListener('click', exportPNG);
  $('exportPdfBtn').addEventListener('click', exportPDF);
  $('batchExportBtn').addEventListener('click', () => {
    renderBatchSizes();
    $('batchExportModal').style.display = 'flex';
  });
  
  // 尺寸选择
  $('canvasSizeSelect').addEventListener('change', (e) => {
    if (e.target.value === 'custom') {
      $('customSizeModal').style.display = 'flex';
    } else {
      const [w, h] = e.target.value.split('x').map(Number);
      setCanvasSize(w, h);
    }
  });
  
  // 自定义尺寸模态框
  $('closeCustomSize').addEventListener('click', () => $('customSizeModal').style.display = 'none');
  $('cancelCustomSize').addEventListener('click', () => $('customSizeModal').style.display = 'none');
  $('confirmCustomSize').addEventListener('click', () => {
    const w = parseInt($('customWidth').value) || 800;
    const h = parseInt($('customHeight').value) || 800;
    setCanvasSize(w, h);
    $('customSizeModal').style.display = 'none';
  });
  
  // 批量导出模态框
  $('closeBatchExport').addEventListener('click', () => $('batchExportModal').style.display = 'none');
  $('cancelBatchExport').addEventListener('click', () => $('batchExportModal').style.display = 'none');
  $('confirmBatchExport').addEventListener('click', batchExport);
  $('resetSizeBtn').addEventListener('click', resetCurrentSize);
  $('applyToAllBtn').addEventListener('click', applyToAllSizes);
  $('snapToSafeBtn').addEventListener('click', snapCurrentSizeToSafeZone);
  $('showSafeZone').addEventListener('change', () => {
    updateSafeZoneDisplay();
    checkOverflowForCurrentSize();
  });
  
  // 点击预览画布空白处取消选中
  if ($('batchPreviewCanvas')) {
    $('batchPreviewCanvas').addEventListener('mousedown', (e) => {
      if (e.target.id === 'batchPreviewCanvas' || e.target.classList.contains('safe-zone')) {
        batchState.selectedElementIndex = -1;
        renderBatchPreview();
      }
    });
  }
  
  // 移动端预览
  $('closeMobilePreview').addEventListener('click', () => $('mobilePreviewModal').style.display = 'none');
  
  // 草稿模态框
  $('closeDrafts').addEventListener('click', () => $('draftsModal').style.display = 'none');
  if ($('draftSearch')) {
    $('draftSearch').addEventListener('input', (e) => {
      draftSearchKeyword = e.target.value;
      renderDraftsList();
    });
  }
  
  // 保存草稿模态框
  $('closeSaveDraft').addEventListener('click', () => $('saveDraftModal').style.display = 'none');
  $('cancelSaveDraft').addEventListener('click', () => $('saveDraftModal').style.display = 'none');
  $('confirmSaveDraftBtn').addEventListener('click', () => doSaveDraft(true));
  $('saveAsNewDraftBtn').addEventListener('click', () => doSaveDraft(false));
  
  // 图片裁剪和替换
  $('cropImageBtn').addEventListener('click', () => {
    if (state.selectedElementIds.length > 0) {
      openCropModal(state.selectedElementIds[0]);
    }
  });
  $('replaceImageBtn').addEventListener('click', () => {
    $('replaceImageInput').click();
  });
  $('replaceImageInput').addEventListener('change', (e) => {
    if (e.target.files.length > 0) {
      replaceImage(e.target.files[0]);
      e.target.value = '';
    }
  });
  $('closeCropModal').addEventListener('click', () => $('cropImageModal').style.display = 'none');
  $('cancelCropBtn').addEventListener('click', () => $('cropImageModal').style.display = 'none');
  $('confirmCropBtn').addEventListener('click', confirmCrop);
  $('resetCropBtn').addEventListener('click', resetCrop);
  $('cropZoomSlider').addEventListener('input', (e) => {
    const val = parseInt(e.target.value);
    $('cropZoomValue').textContent = val + '%';
    cropState.imgScale = cropState.baseScale * (val / 100);
    updateCropUI();
  });
  
  // 裁剪比例按钮
  document.querySelectorAll('.ratio-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      setCropRatio(btn.dataset.ratio);
    });
  });
  
  // 点击模态框背景关闭
  document.querySelectorAll('.modal-overlay').forEach(overlay => {
    overlay.addEventListener('click', (e) => {
      if (e.target === overlay) overlay.style.display = 'none';
    });
  });
  
  // 缩放控制
  $('zoomInBtn').addEventListener('click', zoomIn);
  $('zoomOutBtn').addEventListener('click', zoomOut);
  $('zoomFitBtn').addEventListener('click', zoomFit);
  
  // 画布点击取消选择
  canvas.addEventListener('mousedown', (e) => {
    if (e.target === canvas) {
      deselectAll();
    }
  });
  
  // 画布拖放
  const canvasWrapperEl = $('canvasWrapper');
  canvasWrapperEl.addEventListener('dragover', handleCanvasDragOver);
  canvasWrapperEl.addEventListener('dragleave', handleCanvasDragLeave);
  canvasWrapperEl.addEventListener('drop', handleCanvasDrop);
  
  // 上传图片
  $('uploadImage').addEventListener('change', (e) => {
    if (e.target.files.length > 0) {
      handleImageUpload(e.target.files);
      e.target.value = '';
    }
  });
  
  // 键盘快捷键
  document.addEventListener('keydown', (e) => {
    if (e.target.tagName === 'INPUT' || e.target.tagName === 'SELECT' || e.target.isContentEditable) return;
    
    if (e.ctrlKey && e.key === 'z') {
      e.preventDefault();
      undo();
    } else if (e.ctrlKey && e.key === 'y') {
      e.preventDefault();
      redo();
    } else if (e.ctrlKey && e.key === 's') {
      e.preventDefault();
      saveDraft();
    } else if (e.ctrlKey && e.key === 'a') {
      e.preventDefault();
      selectAll();
    } else if (e.key === 'Delete' || e.key === 'Backspace') {
      if (state.selectedElementIds.length > 0) {
        e.preventDefault();
        deleteSelected();
      }
    } else if (e.key === 'Escape') {
      deselectAll();
    }
  });
  
  // 窗口大小变化时重新适配
  window.addEventListener('resize', () => {
    zoomFit();
  });
}

// ====== 启动 ======
window.addEventListener('DOMContentLoaded', init);