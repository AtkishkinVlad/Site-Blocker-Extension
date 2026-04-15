const params = new URLSearchParams(window.location.search);
const targetUrl = params.get('url') || '';
const tabId = params.get('tabId') || '0';

const urlEl = document.getElementById('url')!;
const btnEl = document.getElementById('confirm')!;

urlEl.textContent = decodeURIComponent(targetUrl);
console.log('Confirm - tabId:', tabId, 'url:', targetUrl);

btnEl.addEventListener('click', () => {
  console.log('Click - updating tab:', tabId, 'to URL:', decodeURIComponent(targetUrl));
  
  const url = decodeURIComponent(targetUrl);
  chrome.tabs.update(Number(tabId), { url });
  window.close();
});