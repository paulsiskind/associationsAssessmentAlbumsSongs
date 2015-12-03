var express = require('express');
var router = express.Router();
var db = require('monk')(process.env.MONGOLAB_URI ||'localhost/associationSummativeAss')
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
    joinAlbumsSongs: function(albums, done){
      songs.find({}).then(function(songs){
  
      albums.forEach(function(albums){
      var addSongs=[]
          console.log(albums, "checking")
        songs.forEach(function(songs){
          if(albums._id.toString() === songs.albumId.toString()){
          
           addSongs.push(songs)
           // console.log(albums)

          }
           albums.songs = addSongs;
            

        })
        })
    return done(albums)
      })
    }



}
// {sort:{_id:-1}}