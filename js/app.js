/**
 * Felipe Janer @5h1rU.
 * Aranda Software prueba
 *
 * Backbone + Marionette + Handlebars + Amor, mucho amor
 *
 */

(function($) {
  'use strict';
  
  var Tweet = Backbone.Model.extend();

  var Tweets = Backbone.Collection.extend({
    model: Tweet,

    url: function() {
      var count = 9;
      return 'php/req.php?q='+this.query+'&count=100';
    },

    parse : function(response) {
      return response.statuses;
    }

  });

  /**
   * Se declara el nombre de la aplicacion para instancia posterior
   */
  var App = new Backbone.Marionette.Application();

  /**
   * Itemview para contener cada tweet
   */
  var TweetView = Backbone.Marionette.ItemView.extend({
    tagName: 'li',
    className: 'tweet',
    template: 'templates/tweet',
    text: null,
    events: {
      'click .show' : '_show'
    },
    ui: {
      'more': '.more',
      'window': $(window)
    },

    initialize: function(options) {
      this.text = options.model.toJSON().text;
      this._limitCharacter();
      this._showMore();
      this.on('finish', this._showTweets, this);
    },

    _show: function() {
      this.ui.more.toggleClass('more-details');
    },

    _showMore: function() {
      var self = this;
      this.ui.window.smack({ threshold: 0.8 }).done(function () {
        self.trigger('finish');
      });
    },

    _showTweets: function() {
      Controller.showTweets();
    },

    /**
     * metodo privado para acortar a 40 los caracteres provenientes de la API
     */
    _limitCharacter: function () {
      return this.text.substring(0,40);
    },

    templateHelpers: function() {
      return {
        shortText: this._limitCharacter()
      };
    }
  });

  /**
   * Itemview para contener formulario de busqueda
   */
  var SearchView = Backbone.Marionette.ItemView.extend({
    template: 'templates/search',

    ui: {
      'input': 'input'
    },

    events: {
      'click .send': '_sendValue'
    },

    /**
     * metodo para enviar la informacion al objeto url de la coleccion
     * y poder ejecutar una nueva "consulta" a la API de twitter 
     */
    _sendValue: function(e) {
      e.preventDefault();
      Controller.getTweets(this.ui.input.val());
    }
  });

  /**
   * Carga el spinner mientras se carga la consulta a la API
   */
  var LoadingView = Backbone.Marionette.ItemView.extend({
    template: 'templates/loading'
  });

  /**
   * Contenedor de cada modelo, se hace render de la coleccion
   */
  var TweetsView = Backbone.Marionette.CollectionView.extend({
    tagName: 'ul',
    itemView: TweetView
  });

  /**
   * Layout de vistas contenedor de regiones
   */
  var AppLayout = Backbone.Marionette.Layout.extend({
    template: 'templates/layout',

    regions: {
      searchRegion: '#search',
      tweetsRegion: '#tweets'
    }
  });

  /**
   * Evento que escucha la inicializacion de la aplicacion se instancian los
   * metodos del controlador para mostrar en pantalla los datos 
   */
  App.addInitializer(function(options) {
    Controller.showLayout();
    Controller.getTweets();
    Controller.searchTweets();
  });

  /**
   * Controlador para manejar el flujo de la aplicacion
   */
  var Controller = {

    /**
     * Se declara como un objeto dentro del controlador para que sea accesible
     * por todos los metodos dentro del mismo
     */
    layout : new AppLayout(),

    /**
     * Muestra en pantalla el layout
     */
    showLayout: function() {
      this.layout.render();
      $('#wrapper').append(this.layout.el);
    },

    showLoading: function() {
      var loadingView = new LoadingView();
      return this.layout.tweetsRegion.show(loadingView);
    },

    /**
     * Se obtienen los datos provenientes del API se instancia la coleccion
     * recibe un parametro que es el valor de la busqueda, en caso que no exista
     * pasa la cadena "colombia" por defecto
     */
    getTweets: function(searchValue) {
      var self = this,
        tweets = new Tweets();
      // Se necesita probar codigo, hecho en el avión = sin conexión a internet
      this.showLoading();
      tweets.query = searchValue || 'colombia';
      tweets.fetch().then(function() {
        App.reqres.setHandler('tweets', function() {
          return tweets;
        });
        self.showTweets(9);
      });
    },

    /**
     * Metodo que se ejecuta inmediatamente despues de recibirse los
     * datos del API
     */
    showTweets: function(setTweets) {
      var tweets = App.reqres.request('tweets'),
        proxy = new Backbone.Obscura(tweets),
        tweetsView = new TweetsView({collection: proxy});
      proxy.setPerPage(setTweets);
      return this.layout.tweetsRegion.show(tweetsView);
    },
    
    /**
     * Muestra en pantalla el formulario de busqueda
     */
    searchTweets: function() {
      var search = new SearchView();
      return this.layout.searchRegion.show(search);
    }
  };
  
  /**
   * Inicia la aplicacion
   */
  App.start();

})(jQuery);