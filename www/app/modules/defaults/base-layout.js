'use strict';

Moba.module('Base', function(Base, App, Backbone, Marionette, $, _) {

    App.Base = {};

    // Module Header View
    // ------------------

    App.Base.Header = Backbone.Marionette.CompositeView.extend({

        tagName:   'ul',

        className: 'navbar-inner',

        template:  JST['app/header/navbar'],

    });

    // Module Footer View
    // ------------------

    App.Base.Footer = Backbone.Marionette.ItemView.extend({
        template: JST['app/empty']
    });

    // Module Content View
    // ------------------

    App.Base.Content = Backbone.Marionette.ItemView.extend({
        template: JST['app/empty']
    });

    // Module Sidebar View
    // ------------------

    App.Base.Sidebar = Backbone.Marionette.ItemView.extend({

        className: 'sidebar-menu-inner',

        events: {
            'click  .logout-link a':  'logout',
        },

        template: JST['app/sidebar/index'],

        templateHelpers: function () {
          var self = this;
          return {

            userInfos: function () {
                return Marionette.Renderer.render(JST['app/sidebar/user-infos']);
            },

            links: function () {
                return Marionette.Renderer.render(JST['app/sidebar/links'], {
                    items: self.links()
                });
            },

          };
        },

        links: function () {
            return this.items || [];
        },

        onRender: function(template, data){
            this.$el.slideDown('fast');
            try { setup_sidebar_menu(); } catch (e) {}
        },

        ////////////////////////

        logout: function (event) {
            event.preventDefault();
            App.vent.trigger('signout');
        }

    });

});