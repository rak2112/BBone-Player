(function(App) {
  App.Products = {};

  App.Products.model = Backbone.Model.extend({
    idAttribute: "productid"
  });

  App.collections.products = Backbone.Collection.extend({
    url: 'data/products.json',
    model: App.Products.model,
    parse: function(data) {
      return data.Products;

    }
  });

  App.Products.view = Backbone.View.extend({

    el: '.prods',
    collection: new App.collections.products(),
    template: Handlebars.compile($("#subCat-template").html()),
    events: {
      'click ul#subCat li.cat': 'itemClicked'
    },
    initialize: function() {
      this.collection.fetch();

      //subscibe to click
      this.listenTo(App.Events, 'category:changed', this.getHTML, this);
      this.listenTo(App.Events, 'home:clicked', this.goHome, this);
      // this.collection.once('all', this.render, this);
    },

    filterCollection: function(i) {

      //filer returns array.
      //stringify array
      return JSON.parse(JSON.stringify(this.collection.filter(function(product) {
        return (_.contains(product.get('inCategories'), i));
      })));
    },
    getHTML: function(i) {
      var catgsHTML = '';
      catgsHTML += this.template({
        products: this.filterCollection(i)
      });


      var products = $('.prod-list');
      // console.log('products', products);
      if (products) {
        this.$el.find('.prod-list').remove();

      }

      //this.render(catgsHTML);
      // App.baseView.render.call(this, catgsHTML);
      this.$el.append(catgsHTML);
    },
    goHome: function() {
      this.$el.find('.prod-list').html('');
    },

    itemClicked: function(e) {

      e.preventDefault();
      var $countTarget = $(e.currentTarget);
      var itemId = $countTarget.attr('id');
      console.log('item clicked');
      App.Events.trigger('item:addToCart', this.collection.get({
        productid: itemId
      }));
    }


  });


}(App));