var express = require('express');
var mongoose = require('mongoose');
var router = express.Router();
const _ = require('lodash');
var Promise = require('promise');

var Task = require('../models/taskModel');
var Player = require('../models/playerModel');

router.get('/goalTasks/:goalId', (req, res) => {
    var goalId = parseInt(req.params.goalId);
    console.log(" goalId ", goalId);
    Task.find({}).exec((err, tasks) => {
        if (err) throw err;
        var resObj = {};
        var promises = [];
        tasks.forEach(taskObj => {
            //console.log(" task obj", taskObj);
            var reqgoalId = Math.floor(parseInt(taskObj['taskId']) / 10000);
            promises.push(new Promise((resolve, reject) => {
                //console.log(" reqgoalId ", reqgoalId);
                if (reqgoalId == goalId) {
                    //console.log(" equal goalId");
                    resolve(taskObj);
                } else {
                    //console.log(" else ");
                    var o = {};
                    resolve(o);
                }
            }));

        });
        // console.log(" promise start");
        Promise.all(promises).then((resArray) => {
            //console.log(" in promise ");
            //console.log("resArray ", resArray);
            var outArray = [];
            resArray.forEach(obj => {
                if (obj['taskId'] != null) {
                    outArray.push(obj);
                    // console.log(" pushed ");
                }
                //console.log(outArray);
            });

            return res.status(200).send(outArray);
        }, (err) => {
            throw err;
        });

    })
});

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
router.post('/add/:goalId', (req, res) => {
    var body = _.pick(req.body, ['taskId', 'taskName', 'taskDes', 'taskImage', 'gitRipoLink', 'timeLimit', 'Points', 'playerIds', 'progress']);
    var goalId = parseInt(req.params.goalId);
    //body['taskId'] = goalId;
    var promise = new Promise((resolve, reject) => {
        Task.find({}, (err, tasks) => {
            if (err) throw err;
            console.log(tasks);
            if (tasks[0] != null) {
                var len = tasks.length;
                console.log("length ", len);

                resolve(parseInt((tasks[len - 1])['taskId']) + 1);
            } else {
                resolve(1000);
            }
        });
    });
    promise.then((taskId) => {
        if (body) {
            var newTaskId = goalId * 10000 + parseInt(taskId) % 10000;
            body['taskId'] = newTaskId;
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
    })

});
module.exports = router;