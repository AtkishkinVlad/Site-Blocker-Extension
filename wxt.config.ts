import { defineConfig } from 'wxt';

export default defineConfig({
  modules: ['@wxt-dev/module-react'],
  manifest: {
    name: 'Site Blocker',
    description: 'Block or confirm navigation to specific sites',
    permissions: ['storage', 'webNavigation'],
    host_permissions: ['<all_urls>'],
  },
});