(function(App) {

  App.Cart = {};
  //App.Pos.Router = {};

  //App.Cart.Model = Backbone.Model.extend({});


  App.Cart.Model = Backbone.Model.extend({
    idAttribute: "productid",
    defaults: {
      unitPriceTotal: 1,
      unit: 1
    }
  });

  App.Cart.collection = Backbone.Collection.extend({
    cartProperties: {
      totalPrice: 0

    },
    model: App.Cart.Model,
    initialize: function() {

      //$('.prods').find('.prod-list').unbind();

      this.listenTo(App.Events, 'item:addToCart', this.addingItem, this);
      this.listenTo(App.Events, 'item:removeFromCart', this.removeItem, this);
      this.listenTo(App.Events, 'item:keyPadValue', this.keyVal, this);
      //this.on('all', this.logEvent, this);
    },

    keyVal: function(key) {

      collection = this.toJSON();
      item = collection.pop();
      // item = item.productid;
      // _unit = item.unit;
      // this.get({productid : item.productid});

      console.log('collection logEvent:', item, 'key', key);
      this.incrementItem(item, key);


    },

    addingItem: function(collectionItem, key) {
      console.log('adding', collectionItem, key);

      var item = collectionItem.toJSON();
      // this.isInCart(item);
      if (this.isInCart(item)) {
        //  check if it is in the collection
        // if it is increment unit
        this.incrementItem(item);
      } else {
        // if not add
        this.addItem(item);
      }

    },

    isInCart: function(item) {
      return this.get({
        productid: item.productid
      }) !== undefined ? true : false;
    },

    incrementItem: function(item, key) {
      // what data do I have / need
      // how do I increment
      if (!item) {
        App.Events.trigger('item:changed');
      } else {
        var product, _unitTotalPrice, totalPriceConversion;
        product = this.get({
          productid: item.productid
        });
        if (!key) {
          _unit = product.get('unit') + 1;
          _unitTotalPrice = _unit * product.get('price');
          _unitTotalPrice = _unitTotalPrice.toFixed(2);
          product.set('unit', _unit);
          product.set('unitPriceTotal', _unitTotalPrice);
        } else {
          if (key !== undefined && item !== undefined) {

            var unitsToAdd, length;
            if (key == '-1') {
              units = product.get('unit');

              units = units.toFixed();
              units = units.slice(0, -1);
              length = units.length;
              if (length === 0) {
                units = 0;
                product.set('unit', units);
                console.log('-1', units, typeof units);
              }
              units = parseFloat(units);
              product.set('unit', units);
              _unitTotalPrice = units * product.get('price');
              product.set('unitPriceTotal', _unitTotalPrice);

            } else {
              unitsToAdd = product.get('unit') + key;
              console.log('keyvale checkd', unitsToAdd);
              _unit = parseInt(unitsToAdd, 10); //key was in string, converted back into number..    
              console.log('keyvale checkd', _unit);
              _unitTotalPrice = _unit * product.get('price');
              _unitTotalPrice = _unitTotalPrice.toFixed(2);

              // totalPriceConversion = parseFloat(this.cartProperties.totalPrice); //converts to a number...   
              // totalPriceConversion += (product.get('price') * (_unit - 1));
              // this.cartProperties.totalPrice = totalPriceConversion.toFixed(2); //converts to string for outputing 2 decimal place number.. 
              //should never do this..product.attributes.unit +=1;
              product.set('unit', _unit);
              product.set('unitPriceTotal', _unitTotalPrice);
            }

          }
          //console.log('addItem key ---->', item, key);
        }


        //console.log('collection ---->', this, item.unit );

      }
      this.cartProperties.totalPrice = this.getTotalPrice();
      App.Events.trigger('item:changed');
    },

    decrementItem: function() {
      App.Events.trigger('item:changed');

    },

    removeItem: function(item) {
      this.remove(item);
      this.cartProperties.totalPrice = this.getTotalPrice();
      App.Events.trigger('item:removed');
      console.log('i am gona remove....');
    },

    addItem: function(item) {

      var product, _unitTotalPrice;
      this.add(item);
      product = this.get({
        productid: item.productid
      });


      _unitTotalPrice = product.get('price'); //setting the unit price equal to price of the item...
      product.set('unitPriceTotal', _unitTotalPrice); //total price of each product ..
      //trigger add
      this.cartProperties.totalPrice = this.getTotalPrice();
      App.Events.trigger('item:added');
      //    console.log('added', item);
    },
    getTotalPrice: function() {
      console.log('get total Price', this.toJSON());
      var price, unitTotal,
        total = 0,
        products = this.toJSON();
      _.each(products, function(model) {
        unitTotal = model.unitPriceTotal;
        // console.log('typeof', unitTotal, typeof unitTotal);
        price = parseFloat(unitTotal);
        // console.log('typeof',price, typeof price);
        total += price;
      })

      return total.toFixed(2);
      //console.log('total cart price', total);

    }


  });

  // App.cartCollection = new App.Cart.collection();
  App.Cart.view = App.BaseView.extend({
    el: '.checkOut',
    template: Handlebars.compile($('#cart-template').html()),
    events: {
      'click .itemList a#delete': 'deleteItem',
      'click ul.keyPads li.symbol': 'keyPadClicked',
      'click .keyPad a#payNow': 'displayCheckOut'
    },
    initialize: function() {
      this.collection = new App.Cart.collection();

      this.listenTo(App.Events, 'item:added', this.getHTML, this);
      this.listenTo(App.Events, 'item:changed', this.getHTML, this);
      this.listenTo(App.Events, 'item:removed', this.getHTML, this);
      this.listenTo(App.Events, 'reset:cart', this.resetCollection, this);

      //this.collection.reset();

    },
    resetCollection: function() {
      this.collection.reset();
      this.collection.cartProperties.totalPrice = 0;
      this.getHTML();
    },
    displayCheckOut: function(e) {
      e.preventDefault();
      App.router.navigate('checkout', true);
    },
    deleteItem: function(e) {
      e.preventDefault();
      var $countTarget = $(e.currentTarget);
      var itemId = $countTarget.parents('li').attr('id');
      App.Events.trigger('item:removeFromCart', this.collection.get({
        productid: itemId
      }));
    },
    getHTML: function() {
      //console.log('render', this.collection, 'this', this);
      console.log('your route is here..')

      var cartHtml = '';
      cartHtml += this.template({
        cart: this.collection.toJSON()
      });

      this.onRender(cartHtml);
      // this.$el.find('.itemList').html(cartHtml);
      // this.$el.find('.totalPrice').html(this.collection.cartProperties.totalPrice);
      //return this;
    },
    onRender: function(cartHtml) {
      this.$el.find('.itemList').html(cartHtml);
      this.$el.find('.totalPrice').html('Total: £' + this.collection.cartProperties.totalPrice);
      return this;
    },

    keyPadClicked: function(e) {
      e.preventDefault();
      var key;
      var $currentKey = $(e.currentTarget);
      key = $currentKey.attr('data-val');
      App.Events.trigger('item:keyPadValue', key);
    }
  });

}(App));