const express = require('express');
const router = express.Router();

const Coaches = require('../models/Coaches.js');
const Message = require('../models/Messages.js');
const session = require('express-session');

const multer = require('multer');
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'public/images');
    },
    filename: function (req, file, cb) {
        const date = new Date();
        const uniquePrefix = date.getFullYear() + '-' + (date.getMonth() + 1) + 
        '-' + date.getDate() + '-' + date.getHours() + '-' + date.getMinutes() + 
        '-' + date.getSeconds();
        cb(null, uniquePrefix + '-' + file.originalname);
    }
})
const upload = multer({ storage: storage });

router.get('/', (req, res) => {
    const coachTable = Coaches.list();

    res.render("coaches/index.hbs",{coachTable})
});

router.get('/details', (req, res) => {
    const idCoach = parseInt(req.query.id);
    const coachFound = Coaches.findById(idCoach);
    res.render('coaches/details.hbs', {coach: coachFound});
});

router.get('/updateBio', (req, res) => {
    const coach = Coaches.findById(req.query.id);
    console.log(coach)
    res.render('coaches/update.hbs', {coach})
});

router.post('/updateBio', upload.single("coach_pciture_path"), function (req, res,next){
    const id_coaches = parseInt(req.body.id_coaches)
    console.log({biography : req.body.biography, file :'images/' + req.file.filename, id_coaches :req.body.id_coaches})
    Coaches.update({biography : req.body.biography, file :'images/' + req.file.filename, id_coaches :req.body.id_coaches})
    res.redirect('/coaches/details?id='+ id_coaches)
});

router.post('/sendTo', function (req, res,next){
    Message.send({ sender_id : req.session.user.user_id , receiver_id : req.body.idReceiver, message_text: req.body.message });
    res.redirect("/messages")
});




module.exports = router;

