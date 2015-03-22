'use strict';

Moba.module('Login', function(Login, App, Backbone, Marionette, $, _) {

    // Module Header View
    // ------------------

    Login.header = App.Base.Header.extend({

    });

    // Module Footer View
    // ------------------

    Login.footer = App.Base.Footer.extend({

    });

    // Module Sidebar View
    // ------------------

    Login.sidebar = App.Base.Sidebar.extend({
        renderUserInfos: function () {
            return '';
        }
    });

    // Module Content View
    // ------------------

    Login.content = App.Base.Content.extend({

        template: JST['login'],

        events: {
            'submit form': 'signin',
        },

        signin: function(event) {

            event.preventDefault();

            var username = this.$el.find('[name=username]').val();
            var password = this.$el.find('[name=passwd]').val();

            App.vent.trigger('signin', username, password);
        },

    });

});