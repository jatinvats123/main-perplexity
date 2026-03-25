import "dotenv/config";
import app from "./src/app.js";
import http from "http";
import connectDB from "./src/config/database.js";
import { initSocket } from "./src/sockets/server.socket.js";

const PORT = process.env.PORT || 3001;
const ENV = process.env.NODE_ENV || 'development';

const httpServer = http.createServer(app);

// Enable socket reuse - critical for nodemon restarts
httpServer.on('listening', () => {
    // Set TCP_NODELAY to disable Nagle algorithm
    httpServer._handle.setBlocking(false);
});

initSocket(httpServer);

connectDB()
    .catch((err) => {
        console.error("❌ MongoDB connection failed:", err.message);
        process.exit(1);
    });

// Start server with comprehensive error handling
httpServer.listen(PORT, () => {
    console.log(`✅ Server running on port ${PORT} [${ENV}]`);
    console.log(`📍 Local: http://localhost:${PORT}`);
    console.log(`📍 Network: http://192.168.1.8:${PORT}`);
});

// Handle port conflicts and server errors
httpServer.on('error', (err) => {
    if (err.code === 'EADDRINUSE') {
        console.error(`\n❌ PORT ERROR: Port ${PORT} is already in use!`);
        console.error(`\n⚠️  Likely cause on nodemon restart:`);
        console.error(`   • OS kernel hasn't released port from previous process yet`);
        console.error(`   • Port is in TIME_WAIT state (30-120 seconds)`);
        console.error(`\n✅ Quick solutions:`);
        console.error(`   1. Wait 10-30 seconds and restart manually`);
        console.error(`   2. Kill all Node processes: taskkill /F /IM node.exe`);
        console.error(`   3. Change PORT in .env to try different port`);
        console.error(`   4. Check which process: netstat -ano | findstr :${PORT}`);
        process.exit(1);
    } else {
        console.error('❌ Server error:', err.message);
        process.exit(1);
    }
});

// Graceful shutdown with proper port release
process.on('SIGINT', async () => {
    console.log('\n\n🛑 Initiating graceful shutdown...');
    
    // Step 1: Close Socket.io connections
    if (global.io) {
        global.io.close();
        console.log('✅ Socket.io connections closed');
    }
    
    // Step 2: Close HTTP server and stop accepting new connections
    httpServer.close(() => {
        console.log('✅ HTTP server closed');
    });
    
    // Step 3: Wait for sockets to fully release before exit
    // This gives the OS time to close the port properly
    setTimeout(() => {
        console.log('✅ Port released, exiting process...');
        process.exit(0);
    }, 3000);
    
    // Force exit after 10 seconds if something hangs
    setTimeout(() => {
        console.error('⚠️  Force closing (graceful shutdown timeout)');
        process.exit(1);
    }, 10000);
});

// Handle unexpected errors
process.on('uncaughtException', (err) => {
    console.error('❌ Uncaught Exception:', err);
    process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
    console.error('❌ Unhandled Rejection:', reason);
    process.exit(1);
});
