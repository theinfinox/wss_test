const WebSocket = require('ws');

// Create WebSocket server on port 8080
const wss = new WebSocket.Server({ port: 3001 });

console.log('WebSocket server running on ws://localhost:3001');

// Handle client connections
wss.on('connection', (ws) => {
    console.log('New client connected');

    // Function to send the current time
    const sendTime = () => {
        const now = new Date();
        const timeString = now.toLocaleTimeString('en-GB', { hour12: false });
        ws.send(timeString);
        console.log(`Sent: ${timeString}`);
    };

    // Send time every second
    const interval = setInterval(sendTime, 1000);

    // Handle client disconnection
    ws.on('close', () => {
        clearInterval(interval);
        console.log('Client disconnected');
    });
});
