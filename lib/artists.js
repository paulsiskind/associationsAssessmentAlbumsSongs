var express = require('express');
var router = express.Router();
var db = require('monk')('localhost/associationSummativeAss')
var artist = db.get('artist')
var albums = db.get('albums')
var songs = db.get('songs')
var Users = db.get('users');
var bcrypt = require('bcrypt')

module.exports = {

  findOne: function(id){
    return artist.findOne({_id: id})
  }

}