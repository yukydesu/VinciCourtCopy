const express = require('express');
const router = express.Router();
const Court = require('../models/Court.js');

// code to placed in routers before routes 
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



/* GET exoplanets index. */
router.get('/', (req, res) => {
    const courtsTable = Court.list()
    res.render('courts/index.hbs', {courtsTable : courtsTable});
});

/* GET details courts. */
router.get('/details', (req, res) => {
    const courtId = parseInt(req.query.id);  
    const courtFound = Court.findById(courtId); 
    if (courtFound === undefined) {
        res.render('courts/details.hbs',{notFoundError : true});

    } else {
    res.render('courts/details.hbs', {court: courtFound, weekDates: Court.getNextWeekDates}); 
    } 
});

router.get('/bookings', (req, res)=> {
    
    res.render('courts/bookings.hbs');
});

router.post('/book', function (req, res, next) {
    res.redirect('/courts/bookings');
});

router.post('/unbook', function (req, res, next) {
    res.redirect('/courts/bookings');
});

router.get('/update', (req, res) => {
    const courtId = parseInt(req.query.id); 
    const courtFound = Court.findById(courtId); 
    if (courtFound === undefined) {
        res.render('courts/details.hbs',{notFoundError : true}); 

    } else {
        res.render('courts/update.hbs', {court: courtFound});
    }
});

router.post('/update', upload.single("court_picture_path"),function (req, res, next) {
 
    Court.save({
        idCourt : parseInt(req.body.id),
        courtName: req.body.court_name,
        courtFlooringType: req.body.court_flooring_type,
        courtLocation: req.body.court_location,
        courtPicturePath: 'images/' + req.file.filename,
    });
    res.redirect('/courts/details?id='+ req.body.id);
});



module.exports = router;