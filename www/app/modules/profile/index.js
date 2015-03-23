'use strict';

Moba.module('Profile', function(Profile, App, Backbone, Marionette, $, _) {

  // Module Content View
  // ------------------

  Profile.content = App.Base.Content.extend({

    template: JST['app/profile/index'],

    initialize: function (options) {

      _.bindAll(this, 'renderAsync');

      this.model = options.model ? new App.UserModel(options.model) : App.account;
    },

    serializeModel: function (model) {

      return this.model;
    },

    onRender: function () {

      var self = this;

      this.model.infos()
        .done(this.renderAsync)
        // TODO fail ...
        ;
    },

    renderAsync: function (infos) {

      this.$el.find('.player-card-full').html(
        Marionette.Renderer.render(JST['app/profile/player-card-full'], infos)
      );

      this.$el.find('.player-match-history').html(
        _.map(infos.matches, function (match) {
          return Marionette.Renderer.render(JST['app/profile/player-match-item'], match);
        }).join('\n')
      );
    }

  });

});