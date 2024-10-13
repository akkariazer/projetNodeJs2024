const express = require('express');
const router = express.Router();
const { 
  getReservations, 
  getReservationById, 
  createReservation, 
  updateReservation, 
  deleteReservation 
} = require('../controllers/reservationController');
const auth = require('../middleware/auth');

router.get('/', auth, getReservations);
router.get('/:id', auth, getReservationById);
router.post('/', auth, createReservation);
router.put('/:id', auth, updateReservation);
router.delete('/:id', auth, deleteReservation);

module.exports = router;