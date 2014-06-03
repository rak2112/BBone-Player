(function(App) {
App.Albums = {};

App.Albums.Model = Backbone.Model.extend({});

App.Albums.collection = Backbone.Collection.extend({

url: 'data/dataAudio.json',
model:App.Albums.Model,
parse: function(data){
	return data;
}


});

App.Albums.views = Backbone.View.extend({
tagName:'ul',
id: 'albums',
collection: new App.Albums.collection(),
initialize: function(){
	this.collection.fetch();
	this.collection.once('all', this.render, this);

},

render: function(){
	console.log(this.collection.toJSON());
}



});



 
}(App));