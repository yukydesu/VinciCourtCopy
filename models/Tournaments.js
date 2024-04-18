const db = require('./db_conf');

// get all tournament in a table
module.exports.list = () => {
    return db.prepare("SELECT * FROM tournaments ORDER BY date_tournament").all();  // SELECT all tournament 
};

// find a tournament by id
module.exports.findById = (id) => {

    return db.prepare(  // SELECT the details of the tournament + the number of player 
    // ------------ ?QUESTION?----------- // subselect dans le select ?
    // probleme : quand le count => 0 alors tout les résultat etait null, solution, subslect dans select....? autre solution ?
        `SELECT 
            tournaments.*, users.user_id as creator_id, users.firstname AS creator_firstname, users.surname AS creator_surname,
            (SELECT COUNT(*) FROM registrations WHERE registrations.tournament_id = tournaments.tournament_id) AS nb_players
        FROM
            tournaments, users
        WHERE
            tournaments.creator = users.user_id
        AND
            tournaments.tournament_id = ?;`
    ).get(id);
};

// find a tournament by name
module.exports.findByName = (name) => {

    return db.prepare(  // SELECT the tournament by name
        `SELECT 
            tournaments.*
        FROM
            tournaments
        WHERE
            tournaments.name = ?`).get(name);
};

// get the registration on the tournament
module.exports.getRegistration = (tournament_id, user_id) => {

    return db.prepare( // SELECT the registration
        `SELECT * 
        FROM registrations 
        WHERE registrations.tournament_id = ? 
        AND registrations.user_id = ?`).get(tournament_id, user_id);
};

// register the user on the tournament
module.exports.register = (tournament_id, user_id) => {

    return db.prepare( // INSERT the registration in the database
        `INSERT INTO registrations(user_id,tournament_id)
        VALUES (?, ?)`).run(user_id, tournament_id);
};

// unregister the user on the tournament
module.exports.unregister = (tournament_id, user_id) => {

    return db.prepare( // DELETE the registration on the database
        `DELETE FROM registrations 
        WHERE user_id = ? 
        AND tournament_id = ?`).run(user_id, tournament_id); 
};


// creeate the tournament
module.exports.create = (nName, nCreator, nDate, nNbMax, nBanner) => {

    return db.prepare( // DELETE the registration on the database
    `INSERT INTO tournaments(name, creator, date_tournament, nb_max_participants, banner_image_path)
    VALUES (?, ?, ?, ?, ?)`).run(nName, nCreator, nDate, nNbMax, nBanner); 

};
