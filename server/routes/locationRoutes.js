import express from 'express'
import pool from '../db.js'

const router = express.Router()

// POST /api/locations - Save a location
router.post('/', async (req, res) => {
  const { latitude, longitude, accuracy } = req.body

  if (
    typeof latitude !== 'number' ||
    typeof longitude !== 'number' ||
    typeof accuracy !== 'number'
  ) {
    return res.status(400).json({ success: false, error: 'Invalid location data' })
  }

  try {
    const result = await pool.query(
      'INSERT INTO locations (latitude, longitude, accuracy) VALUES ($1, $2, $3) RETURNING *',
      [latitude, longitude, accuracy]
    )

    res.status(201).json({ success: true, location: result.rows[0] })
  } catch (error) {
    console.error('Error saving location:', error)
    res.status(500).json({ success: false, error: 'Internal server error' })
  }
})

// GET /api/locations - Retrieve all locations (for testing or history screen)
router.get('/', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM locations ORDER BY created_at DESC');
    res.json({ success: true, locations: result.rows })
  } catch (error) {
    console.error('Error retrieving locations:', error)
    res.status(500).json({ success: false, error: 'Internal server error' })
  }
})

export default router
