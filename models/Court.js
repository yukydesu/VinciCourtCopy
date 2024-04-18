const db = require('./db_conf');


module.exports.list = () => {
    return db.prepare("SELECT * FROM tennis_courts ORDER BY tennis_court_id ASC").all();
};

// find a tournament by id
module.exports.findById = (id) => {
    return db.prepare( `SELECT tennis_courts.* FROM tennis_courts WHERE tennis_court_id = ?`).get(id);
}

module.exports.getBooking = (user_id) => {

    return db.prepare(`SELECT book.* AND ten.name FROM bookings book AND tennis_courts ten WHERE book.user_id = ?`).all(user_id);
};

module.exports.book = (tennis_court_id, date_booking, user_id) => {

    return db.prepare(`INSERT INTO bookings(tennis_court_court, date_booking, user_id) VALUES (?, ?, ?)`).run(tennis_court_id, date_booking, user_id);
};

module.exports.unbook = (tennis_court_id, date_booking) => {

    return db.prepare(`DELETE FROM bookings book WHERE book.tennis_court_id = ? AND book.date_booking = ?`).run(tennis_court_id, date_booking);
};

module.exports.save = (data) => {
    console.log("SAVE :" + JSON.stringify(data));
    //no id => error
    // id => update court
    const stmt = db.prepare('UPDATE tennis_courts SET name = ?, flooring_type = ?, location = ?, picture_path = ? WHERE tennis_court_id = ?');
    const info = stmt.run(data.courtName, data.courtFlooringType, data.courtLocation, data.courtPicturePath, data.idCourt);
    console.log("court model save update" + info.changes);

}

module.exports.getNextWeekDates=() => {
    var today = new Date();
    var nextWeekDates = [];
    // Trouver le premier jour de la semaine prochaine
    var nextWeekFirstDay = new Date(today.getFullYear(), today.getMonth(), today.getDate() + (7 - today.getDay()));
    // Boucler sur les 7 jours de la semaine prochaine
    for (var i = 0; i < 7; i++) {
        var date = new Date(nextWeekFirstDay.getFullYear(), nextWeekFirstDay.getMonth(), nextWeekFirstDay.getDate() + i);
        nextWeekDates.push(date.toISOString().split('T')[0]); // Ajouter la date au format ISO (YYYY-MM-DD)
    }
    console.log(nextWeekDates)
    return nextWeekDates;


}


