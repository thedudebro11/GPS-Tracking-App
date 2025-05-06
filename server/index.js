import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import locationRoutes from './routes/locationRoutes.js'

dotenv.config()

const app = express()
const PORT = process.env.PORT || 4000

app.use(cors())
app.use(express.json())

app.get('/', (req, res) => {
  res.json({ success: true, time: new Date().toISOString() })
})

app.use('/api/locations', locationRoutes)

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`)
})
