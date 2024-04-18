const db = require('../models/db_conf.js');


module.exports.list = () => {
    return db.prepare("SELECT * FROM users WHERE status = 'coach' ORDER BY firstname").all();
};

module.exports.findById = (id) => {
    return db.prepare(
        `SELECT * FROM users u WHERE u.status = 'coach' AND user_id = ?`).get(id);}

module.exports.update = (data) => {
    if(!data.file){
        console.log("lhifbamfaijefabmfabjiebfmaegijbae")
        const stmt = db.prepare('UPDATE users SET biography = ? WHERE user_id = ?');
        const info = stmt.run(data.biography,data.id_coaches);
    }else{
    const stmt = db.prepare('UPDATE users SET biography = ? , picture_path = ? WHERE user_id = ?');
    const info = stmt.run(data.biography,data.file,data.id_coaches);
    }}