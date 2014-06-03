define(['jquery', 
        'underscore', 
        'backbone', 
        'handlebars', 
        'collections/albumsCollection',
        'events/AppEvents'],
         function($, _ , Backbone, Handlebars, albumsCollection, AppEvents){
  
    var albumView = Backbone.View.extend({
    	tagName: 'div',
        id: 'albumRecords',
        template: Handlebars.compile($('#albumRecords-template').html()),
        events: {
            'click #songsList li' : 'songClicked',
            'click #gotoHome': 'goToAlbums',
            'click #playAll': 'playAll'
        },
        initialize: function(){
    		this.collection = new albumsCollection();
    		this.listenTo(AppEvents, 'album:Selected', this.render, this);
    	},
    	render: function(albumClicked){
    		
    		
            var album = albumClicked.toJSON();
            var albumRecords = album.subalbum;
            this.collection = albumRecords;
            var data='',html;
            data = this.template({
               records: albumRecords
            });
            html = this.$el.html(data);
            $('#albumView').css({display:'none'});
            $('#albumRecordsView').css({display:'block'});
            $('#playerAudio').css({display:'block'});
            $('#albumRecordsView').append(html);
            return this;


    	},
        songClicked: function(evt){

            var songId,songSelected;
            songId = $(evt.currentTarget).attr('data-spid'); 
            songSelected = _.find(this.collection, function(items){
                return items.pid == songId;               
           });
           //console.log('collection', songSelected);
           AppEvents.trigger('audio:addToPlayList', songSelected);

        },
        goToAlbums: function(evt){
            $('#albumRecordsView').css({display:'none'});
            $('#albumView').css({display:'block'});
            this.$el.html('');
        },
        playAll: function(evt){
            evt.preventDefault();
            AppEvents.trigger('audio:playAll', this.collection);
            
        }
  
    });     


  
   return albumView;
  });