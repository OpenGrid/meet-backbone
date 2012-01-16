$(function() {
	var App = {
		Models : {},
		Collections : {},
		Views : {}
	};

	App.Models.Fanpage = Backbone.Model.extend({
		url : function() {
			return "https://graph.facebook.com";
		},
		initialize : function() {
			this.fetch({data : {id : this.get("id")}});
		}
	});

	App.Collections.Pages = Backbone.Collection.extend({
		model : App.Models.Fanpage,
		url : function() {
			return "https://graph.facebook.com/search";
		},
		parse : function(datafromfacebook) {
			return datafromfacebook.data;		
		}
	});

	App.pageList = new App.Collections.Pages();

	App.Views.Page = Backbone.View.extend({
		tagName : 'tr',
		initialize : function() {
			this.template = _.template(
				$("#FanpageTemplate").html());
			
			this.model.bind("change", this.render, this);
			
		},
		render : function() {
			var row = 
			this.template({model : this.model.toJSON()});
			$(this.el).html(row);
		}
	});

	App.Views.Pages = Backbone.View.extend({
		el : "#SearchResults",
		initialize : function() {
			App.pageList.bind("reset", this.render, this);
		},
		render : function() {
			this.$("tbody").empty();
			App.pageList.each(function(fanpage) {
				var row = new App.Views.Page({model : fanpage});
				row.render();
				this.$("tbody").append(row.el);			
			}, this);
		}
	});

	App.Router = Backbone.Router.extend({
		routes : {
			"!/search/:term" : "search"
		},
		initialize : function() {
			App.searchbox = new App.SearchBox();
			Backbone.history.start();
		},
		search : function(term) {
			App.pageList.fetch({data : {
				q : term, type : "page"}});
		}
	});


	App.SearchBox = Backbone.View.extend({
		el : '#Search',
		initialize : function() {
			
		},
		events : {
			"keypress" : "handleEnter"
		},
		handleEnter : function(event) {
			if(event.keyCode == 13) {
				var term = $(this.el).val();
				App.router.navigate("!/search/" + term, true);
				return false;
			}
		}
	});

	App.SearchView = new App.Views.Pages();
	App.router = new App.Router();
});