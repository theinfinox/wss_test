# wss_test
Test for web sockets over https

Cloudflare Tunnel does not directly support the `ws://` (WebSocket) protocol. However, you can work around this limitation by using **WebSockets over HTTPS (WSS)** instead. To achieve this, follow these steps:

---

### **Solution: Use WebSockets over HTTPS (WSS)**

#### **Step 1: Set Up Your WebSocket Server with HTTPS (Express.js Example)**

Modify your Node.js WebSocket server to use HTTPS instead of HTTP:

1. Install necessary dependencies:

   ```bash
   npm install express ws https fs
   ```

2. Create an `https_websocket_server.js` file:

   ```javascript
   const fs = require('fs');
   const https = require('https');
   const WebSocket = require('ws');
   const express = require('express');

   const app = express();

   // Load SSL certificates (replace with your own certificate paths)
   const server = https.createServer({
       key: fs.readFileSync('path/to/your/private-key.pem'),
       cert: fs.readFileSync('path/to/your/certificate.pem')
   }, app);

   const wss = new WebSocket.Server({ server });

   wss.on('connection', (ws) => {
       console.log('New client connected');

       setInterval(() => {
           const now = new Date().toLocaleTimeString('en-GB', { hour12: false });
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
   ```

3. Generate or obtain an SSL certificate:

   - Use **Let's Encrypt** (for production).
   - For local development, create a self-signed certificate:

     ```bash
     openssl req -x509 -newkey rsa:2048 -keyout key.pem -out cert.pem -days 365 -nodes
     ```

---

#### **Step 2: Run Cloudflare Tunnel with HTTPS Origin**

Once the WebSocket server is running securely over HTTPS (WSS), use Cloudflare Tunnel like this:

```bash
cloudflared tunnel --url https://192.168.0.101:3001
```

Cloudflare will provide a public URL like:

```
https://your-generated-url.trycloudflare.com
```

Since Cloudflare now sees the connection as HTTPS, WebSocket communication will work properly.

---

#### **Step 3: Update WebSocket Client (HTML/JS)**

Update your client code to use `wss://` instead of `ws://`:

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Secure WebSocket Clock</title>
</head>
<body>
    <h1>Live Clock</h1>
    <p id="clock">Connecting...</p>

    <script>
        const socket = new WebSocket("wss://your-generated-url.trycloudflare.com");

        socket.onopen = () => {
            console.log("Connected to WebSocket server");
            document.getElementById("clock").innerText = "Connected...";
        };

        socket.onmessage = (event) => {
            document.getElementById("clock").innerText = "Current Time: " + event.data;
        };

        socket.onerror = (error) => {
            console.error("WebSocket Error:", error);
        };

        socket.onclose = () => {
            console.log("WebSocket connection closed");
            document.getElementById("clock").innerText = "Disconnected";
        };
    </script>
</body>
</html>
```

---

#### **Step 4: Test the Setup**

1. Start your HTTPS WebSocket server:  
   ```bash
   node https_websocket_server.js
   ```

2. Run Cloudflare Tunnel:  
   ```bash
   cloudflared tunnel --url https://192.168.0.101:3001
   ```

3. Open the provided Cloudflare URL in your browser and check if the WebSocket clock updates correctly.

---
