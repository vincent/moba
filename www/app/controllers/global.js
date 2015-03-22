'use strict';

Moba.module('Main', function(Main, App, Backbone, Marionette, $, _) {

    // Main Router
    // ---------------

    Main.Router = Marionette.AppRouter.extend({

    });

    // Main Controller
    // ------------------------------

    Main.Controller = function() {

    };

    _.extend(Main.Controller.prototype, {

        // Start the app by showing the appropriate views
        // and fetching the list of todo items, if there are any
        start: function() {

            var self = this;

            // Login module
            App.vent.on('login', function () {
                self.showModule('Home');
            });

            // Logout module
            App.vent.on('logout', function () {
                self.showModule('Login');
            });

            // Navigation
            App.vent.on('navigate', function (options) {
                self.showModule(options.module || 'Home', options);
            });

            // Default module
            if (App.isLoggedIn()) {
                App.vent.trigger('login');

            } else {
                this.showModule('Login');
            }
        },

        showModule: function(module, options) {

            console.log('showing module', module, App[module]);

            var Module = App[module];

            function modulesClassRE (i, c) {
                return c.match(/^mod-/);
            }

            _.each(App.getRegions(), function (region, name) {
                if (Module[name]) {

                    var view = new Module[name](options);

                    App[name].show(view);
                    App[name].$el.parent()
                            .removeClass(modulesClassRE)
                            .addClass('mod-' + module.toLowerCase());
                }
            });
        },

    });

    // Main Initializer
    // --------------------

    Main.addInitializer(function() {

        var controller = new Main.Controller();
        new Main.Router({
            controller: controller
        });

        controller.start();
    });

});