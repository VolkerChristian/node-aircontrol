/*jshint esversion: 6 */

const express = require('express');
const bodyParser = require('body-parser');
const {
    exec
} = require('child_process');

const app = express();
app.use(bodyParser.json());


var jalousien = {
    kueche: 'kueche',
    strasse: 'strasse',
    esstisch: 'esstisch',
    balkon: 'balkon',
    schlafzimmer: 'schlafzimmer',
    arbeitszimmer: 'arbeitszimmer',
    comfort: 'komfort',
    all: 'alle'
};

var actions = {
    open: 'up',
    close: 'down',
    stop: 'stop'
};

app.get('/jalousien/', function(req, res) {
    console.error('ERROR: no Jalousie specified');
    res.status(404).send('ERROR: no Jalousie specified');
});

app.get('/jalousien/:id', function(req, res) {
    if (!req.params.id) {
        console.error('ERROR: no Jalousie specified');
        res.status(404).send('ERROR: no Jalousie specified');
    } else if(!jalousien[req.params.id]) {
        console.error('ERROR: could not find Jalousie for ' + req.params.id);
        res.status(404).send('ERROR: could not find Jalousie for ' + req.params.id);
    } else if (!req.query.action) {
        console.error('ERROR: no action specified');
        res.status(404).send('ERROR: no action specified');
    } else if (!actions[req.query.action]) {
        console.error('ERROR: could not find action for ' + req.query.action);
        res.status(404).send('ERROR: could not find action for ' + req.query.action);
    } else {
        var jalousie = jalousien[req.params.id];
        var action = actions[req.query.action];
        var command = jalousie + '_' + action;
        res.status(200).send('OK: ' + jalousie + ' -> ' + action);
        exec('aircontrol -t ' + command, (err, stdout, stderr) => {
            if (err) {
                //some err occurred
                console.error('ERROR: ' + jalousie + ' -> ' + action);
            } else {
                // the *entire* stdout and stderr (buffered)
                console.log('OK: ' + jalousie + ' -> ' + action);
            }
        });
    }
});


app.listen(8888, function () {
    console.log('Development endpoint listening on port 8888!');
});
