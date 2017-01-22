var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var passportLocalMongoose = require('passport-local-mongoose');
var mae = require('mongoose-address-easy');

var User = new Schema({
    username: String,
    password: String,
    OauthId: String,
    OauthToken: String,
    firstname: {
      type: String,
        default: ''
    },
    lastname: {
      type: String,
        default: ''
    },
    email: {
      type: String,
        default: ''
    },
    admin:   {
        type: Boolean,
        default: false
    },
    userType:   {
        type: String,
        default: "buyer"
    }
    
});

User.methods.getName = function() {
    return (this.firstname + ' ' + this.lastname);
};

User.plugin(passportLocalMongoose);
User.plugin(mae);

module.exports = mongoose.model('User', User);