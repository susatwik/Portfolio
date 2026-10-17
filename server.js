/**
 * Local Development Server for Susatwik Manuri Portfolio
 * Serves static assets and routes /api/contact directly to serverless handler.
 * Zero external dependencies required.
 */

const http = require('http');
const fs = require('fs');
const path = require('path');

// Auto-load .env file if present in workspace (zero external dependencies)
try {
  const envPath = path.resolve(__dirname, '.env');
  if (fs.existsSync(envPath)) {
    const lines = fs.readFileSync(envPath, 'utf8').split(/\r?\n/);
    for (const rawLine of lines) {
      const line = rawLine.trim();
      if (!line || line.startsWith('#')) continue;
      const eqIdx = line.indexOf('=');
      if (eqIdx > 0) {
        const key = line.slice(0, eqIdx).trim();
        let val = line.slice(eqIdx + 1).trim();
        if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
          val = val.slice(1, -1);
        }
        if (!process.env[key]) {
          process.env[key] = val.trim();
        }
      }
    }
  }
} catch (e) {
  // Silent ignore
}

const PORT = process.env.PORT || 3000;
const PUBLIC_DIR = __dirname;
const contactHandler = require('./api/contact.js');

const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.webp': 'image/webp',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
  '.ttf': 'font/ttf',
  '.map': 'application/json'
};

const server = http.createServer(async (req, res) => {
  const parsedUrl = new URL(req.url, `http://${req.headers.host || 'localhost'}`);
  const pathname = decodeURIComponent(parsedUrl.pathname);

  // 1. API Route: /api/contact
  if (pathname === '/api/contact') {
    let bodyBuffer = '';
    req.on('data', chunk => {
      bodyBuffer += chunk;
      // Prevent flood attacks
      if (bodyBuffer.length > 1e6) {
        req.destroy();
      }
    });

    req.on('end', async () => {
      // Mock Express / Vercel res methods
      res.status = function(code) {
        res.statusCode = code;
        return res;
      };

      res.json = function(data) {
        if (!res.getHeader('Content-Type')) {
          res.setHeader('Content-Type', 'application/json; charset=utf-8');
        }
        res.end(JSON.stringify(data));
        return res;
      };

      try {
        if (bodyBuffer && req.headers['content-type']?.includes('application/json')) {
          req.body = JSON.parse(bodyBuffer);
        } else if (bodyBuffer) {
          const params = new URLSearchParams(bodyBuffer);
          req.body = Object.fromEntries(params.entries());
        } else {
          req.body = {};
        }
      } catch (err) {
        req.body = {};
      }

      try {
        await contactHandler(req, res);
      } catch (err) {
        console.error('[API Server Error]', err);
        if (!res.writableEnded) {
          res.status(500).json({ ok: false, error: 'Internal server error.' });
        }
      }
    });
    return;
  }

  // 2. Static File Serving
  let relativePath = pathname === '/' ? 'index.html' : pathname.replace(/^\/+/, '');
  let filePath = path.normalize(path.join(PUBLIC_DIR, relativePath));

  // Security: prevent path traversal out of PUBLIC_DIR
  if (!filePath.startsWith(PUBLIC_DIR)) {
    res.statusCode = 403;
    res.setHeader('Content-Type', 'text/plain');
    res.end('403 Forbidden');
    return;
  }

  // Security: never serve .env, dotfiles, or internal configuration files
  const baseName = path.basename(filePath);
  if (baseName.startsWith('.') || baseName.includes('.env')) {
    res.statusCode = 403;
    res.setHeader('Content-Type', 'text/plain');
    res.end('403 Forbidden');
    return;
  }

  fs.stat(filePath, (err, stats) => {
    if (err || !stats.isFile()) {
      // Fallback to index.html if file doesn't exist
      const indexPath = path.join(PUBLIC_DIR, 'index.html');
      fs.readFile(indexPath, (indexErr, content) => {
        if (indexErr) {
          res.statusCode = 404;
          res.setHeader('Content-Type', 'text/plain');
          res.end('404 Not Found');
          return;
        }
        res.statusCode = 200;
        res.setHeader('Content-Type', 'text/html; charset=utf-8');
        res.end(content);
      });
      return;
    }

    const ext = path.extname(filePath).toLowerCase();
    const contentType = MIME_TYPES[ext] || 'application/octet-stream';

    res.statusCode = 200;
    res.setHeader('Content-Type', contentType);

    // Add caching headers for static assets
    if (ext === '.png' || ext === '.jpg' || ext === '.webp' || ext === '.woff2') {
      res.setHeader('Cache-Control', 'public, max-age=86400');
    } else {
      res.setHeader('Cache-Control', 'no-cache');
    }

    const stream = fs.createReadStream(filePath);
    stream.pipe(res);
  });
});

server.listen(PORT, () => {
  console.log(`\n======================================================`);
  console.log(`🚀 Susatwik Manuri Portfolio running at:`);
  console.log(`   http://localhost:${PORT}`);
  console.log(`   http://127.0.0.1:${PORT}`);
  console.log(`   API Endpoint: http://localhost:${PORT}/api/contact`);
  console.log(`======================================================\n`);
});

module.exports = server;
