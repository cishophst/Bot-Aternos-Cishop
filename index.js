const mineflayer = require('mineflayer');
const express = require('express');
require('dotenv').config();

const bot = mineflayer.createBot({
  host: 'server.aternos.org',  // Ganti dengan alamat server Aternos Anda
  port: 25565,                 // Ganti jika Anda menggunakan port custom
  username: process.env.BOT_USERNAME,  // Ganti dengan username bot Anda
  password: process.env.BOT_PASSWORD,  // Ganti dengan password bot Anda (jika menggunakan akun premium)
  version: '1.21'              // Menentukan versi Minecraft
});

bot.once('spawn', () => {
  bot.chat('Halo! Saya bot Minecraft yang berjalan di versi 1.21+');
});

bot.on('chat', (username, message) => {
  if (username === bot.username) return;

  if (message === 'follow me') {
    const player = bot.players[username];
    if (!player || !player.entity) {
      bot.chat("Aku tidak bisa melihatmu!");
      return;
    }
    const target = player.entity;
    bot.pathfinder.setGoal(new goals.GoalFollow(target, 1), true);
  }

  if (message === 'stop') {
    bot.pathfinder.setGoal(null);
  }
});

bot.on('error', (err) => {
  console.log(`Terjadi kesalahan: ${err.message}`);
});

bot.on('end', () => {
  console.log('Bot terputus dari server, mencoba untuk menyambung ulang...');
  setTimeout(() => {
    bot = mineflayer.createBot(bot.options);
  }, 5000);
});

// Web server untuk menjaga bot tetap hidup di Replit
const app = express();
app.get('/', (req, res) => {
  res.send('Bot is alive!');
});

app.listen(3000, () => {
  console.log('Web server is running...');
});