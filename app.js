const Joi = require('@hapi/joi');
const startupDebugger = require('debug')('app:startup');
const dbDebugger = require('debug')('app:db');
const morgan = require('morgan');
const logger = require('./logger');
const express = require('express');
const helmet = require('helmet');
// const { valid } = require('joi');
const app = express();

// console.log(`NODE_ENV: ${process.env.NODE_ENV}`);
// console.log(`app: ${app.get('env')}`); // returns development by default

app.use(express.json()); // middleware
app.use(express.urlencoded({extended : true}));
app.use(express.static('public'));
app.use(helmet());

if(app.get('env') === 'development'){
    app.use(morgan('tiny'));
    startupDebugger('Morgan Enabled...');
}

// Database work...
// dbDebugger('Connected to the database...');

app.use(morgan('tiny'));

app.use(logger);

app.use(function(req, res, next){
    console.log('Authenticating...');
    next();
});

const cars = [
    {id: 1, name: 'Mercedes'},
    {id: 2, name: 'BMW'},
    {id: 3, name: 'Audi'},
    {id: 4, name: 'Volkswagen'}
];

// ROUTES
app.get('/', (req, res) => {
    res.send('We are on the homepage.');
})

app.get('/cars', (req, res) => {
    res.send(cars);
});

app.get('/cars/:id', (req, res) => {
    const car = cars.find(c => c.id === parseInt(req.params.id));
    if(!car){
        return res.status(404).send('The car with the ID was not found.');
    }
    res.send(car);
});

app.post('/cars', (req,res) => {
    const { error } = validateCourse(req.body);
    if(error) return res.status(400).send(error.details[0].message);

    const car = {
        id: cars.length + 1,
        name: req.body.name
    };
    cars.push(car);
    res.send(car);
});

app.put('/cars/:id', (req, res) => {
    // check if the car with the ID exists
    const car = cars.find(c => c.id === parseInt(req.params.id));
    if(!car){
        return res.status(404).send('The car with the ID was not found.');
    }
    const result = validateCourse(req.body);
    const { error } = validateCourse(req.body); // same as result.error

    if(error){
        return res.status(400).send(result.error.details[0].message);
    }

    car.name = req.body.name;
    res.send(car);
});

function validateCourse(car){
    const schema = {
        name: Joi.string().min(3).required()
    };  

    return Joi.validate(car, schema);
}

app.delete('/cars/:id', (req, res) => {
    // Find hte course, if it does not exist, return 404
    const car = cars.find(c => c.id === parseInt(req.params.id));
    if(!car){
        res.status(404).send('The car with the ID was not found.');
    }

    // Delete
    const index = cars.indexOf(car);
    cars.splice(index, 1);

    // Return the deleted item
    res.send(car);
});

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Listening on port ${port}!`));