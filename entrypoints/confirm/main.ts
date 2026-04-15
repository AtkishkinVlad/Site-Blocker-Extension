const params = new URLSearchParams(window.location.search);
const targetUrl = params.get('url') || '';
const tabId = params.get('tabId') || '0';

const urlEl = document.getElementById('url')!;
const btnEl = document.getElementById('confirm')!;

urlEl.textContent = decodeURIComponent(targetUrl);
console.log('Confirm - tabId:', tabId, 'url:', targetUrl);

btnEl.addEventListener('click', () => {
  const url = decodeURIComponent(targetUrl);
  console.log('Click! URL:', url);
  
  browser.runtime.sendMessage({
    action: 'navigate',
    url: url,
    originalTabId: tabId
  });
  
  setTimeout(() => {
    window.close();
  }, 500);
});