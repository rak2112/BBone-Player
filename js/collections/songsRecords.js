define(['backbone', 'jquery', 'models/albumsModel'], function(Backbone, $, albumModel){
  var albumsCollection = Backbone.Collection.extend({
  	url: 'data/dataAudio.json',
  	model: albumModel,
  	parse: function(data){
    	return data.records;
  	}
  });
  return albumsCollection;
});