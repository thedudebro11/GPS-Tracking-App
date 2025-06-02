import express from 'express'
import pool from '../db.js'

const router = express.Router()

// POST /api/alerts - Save emergency location
router.post('/', async (req, res) => {
  const {
    latitude,
    longitude,
    accuracy,
    message = 'Emergency Triggered',
    user_id = 'guest',
    is_emergency = true,
  } = req.body;

  if (
    typeof latitude !== 'number' ||
    typeof longitude !== 'number' ||
    typeof accuracy !== 'number' ||
    typeof is_emergency !== 'boolean'
  ) {
    return res.status(400).json({ error: 'Invalid data' });
  }

  try {
    const result = await pool.query(
      `INSERT INTO locations (user_id, latitude, longitude, accuracy, message, is_emergency)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING *`,
      [user_id, latitude, longitude, accuracy, message, is_emergency]
    );
    console.log('🚨 Emergency alert stored:', { latitude, longitude, accuracy, message, user_id });

    res.status(201).json({
      status: 'Alert received and stored',
      time: new Date().toISOString(),
      data: result.rows[0],
    });
  } catch (err) {
    console.error('❌ Failed to store emergency alert:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// ✅ GET /api/alerts - Retrieve recent emergencies
router.get('/', async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT * FROM locations WHERE is_emergency = true ORDER BY created_at DESC LIMIT 100'
    );
    res.status(200).json({ emergencies: result.rows });
  } catch (err) {
    console.error('❌ Failed to fetch alerts:', err);
    res.status(500).json({ error: 'Failed to fetch alerts' });
  }
});

export default router; // ✅ export AFTER defining all routes
