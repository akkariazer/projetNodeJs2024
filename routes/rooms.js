const express = require('express');
const router = express.Router();
const { 
  getRooms, 
  getRoomById, 
  createRoom, 
  updateRoom, 
  deleteRoom 
} = require('../controllers/roomController');
const auth = require('../middleware/auth');

router.get('/', getRooms);
router.get('/:id', getRoomById);
router.post('/', auth, createRoom);
router.put('/:id', auth, updateRoom);
router.delete('/:id', auth, deleteRoom);

module.exports = router;