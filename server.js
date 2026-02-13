const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = 3000;
const ROOT_DIRECTORY = 'D:/Bloxorz - Block And Hole';
const DEFAULT_ROOT_FILE = 'index.html';

const server = http.createServer((req, res) => {
    const url = req.url;
    const method = req.method;

    // Helper to get cookies from request
    const getCookie = (name) => {
        const list = {};
        const rc = req.headers.cookie;
        rc && rc.split(';').forEach(cookie => {
            const parts = cookie.split('=');
            list[parts.shift().trim()] = decodeURI(parts.join('='));
        });
        return list[name];
    };

    // ROUTE: Create Randomized or Chosen Name
    if (url === '/create-randomized-name' || url === '/create-chosen-name') {
        const userName = getCookie('user_name_token');
        
        if (!userName) {
            res.writeHead(400);
            return res.end('No name provided in cookie.');
        }

        const cleanName = userName.replace(/[^a-z0-9]/gi, '_');
        const userFolder = path.join(ROOT_DIRECTORY, cleanName);

        // Create folder if it doesn't exist
        if (!fs.existsSync(userFolder)) {
            fs.mkdirSync(userFolder, { recursive: true });
        }

        // Save IP.save inside that folder
        const ip = req.socket.remoteAddress;
        const logContent = `Name: ${userName}\nIP: ${ip}\nDate: ${new Date().toISOString()}\n`;
        fs.writeFileSync(path.join(userFolder, 'IP.save'), logContent);

        // Clear the "one-time" cookie by setting it to expire
        res.setHeader('Set-Cookie', 'user_name_token=; Max-Age=0; Path=/');
        res.writeHead(200, { 'Content-Type': 'application/json' });
        return res.end(JSON.stringify({ status: 'success', folder: cleanName }));
    }

    // STATIC FILE SERVING
    let filePath = url === '/' 
        ? path.join(ROOT_DIRECTORY, DEFAULT_ROOT_FILE) 
        : path.join(ROOT_DIRECTORY, url);

    fs.readFile(filePath, (err, content) => {
        if (err) {
            res.writeHead(404);
            res.end('Not Found');
        } else {
            const ext = path.extname(filePath);
            const contentType = ext === '.html' ? 'text/html' : 'text/plain';
            res.writeHead(200, { 'Content-Type': contentType });
            res.end(content);
        }
    });
});

server.listen(PORT, () => console.log(`Server: http://localhost:${PORT}`));
