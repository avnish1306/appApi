var mongoose = require('mongoose');
var Schema = mongoose.Schema;
const _ = require('lodash');
var playerSchema = new Schema({
    username: {
        type: String,
        unique: true,

    },
    playerId: {
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
    College: {
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
        type: String,
        default: ""
    },
    taskState: [{
        taskId: Number,
        state: Number
    }],
    tasks: [{ type: Number }],



});
playerSchema.methods.toJSON = function() {
    var player = this;
    var playerObject = player.toObject();
    return _.pick(playerObject, ['taskState', 'Email', '_id', 'playerId', 'College', 'Name', 'DoBs', 'username', 'profile_pic', 'Gender', 'tasks', 'taskId']);
}


module.exports = mongoose.model('Player', playerSchema);