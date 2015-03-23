'use strict';

Moba.module('Lobby', function(Lobby, App, Backbone, Marionette, $, _) {

  Lobby.PlayerItemView = Marionette.ItemView.extend({

    tagName: 'li',

    template: JST['app/matchs/lobby-item'],

    serializeModel: function (model) {

      return this.model;
    },

  });

  // Module Sidebar View
  // ------------------

  Lobby.sidebar = App.Base.Content.extend({

  });

  // Module Content View
  // ------------------

  Lobby.content = App.Base.Content.extend({

    template: JST['app/matchs/lobby'],

    initialize: function () {

      _.bindAll(this, 'addPlayer');

      this.listenTo(App.vent, 'lobby:add', this.addPlayer);

      App.vent.trigger('lobby:ready');
    },

    addPlayer: function (account) {

      var playerView = new Lobby.PlayerItemView({ model:account });
      playerView.render();

      this.$el.find('.players').append(playerView.$el);
    }

  });

});