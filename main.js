const express = require('express');
require('dotenv').config();
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const { Server } = require('socket.io');
const http = require('http');


const app = express();
const server = http.createServer(app);

const io = new Server(server)



const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());

let lampStatus = 'off'; // Lampu dimatikan secara default


app.get('/', (req, res) => {
  res.send('welcome to the api');
})

async function saveDailyPowerUsage(totalPowerUsage) {
  try {
    await prisma.dailyPowerUsage.create({
      data: {
        totalPowerUsage: totalPowerUsage.toFixed(2), // Batasi jumlah angka desimal
        timestamp: new Date()
      }
    });
    console.log("Total konsumsi daya harian berhasil disimpan ke database");
  } catch (error) {
    console.error("Gagal menyimpan total konsumsi daya harian ke database:", error);
  }
}

// Route untuk mendapatkan status lampu
app.get('/status', (req, res) => {
  res.json({ status: lampStatus });
});

// Route untuk mengubah status lampu
app.post('/update', (req, res) => {
  const { status } = req.body;
  if (status === 'on' || status === 'off') {
    lampStatus = status;
    console.log(lampStatus);
    res.json({ message: `Lampu diubah menjadi ${status}` });
  } else {
    res.status(400).json({ error: 'Status lampu harus "on" atau "off"' });
  }
});


// Route to save power usage data
app.post('/power-usage', async (req, res) => {
  try {
    const { current_mA, status } = req.body;
    await prisma.powerUsage.create({
      data: {
        current_mA,
        status
      }
    });
    res.status(201).json({ message: 'Data saved successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Route to save daily power usage data
app.post('/daily-power-usage', async (req, res) => {
  const { totalPowerUsage } = req.body;
  if (!totalPowerUsage) {
    return res.status(400).json({ error: 'Total konsumsi daya tidak diberikan' });
  }
  await saveDailyPowerUsage(totalPowerUsage);
  res.status(201).json({ message: 'Total konsumsi daya harian berhasil disimpan' });
});


io.on('connection', (socket) => {
  console.log('connected');
  socket.on ('disconnect', () => {
    console.log('disconnected');
  })
})

app.listen(PORT, () => {
  console.log(`Server running at port ${PORT}`);
});
