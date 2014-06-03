define(['jquery', 
        'underscore', 
        'backbone', 
        'handlebars', 
        'collections/albumsCollection', 
        'events/AppEvents',
        ],
         function($, _ , Backbone, Handlebars, albumsCollection, AppEvents){
  
	var appView = Backbone.View.extend({
		tagName: 'div',
    id: 'albums',
    template: Handlebars.compile($('#albumsList-template').html()),
    events:{
    'click #albumList li' : 'albumClicked'
    },
		collection: new albumsCollection(),
  		initialize: function(){
  			this.collection.fetch();
  			this.collection.once('all', this.render, this);
  		},
  		render: function(){
      var data='', html;
      data  = this.template({
          albums: this.collection.toJSON() 
        });
      html = this.$el.html(data); 
      $('#albumView').append(html);
       
       return this;
  		},

      albumClicked: function(evt){
      evt.preventDefault();       
      var selectedAlbum = $(evt.currentTarget).attr('data-pid');
        AppEvents.trigger('album:Selected', this.collection.get({
          id : selectedAlbum
        }));

      } 

  	});

  return appView;
});