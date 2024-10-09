const express = require("express");
const passport = require("passport");
const xsenv = require("@sap/xsenv");

const httpClient= require('@sap-cloud-sdk/http-client');
const { retrieveJwt } = require('@sap-cloud-sdk/connectivity');

const JWTStrategy = require("@sap/xssec").JWTStrategy;
const services = xsenv.getServices({ uaa:"cfdemo1268-xsuaa"}, { dest: { label: 'destination'} }); //XSUAA service y Destination

const app = express();

passport.use(new JWTStrategy(services.uaa));
app.use(express.json());
app.use(passport.initialize());
app.use(passport.authenticate("JWT", { session: false }));

/*app.get("/", function (req, res, next){
    res.send("Welcome to Basic NodeJS");
});*/

// /srv/destinations?destinationX=MDFData

app.get("/", function (req, res, next){
    res.send("Welcome to Basic NodeJS: "+ req.user.id);
});


app.get("/user", function (req, res, next){
    res.send("I am : "+ req.user.id);
});

app.get('/destinations', async function (req, res) {
    try{
        let res1 = await httpClient.executeHttpRequest(
            {
                destinationName: req.query.destinationX || '',
                jwt: retrieveJwt(req)
            },
            {
                method: 'GET',
                url: req.query.path || '/'
            },
        );
        res.status(200).json(res1.data);
    } catch(err) {
        //console.log(err.stack);
        res.status(599).send(err.message);

    }
});
app.post('/postDestination', async function (req, res) {
    try{
        let res1 = await httpClient.executeHttpRequest(
            {
                destinationName: req.query.destinationX || '',
                jwt: retrieveJwt(req)
            },
            {
                method: 'POST',
                url: req.query.path || '/',
                data: req.body
            },
        );
        res.status(201).json(res1.data);
    } catch(err) {
        //console.log(err.stack);
        res.status(599).send(err.message);

    }
});

app.post('/editDestination', async function (req, res) {
    try{
        let res1 = await httpClient.executeHttpRequest(
            {
                destinationName: req.query.destinationX || '',
                jwt: retrieveJwt(req)
            },
            {
                method: 'POST',
                url: req.query.path || '/',
                data: req.body
            },
        );
        res.status(200).json(res1.data);
    } catch(err) {
        //console.log(err.stack);
        res.status(599).send(err.message);

    }
});

app.delete('/deleteDes', async function (req, res) {
    try{
        let res1 = await httpClient.executeHttpRequest(
            {
                destinationName: req.query.destinationX || '',
                jwt: retrieveJwt(req)
            },
            {
                method: 'DELETE',
                url: req.query.path || '/'
            },
        );
        res.status(200).json(res1.data);
    } catch(err) {
        //console.log(err.stack);
        res.status(599).send(err.message);

    }
})


const port = process.env.PORT || 5000;
app.listen(port, function() {
    console.log("Basic NodeJS listening on port " + port);
});