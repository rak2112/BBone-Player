define(['backbone',
        'events/AppEvents',
        'models/songModel'], function(Backbone, AppEvents, songModel){
  var songsCollection = Backbone.Collection.extend({
  	model: songModel,
  	initialize: function(){
  		this.listenTo(AppEvents, 'audio:addToPlayList', this.addSong, this);
      this.listenTo(AppEvents, 'playList:removeSong', this.removeSong, this);
      this.listenTo(AppEvents, 'audio:playAll', this.addAll, this);

  	},
    addAll: function(col){
      this.add(col);
    },
  	addSong: function(song){
      var list = this.toJSON();
    if(list.length<1){
    //if playlist is empty add the selected song at index 0....
    this.add(song);
    this.setElement(this.at(0));
    AppEvents.trigger('added:SelectSrc', song);
  }else{
    this.add(song);
  }   
  	},
    removeItem: function(song){  
        var item = this.get({id: song});
        this.remove(item);
    },
    getElement: function() {
    return this.currentElement;
  },
  setElement: function(model) {
    if(!model){
     this.currentElement = null;
    }else{
      this.currentElement = model;
    }
    
  },
  next: function (){
    this.setElement(this.at(this.indexOf(this.getElement()) + 1));
    return this;
  },
  prev: function() {
    this.setElement(this.at(this.indexOf(this.getElement()) - 1));
    return this;
  }
  });
  return songsCollection;
});