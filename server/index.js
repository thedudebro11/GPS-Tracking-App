import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import locationRoutes from './routes/locationRoutes.js'
import alertRoutes from './routes/alertRoutes.js'
import pool from './db.js' // This connects to PostgreSQL

dotenv.config()

const app = express()
const PORT = process.env.PORT || 4000

app.use(cors())
app.use(express.json())

// Root test route
app.get('/', (req, res) => {
  res.json({ success: true, time: new Date().toISOString() })
})

// Route registrations
app.use('/api/locations', locationRoutes)
app.use('/api/alerts', alertRoutes) // ✅ moved below app init

// Emergency POST route
app.post('/api/alert', async (req, res) => {
  const {
    latitude,
    longitude,
    accuracy,
    message = 'Emergency Triggered',
    user_id = 'guest',
  } = req.body;

  try {
    await pool.query(
      `INSERT INTO emergencies (user_id, latitude, longitude, accuracy, message, is_emergency)
      VALUES ($1, $2, $3, $4, $5, $6)`,
      [user_id, latitude, longitude, accuracy, message, true]
    );

    console.log('🚨 Emergency alert stored in database');

    res.status(200).json({
      status: 'Alert received and stored',
      time: new Date().toISOString(),
    });
  } catch (err) {
    console.error('❌ Failed to store alert:', err);
    res.status(500).json({ error: 'Failed to store emergency alert' });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
