import express from 'express';

const app = express();
const PORT = 5001;

console.log('Starting test server...');

app.listen(PORT, () => {
  console.log(`Test server running on port ${PORT}`);
  console.log('Server should stay running now');
});

console.log('Listener setup complete');

// Keep it running
setTimeout(() => {
  console.log('Server is still running after 5 seconds!');
}, 5000);
