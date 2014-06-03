define(['backbone'], function(Backbone){
	var albumModel = Backbone.Model.extend({
		idAttribute: "pid"
	});
	return albumModel;
});