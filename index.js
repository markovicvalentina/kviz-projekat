const express = require('express');
const app = express();
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const routes = require('./routes/routes.js');


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

//comment
app.use(express.static('public'));
app.use('/api', routes);

app.use(function (err, req, res, next) {
    console.log(err.name)
    if (err.name === 'UnauthorizedError') { // Send the error rather than to show it on the console
        console.log('Responding with error...')
        res.status(401).send(err);
    }
    else {
        next(err);
    }
});

//fix deprecation warnings
mongoose.set('useNewUrlParser', true);
mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);
mongoose.set('useUnifiedTopology', true);

//connect to the database
mongoose.connect('mongodb+srv://Valentina:Valentina123456@cluster0-mgau2.mongodb.net/kviz?retryWrites=true&w=majority');
mongoose.Promise = global.Promise; //mongodb promise is deprecated

app.listen(3000, function(){
    console.log('Listening to port 3000');
});