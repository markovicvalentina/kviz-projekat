const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const KorisnikSchema = new Schema({
    username: String,
    password: String,
    highscore: Number
});

const Korisnik = mongoose.model('korisnik', KorisnikSchema);

module.exports = Korisnik;