var express = require('express');
var router = express.Router();
var db = require('monk')('localhost/associationSummativeAss')
var artist = db.get('artist')
var albums = db.get('albums')
var songs = db.get('songs')
var Users = db.get('users');
var bcrypt = require('bcrypt')
var Album = require('../lib/albums.js');
var Artist = require('../lib/artists.js');
var Song = require('../lib/songs.js');

/* GET home page. */


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

  // router.get('/home', function(req, res, next){
  //   var username = req.session.username;
  //   console.log(username)
  //   res.render('index', {username: username});
  // });

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

 //-------------------------------------------Need to move to users---------------------------------- 
router.get('/home', function(req, res, next) {
  var username = req.session.username;
  artist.find({}).then(function(data){    
    res.render('index', { artists:data, username:username});
  })
});

router.get('/songs', function(req, res, next){
  var username = req.session.username;
  songs.find({}).then(function(data){
    res.render('songIndex', {songs:data, username: username})
  })
})

// router.get('/home', function(req, res, next){
//   var username = req.session.user
//   artist.find({}).then(function(artist){
//     var id = String(artist._id)
//     console.log(artist)
//   albums.find({artistId: id}).then(function(albums){
//       console.log(albums)
//     res.render('index', {artists: artists, username: username, albums:albums})
//   })
//   })
// })

router.get('/new', function(req, res, next){
  res.render('new');
});

router.post('/', function(req, res, next){
  var errors = [];
  if(req.body.artist == 0){
    errors.push('Please Insert Artist!')
  }
  if(errors.length){
    res.render('new', {errors:errors})
  }
  else{
  artist.insert({artist: req.body.artist})
  res.redirect('/home');
  }
})

router.get('/:id/addSongs', function(req, res, next){
  var username = req.session.user
  Album.findOne(req.params.id).then(function(album){
    console.log(album)
    var id = String(album._id)
    Song.findId(id).then(function(songs){
      console.log(songs)
      res.render('addSongs', {username:username, theAlbum: album, song: songs})
    })
  })
})

router.get('/:id/show', function(req,res, next){
  console.log("text")
  var username = req.session.user;
  Artist.findOne(req.params.id).then(function(artist){
    console.log(artist._id, "Minnie")
    var id = String(artist._id)
      Album.findId(id).then(function(albums){
        console.log(albums, "Mickey Mouse")

          Album.joinAlbumsSongs(albums, function(albums){
            console.log(albums,  "boooh1")
      res.render('show', {username: username, artist: artist, albums:albums})
    })
    })
  })
})


// router.get('/:id/show', function(req,res, next){
//   console.log(joinAlbumsSongs)
//   var username = req.session.user;
//   Artist.findOne(req.params.id).then(function(artist){
//     console.log(artist._id, "Minnie")
//     var id = String(artist._id)
//     Album.findId(id).then(function(albums){
//       console.log(albums._id, "Mickey Mouse")
//        var id = String(albums._id)
//           Song.findId(id).then(function(songs){
//             console.log(songs)

//       res.render('show', {username: username, artist: artist, albums:albums, song: songs})
//     })
//     })
//   })
// })


router.get('/:id/addAlbum', function(req, res, next){
  var username = req.session.user
  Artist.findOne(req.params.id).then(function(data){
    res.render('addAlbum', {theArtist: data, username: username})
  })
})

router.post('/:id/addAlbum', function(req, res, next){
  var errors = [];
  if(req.body.album.length == 0){
    errors.push('Please Add Album')
  }
  if(errors.length){
    artist.findOne({_id: req.params.id}, function(err, data){
    res.render('addAlbum', {theArtist:data, errors:errors});
  })
  }
  else{
    albums.insert({album: req.body.album,
                artistId: req.params.id}).then(function(){
    res.redirect('/home')
    
    })
  }
})



router.post('/:id/addSongs', function(req, res, next){
  var errors = [];
  if(req.body.song.length == 0){
    errors.push('Please Add Song')
  }
  if(errors.length){
    albums.findOne({_id: req.params.id},function(err, data){
    res.render('addSongs', {theAlbum:data, errors:errors});
  });
  }
  else{
    songs.insert({albumId: req.params.id,
                     song: req.body.song}).then(function(){
    res.redirect('/home')
    
    })
  }
})
module.exports = router;
