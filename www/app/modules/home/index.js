'use strict';

Moba.module('Home', function(Home, App, Backbone, Marionette, $, _) {

  // Module Sidebar View
  // ------------------

  Home.sidebar = App.Base.Sidebar.extend({

    links: function () {
      return [
        { url: '/hero-viewer', title: 'Hero viewer', module: 'HeroViewer', action: 'index' }
      ];
    }

  });

  // Module Content View
  // ------------------

  Home.content = App.Base.Content.extend({
    template: JST['app/home']
  });

});