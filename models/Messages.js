const db = require('../models/db_conf.js');

module.exports.listUser = (id) => {
    return db.prepare(`SELECT m.*,u.*
    FROM messages m ,users u 
    WHERE m.receiver_id = u.user_id AND  sender_id = ? ORDER BY date_hour_message desc`).all(id);
}

module.exports.listCoach = (id) => {
    return db.prepare(`SELECT m.*,u.*
    FROM messages m ,users u 
    WHERE m.receiver_id = u.user_id AND m.receiver_id = ? AND response_text IS NULL ORDER BY date_hour_message desc`).all(id);
}

module.exports.findById = (id) => {
    console.log(id)
    return db.prepare(`SELECT * 
    FROM messages 
    WHERE sender_id = ?`).get(id);
    
};

module.exports.send = (data) =>{
    console.log(data.sender_id)
    const today = new Date();
    let date = today.getFullYear() + "-" + (today.getMonth() + 1) + "-" + today.getDate() + " " + today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();  
    const stmt = db.prepare('INSERT INTO messages(sender_id,receiver_id,message_text,date_hour_message) VALUES (?, ?, ?,?)');
    const info = stmt.run(data.sender_id, data.receiver_id, data.message_text, date);

}

module.exports.reply = (id,response_text)=>{
    const stmt = db.prepare('UPDATE messages SET response_text = ? WHERE message_id = ?');
    const info = stmt.run(response_text,id);
}

module.exports.number = ()=>{
    const nb = db.prepare(`SELECT COUNT(*) AS message_count
    FROM messages
    WHERE date_hour_message >= DATE('now', '-7 days');`);
    const result = nb.get()
    return result.message_count;
}