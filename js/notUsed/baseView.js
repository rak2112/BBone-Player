
App.BaseView = Backbone.View.extend({

        render: function(data) {
        this.$el.html(data);

        if(this.onRender){
        	console.log('here', this);
        	this.onRender();
        }

        return this;
    },
    testMethod: function(){
    	return this;
    }

});

App.baseView = new App.BaseView();
