import { createServer } from 'http';
import app from './app.js';
import dotenv from 'dotenv';
import { initializeSocket } from './socket/consultationSocket.js';

dotenv.config();

const PORT = process.env.PORT || 5000;

// Create HTTP server
const server = createServer(app);

// Initialize Socket.IO
initializeSocket(server);

// Start server
server.listen(PORT, () => {
    console.log(`✅ Server running on http://localhost:${PORT}`);
    console.log(`📝 Environment: ${process.env.NODE_ENV || 'development'}`);
    console.log(`🔌 Socket.IO initialized for real-time messaging`);
});
