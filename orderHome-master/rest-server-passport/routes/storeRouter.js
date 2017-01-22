var express = require('express');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var Verify = require('./verify');
var Stores = require('../models/stores');

var storeRouter = express.Router();

storeRouter.use(bodyParser.json());

storeRouter.route('/')

.get(function (req, res, next) {
    Stores.find(req.query)
        .exec(function (err, store) {
        if (err) next(err);
        res.json(store);
    });
})



.post(Verify.verifyAdmin,function(req, res, next){
    Stores.create(req.body, function (err, store) {
        if (err) next(err);
        console.log('Store added!');
        var id = store._id;

        res.writeHead(200, {
            'Content-Type': 'text/plain'
        });
        res.end('Added the store with id: ' + id);
    });
})



storeRouter.route('/:storeId')

.get(Verify.verifyOrdinaryUser,function(req,res,next) {
      Stores.findById(req.params.storeId, function (err, store) {
        if (err) next(err);
        res.json(store);
      });
      
})

.delete(Verify.verifyAdmin,function(req, res, next){
        Dishes.findByIdAndRemove(req.params.storeId, function (err, resp) {if (err) throw err;
        res.json(resp);
        });
});


module.exports = storeRouter;