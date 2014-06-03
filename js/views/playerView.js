define(['jquery', 
        'underscore', 
        'backbone', 
        'handlebars', 
        'collections/playList',
        'events/AppEvents'],
         function($, _ , Backbone, Handlebars, songsCollection, AppEvents){
    var audio = $('#player')[0], currPlaying=0;
    
    var playerCollectionView = Backbone.View.extend({
        tagName: 'ul',
        id: 'playList',
        events:{
             'click a#remove' : 'removeSong',
            'click a.song': 'songSelected'
        },
        initialize: function(){
            this.collection = new songsCollection();
            this.collection.on('add',this.addRecord,this);
            this.listenTo(AppEvents, 'added:SelectSrc', this.addSource, this);
        },
        addRecord: function(model){
        var viewPlayer = new playerView({model:model});
        this.$el.append(viewPlayer.render().el);
        $('#songsCollection').append(this.$el);
        },
        render:function(resultsDataSet){
        this.collection.forEach(this.addRecord,this);
        },
         addSource: function(firstSong){
            this.$el.children('li').addClass('selected');
            var firstSrc = firstSong.media;   
            this.playNow(firstSrc);
           
        },
        songSelected: function(evt){
            evt.preventDefault();
            var currId, $currTarget, mediaSrc;
            $('#player').unbind();
            currId = $(evt.currentTarget).attr('data-pid');
            currId = this.collection.get(currId);
            this.collection.setElement(currId);
            $currTarget = $(evt.currentTarget);
            mediaSrc = $currTarget.attr('data-source');       
            this.$el.find('li').removeClass('selected');
            $currTarget.parent('li').addClass('selected');
            this.playNow(mediaSrc);         
        },
        playNow: function(songSrc){                  
            audio.src= songSrc;
            audio.play();
            $('#player').bind("ended", {this:this}, this.playNext);
        },
        playNext: function(evt){
            var thisView= evt.data.this, nxtModel, nxtSrc, currIndex;
            var nxtModel = thisView.collection.next().getElement();
            if(nxtModel){
            nxtModel = nxtModel.toJSON();
            nxtSrc = nxtModel.media;          
            audio.src = nxtSrc;
            audio.play();
            currIndex = thisView.$el.find('li.selected').index();
            currIndex = currIndex + 1;
            thisView.$el.find('li').eq(currIndex).addClass('selected').siblings().removeClass('selected');       
            //  $('#player').unbind();
            // thiss.playNow(nxtSrc);
            }
            else
            {
            }
        },
        removeSong: function(evt){
            evt.preventDefault();
            var item = $(evt.currentTarget).prev('a').attr('data-pid');
            var currIndex = $(evt.currentTarget).parent('li').index();
            var nxtIndex = currIndex + 1;
            var nxtItem = this.$el.find('li').eq(nxtIndex).find('a.song').attr('data-pid');
            this.collection.removeItem(item);

            if($(evt.currentTarget).parent('li').hasClass('selected')){    
                $('#player').unbind();         
            var mediaSrc = this.$el.find('li').eq(nxtIndex).find('a.song').attr('data-source');
            this.playNow(mediaSrc);
            item = this.collection.get(nxtItem);
            this.collection.setElement(nxtItem);        
            this.$el.find('li').eq(nxtIndex).addClass('selected').siblings().removeClass('selected');
              $(evt.currentTarget).parent('li').remove();
            }
            
            else{
                 $(evt.currentTarget).parent('li').remove();
            }

        }
    });
    var playerView = Backbone.View.extend({
    	tagName: 'li',
        className: 'songplayList',
        template: Handlebars.compile($('#playList-template').html()),
        events: {
            // 'click a#remove' : 'removeSong',
            // 'click a.song': 'songSelected'
        },
        initialize: function(){
    	},
    	render: function(songModel){
            this.$el.html(this.template(this.model.toJSON()));
            return this;
        }    
    });      
   return playerCollectionView;
  });