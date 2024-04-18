const express = require('express');
const router = express.Router();
const Tournaments = require('../models/Tournaments.js');

/* GET index tournament. */
router.get('/', (req, res) => {

    const tournamentsTable = Tournaments.list();  // table with all tournament
    res.render("tournaments/index.hbs", {tournamentsTable}) // render index page with the table
});

/* GET details tournament. */
router.get('/details', function (req, res, next) {

    const tournamentIdParam = parseInt(req.query.id_tournament);  // convert string req.query.id to int
    const tournamentFound = Tournaments.findById(tournamentIdParam); // find the tournament by id 

    if (tournamentFound === undefined) { // if the tournament is not found
        res.render('tournaments/details.hbs',{tournamentNotFoundError: true}); // render detail page with error

    } else { // if the tournament is found

        if(req.session.user != undefined) { // if the user is not connected

            if((tournamentFound.date_tournament > new Date().toISOString().slice(0, 10)) && // if the tournament date has not passed
            (tournamentFound.nb_players != tournamentFound.nb_max_participants)){ // and number of player != number max of player of the tournament

                const registration = Tournaments.getRegistration(tournamentIdParam, req.session.user.user_id) // get the registration

                if(registration === undefined) { 
                    
                    // if the user is not registered
                    res.render('tournaments/details.hbs', {tournament: tournamentFound, registered: false});  // render the page the register button

                }else{
                    // if the user is registered
                    res.render('tournaments/details.hbs', {tournament: tournamentFound, registered: true}); // render the page the unregister button
                }

            }else{
                // if number of player === number max of player of the tournament OR the tournament date is past
                res.render('tournaments/details.hbs', {tournament: tournamentFound}); // render detail page without the button
            }

        }else{
            // if the user is not connected
            res.render('tournaments/details.hbs', {tournament: tournamentFound}); // render detail page without the button
        }
    }
});


/* SUBSCRIBE to a tournament */
router.post('/register', function (req, res, next) {

    const tournamentIdParam = parseInt(req.body.id_tournament);  // convert string req.query.id to int
    const tournamentFound = Tournaments.register(tournamentIdParam, req.session.user.user_id); // register the player
    res.redirect('/tournaments/details?id_tournament='+ tournamentIdParam); // redirect detail page 
 
});


/* SUBSCRIBE to a tournament */
router.post('/unregister', function (req, res, next) {

    const tournamentIdParam = parseInt(req.body.id_tournament);  // convert string req.query.id to int
    const tournamentFound = Tournaments.unregister(tournamentIdParam, req.session.user.user_id); // register the player
    res.redirect('/tournaments/details?id_tournament='+ tournamentIdParam); // redirect detail page 
 
});

/* GET creation tournament. */
router.get('/creation', (req, res) => {

    if(req.session.user === undefined || req.session.user.status === 'regular'){ // if the user is not a coach
        res.redirect('/');

    }else{
        // if the user is a coach
        res.render("tournaments/creation.hbs") // render index page with the table
    }
});


/* create a tournament */
router.post('/create', (req, res)  => {

    let tournament = Tournaments.findByName(req.body.newTournamentName);

    if(tournament != undefined) { // if there is alrady a tournament with this name
        res.render('tournaments/creation.hbs',{creationNameError: true}); // render detail page with Name error

    }else{
        // if there is not alrady a tournament with this name
        if(req.body.newTournamentDate < new Date().toISOString().slice(0, 10)) { // if the date is passed
            res.render('tournaments/creation.hbs',{creationDateError: true}); // render detail page with error

        }else{
            // if the date is not passed
            let nFileName = 'images/' + req.body.newBanner_image; // add "image/" at the name to have the entier path

            Tournaments.create(req.body.newTournamentName, parseInt(req.session.user.user_id), 
            req.body.newTournamentDate , parseInt(req.body.newMaxPlayers), nFileName); // call SQL script to create the tournament on the database

            res.redirect('/tournaments') // redirect to the tournament list (index.hbs)
        }
    }
});

module.exports = router;