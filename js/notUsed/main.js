require.config({
	paths:{
		"jquery": "vendor/jquery/jquery",
		"underscore": "vendor/underscore-amd/underscore",
		"backbone": "vendor/backbone-amd/backbone"
	}

});

require(['views/appView'], function(AppView){
	new AppView;
});



// var App = {
// 	collections: {},
// 	Router:{}
// };

// (function(exports, $, Backbone) {
// 	App.init = function() {

// 		App.Events = _.extend({}, Backbone.Events);
// 		//App.categoriesView = new App.Categories.view();
// 		//App.baseView= new App.BaseView();
// 		 // App.productsView = new App.Products.view();
// 		 // App.cartView = new App.Cart.view();
// 		// App.cartCollection= new App.Cart.collection();
// 		// App.checkout = new App.checkOutView();
//         App.albumsView = new App.Albums.views();

// 		// App.router = new App.Router();
//   //       Backbone.history.start();
// 		// App.router.navigate('home', true);
// 	};

// }(window, jQuery, Backbone));

