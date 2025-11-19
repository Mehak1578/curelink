const express = require('express');
const auth = require('../middleware/auth');
const Message = require('../models/Message');

const router = express.Router();

// GET /api/messages/conversation/:userId - get messages between current user and userId
router.get('/conversation/:userId', auth, async (req, res) => {
  try {
    const other = req.params.userId;
    const msgs = await Message.find({ $or: [ { from: req.user.id, to: other }, { from: other, to: req.user.id } ] }).sort({ createdAt: 1 });
    res.json(msgs);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Server error' });
  }
});

module.exports = router;
