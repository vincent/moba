'use strict';

Moba.module('HoodieBridge', function(HoodieBridge, App, Backbone, Marionette, $, _) {

  // initialize Hoodie
  var hoodie = new Hoodie();

  // Patch Hoodie because mehh
  hoodie.defer = function () {
    return $.Deferred();
  };

  // Extend App with hoodie helpers
  _.extend(App, {

    account: function () {
      return hoodie.account;
    },

    isLoggedIn: function () {
      return hoodie.account.username !== undefined;
    },

    playerCard: function (ownerHash) {

          App.updateCard({
            username: hoodie.account.username,
            rank: 'n00b'
          });


      ownerHash = ownerHash || hoodie.id();
      return hoodie.game.getPlayerCard(ownerHash);
    },

    updateCard: function (values) {
      return hoodie.game.updateCard(values);
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
    hoodie.account.signOut();
  }

  function onSignin (username, password) {
    hoodie.account.signIn(username, password)
      .done(function(){
          App.vent.trigger('login', hoodie.account);
      })
      .fail(function(){
        hoodie.account.signUp(username, password, password)
          .done(function(){
            App.vent.trigger('login', hoodie.account);
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