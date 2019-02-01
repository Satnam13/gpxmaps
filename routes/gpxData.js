const express = require('express');
const formidable = require('formidable');
const route = express.Router();
const passport = require('passport')
const gpx = require('../database/gpxDatabase');

route.post('/upload', passport.authenticate('jwt', { session: false }), (req, res, next) => {
    console.log('upload');
    console.log(req.user.username);
    var form = new formidable.IncomingForm();
    // form.uploadDir = './'
    // form.keepExtensions = true;
    // form.encoding = 'utf-8';
    form.parse(req, (err, fields, Files) => {
        // console.log(form.type);
        // console.log('request: ' + req);
        // console.log('fields: ' + fields);
        // console.log('files: ' + Files);
        res.json({ success: true });
    }
    )
    var file = "";
    form.onPart = function (part) {
        part.addListener('data', function (e) {
            console.log('part received');
            file = file.concat(e.toString());
        });
        part.addListener('end', () => {
            console.log('end');
            gpx.setGpxData(req.user.username, file);
        })
    }
})
route.get('/getGPX/total', passport.authenticate('jwt', { session: false }), (req, res) => {

    //res.setHeader('Content-Disposition', 'attachment; filename=x.gpx');
    gpx.find({ username: req.user.username.toUpperCase() }, (err, result) => {
        if (err) console.log(err);
        if (result) {
            res.json({ total: result.length });

        }
    }
    )
})
route.get('/getGPX/:number', passport.authenticate('jwt', { session: false }), (req, res) => {

    //res.setHeader('Content-Disposition', 'attachment; filename=x.gpx');
    gpx.find({ username: req.user.username }, (err, result) => {
        if (err) console.log(err);
        if (result) {
            if (result.length === 0) {
                res.end();
                console.log('ended')
            }
            else {
                //res.json({total: result.length});
                //res.contentType('application/gpx+xml');
                console.log('sending' + req.params.number);
                var jsonRes = {};
                result.forEach((value, index) => {
                    console.log('\n');
                    jsonRes = Object.assign({ [index]: value.data }, jsonRes);
                })
                res.send(jsonRes)
                res.end();


                // res.writeContinue
                // res.write(Buffer.from(result[1].data, 'utf8'));
                // res.write(Buffer.from(result[2].data, 'utf8'));
                // res.end(Buffer.from(result[3].data, 'utf8'));
                //res.end();}
            }
        }
    })
})
module.exports = route;
