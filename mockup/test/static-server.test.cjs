const { test } = require('node:test');
const assert = require('node:assert/strict');
const http = require('node:http');
const fs = require('node:fs/promises');
const os = require('node:os');
const path = require('node:path');
const handler = require('serve-handler');
const config = require('../../serve.json');

test('serverul static servește sub /platforma fără redirecturi circulare', async () => {
  const root = await fs.mkdtemp(path.join(os.tmpdir(), 'platforma-http-'));
  const html = '<!doctype html><title>Platforma demo</title>';
  const javascript = 'console.log("demo");';
  const server = http.createServer((request, response) => handler(request, response, { ...config, public: root }));
  try {
    await fs.mkdir(path.join(root, 'platforma/assets'), { recursive: true });
    await fs.writeFile(path.join(root, 'platforma/index.html'), html);
    await fs.writeFile(path.join(root, 'platforma/assets/app.js'), javascript);
    await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
    const origin = `http://127.0.0.1:${server.address().port}`;
    for (const route of ['/platforma', '/platforma/', '/platforma/judet/bacau?tema=scoli', '/platforma/proiect/scoala-demo-01', '/platforma/buletin', '/platforma/exploreaza', '/platforma/verifica']) {
      const response = await fetch(origin + route, { redirect: 'manual' });
      assert.equal(response.status, 200, route);
      assert.equal(response.headers.get('location'), null, route);
      assert.equal(await response.text(), html, route);
    }
    const asset = await fetch(origin + '/platforma/assets/app.js');
    assert.match(asset.headers.get('content-type'), /javascript/);
    assert.equal(await asset.text(), javascript);
    const outside = await fetch(origin + '/alt-site', { redirect: 'manual' });
    assert.equal(outside.status, 404);
    await outside.text();
  } finally {
    server.closeAllConnections();
    await new Promise(resolve => server.close(resolve));
    await fs.rm(root, { recursive: true, force: true });
  }
});
