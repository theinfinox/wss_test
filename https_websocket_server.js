const fs = require('fs');
const https = require('https');
const WebSocket = require('ws');
const express = require('express');

const app = express();

// Load SSL certificates (replace with your own certificate paths)
const server = https.createServer({
    key: fs.readFileSync('./key.pem'),
    cert: fs.readFileSync('./cert.pem')
}, app);

const wss = new WebSocket.Server({ server });

wss.on('connection', (ws) => {
    console.log('New client connected');

    setInterval(() => {
        const now = new Date().toLocaleString('en-IN', { 
            timeZone: 'Asia/Kolkata', 
            hour: '2-digit', 
            minute: '2-digit', 
            second: '2-digit', 
            hour12: true 
        });
        
        ws.send(now);
        console.log(`Sent: ${now}`);
    }, 1000);

    ws.on('close', () => {
        console.log('Client disconnected');
    });
});

server.listen(3001, () => {
    console.log('Secure WebSocket server running on wss://localhost:3001');
});
