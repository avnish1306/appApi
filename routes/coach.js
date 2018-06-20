var mongoose = require('mongoose');
var express = require('express');
var router = express.Router();
const _ = require('lodash');
var Coach = require('../models/coachModel');

router.post('/save', (req, res, next) => {
    var body = _.pick(req.body, ['Email', 'coachId', 'Profession', 'Name', 'DoBs', 'username', 'profile_pic', 'Gender', 'goals'])
    if (body) {
        var coach = new Coach(body);
        coach.save().then((coach) => {
            res.status(200).json({
                'success': true,
                'msg': 'saved'
            });
        }, (e) => {
            res.json({
                'success': true,
                'msg': e
            });
        });
    } else {
        res.json({
            'success': true,
            'msg': e
        });
    }
});

module.exports = router;