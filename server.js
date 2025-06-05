import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import fetch from 'node-fetch';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config();

const app = express();
const PORT = 3000;

// Resolve paths relative to this file so the server works from any cwd
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Directories for static assets
const PUBLIC_DIR = path.join(__dirname, 'public');
const GAME_DIR = path.join(PUBLIC_DIR, 'Game');

app.use(cors());
app.use(express.json());

// Serve schema.json directly before static middleware so it isn't intercepted
app.get('/schema.json', (req, res) => {
  res.sendFile(path.join(__dirname, 'schema.json'));
});

app.use(express.static(PUBLIC_DIR));
app.use('/Game', express.static(GAME_DIR));

app.get('/', (req, res) => {
  res.sendFile(path.join(PUBLIC_DIR, 'index.html'));
});

// Example endpoint
app.get('/api/ping', (req, res) => {
  res.json({ message: 'pong' });
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
