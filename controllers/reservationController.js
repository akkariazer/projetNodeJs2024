const Reservation = require('../models/Reservation');
const Room = require('../models/Room');

// Vérifier les conflits de réservation
const checkReservationConflict = async (roomId, startTime, endTime, excludeReservationId = null) => {
  const conflictingReservation = await Reservation.findOne({
    room: roomId,
    $or: [
      { startTime: { $lt: endTime }, endTime: { $gt: startTime } },
      { startTime: { $gte: startTime, $lt: endTime } },
      { endTime: { $gt: startTime, $lte: endTime } }
    ],
    ...(excludeReservationId && { _id: { $ne: excludeReservationId } })
  });

  return conflictingReservation;
};

// Obtenir toutes les réservations
exports.getReservations = async (req, res) => {
  try {
    const reservations = await Reservation.find({ user: req.user }).populate('room', 'name');
    res.json(reservations);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Erreur serveur');
  }
};

// Obtenir une réservation par son ID
exports.getReservationById = async (req, res) => {
  try {
    const reservation = await Reservation.findById(req.params.id).populate('room', 'name');
    if (!reservation) {
      return res.status(404).json({ msg: 'Réservation non trouvée' });
    }
    if (reservation.user.toString() !== req.user) {
      return res.status(401).json({ msg: 'Non autorisé' });
    }
    res.json(reservation);
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Réservation non trouvée' });
    }
    res.status(500).send('Erreur serveur');
  }
};

// Créer une nouvelle réservation
exports.createReservation = async (req, res) => {
  const { room, startTime, endTime } = req.body;

  try {
    // Vérifier si la salle existe
    const roomExists = await Room.findById(room);
    if (!roomExists) {
      return res.status(404).json({ msg: 'Salle non trouvée' });
    }

    // Vérifier les conflits de réservation
    const conflict = await checkReservationConflict(room, startTime, endTime);
    if (conflict) {
      return res.status(400).json({ msg: 'La salle est déjà réservée pour cette période' });
    }

    const newReservation = new Reservation({
      user: req.user,
      room,
      startTime,
      endTime
    });

    const reservation = await newReservation.save();
    res.json(reservation);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Erreur serveur');
  }
};

// Mettre à jour une réservation
exports.updateReservation = async (req, res) => {
  const { room, startTime, endTime } = req.body;

  try {
    let reservation = await Reservation.findById(req.params.id);
    if (!reservation) {
      return res.status(404).json({ msg: 'Réservation non trouvée' });
    }

    if (reservation.user.toString() !== req.user) {
      return res.status(401).json({ msg: 'Non autorisé' });
    }

    // Vérifier les conflits de réservation
    const conflict = await checkReservationConflict(room, startTime, endTime, req.params.id);
    if (conflict) {
      return res.status(400).json({ msg: 'La salle est déjà réservée pour cette période' });
    }

    reservation.room = room || reservation.room;
    reservation.startTime = startTime || reservation.startTime;
    reservation.endTime = endTime || reservation.endTime;

    await reservation.save();
    res.json(reservation);
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Réservation non trouvée' });
    }
    res.status(500).send('Erreur serveur');
  }
};

// Supprimer une réservation
exports.deleteReservation = async (req, res) => {
  try {
    const reservation = await Reservation.findById(req.params.id);
    if (!reservation) {
      return res.status(404).json({ msg: 'Réservation non trouvée' });
    }

    if (reservation.user.toString() !== req.user) {
      return res.status(401).json({ msg: 'Non autorisé' });
    }

    await reservation.remove();
    res.json({ msg: 'Réservation supprimée' });
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Réservation non trouvée' });
    }
    res.status(500).send('Erreur serveur');
  }
};