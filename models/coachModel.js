var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var coachSchema = new Schema({
    username: {
        type: String,
        unique: true,
        required: true

    },
    coachId: {
        type: String,
        unique: true,
        minlength: 1,
        required: true
    },
    Name: {
        type: String
    },
    Email: {
        type: String,
        unique: true,
        minlength: 4,
        required: true
    },
    Profession: {
        type: String,
        default: ""
    },
    DoBs: {
        type: String
    },
    Gender: {
        type: String,
        default: ''
    },
    profile_pic: {
        type: String
    },
    goals: [{ type: String }]
});

coachSchema.methods.toJSON = function() {
    var coach = this;
    var coachObject = coach.toObject();
    return _.pick(coachObject, ['Email', '_id', 'coachId', 'Professoion', 'Name', 'DoBs', 'username', 'profile_pic', 'Gender', 'goals']);
}

module.exports = mongoose.model('Coach', coachSchema);