var express = require('express');
var router = express.Router();
var db = require('monk')('localhost/associationSummativeAss')
var artist = db.get('artist')
var albums = db.get('albums')
var songs = db.get('songs')
var Users = db.get('users');
var bcrypt = require('bcrypt')

module.exports = {
    getAlbums: function(artistId){
      return(albums.find({artistId: String(artistId)}))
    },

    findId: function(id){
      return albums.find({artistId: id},{sort:{_id:-1}})
    },
    findOne: function(id){
    return albums.findOne({_id: id})
    },
    joinAlbumsSongs: function(){
      albums.forEach(function(albums){
        songs.forEach(function(songs){
          if(albums._id.toString() === songs.albumId.toString()){
            console.log(albums, songs, "here")
            albums.songs = songs
          }
        })
      })
    return albums
    }

}
// {sort:{_id:-1}}