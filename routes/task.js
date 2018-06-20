var express = require('express');
var mongoose = require('mongoose');
var router = express.Router();
const _ = require('lodash');
var Promise = require('promise');

var Task = require('../models/taskModel');
var Player = require('../models/playerModel');

router.get('/allTasks/:a/:b/:playerId', (req, res) => {
    var a = parseInt(req.params.a);
    a = a - 1;
    var b = parseInt(req.params.b);
    console.log(a, " ", b);
    Task.find({})
        .exec((err, result) => {
            if (err) throw err;
            var resArray = [];
            var resObj = {};
            var promises = [];
            // res.status(200).send(result.slice(a, b));

            result.forEach(taskObj => {

                promises.push(new Promise((resolve, reject) => {
                    var taskId = parseInt(taskObj['taskId']);
                    var playerId = req.params.playerId;
                    Player.findOne({ 'playerId': playerId }, (err, playerObj) => {
                        if (err) reject(err);

                        var taskArray = playerObj.taskState;
                        var obj;
                        if (taskArray[0] != null) {
                            obj = taskArray.find((obj) => {
                                //console.log(" obj ", obj.taskId);
                                if (obj.taskId == taskId) {
                                    console.log("true");
                                    resObj = {};
                                    resObj = {
                                        'success': true,
                                        'state': obj.state
                                    };
                                    resObj['task'] = taskObj;

                                    /* res.json({
                                        'success': true,
                                        'state': obj.state
                                    });*/
                                } else {
                                    console.log("false");
                                    resObj = {};
                                    resObj = {
                                        'success': false,
                                        'state': 0
                                    };
                                    resObj['task'] = taskObj;
                                    /* res.json({
                                        'success': false,
                                        'state': 0
                                    });*/
                                }

                            });
                            // console.log(" if obj ", obj);
                        } else {
                            console.log("else");
                            console.log("false");
                            resObj = {};
                            resObj = {
                                'success': false,
                                'state': 0
                            };
                            resObj['task'] = taskObj;
                        }
                        resolve(resObj);
                        console.log("before findPlayer res obj  ", resObj);
                    });

                }));

                //console.log("after findPlayer res obj  ", resObj);
                //resObj['task'] = taskObj;
                //resArray.push(resObj);
                //resObj = {};
            });
            Promise.all(promises).then((resArray) => {
                return res.status(200).send(resArray);
            }, (err) => {
                throw err;
            });


        });
});
router.post('/add', (req, res) => {
    var body = _.pick(req.body, ['taskId', 'taskName', 'taskDes', 'taskImage', 'gitRipoLink', 'timeLimit', 'Points', 'playerIds']);
    if (body) {
        var task = new Task(body);
        console.log(task);
        task.save().then((task) => {
            res.status(200).json({
                'success': true,
                'msg': 'saved',
                'taskId': req.body.taskId
            });
        }, (e) => {
            console.log(e);
            res.status(200).json({
                'success': false,
                'msg': 'not saved'
            });
        });
    }
});
module.exports = router;