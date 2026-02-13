const http = require('http');
const fs = require('fs');
const path = require('path');

// --- CUSTOMIZATION SETTINGS ---
const PORT = 3001;
const ROOT_DIRECTORY = 'D:/Bloxorz - Block And Hole';
const DEFAULT_ROOT_FILE = 'index.html'; // Change this to your preferred start file
// ------------------------------

const server = http.createServer((req, res) => {
    // Determine the requested file path
    let filePath = req.url === '/' 
        ? path.join(ROOT_DIRECTORY, DEFAULT_ROOT_FILE) 
        : path.join(ROOT_DIRECTORY, req.url);

    // Get the file extension for MIME types
    const extname = path.extname(filePath);
    let contentType = 'text/html';

    const mimeTypes = {
        '.html': 'text/html',
        '.js': 'text/javascript',
        '.css': 'text/css',
        '.json': 'application/json',
        '.png': 'image/png',
        '.jpg': 'image/jpg',
        '.gif': 'image/gif',
        '.wav': 'audio/wav',
        '.mp4': 'video/mp4',
        '.woff': 'application/font-woff',
        '.ttf': 'application/font-ttf',
        '.eot': 'application/vnd.ms-fontobject',
        '.otf': 'application/font-otf',
        '.svg': 'application/image/svg+xml'
    };

    contentType = mimeTypes[extname] || 'application/octet-stream';

    // Read the file from disk
    fs.readFile(filePath, (error, content) => {
        if (error) {
            if (error.code === 'ENOENT') {
                res.writeHead(404);
                res.end('Error: File Not Found');
            } else {
                res.writeHead(500);
                res.end(`Server Error: ${error.code}`);
            }
        } else {
            res.writeHead(200, { 'Content-Type': contentType });
            res.end(content, 'utf-8');
        }
    });
});

server.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}/`);
    console.log(`Serving files from: ${ROOT_DIRECTORY}`);
    console.log(`Homepage is set to: ${DEFAULT_ROOT_FILE}`);
});