const express = require('express');
const router = express.Router();
const Tournaments = require('../models/Tournaments.js');
const Message = require('../models/Messages.js');

router.get('/', (req, res) => {
    const tournamentsTable = Tournaments.list();
    const nbTournament = tournamentsTable.length;
    const nbMessages = Message.number();
    console.log(nbMessages)
    res.render('index.hbs', { nbTournament,nbMessages });
});


module.exports = router;