define(['backbone'], function(Backbone){
	var songModel = Backbone.Model.extend({
		idAttribute: "pid"
	});
	return songModel;
});