/*
 * fire.js
 * */

//= require ./lib/jquery-2.1.1.min.js
//= require ./lib/dat.gui.min.js
//= require ./lib/three.r71.min.js
//= require ./lib/TrackballControls.js

//= require ./lib/FireShader.js
//= require ./lib/Fire.js

(function(global, $, THREE) {

    var app, App = function(id) {
        app = this;
        app.init(id);
    };

    App.prototype = {

        init : function(id) {
        var loader = new THREE.FontLoader();



            var $dom = $("#" + id);

            var scene = this.scene = new THREE.Scene();
            var camera = this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.001, 1000);
            camera.position.z = 2;
            scene.add(camera);

            var renderer = new THREE.WebGLRenderer({
                alpha: true,
                antialias: true
            });

            renderer.setClearColor(0x000000);
            renderer.setSize(window.innerWidth, window.innerHeight);
            $dom.append(renderer.domElement);
	    //holoplay = new HoloPlay(scene, camera, renderer);

            var fireTex = THREE.ImageUtils.loadTexture("textures/firetex.png");

            var wireframeMat = new THREE.MeshBasicMaterial({
                color : new THREE.Color(0xffffff),
                wireframe : true
            });

            var fire = new THREE.Fire(fireTex);

            var wireframe = new THREE.Mesh(fire.geometry, wireframeMat.clone());
            fire.add(wireframe);
            wireframe.visible = false;

            scene.add(fire);

            var clock = new THREE.Clock();
            var trackballControls = new THREE.TrackballControls(camera, renderer.domElement);
            trackballControls.minDistance = .5;
            trackballControls.maxDistance = 12;

            var controller = {
                speed       : 1.0,
                magnitude   : 1.3,
                lacunarity  : 2.0,
                gain        : 0.5,
                noiseScaleX : 1.0,
                noiseScaleY : 2.0,
                noiseScaleZ : 1.0,
                wireframe   : false
            };

            var onUpdateMat = function() {
                fire.material.uniforms.magnitude.value = controller.magnitude;
                fire.material.uniforms.lacunarity.value = controller.lacunarity;
                fire.material.uniforms.gain.value = controller.gain;
                fire.material.uniforms.noiseScale.value = new THREE.Vector4(
                    controller.noiseScaleX,
                    controller.noiseScaleY,
                    controller.noiseScaleZ,
                    0.3
                );
            };

/*
           var gui = new dat.GUI();
            gui.add(controller, "speed", 0.1, 10.0).step(0.1);
            gui.add(controller, "magnitude", 0.0, 10.0).step(0.1).onChange(onUpdateMat);
            gui.add(controller, "lacunarity", 0.0, 10.0).step(0.1).onChange(onUpdateMat);
            gui.add(controller, "gain", 0.0, 5.0).step(0.1).onChange(onUpdateMat);
            gui.add(controller, "noiseScaleX", 0.5, 5.0).step(0.1).onChange(onUpdateMat);
            gui.add(controller, "noiseScaleY", 0.5, 5.0).step(0.1).onChange(onUpdateMat);
            gui.add(controller, "noiseScaleZ", 0.5, 5.0).step(0.1).onChange(onUpdateMat);
*/

/*
            gui.add(controller, "wireframe").onChange(function() {
                var wireframe = fire.children[0];
                wireframe.visible = controller.wireframe;
            });
*/

            loader.load( 'fonts/helvetiker_bold.typeface.json', function ( font ) {
                var geometry = new THREE.TextGeometry( 'Agni', {
                    font: font,
                    size: 80,
                    height: 5,
                    curveSegments: 12,
                    bevelEnabled: true,
                    bevelThickness: 10,
                    bevelSize: 8,
                    bevelSegments: 5
                } );
                var s = 0.003;
                geometry.scale(s, s, s);
                
                geometry.computeBoundingBox();
                geometry.computeVertexNormals();

                
                var textGeo = new THREE.BufferGeometry().fromGeometry( geometry );
                var material = new THREE.MeshBasicMaterial( { color: 0x00aa00, wireframe:true } );
                var textMesh = new THREE.Mesh( textGeo,  fire.material);
                textMesh.position.x = -(geometry.boundingBox.max.x - geometry.boundingBox.min.x)/2;
                textMesh.position.y = -(geometry.boundingBox.max.y - geometry.boundingBox.min.y)/5*6;
                textMesh.position.z = 0;
            scene.add(textMesh);
               //fire.add(textMesh);
                window.console.log('text ready', textMesh);
                window.textMesh=textMesh;
                window.textGeo=geometry;


                
            } );

            (function loop() {
                requestAnimationFrame(loop);

                var delta = clock.getDelta();
                trackballControls.update(delta);

                var t = clock.elapsedTime * controller.speed;
                fire.update(t);
                
                renderer.render(scene, camera);
		//holoplay.render();

            })();

            var updateRendererSize = function() {
                var w = window.innerWidth;
                var h = window.innerHeight;

                camera.aspect = w / h;
                camera.updateProjectionMatrix();

                renderer.setSize(w, h);
            };

            $(window).on('resize', updateRendererSize);
        }

    };

    global.App = App;

})(window, $, THREE);

$(function() {
    new App("viewer");
});

