var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var taskSchema = new Schema({
    taskId: {
        type: Number,
        unique: true,
    },
    taskName: {
        type: String,
        default: " "
    },
    taskDes: {
        type: String,
        default: " "
    },
    gitRipoLink: {
        type: String,
        default: " "
    },
    taskImage: {
        type: String,
        default: " "
    },
    timeLimit: {
        type: Number,
        default: 0
    },
    Points: {
        type: Number,
        default: 0
    },
    playerIds: [{ type: String }]


});
module.exports = mongoose.model('Task', taskSchema);