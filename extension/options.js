// ===== 加载已保存的设置 =====
document.addEventListener('DOMContentLoaded', async () => {
  const cfg = await chrome.storage.sync.get(['apiBase', 'apiToken']);
  if (cfg.apiBase) document.getElementById('apiBase').value = cfg.apiBase;
  if (cfg.apiToken) document.getElementById('apiToken').value = cfg.apiToken;
});

// ===== 保存设置 =====
document.getElementById('save-btn').addEventListener('click', async () => {
  const apiBase = document.getElementById('apiBase').value.trim();
  const apiToken = document.getElementById('apiToken').value.trim();

  if (!apiBase || !apiToken) {
    showStatus('请填写 API 地址和 Token', 'error');
    return;
  }

  try {
    // 验证 token 是否有效
    const res = await fetch(`${apiBase}/api/user/profile`, {
      headers: { 'Authorization': `Bearer ${apiToken}` }
    });
    if (!res.ok) throw new Error('Token 无效或 API 地址不可达');

    await chrome.storage.sync.set({ apiBase, apiToken });
    showStatus('✅ 设置已保存，Token 验证通过', 'success');
  } catch (err) {
    showStatus(`❌ ${err.message}`, 'error');
  }
});

function showStatus(msg, type) {
  const el = document.getElementById('status');
  el.textContent = msg;
  el.className = `status ${type}`;
}
