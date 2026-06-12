// ===== 常量 =====
const TYPES = [
  { value: 'link', label: '链接', icon: '🔗' },
  { value: 'image', label: '图片', icon: '🖼️' },
  { value: 'code', label: '代码', icon: '💻' },
  { value: 'note', label: '笔记', icon: '📝' },
];
const DOMAINS = [
  { value: 'design', label: '设计' },
  { value: 'dev', label: '开发' },
  { value: 'product', label: '产品' },
];

let apiBase = '';
let apiToken = '';
let selectedType = 'link';
let selectedDomains = [];
let tags = [];

// ===== 初始化 =====
document.addEventListener('DOMContentLoaded', async () => {
  const cfg = await chrome.storage.sync.get(['apiBase', 'apiToken']);
  apiBase = cfg.apiBase || '';
  apiToken = cfg.apiToken || '';

  if (!apiBase || !apiToken) {
    document.getElementById('no-config').style.display = 'block';
    return;
  }

  document.getElementById('form').style.display = 'block';
  renderTypes();
  renderDomains();
  bindEvents();
  loadPageInfo();
});

// ===== 获取当前页面信息 =====
async function loadPageInfo() {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  if (!tab) return;
  document.getElementById('title').value = tab.title || '';
  document.getElementById('url').value = tab.url || '';
}

// ===== 渲染类型按钮 =====
function renderTypes() {
  const row = document.getElementById('type-row');
  row.innerHTML = TYPES.map(t =>
    `<button class="type-btn${t.value === selectedType ? ' active' : ''}" data-type="${t.value}">
      <span>${t.icon}</span>${t.label}
    </button>`
  ).join('');
}

// ===== 渲染领域按钮 =====
function renderDomains() {
  const row = document.getElementById('domain-row');
  row.innerHTML = DOMAINS.map(d =>
    `<span class="domain-tag${selectedDomains.includes(d.value) ? ' active' : ''}" data-domain="${d.value}">${d.label}</span>`
  ).join('');
}

// ===== 更新标签显示 =====
function renderTags() {
  const list = document.getElementById('tag-list');
  list.innerHTML = tags.map(t =>
    `<span class="tag" data-tag="${t}">${t}<span class="remove">&times;</span></span>`
  ).join('');
}

// ===== 绑定事件 =====
function bindEvents() {
  // 类型点击
  document.getElementById('type-row').addEventListener('click', (e) => {
    const btn = e.target.closest('.type-btn');
    if (!btn) return;
    selectedType = btn.dataset.type;
    renderTypes();
    updateContentFields();
  });

  // 领域点击
  document.getElementById('domain-row').addEventListener('click', (e) => {
    const tag = e.target.closest('.domain-tag');
    if (!tag) return;
    const d = tag.dataset.domain;
    selectedDomains = selectedDomains.includes(d)
      ? selectedDomains.filter(x => x !== d)
      : [...selectedDomains, d];
    renderDomains();
  });

  // 标签添加
  document.getElementById('tag-input').addEventListener('keydown', (e) => {
    if (e.key === 'Enter') { e.preventDefault(); addTag(); }
  });
  document.getElementById('tag-add-btn').addEventListener('click', addTag);

  // 标签删除
  document.getElementById('tag-list').addEventListener('click', (e) => {
    const tagEl = e.target.closest('.tag');
    if (!tagEl) return;
    tags = tags.filter(t => t !== tagEl.dataset.tag);
    renderTags();
  });

  // 保存
  document.getElementById('save-btn').addEventListener('click', save);

  // 设置
  document.getElementById('open-settings').addEventListener('click', (e) => {
    e.preventDefault();
    chrome.runtime.openOptionsPage();
  });
}

// ===== 按类型显示/隐藏字段 =====
function updateContentFields() {
  document.getElementById('code-field').style.display = selectedType === 'code' ? 'block' : 'none';
  document.getElementById('note-field').style.display = selectedType === 'note' ? 'block' : 'none';
}

// ===== 添加标签 =====
function addTag() {
  const input = document.getElementById('tag-input');
  const val = input.value.trim();
  if (!val) return;
  if (!tags.includes(val)) {
    tags.push(val);
    renderTags();
  }
  input.value = '';
}

// ===== 保存到 InspireHub =====
async function save() {
  const title = document.getElementById('title').value.trim();
  if (!title) return showStatus('请输入标题', 'error');

  const url = document.getElementById('url').value.trim();
  let content = url;
  if (selectedType === 'code') content = document.getElementById('code-content').value.trim();
  if (selectedType === 'note') content = document.getElementById('note-content').value.trim();
  if (!content) return showStatus('请输入内容', 'error');

  const notes = document.getElementById('notes').value.trim();
  const sourceUrl = selectedType === 'link' ? url : '';
  const body = {
    title,
    type: selectedType,
    content,
    domain: selectedDomains,
    tags,
    notes,
    ...(sourceUrl ? { sourceUrl } : {}),
  };

  const btn = document.getElementById('save-btn');
  btn.disabled = true;
  btn.textContent = '保存中…';

  try {
    const res = await fetch(`${apiBase}/api/inspirations`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiToken}`,
      },
      body: JSON.stringify(body),
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.message || `HTTP ${res.status}`);
    }

    showStatus('✅ 已保存到 InspireHub', 'success');
    setTimeout(() => window.close(), 1200);
  } catch (err) {
    showStatus(`❌ ${err.message}`, 'error');
  } finally {
    btn.disabled = false;
    btn.textContent = '保存到 InspireHub';
  }
}

function showStatus(msg, type) {
  const el = document.getElementById('status');
  el.textContent = msg;
  el.className = `status ${type}`;
  if (type === 'success') setTimeout(() => el.textContent = '', 3000);
}
