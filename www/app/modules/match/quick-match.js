'use strict';

Moba.module('QuickMatch', function(QuickMatch, App, Backbone, Marionette, $, _) {

  // Module Sidebar View
  // ------------------

  QuickMatch.sidebar = App.Lobby.sidebar;

  // Module Content View
  // ------------------

  QuickMatch.content = App.GameEngine.View.extend({

    initialize: function () {

      _.bindAll(this, 'loadGame', 'setCharacter', 'setSpell');

      this.createLobby();
      // this.listenTo(App.vent, 'engine:loaded', this.createLobby);

      App.GameEngine.View.prototype.initialize.apply(this);
    },

    render: function () {

      this.lobby.render();

      return this.$el.html(this.lobby.$el);
    },

    createLobby: function () {

      if (App.currentLobby) {
        this.lobby = App.currentLobby;

      } else {
        this.lobby = App.currentLobby = new App.Lobby.content();

      }

      setTimeout(function () {
        App.vent.trigger('lobby:add', App.account);
      }, 2000);
    },

    loadGame: function (Arena) {

      if (! Arena) return;

      var arena = this.arena = window.arena = new Arena({

        container: this.$el.find('#game-container').get(0),

        lightAmbientColor: '#343434',
        lightPointColor: '#2aac8d',
        lightPointIntensity: 1.5,

      });

      arena.setTerrain('/gamedata/maps/simplest/simplest.obj', {
        minimap: THREE.ImageUtils.loadTexture('/gamedata/maps/simplest/minimap.png'),

        cellSize: 0.9,          // nav mesh cell size (.8 > 2)
        cellHeight: 0.8,        // nav mesh cell height (.5 > 1)
        agentHeight: 2.0,       // character height (1.2 => 2)
        agentRadius: 0.8,       // character radius (.5 > 2)
        agentMaxClimb: 1.0,     // max units character can jump (1 > 5)
        agentMaxSlope: 50.0,    // max degre character can climb (20 > 40)
      });

      arena.addCharacter(function(done){
        var d = new Arena.Characters.Dummy({
          maxSpeed: 15.0,
          onLoad: function(){
            this.learnSpell(Arena.Spells.Teleport);
            arena.asPlayer(this);
            done(this);
          }
        });
      });

      arena.on('set:terrain', function(){
        arena.init(function(arena){
          arena.run();
        });
      });

      this.$el.find('#game-wrapper, #game-container').show();
      $('footer.main-footer ').hide();
    },

    setCharacter:function (characterClass) {

      var self = this;

      self.arena.addCharacter(function(done){
        var d = new Arena.Characters[characterClass]({
          onLoad: function(){
            self.arena.asPlayer(this);
            done(this);
          }
        });
      });
    },

    setSpell: function (spellClass) {
      this.arena.entity.learnSpell(Arena.Spells[spellClass]);
    }

  });

});