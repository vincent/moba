'use strict';

var Moba = new Backbone.Marionette.Application();

Moba.addRegions({
    header:  '#moba-header',
    content: '#moba-content',
    sidebar: '#moba-sidebar',
    footer:  '#moba-footer'
});

Moba.on('initialize:after', function() {
    Backbone.history.start({pushState: true});
});
