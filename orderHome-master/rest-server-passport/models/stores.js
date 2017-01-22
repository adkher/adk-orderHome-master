var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var mae = require('mongoose-address-easy');

var Store = new Schema({
    
    storename: {
      type: String,
        default: ''
    },
    storetype: {
        type :String,
        default:'Grocery'
    }
});

Store.plugin(mae);

module.exports = mongoose.model('Store', Store);