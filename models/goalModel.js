var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var goalSchema = new Schema({
    goalId: {
        type: Number,
        unique: true,
    },
    goalName: {
        type: String,
        default: " "
    },
    goalDes: {
        type: String,
        default: " "
    },
    goalImage: {
        type: String,
        default: " "
    },
    timeLimit: {
        type: Number,
        default: 0
    },
    coachId: {
        type: String,
        default: ""
    },
    dateCreated: {
        type: String,
        default: ""
    },
    progress: {
        type: Number,
        default: 0
    },
    tasks: [{ type: Number }]

});

module.exports = mongoose.model('Goal', goalSchema);