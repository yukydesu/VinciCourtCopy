const express = require('express');
const router = express.Router();

const Message = require('../models/Messages.js');
const session = require('express-session');

router.get('/', (req, res) => {
    const idUser = parseInt(req.session.user.user_id);
    console.log(idUser)
    console.log(session.user === "coach")
    if(req.session.user.status === "coach"){
        const coach = Message.listCoach(idUser)
        console.log(coach)
        res.render("messages.hbs",{coach}) 
    }
    const user = Message.listUser(idUser);
    console.log(user)
    res.render("messages.hbs", {user})
});

router.post('/replyTo', function (req, res,next){
    Message.reply(req.body.message_id,req.body.response)
    res.redirect("/messages")
});


module.exports = router;