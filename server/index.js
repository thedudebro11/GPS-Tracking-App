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



app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
