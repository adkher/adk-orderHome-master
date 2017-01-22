var express = require('express');
var router = express.Router();
var passport = require('passport');
var User = require('../models/user');
var Verify    = require('./verify');

/* GET users listing. */

router.get('/', Verify.verifyAdmin,function(req,res,next){
    User.find({}, function (err, dish) {
        if (err) throw err;
        res.json(dish);
    });
});

router.post('/register', function(req, res) {
    User.register(new User({ username : req.body.username }),
        req.body.password, function(err, user) {
        if (err) {
            return res.status(500).json({err: err});
        }
        if(req.body.firstname) {
            user.firstname = req.body.firstname;
        }
        if(req.body.lastname) {
            user.lastname = req.body.lastname;
        }
        if(req.body.email) {
            user.email = req.body.email;
        }
        if(req.body.aaddress_line1) {
            user.aaddress_line1 = req.body.aaddress_line1;
        }
        if(req.body.aaddress_line2) {
            user.aaddress_line1 = req.body.aaddress_line2;
        }
        if(req.body.address_city) {
            user.address_city = req.body.address_city;
        }
        if(req.body.address_state) {
            user.address_state = req.body.address_state;
        }
        if(req.body.address_zip) {
            user.address_zip = req.body.address_zip;
        }
        if(req.body.address_country) {
            user.address_country = req.body.address_country;
        }
        if(req.body.userType) {
            user.userType = req.body.userType;
        }
        
        
        user.save(function(err,user) {
            passport.authenticate('local')(req, res, function () {
                return res.status(200).json({status: 'Registration Successful!'});
        });
        });
    });
});

router.post('/login', function(req, res, next) {
  passport.authenticate('local', function(err, user, info) {
    if (err) {
      return next(err);
    }
    if (!user) {
      return res.status(401).json({
        err: info
      });
    }
    req.logIn(user, function(err) {
      if (err) {
        return res.status(500).json({
          err: 'Could not log in user'
        });
      }
        
      var token = Verify.getToken({"username":user.username, "_id":user._id, "admin":user.admin});
              res.status(200).json({
        status: 'Login successful!',
        success: true,
        token: token
      });
    });
  })(req,res,next);
});

router.get('/logout', function(req, res) {
    req.logout();
  res.status(200).json({
    status: 'Bye!'
  });
});

router.get('/facebook', passport.authenticate('facebook'),
  function(req, res){});

router.get('/facebook/callback', function(req,res,next){
  passport.authenticate('facebook', function(err, user, info) {
    if (err) {
      return next(err);
    }
    if (!user) {
      return res.status(401).json({
        err: info
      });
    }
    req.logIn(user, function(err) {
      if (err) {
        return res.status(500).json({
          err: 'Could not log in user'
        });
      }
              var token = Verify.getToken({"username":user.username, "_id":user._id, "admin":user.admin});
              res.status(200).json({
        status: 'Login successful!',
        success: true,
        token: token
      });
    });
  })(req,res,next);
});


module.exports = router;