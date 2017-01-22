var express = require('express');
var bodyParser = require('body-parser');
var Verify = require('./verify');
var mongoose = require('mongoose');

var Orders = require('../models/orders');
var Stores = require('../models/stores');

var orderRouter = express.Router();

orderRouter.use(bodyParser.json());

orderRouter.route('/')
.get(Verify.verifyOrdinaryUser,function(req,res,next){
        var orderedByUserID = req.decoded._id;
        Orders.find({'orderedBy': orderedByUserID})
        .populate('fromStore')
        .exec(function (err, orders) {
            if (err) throw err;
            res.json(orders);
        });
        
        
})

.post(Verify.verifyOrdinaryUser,function(req, res, next){
    Orders.create(req.body, function (err, order) {
        if (err) next(err);
        console.log('Order added!');
        var id = order._id;
        order.orderedBy = req.decoded._id;
        order.save(function (err, order) {
            if (err) throw err;
            console.log('Added userId to the order');
            res.json(order);
        }); 
    })
})



orderRouter.route('/:orderId')

.get(Verify.verifyOrdinaryUser,function(req,res,next){
        Orders.findById(req.params.orderId)
        .populate('postedBy')
        .populate('fromStore')
        .exec(function (err, order) {
        if (err) next(err);
        res.json(order);
        });
})

.put(Verify.verifyOrdinaryUser,function(req, res, next){
    Orders.findByIdAndUpdate(req.params.orderId, {
    $set: req.body
    }, {
        new: true
    }, function (err, order) {
        if (err) next(err);
        res.json(order);
    });
})

.delete(Verify.verifyOrdinaryUser,function(req, res, next){
    Orders.findByIdAndRemove(req.params.orderId, function (err, resp) {
        if (err) throw err;
        res.json(resp);
    });
});


module.exports = orderRouter;