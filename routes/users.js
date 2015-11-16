var express = require('express');
var router = express.Router();
var db = require('monk')('localhost/associationsSummativeAss');
var Users = db.get('users');
var bcrypt = require('bcrypt')


  router.get('/', function(req, res, next){
    res.redirect('/register');
  });

  router.get('/signin', function(req, res, next){
    res.render('signin')
  });

  router.get('/register', function(req, res, next){
    res.render('register');
  });

  router.get('/signout', function(req, res, next){
    req.session = null;
    res.redirect('/signin');
  });

  /*router.get('/home', function(req, res, next){
    var username = req.session.username;
    console.log(username)
    res.render('index', {username: username});
  });*/

  router.post('/register', function(req, res, next){
    var hash = bcrypt.hashSync(req.body.password, 12);
    var errors = [];
    if(req.body.email == 0){
      errors.push('Email cannot be blank!')
    }
    if(req.body.password.length == 0){
      errors.push('Password Cannot be blank!');
    }
    if(req.body.password.length < 8){
      errors.push('Password Must be atleast 8 characters!')
    }
    re = /[0-9]/;
    if(!re.test(req.body.password)){
      errors.push('Password Must Contain at least One Number!')
    }
    // de = /[@#$%^&+=]/;
    // if(!de.text(req.body.password)){
    //   errors.push('Password Must Contain at least one Special Character!')
    // }
    if(req.body.password !== req.body.confirmation){
      errors.push('Password does not match confirmation')
    }
    if(errors.length){
      res.render('register', {errors:errors})
    }
    else{
      Users.find({email: req.body.email.toLowerCase()}, function(err, data){
        if(data.length > 0){
          errors.push('Email Already in Exists!');
          res.render('register', {errors:errors});
        }
        else{
          Users.insert({email: req.body.email.toLowerCase(), passwordDigest:hash}, function(err, data){
            req.session.username = req.body.email;
            res.redirect('/home')
          });
        }
      });
    }
  });

  router.post('/signin', function(req, res, next){
    var errors = [];
    if(req.body.email.length == 0){
      errors.push('Email Cannot be Blank!')
    }
    if(req.body.password.length == 0){
      errors.push('Password Cannot be Blank!')
    }
    if(errors.length){
      res.render('signin', {errors: errors})
    }
    else{
      Users.findOne({email: req.body.email}, function(err, data){
        if(data){
          if(bcrypt.compareSync(req.body.password, data.passwordDigest)){
            req.session.username = req.body.email;
            res.redirect('/home')
          }
          else{
            errors.push("Invalid Email/Password");
            res.render('signin', {errors: errors})
          }
        }else{
          errors.push('Email Does not Exist');
          res.render('signin', {errors: errors})
        }
      });
    }

  });

module.exports = router;