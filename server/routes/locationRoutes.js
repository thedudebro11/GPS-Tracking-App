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

// GET /api/locations - Retrieve location history for premium users only
router.get('/', async (req, res) => {
  const userId = req.query.user_id
  const rangeParam = req.query.range

  if (!userId) {
    return res.status(400).json({ success: false, error: 'Missing user_id' })
  }

  try {
    // Check if the user is premium
    const userResult = await pool.query(
      'SELECT is_premium FROM users WHERE id = $1',
      [userId]
    )

    if (userResult.rowCount === 0) {
      return res.status(404).json({ success: false, error: 'User not found' })
    }

    const isPremium = userResult.rows[0].is_premium
    if (!isPremium) {
      return res.status(403).json({ success: false, error: 'Access denied: Premium required' })
    }

    const interval = rangeParam === '30' ? '30 days' : '7 days'

    const result = await pool.query(
      `SELECT id, latitude, longitude, accuracy, address, created_at, is_emergency
       FROM locations
       WHERE user_id = $1 AND created_at >= NOW() - INTERVAL '${interval}'
       ORDER BY created_at DESC`,
      [userId]
    )

    res.setHeader('Cache-Control', 'no-store')
    res.json({ success: true, locations: result.rows })
  } catch (error) {
    console.error('Error retrieving locations:', error)
    res.status(500).json({ success: false, error: 'Internal server error' })
  }
})

export default router
