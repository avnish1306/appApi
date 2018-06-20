var mongoose = require('mongoose');
var express = require('express');
var router = express.Router();
const _ = require('lodash');
var Coach = require('../models/coachModel');

router.post('/save', (req, res, next) => {
    var body = _.pick(req.body, ['Email', 'coachId', 'Profession', 'Name', 'DoBs', 'username', 'profile_pic', 'Gender', 'goals', 'reqTasks'])
    console.log(" body ", body);

    Coach.find({ Email: body.Email }, (err, result) => {
        if (result.length) {
            res.status(200).json({
                'success': false,
                'msg': 'email exist',
                'coachId': result[0]['coachId'],
                'Gender': result[0]['Gender']
            });
        } else {
            //body.username = req.body.personId
            var coach = new Coach(body);
            console.log(coach);
            coach.save().then((coach) => {
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
});


router.put('/update', (req, res) => {
    var oldcoachId = req.body.coachId;
    var newusername = req.body.username;
    var newGender = req.body.Gender;
    var newDoBs = req.body.DoBs;
    var newProfession = req.body.Profession;
    Coach.find({ username: newusername }, (err, result) => {
        if (err) throw err;
        if (result.length) {
            console.log(" find sucess", result);
            res.status(200).json({
                'success': false,
                'msg': 'username exist'
            });
        } else {
            var newcoachId = newusername + "complex";
            console.log(" find fail", newcoachId);
            Coach.findOne({ "coachId": oldcoachId }).then((model) => {
                return Object.assign(model, { Gender: newGender, username: newusername, DoBs: newDoBs, Profession: newProfession, coachId: newcoachId });
            }).then((model) => {
                console.log(" return model(save)");
                return model.save();
            }).then((newModel) => {
                res.json({
                    "success": true,
                    "msg": "updated",
                    "coachId": newcoachId
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