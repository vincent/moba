'use strict';

Moba.module('Home', function(Home, App, Backbone, Marionette, $, _) {

  // Module Header View
  // ------------------

  Home.header = App.Base.Header.extend({

  });

  // Module Sidebar View
  // ------------------

  Home.sidebar = App.Base.Sidebar.extend({

    links: function () {
      return [

        { url: '/hero-viewer', title: 'Hero viewer', module: 'HeroViewer', action: 'index' },
        { url: '/campaign',    title: 'Campaign',    module: 'Campaign',   action: 'index' },
        { url: '/quick-match', title: 'Match',       module: 'QuickMatch', action: 'index' }

      ];
    }

  });

  // Module Content View
  // ------------------

  Home.content = App.Base.Content.extend({

    template: JST['app/home']

  });

});