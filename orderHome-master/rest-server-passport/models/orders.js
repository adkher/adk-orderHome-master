// grab the things we need
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// create a schema
var ordersSchema = new Schema({
    orderedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    fromStore: {
        type: mongoose.Schema.Types.ObjectId,
         ref: 'Store'
        
    },
    orderStatus: {
        type : String,
        default : 'accepted'
    },
    orderString:{
        type: String,
        required : true
    },
    description:{
        type: String,
        default : ''
    }
    },
                                  
                              
     {
    timestamps: true
});

// the schema is useless so far
// we need to create a model using it
var Orders = mongoose.model('Order', ordersSchema);

// make this available to our Node applications
module.exports = Orders;