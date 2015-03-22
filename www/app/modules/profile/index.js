'use strict';

Moba.module('Profile', function(Profile, App, Backbone, Marionette, $, _) {

  // Module Header View
  // ------------------

  Profile.header = App.Base.Header.extend({
    onRender: function () {
      this.$el.html('<span class="title">Profile</span>');
    }
  });

  // Module Content View
  // ------------------

  Profile.content = App.Base.Content.extend({

    initialize: function (options) {
      this.model = new Backbone.Model(options.model || App.account());
    },

    template: JST['app/profile/index']

  });

});