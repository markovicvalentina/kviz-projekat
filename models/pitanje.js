const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const PitanjeSchema = new Schema({
    question_string: String,
    choices: {
        correct: String,
        wrong: [String]
    }
});

const Pitanje = mongoose.model('pitanje', PitanjeSchema);

module.exports = Pitanje;