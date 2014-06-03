App.checkOutView = {};
App.checkOutView.totalAmount = 0;

App.checkOutView = Backbone.View.extend({
  el: '.prods',
  template: Handlebars.compile($('#template-checkOut').html()),
  events: {
    'change #txtEnabled': 'amountEnterd',
    'click a#homeRoute': 'goHome'
  },
  initialize: function() {

    this.listenTo(App.Events, 'cart:goToCheckOut', this.swapViews, this);
  },
  render: function(data) {
    //  console.log('render----->', data);
    this.$el.find('#checkOutView').find('span#paid').html(' £ ' + data.paid);
    this.$el.find('#checkOutView').find('span#change').html(' £ ' + data.change);
    this.$el.find('#checkOutView').find('span#remaining').html(' £ ' + data.remaining);



  },
  swapViews: function(totalAmount) {
    App.checkOutView.totalAmount = totalAmount;
    this.$el.html(this.template);
    this.$el.find('#amountPaid').val('0.00');
    // this.$el.find('#checkOutView').find('.amounts span').html('');
    this.$el.find('#checkOutView').find('span#totalAmount').html(' £ ' + totalAmount);


  },
  amountEnterd: function(e) {

    var change = 0,
      rem = 0;
    var paid = parseFloat($(e.currentTarget).find('input').val());
    var total = parseFloat(App.checkOutView.totalAmount);
    if (paid < total) {
      rem = total - paid;
      rem = rem.toFixed(2);

    } else {
      change = paid - total;
      change = change.toFixed(2);
    }

    //console.log(paid, typeof paid, total, change);
    var data = {
      paid: paid,
      total: total,
      change: change,
      remaining: rem
    };

    this.render(data);
  },
  goHome: function(e) {
    e.preventDefault();
    App.router.navigate('home', true);
  }



});