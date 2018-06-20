var express = require('express');
var mongoose = require('mongoose');
var router = express.Router();
const _ = require('lodash');
var Player = require('../models/playerModel');
var Goal = require('../models/goalModel');
var Task = require('../models/taskModel');
var Coach = require('../models/coachModel');

router.get('/isuname/:uname', (req, res) => {
    var uname = req.params.uname;
    Player.find({ username: uname }, (err, result) => {
        if (result.length) {
            res.status(200).json({
                'success': false,
                'msg': 'user exist'
            });
        } else {
            res.status(200).json({
                'success': true,
                'msg': 'user not exist'
            });
        }

    })
});

router.get('/isemail/:email', (req, res) => {
    var email = req.params.email;
    Player.find({ Email: email }, (err, result) => {
        if (result.length) {
            res.status(200).json({
                'success': false,
                'msg': 'email exist'
            });
        } else {
            res.status(200).json({
                'success': true,
                'msg': 'email not exist'
            });
        }

    });
});

router.post('/save', (req, res, next) => {
    var body = _.pick(req.body, ['Email', 'playerId', 'College', 'Name', 'DoBs', 'username', 'profile_pic', 'Gender', 'tasks']);



    console.log(" body ", body);

    Player.find({ Email: body.Email }, (err, result) => {
        if (result.length) {
            res.status(200).json({
                'success': false,
                'msg': 'email exist',
                'playerId': result[0]['playerId'],
                'Gender': result[0]['Gender']
            });
        } else {
            //body.username = req.body.personId
            var player = new Player(body);
            console.log(player);
            player.save().then((player) => {
                res.status(200).json({
                    'success': true,
                    'msg': 'saved'
                });
            }, (e) => {
                console.log("error ", e);
                res.json({
                    'success': false,
                    'msg': "not saved",
                    'error': "e"
                });
            });
        }

    });

    /*if (body) {
        var player = new Player(body);
        console.log(player);
        player.save().then((player) => {
            res.status(200).json({
                'success': true,
                'msg': 'Saved'
            });
        }, (e) => {
            res.json({
                'success': false,
                'msg': e
            });
        });
    } else {
        res.json({
            'success': false,
            'msg': e
        });
    }*/

});

router.get('/isapplied/:taskId/:playerId', (req, res) => {
    var taskId = parseInt(req.params.taskId);
    var playerId = req.params.playerId;
    Player.findOne({ 'playerId': playerId }, (err, result) => {
        if (err) throw err;

        var taskArray = result.taskState;
        var obj;
        if (taskArray[0] != null) {
            obj = taskArray.find((obj) => {
                //console.log(" obj ", obj.taskId);
                if (obj.taskId == taskId) {
                    console.log("true");
                    res.json({
                        'success': true,
                        'state': obj.state
                    });
                } else {
                    console.log("false");
                    res.json({
                        'success': false,
                        'state': 0
                    });
                }

            });
            // console.log(" if obj ", obj);
        } else {
            console.log("else");
            console.log("false");
            res.json({
                'success': false,
                'state': 0
            });
        }
    });
});

router.get('/addTask/:playerId/:taskId', (req, res) => {
    var taskId = parseInt(req.params.taskId);
    var goalId = Math.floor(taskId / 10000);
    var playerId = req.params.playerId;
    Player.findOne({ 'playerId': playerId }, (err, result) => {
        if (err) throw err;
        var temp = {
            'taskId': taskId,
            'state': 1
        }
        console.log(result['taskState']);
        (result['taskState']).push(temp);
        var player = new Player(result);
        player.save((err, result) => {
            if (err) throw err;
            var coachId;
            Goal.findOne({ 'goalId': goalId }, (err, goalObj) => {
                if (err) throw err;
                coachId = goalObj['coachId'];
                Coach.findOne({ 'coachId': coachId }, (err, coachObj) => {
                    if (err) throw err;
                    var temp2 = {
                            'taskId': taskId,
                            'playerId': playerId,
                            'state': 1
                        }
                        (coachObj['reqTasks']).push(temp2);
                    var coach = new Coach(coachObj);
                    coach.save((err, ok) => {
                        if (err) throw err;
                        res.json({
                            'success': true
                        });

                    });

                });
            });


        });
    });
});

router.put('/update', (req, res) => {
    var oldPlayerId = req.body.playerId;
    var newusername = req.body.username;
    var newGender = req.body.Gender;
    var newDoBs = req.body.DoBs;
    var newCollege = req.body.College;
    Player.find({ username: newusername }, (err, result) => {
        if (err) throw err;
        if (result.length) {
            console.log(" find sucess", result);
            res.status(200).json({
                'success': false,
                'msg': 'username exist'
            });
        } else {
            var newplayerId = newusername + "complex";
            console.log(" find fail", newplayerId);
            Player.findOne({ "playerId": oldPlayerId }).then((model) => {
                return Object.assign(model, { Gender: newGender, username: newusername, DoBs: newDoBs, College: newCollege, playerId: newplayerId });
            }).then((model) => {
                console.log(" return model(save)");
                return model.save();
            }).then((newModel) => {
                res.json({
                    "success": true,
                    "msg": "updated",
                    "playerId": newplayerId
                });
            }).catch((err) => {
                res.json({
                    "success": false,
                    "msg": "not updated"
                });
            });
        }
    })
});
module.exports = router;