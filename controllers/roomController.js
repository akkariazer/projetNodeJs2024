const Room = require('../models/Room');

// Obtenir toutes les salles
exports.getRooms = async (req, res) => {
  try {
    const rooms = await Room.find();
    res.json(rooms);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Erreur serveur');
  }
};

// Obtenir une salle par son ID
exports.getRoomById = async (req, res) => {
  try {
    const room = await Room.findById(req.params.id);
    if (!room) {
      return res.status(404).json({ msg: 'Salle non trouvée' });
    }
    res.json(room);
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Salle non trouvée' });
    }
    res.status(500).send('Erreur serveur');
  }
};

// Créer une nouvelle salle
exports.createRoom = async (req, res) => {
  const { name, capacity, equipment, description } = req.body;

  try {
    const newRoom = new Room({
      name,
      capacity,
      equipment,
      description
    });

    const room = await newRoom.save();
    res.json(room);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Erreur serveur');
  }
};

// Mettre à jour une salle
exports.updateRoom = async (req, res) => {
  const { name, capacity, equipment, description } = req.body;

  try {
    let room = await Room.findById(req.params.id);
    if (!room) {
      return res.status(404).json({ msg: 'Salle non trouvée' });
    }

    room.name = name || room.name;
    room.capacity = capacity || room.capacity;
    room.equipment = equipment || room.equipment;
    room.description = description || room.description;

    await room.save();
    res.json(room);
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Salle non trouvée' });
    }
    res.status(500).send('Erreur serveur');
  }
};

// Supprimer une salle
exports.deleteRoom = async (req, res) => {
  try {
    const room = await Room.findById(req.params.id);
    if (!room) {
      return res.status(404).json({ msg: 'Salle non trouvée' });
    }

    await room.remove();
    res.json({ msg: 'Salle supprimée' });
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Salle non trouvée' });
    }
    res.status(500).send('Erreur serveur');
  }
};