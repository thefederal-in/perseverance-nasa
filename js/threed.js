var container, stats;
var camera, controls, scene, renderer, model, raycaster, mouse;
var loader, intersects,modelchildren = [];
var datapoints = [{"tag":"pilot-hotpoint","name":"Mastcam-Z","position":{"x":-0.834,"y":1.985,"z":0.785}, "camerapos":{"x": -1.40, "y": 2.48, "z": 1.84}, "camerarot":{"x": -0.93, "y": -0.42, "z": -0.50}, "line-length":350,"link":"app/hotpoints/hotpoint_crew.html","text":"Loading info ...","image":"app/img/hotpoints/CREW.png","image-scale":150},{"tag":"pilot-hotpoint","name":"SuperCam","position":{"x":-0.276,"y":2.132,"z":0.766}, "camerapos":{"x":-0.10, "y":2.31, "z":2.97}, "camerarot":{"x":-0.58, "y":-0.24, "z":-0.15}, "line-length":350,"link":"app/hotpoints/hotpoint_b767-200er_seating.html","text":"Loading info ...","image":"app/img/hotpoints/SEATING.png","image-scale":150}]

init();
// animate();

function init() {

    var scene = new THREE.Scene();

    camera = new THREE.PerspectiveCamera(75,window.innerWidth/window.innerHeight,0.1,1000)
        camera.position.x = -5;
        camera.position.y = 2;
        camera.position.z = 5;
        
    renderer = new THREE.WebGLRenderer({antialias: true, alpha:true});
    renderer.setSize(window.innerWidth,window.innerHeight);

    // set render auto clear false.
    renderer.autoClear = false;

    // initialize global configuration
    THREE.threeDataConfig = {renderer: renderer, camera: camera};


    document.body.appendChild(renderer.domElement);

    // Load the 3D model
    loader = new THREE.GLTFLoader();
    loader.load('perseverance.gltf', function(gltf){
        model = gltf.scene

        // modelchildren.push(
        // intersects = raycaster.intersectObjects(model.children[0].children), true);
        // console.log()
        scene.add(model);
    });


    // var geometry = new THREE.SphereGeometry( 0.04, 32, 32 );
    // var material = new THREE.MeshBasicMaterial( {color: 0xff0000} );
    // var sphere = new THREE.Mesh( geometry, material );
    // sphere.position.set(-0.834, 1.985, 0.785)
    // scene.add( sphere );



    var Hotspot = function ( hotpoint_data ) {
        "use strict";
    
        var self = this;
    
        self.callback = function(_this, sprite, action){};
    
        self.data = hotpoint_data;
    
        self.sprite = null;
    
        self.group = new THREE.Group();
    
        self.entities = { };
    
        self.makeVisible = function( b ){ self.entities.red_dot_transparent.visible = !b; };
    
        // --------------------------------
        // radius : 0.04, widthSegments : 32, heightSegments : 32, phiStart : 0, phiLength : 2 * Math.PI, thetaStart : 0, thetaLength : Math.PI
        var hotspot_geometry = new THREE.SphereGeometry( 
            0.04, 32, 32, 0, 2 * Math.PI, 0,  Math.PI
        );

        var hot_spot = self.entities.hot_spot =  new THREE.Mesh( hotspot_geometry, new THREE.MeshBasicMaterial( {  color: 0xff0000  } ) );
        
        hot_spot.position.set( self.data.position.x, self.data.position.y, self.data.position.z );
    
        hot_spot.callback = function( action ) { self.callback(self, hot_spot, action); };

        hot_spot.name = self.data.name;
        
        hot_spot.old_raycast = hot_spot.raycast;
    
        hot_spot.raycast = function( raycaster, intersects ){
    
            hot_spot.scale.set( 4, 4, 4 );
    
            hot_spot.updateMatrixWorld();
    
            var return_value = hot_spot.old_raycast(raycaster, intersects );
    
            hot_spot.scale.set( 1, 1, 1 );
    
            hot_spot.updateMatrixWorld();
    
            return return_value;
        };
    
        var hot_spot_transparent = self.entities.hot_spot_transparent = new THREE.Mesh( hotspot_geometry, new THREE.MeshBasicMaterial( {  color: 0xff0000, transparent: true, opacity: 0.3 } ) );
        hot_spot_transparent.scale.set( 1, 1, 1 );
        hot_spot_transparent.position.set( self.data.position.x, self.data.position.y, self.data.position.z );
        hot_spot_transparent.raycast = function(){};

        self.group.add(hot_spot);
        self.group.add(hot_spot_transparent);
    
        return this;
    };

    var hotpoints = datapoints

    var hotpoints_objects_array = [];
    
    hotpoints.forEach( function(currentValue, index, array) {
        // console.log("hotpoints", currentValue)
        var hot_spot = new Hotspot( currentValue, index, array  );

        scene.add( hot_spot.group );

        hotpoints_objects_array.push(hot_spot);

        hot_spot.callback = function(_this, sprite, action){

            var e;
            if (action === "click"){
                e = document.createEvent('Event');
                e.initEvent("hotspot-clicked", true, true);
                e.hotpoint =_this;
                document.dispatchEvent(e);
            }
            else if (action === "hover"){
                e = document.createEvent('Event');
                e.initEvent("hotspot-hover", true, true);
                e.hotpoint =_this;
                document.dispatchEvent(e);
            }
            else if (action === "focus"){
                e = document.createEvent('Event');
                e.initEvent("hotspot-clicked", true, true);
                e.hotpoint =_this;
                document.dispatchEvent(e);
            } 
            else if (action === "out"){
                e = document.createEvent('Event');
                e.initEvent("hotspot-out", true, true);
                e.hotpoint =_this;
                document.dispatchEvent(e);
            }
            else if (action === "blur"){
                e = document.createEvent('Event');
                e.initEvent("hotspot-clicked", true, true);
                e.hotpoint =_this;
                document.dispatchEvent(e);
            }
        };
    });


    var hot_point_name = document.createElement('span');
        hot_point_name.innerHTML = "";
        hot_point_name.style.position = "absolute";
        hot_point_name.style.display = "none";
        hot_point_name.style.color = "#000";
        hot_point_name.style.fontFamily  = "Lato, sans-serif";
        hot_point_name.style.fontSize  = "20px";
        hot_point_name.style.fontWeight  = "400";
        hot_point_name.style.backgroundColor = "rgba(255,255,255,.75)";
        hot_point_name.style.padding = "6px 16px";
        
        hot_point_name.hotpoint = null;

        document.body.appendChild(hot_point_name);

        document.addEventListener("hotspot-hover", function(e){

            if ($('#main-column-container').hasClass('out'))
                return;

            hot_point_name.hotpoint = e.hotpoint;
            hot_point_name.style.display = "";

            setHotPointNamePosition( e.hotpoint );
        });

        // document.addEventListener("hotspot-out", function(e){

        //     let drawer = state.drawer;
        //     let camera = drawer.getCamera();
        //     let ipm = state.inputmanager;
        //     let canvas = drawer.getRenderer().domElement;

        //     let hotpoint = e.hotpoint;

        //     let entity = hotpoint.entities.red_dot_transparent;

        //     hot_point_name.style.display = "none";
        //     hot_point_name.hotpoint = null;
        // });

        document.addEventListener("hotspot-clicked", function(e){
            console.log("Trigger camera animation", e.hotpoint.data.position)
            controls.enabled = false;
            var hotpoint_pos = e.hotpoint.data.camerapos
            var hotpoint_rot = e.hotpoint.data.camerarot

            controls.maxPolarAngle = Math.PI;
            controls.minPolarAngle=0;

            gsap.to( camera.position, {
                duration: 1,
                x: hotpoint_pos.x,
                y: hotpoint_pos.y,
                z: hotpoint_pos.z,
                onUpdate: () => {
                    controls.enabled = false;
                },
                onComplete: () => {
                    controls.enabled = true;
                    
                }
            } );
            
            gsap.to( camera.rotation, {
                duration: 1,
                x: hotpoint_rot.x,
                y: hotpoint_rot.y,
                z: hotpoint_rot.z,
                onUpdate: () => {
                    controls.enabled = false;
                },
                onComplete: () => {
                    controls.enabled = true;
                    
                }
            } );
            
            // gsap.to( camera.position, {
            //     duration: 1,
            //     x:-2.16,
            //     y:2.02,
            //     z:2.56,
            //     onUpdate: () => {
            //         controls.enabled = false;
            //         // camera.lookAt(-2.16, 1.02, 2.56);

            //     },
            //     onComplete: () => {
            //         // camera.lookAt(hotpoint_pos.x, hotpoint_pos.y, hotpoint_pos.z);
            //         // camera.lookAt(-2.16, 1.02, 2.56);
            //         controls.enabled = true;
                    
            //     }
            // } );
        });
    

    // console.log(scene)

    // raycaster = new THREE.Raycaster();
    // mouse = new THREE.Vector2();

    //add a light
    function addLight(source, xpos, ypos, zpos) {
        var light = source;
        light.position.x = xpos;
        light.position.y = ypos;
        light.position.z = zpos;
        scene.add(light);
    }




    // using reusable function addLight(source, xpos, ypos, zpos) 
    addLight(new THREE.PointLight(0xFFFFFF, 1, 500), -6.322, 1.144, -0.073);
    addLight(new THREE.DirectionalLight(0xFFFFFF, 1, 500), 5, 10, 7.5);

    var controls = new THREE.OrbitControls(camera);
    controls.enableDamping = true


    var render = function(){

        requestAnimationFrame(render);
        renderer.render(scene, camera)

    }
    
    render()

    var Objectselected = false;
    
    function onMouseMove( event ) {

        var raycaster = new THREE.Raycaster();
        var mouse = new THREE.Vector2();

        // event.preventDefault();

        var rect = renderer.domElement.getBoundingClientRect();

        var clientX = event.clientX - rect.left;
        var clientY = event.clientY - rect.top;

        if ( clientX < 0 || event.clientX > ( renderer.domElement.clientWidth + rect.left ) )
            return;

        if ( clientY < 0 || event.clientY > ( renderer.domElement.clientHeight - rect.top ) )
            return;

        mouse.x = ( clientX / renderer.domElement.clientWidth ) * 2 - 1;
        mouse.y = - ( clientY / renderer.domElement.clientHeight ) * 2 + 1;

        raycaster.setFromCamera( mouse, camera );

        var intersects = raycaster.intersectObjects( scene.children, true ); 

        roverparts = ["Mastcam-Z", "SuperCam"]

        if ( intersects.length > 0 ) {

            if (roverparts.indexOf(intersects[0].object.name) >= 0) {
                
                // console.log("intersects", intersects[0].object.name)
                document.getElementById("Objectname").innerHTML = "<h3>"+intersects[0].object.name+"</h3>"
                Objectselected = true;
            }


        } else {
            Objectselected = false;
        }
    }
    
    
    function onClick( event ) {

        var raycaster = new THREE.Raycaster();
        var mouse = new THREE.Vector2();

        // event.preventDefault();

        var rect = renderer.domElement.getBoundingClientRect();

        var clientX = event.clientX - rect.left;
        var clientY = event.clientY - rect.top;

        if ( clientX < 0 || event.clientX > ( renderer.domElement.clientWidth + rect.left ) )
            return;

        if ( clientY < 0 || event.clientY > ( renderer.domElement.clientHeight - rect.top ) )
            return;

        mouse.x = ( clientX / renderer.domElement.clientWidth ) * 2 - 1;
        mouse.y = - ( clientY / renderer.domElement.clientHeight ) * 2 + 1;

        raycaster.setFromCamera( mouse, camera );

        var intersects = raycaster.intersectObjects( scene.children, true ); 

        roverparts = ["Mastcam-Z", "SuperCam"]

        function global_area_clicked(){
            var e=document.createEvent('Event');
            e.initEvent("app-global-area-clicked", true, true);
            e.event = event;
            document.dispatchEvent(e);
        }

        if ( intersects.length > 0 ) {

            if (roverparts.indexOf(intersects[0].object.name) >= 0) {
                console.log("intersects", intersects[0].object.name)
                intersects[0].object.callback( "click" );
            }else {
                global_area_clicked();
            }


        } else {
            global_area_clicked();
        }

        
    }

    window.addEventListener( 'mousemove', onMouseMove, false );
    window.addEventListener( 'click', onClick, false );
    
        

 


} //init()

        

window.addEventListener('resize', () => {
    renderer.setSize(window.innerWidth,window.innerHeight);
    camera.aspect = window.innerWidth / window.innerHeight;

    // camera.updateProjectionMatrix();
})