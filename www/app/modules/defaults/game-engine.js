'use strict';

Moba.module('GameEngine', function(GameEngine, App, Backbone, Marionette, $, _) {

    App.GameEngine = {};

    // GameEngine View
    // ------------------

    App.GameEngine.View = Backbone.Marionette.ItemView.extend({

        template: JST['app/game-engine'],

        initialize: function () {

            this.on('render', this.waitEngine);
            this.on('before:destroy', this.unloadGame);
        },

        waitEngine: function () {
            async.until(
              function () { return !! window.Arena; },
              function (callback) { setTimeout(callback, 500); },
              this.engineLoaded
            );
        },

        engineLoaded: function () {
            App.vent.trigger('engine:loaded', window.Arena);
        },

        unloadGame: function(){
            window.arena.pause();
        },

        onRender: function () {

            var self = this;

            $.getScript('/three-arena/vendor/threejs/build/three.js')
                .done(function(script, textStatus ) {

                    _.each([

                        '/three-arena/vendor/threejs/examples/js/libs/tween.min.js',
                        '/three-arena/node_modules/Dat-GUI/build/dat.gui.js',
                        '/three-arena/vendor/shaderparticles/ShaderParticles.js',
                        '/three-arena/vendor/threejs/examples/js/Sparks.js',
                        '/three-arena/vendor/threejs/examples/js/MD2Character.js',
                        '/three-arena/vendor/threejs/examples/js/MD2CharacterComplex.js',
                        '/three-arena/vendor/threejs/src/loaders/Loader.js',
                        '/three-arena/vendor/threejs/src/loaders/JSONLoader.js',
                        '/three-arena/vendor/threejs/examples/js/loaders/OBJLoader.js',
                        '/three-arena/vendor/threejs/examples/js/loaders/MTLLoader.js',
                        '/three-arena/vendor/threejs/examples/js/loaders/OBJMTLLoader.js',
                        '/three-arena/vendor/threejs/examples/js/loaders/ColladaLoader.js',
                        '/three-arena/vendor/threejs/examples/js/controls/TrackballControls.js',
                        '/three-arena/vendor/threejs/examples/js/controls/OrbitControls.js',
                        '/three-arena/vendor/threejs/examples/js/controls/EditorControls.js',
                        '/three-arena/vendor/threejs/examples/js/geometries/ConvexGeometry.js',
                        '/three-arena/vendor/threejs/examples/js/shaders/BleachBypassShader.js',
                        '/three-arena/vendor/threejs/examples/js/shaders/ColorCorrectionShader.js',
                        '/three-arena/vendor/threejs/examples/js/shaders/CopyShader.js',
                        '/three-arena/vendor/threejs/examples/js/shaders/FXAAShader.js',
                        '/three-arena/vendor/threejs/examples/js/ShaderTerrain.js',
                        '/three-arena/vendor/threejs/examples/js/postprocessing/EffectComposer.js',
                        '/three-arena/vendor/threejs/examples/js/postprocessing/RenderPass.js',
                        '/three-arena/vendor/threejs/examples/js/postprocessing/ShaderPass.js',
                        '/three-arena/vendor/threejs/examples/js/postprocessing/MaskPass.js',
                        '/three-arena/vendor/threejs/examples/js/renderers/Projector.js',
                        '/three-arena/vendor/threejs/examples/js/TypedArrayUtils.js',
                        '/three-arena/vendor/threejs/examples/fonts/helvetiker_regular.typeface.js',
                        '/three-arena/vendor/m.guerrero/SkeletonHelper.js',
                        '/three-arena/vendor/m.guerrero/BlendCharacter.js',
                        'https://cdn.socket.io/socket.io-1.2.0.js',
                        '/three-arena/build/arena.build.js'

                    ], self.appendScript.bind(self));

                });
        },

        appendScript: function (src) {

            var s  = document.createElement('script');
            s.type = 'text/javascript';
            s.src  = src;

            this.$el.append(s);
        }

    });

});