import express from 'express'
import pool from '../db.js'

const router = express.Router()

// GET /api/alerts - return emergency alerts
router.get('/', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM emergencies ORDER BY triggered_at DESC');
    res.json({ success: true, emergencies: result.rows });
  } catch (error) {
    console.error("Error fetching emergencies:", error);
    res.status(500).json({ success: false, error: "Failed to fetch emergency alerts" });
  }
});

export default router
