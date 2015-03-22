'use strict';

Moba.module('HeroViewer', function(HeroViewer, App, Backbone, Marionette, $, _) {

  // Module Header View
  // ------------------

  HeroViewer.header = App.Base.Header.extend({
    onRender: function () {
      this.$el.html('<span class="title">Hero Viewer</span>');
    }
  });

  // Module Sidebar View
  // ------------------

  HeroViewer.sidebar = App.Base.Sidebar.extend({

    events: {

      'click  .logout-link a':    'logout',
      'click  li a[data-module]': 'navigate',

      'click  .set-spell':        'clickOnSpell',
      'click  .set-character':    'clickOnCharacter'
    },

    initialize: function () {

      _.bindAll(this, 'loadCharacters');

      this.items = {};

      this.listenTo(App.vent, 'engine:loaded', this.loadSpells);
      this.listenTo(App.vent, 'engine:loaded', this.loadCharacters);
    },

    links: function () {
      return _.values(this.items);
    },

    clickOnSpell: function (event) {
      var name = $(event.target).closest('a').children('.title').html();
      App.vent.trigger('hero-viewer:set-spell', name);
    },

    clickOnCharacter: function (event) {
      var name = $(event.target).closest('a').children('.title').html();
      App.vent.trigger('hero-viewer:set-character', name);
    },

    loadSpells: function (Arena) {

      var self = this;

      var menuItem = {
        url: '#', title: 'Spells',
        subs: [ ]
      };

      _.each(Arena.Spells, function (c, name) {
        menuItem.subs.push( { className:'set-spell', url:'#', icon:'fa fa-yelp', title:name } );
      });

      this.items.spells = menuItem;

      this.render();
    },

    loadCharacters: function (Arena) {

      var self = this;

      var menuItem = {
        url: '#', title: 'Characters',
        subs: [ ]
      };

      _.each(Arena.Characters, function (c, name) {
        menuItem.subs.push( { className:'set-character', url:'#', icon:'fa fa-child', title:name } );
      });

      this.items.characters = menuItem;

      this.render();
    },

  });

  // Module Content View
  // ------------------

  HeroViewer.content = App.GameEngine.View.extend({

    initialize: function () {

      _.bindAll(this, 'loadGame', 'setCharacter', 'setSpell');

      this.listenTo(App.vent, 'engine:loaded', this.loadGame);
      this.listenTo(App.vent, 'hero-viewer:set-character', this.setCharacter);

      App.GameEngine.View.prototype.initialize.apply(this);
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