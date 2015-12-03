var express = require('express');
var router = express.Router();
var db = require('monk')(process.env.MONGOLAB_URI ||'localhost/associationSummativeAss')
var artist = db.get('artist')
var albums = db.get('albums')
var songs = db.get('songs')
var Users = db.get('users');
var bcrypt = require('bcrypt')

module.exports = {

  findId: function(idTwo){
       console.log('These are the Droids you are looking for')
      return songs.find({albumId: idTwo}, {sort:{_id:-1}})

    },
    find: function(){
    return songs.find({})
  },

  findIn: function(idTwo){
      console.log('$ins the house')
      return songs.find({_id: {$in: idTwo._id}})
  }
}
//  You are probably going to need two of these for the many to many relationship
// db.events.find({_id: {$in: user.events}})

// hash the album info as a unigue identifier