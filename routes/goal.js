var express = require('express');
var router = express.Router();
const _ = require('lodash');
var Promise = require('promise');

var Task = require('../models/taskModel');
var Player = require('../models/playerModel');
var Goal = require('../models/goalModel');
var Coach = require('../models/coachModel');

router.get('/allGoals/:coachId', (req, res) => {
    var coachId = req.params.coachId;
    console.log(coachId);
    Coach.findOne({ 'coachId': coachId }, (err, coachObj) => {
        if (err) throw err;
        console.log(coachObj);
        var goalArray = coachObj.goals;
        if (goalArray[0] != null) {
            var promises = [];
            goalArray.forEach(goalId => {
                console.log(goalId);
                promises.push(new Promise((resolve, reject) => {
                    Goal.findOne({ 'goalId': parseInt(goalId) }, (err, goalObj) => {
                        if (err) throw err;
                        var temp = {};
                        console.log("goal obj ", goalObj);
                        if (goalObj['progress'] == 100) {
                            temp['success'] = true;
                            temp['finished'] = true;
                            temp['goal'] = goalObj;
                            resolve(temp);
                        } else {
                            temp['success'] = true;
                            temp['finished'] = false;
                            temp['goal'] = goalObj;
                            resolve(temp);
                        }
                    });
                }));
            });
            Promise.all(promises).then((goalArray) => {
                res.status(200).send(goalArray);
            }, (err) => {
                throw err;
            });
        } else {
            res.json({
                'success': false
            });
        }
    });
});

router.post('/add', (req, res) => {
    var body = _.pick(req.body, ['goalId', 'goalName', 'goalDes', 'goalImage', 'coachId', 'timeLimit', 'tasks', 'progress']);
    body['dateCreated'] = new Date();
    var goalId = req.body.goalId;
    if (body) {
        var goal = new Goal(body);
        console.log(goal);
        goal.save().then((goal) => {
            Coach.findOne({ 'coachId': req.body.coachId }, (err, coachObj) => {
                if (err) throw err;
                (coachObj['goals']).push(parseInt(goalId));
                var coach = new Coach(coachObj);
                coach.save((err, result) => {
                    if (err) throw err;
                    res.status(200).json({
                        'success': true,
                        'msg': 'saved',
                        'goalId': req.body.goalId
                    });
                })
            })
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