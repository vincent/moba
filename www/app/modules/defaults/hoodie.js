'use strict';

Moba.module('HoodieBridge', function(HoodieBridge, App, Backbone, Marionette, $, _) {

  // initialize Hoodie
  var hoodie = new Hoodie();

  // Patch Hoodie because mehh
  hoodie.defer = function () {
    return $.Deferred();
  };

  // Our User model
  // ------------------

  App.UserModel = Backbone.Model.extend({

    quote: function () {
      return this.get('quote') || 'A magnificient player';
    },

    image: function () {
      return 'http://api.randomuser.me/portraits/thumb/men/' + 55 + '.jpg';
    },

    infos: function () {

      // App.updateCard({
      //   username: hoodie.account.username,
      //   rank: 'n00b'
      // });

      return hoodie.game.getPlayerCard(this.get('username'));
    },

    updateInfos: function (values) {
      return hoodie.game.updateCard(values);
    }

  });


  // Extend App with hoodie helpers
  // ------------------

  _.extend(App, {

    account: null,

    attachHoodieAccount: function () {
      App.account = new App.UserModel({
        id: hoodie.id(),
        username: hoodie.account.username
      });
    },

    isLoggedIn: function () {

      return hoodie.account.username !== undefined;
    },

    requestMatch: function () {

      var promise = hoodie.game.requestMatch({});

      promise.then(function (data) {
        App.vent.trigger('match:ready', data);
      });

      return promise;
    }

    /* * /
    Get game achievements

    var promise = hoodie.game.getAchievements();
    promise.done(function(achievements){ console.log(achievements); });
    promise.fail(function(){ alert('Get Achievements Failed'); });


    Get single game achievement

    var achievementId = 'ach1';
    var promise = hoodie.game.getAchievement(achievementId);
    promise.done(function(achievement){ console.log(achievement); });
    promise.fail(function(){ alert('Get Achievement Failed'); });


    Get game levels

    var promise = hoodie.game.getLevels();
    promise.done(function(levels){ console.log(levels); });
    promise.fail(function(){ alert('Get Levels Failed'); });


    Get single game level

    var levelIndex = 1;
    var promise = hoodie.game.getLevel(levelIndex);
    promise.done(function(level){ console.log(level); });
    promise.fail(function(){ alert('Get Level Failed'); });


    Get game leaderboard

    var promise = hoodie.game.getLeaderboard();
    promise.done(function(leaderboard){ console.log(leaderboard); });
    promise.fail(function(){ alert('Get leaderboard Failed'); });


    Add points (current logged in user)

    var points = 3;
    var promise = hoodie.game.addPoints(points);
    promise.done(function(result){ console.log(result); });
    promise.fail(function(){ alert('Add Points Failed'); });


    Add action (units) toward achievement (current logged in user)

    var achievementId = 'ach1';
    var units = 10;
    var promise = hoodie.game.addAction(achievementId, units);
    promise.done(function(result){ console.log(result); });
    promise.fail(function(){ alert('Add Action Failed'); });


    Update Player Card (current logged in user)

    values = {rank: "private first class"};
    var promise = hoodie.game.updateCard(values);
    promise.done(function(result){ console.log(result); });
    promise.fail(function(){ alert('Update Card Failed'); });


    Listen for game event

    var event = 'levelup'; //levelup or achievement
    var promise = hoodie.game.on(event);
    promise.done(function(eventData){ console.log(eventData); });
    promise.fail(function(){ alert('Add Points Failed'); });
    /* */

  });

  // Set the current user
  App.attachHoodieAccount();

  // Patch the Marionette's Rendered to include the `user` variable
  _.extend(Marionette.Renderer, {
    render: renderTemplate
  });

  HoodieBridge.listenTo(App.vent, 'signin',  onSignin);
  HoodieBridge.listenTo(App.vent, 'signout', onSignout);

  hoodie.account.on('signout', function(username){
    App.vent.trigger('logout');
  });

  ///////////////////////

  function onSignout () {
    App.attachHoodieAccount();
    hoodie.account.signOut();
  }

  function onSignin (username, password) {
    hoodie.account.signIn(username, password)
      .done(function(){
        App.attachHoodieAccount();
        App.vent.trigger('login', App.account);
      })
      .fail(function(){
        hoodie.account.signUp(username, password, password)
          .done(function(){
            App.attachHoodieAccount();
            App.vent.trigger('login', App.account);
          })
          .fail(function(){
            App.vent.trigger('login-fail');
          }
        );
      });
  }

  function renderTemplate (template, data) {

    if (! data) { data = {}; }

    data.app = App;

    if (!template) {
      throw new Marionette.Error({
        name: 'TemplateNotFoundError',
        message: 'Cannot render the template since its false, null or undefined.'
      });
    }

    var templateFunc = _.isFunction(template) ? template : Marionette.TemplateCache.get(template);

    return templateFunc(data);
  }

});