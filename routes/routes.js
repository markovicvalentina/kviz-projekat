const express = require('express');
const router = express.Router();
const Pitanje = require('../models/pitanje');
const Korisnik = require('../models/korisnik');
// const { resolve } = require('path');
const path = require('path');
const jwt = require('jsonwebtoken');
const exjwt = require('express-jwt');

const jwtMW = exjwt({
    secret: 'keyboard cat 4 ever'
});

router.get('/', jwtMW, function(req, res){
    Pitanje.find({}).then((pitanja) => {
        res.send(pitanja);
    });
});

router.get('/kviz', function(req, res){
    // res.sendFile(resolve(__dirname, '..', 'public', 'index.html'));
    res.sendFile(path.join(__dirname, '../public/index.html'));
});

router.get('/new', function(req, res){
    Pitanje.create({
        question_string: 'drugo novo pitanje',
        choices: {
            correct: 'drugo tacno',
            wrong: ['mozda', 'ne znam', 'begaj']
        }
    }).then(function (pitanje) {
        res.send(pitanje);
    });
});

router.post('/login', (req, res) => {
    const username = req.body.username;
    const password = req.body.password;

    console.log(username, password)

    Korisnik.findOne({ username: username }).then(function(user){
        if (!user) {
            return res.json({
                success: false,
                err: 'User not found'
            });
        }

        if(user.password == password){
            let token = jwt.sign({ id: user._id, username: user.username }, 'keyboard cat 4 ever', { expiresIn: 129600 }); // Sigining the token
            res.json({
                sucess: true,
                err: null,
                token
            });
        }
        else{
            res.json({
                sucess: false,
                err: 'invalid creds'
            });
        }
    })
});

router.post('/register', function(req, res){
        const username = req.body.username;
        const password = req.body.password;

        Korisnik.create({
            username: username,
            password: password,
            highscore: 0
        }).then((korisnik) => {
            res.json(korisnik);
        })    
});
//Bearer fsjdfkdgjds;kfzkd;gkdg;dflk
router.post('/update-high-score', jwtMW, function(req, res){
    const authHeader = req.get('Authorization');
    const token = authHeader.split(' ')[1];
    const tokenInfo = jwt.verify(token, 'keyboard cat 4 ever');
    console.log(tokenInfo);
    Korisnik.findOne({ _id: tokenInfo.id }).then(function(user){
        console.log(req.body.newScore);
        if (user.highscore < req.body.newScore) {
            Korisnik.updateOne({ _id: tokenInfo.id }, { highscore: req.body.newScore }).then(function(updatedUser) {
            });
        }
    })
    res.json({});
})

router.get('/high-scores', function(req, res) {
    Korisnik.find({}).sort({ highscore: -1 }).then(function(docs) {
        res.json(docs);
    });
    
});

router.post('/question', function(req, res){
    const questionString = req.body.questionString;
    const correctChoice = req.body.correctChoice;
    const wrongChoice1 = req.body.wrongChoice1;
    const wrongChoice2 = req.body.wrongChoice2;
    const wrongChoice3 = req.body.wrongChoice3;

    Pitanje.create({
        question_string: questionString,
        choices: {
            correct: correctChoice,
            wrong: [wrongChoice1, wrongChoice2, wrongChoice3]
        }
    }).then((newQuestion) => {
        res.json(newQuestion);
    })
})

module.exports = router;