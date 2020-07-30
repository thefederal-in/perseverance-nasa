var container, stats;
var camera, controls, scene, renderer, model, raycaster, mouse;
var loader, intersects,modelchildren = [];
var datapoints = [
    { "name": "Spacecraft", "position": { "x": 0.8, "y": 10, "z": 0.8 }, "camerapos": { "x": 3.772, "y": 16.64, "z": 6.577 }, "camerarot": { "x": -1.194, "y": 0.207, "z": 0.481 } },
    { "name": "Fairing", "position": { "x": 0.8, "y": 7, "z": 0.8 }, "camerapos": { "x": 1.188, "y": 13.32, "z": 4.604 }, "camerarot": { "x": -1.238, "y": 0.084, "z": 0.238 } },
    { "name": "Centaur upper stage", "position": { "x": -1, "y": 6, "z": 0.2 }, "camerapos": { "x": -5.770, "y": 10.60, "z": 4.168 }, "camerarot": { "x": -1.196, "y": -0.468, "z": -0.854 } },
    { "name": "RL-10-1 Engine", "position": { "x": -1, "y": 4, "z": 0  }, "camerapos": { "x": -6.228, "y": 7.526, "z": -1.478 }, "camerarot": { "x": -1.764, "y": -0.682, "z": -1.872 } },
    { "name": "Atlas V Booster", "position": { "x":-1, "y": 1.01, "z": 0 }, "camerapos": { "x": -3.319, "y": 1.894, "z": 6.176 }, "camerarot": { "x": -0.297, "y": -0.474, "z": -0.139 } },
    { "name": "Solid Rocket Booster", "position": { "x": -1, "y": -5, "z": 0.785 }, "camerapos": { "x": -11.384, "y": -5.384, "z": 2.114 }, "camerarot": { "x": 1.196, "y": -1.100, "z": 1.155 } },
    { "name": "RD-180 Engine", "position": { "x": 0, "y": -11, "z": 1 }, "camerapos": { "x": -2.663, "y": -16.983, "z": 6.234 }, "camerarot": { "x": 1.218, "y": -0.146, "z": 0.377 } },
]

// x: , y: , z: 
var instrumentdata = {
    "Spacecraft": {"subname":"Spacecraft", "desc":"The spacecraft is the protective \"spaceship\" that enables the precious cargo (that is, the Perseverance rover!) to travel between Earth and Mars. It is separate from the launch vehicle that carries the spacecraft and the rover outside of Earth's atmosphere and gravitational pull. The spacecraft includes the mechanical units that safely carry and maneuver the rover through the Martian atmosphere to a landing on Mars."},
    "Fairing": {"subname":"Payload Fairing", "desc":"The spacecraft rides into the sky inside a protective payload fairing atop the Centaur stage. With the payload fairing on top, the vehicle stands approximately 191 feet (58 meters) tall when it is ready for launch."},
    "Centaur upper stage": {"subname":"Fuel and oxidizer", "desc":"Fuel and oxidizer and the vehicle's \"brains\" fires twice, once to insert the vehicle-spacecraft stack into low Earth orbit and then again to accelerate the spacecraft out of Earth orbit and on its way towards Mars. Two interstage adaptors connect the first stage of the Atlas with its Centaur upper stage. The Centaur's has a restartable RL-10 engine from Pratt & Whitney Rocketdyne. This engine uses liquid hydrogen and liquid oxygen and can provide up to about 22,300 pounds (99,200 newtons) of thrust. The Centaur can control its orientation precisely, which is important for managing the direction of thrust while its engine is firing. It carries its own flight control computer and can release its payload with the desired attitude and spin rate."},
    "RL-10-1 Engine": {"subname":"Engine", "desc":"The RL10 is a liquid-fuel cryogenic rocket engine built in the United States by Aerojet Rocketdyne that burns cryogenic liquid hydrogen and liquid oxygen propellants. Modern versions produce up to 110 kN (24,729 lbf) of thrust per engine in vacuum. Three RL10 versions are still in production for the Centaur upper stage of the Atlas V and the DCSS of the Delta IV. "},
    "Atlas V Booster": {"subname":"common core booster", "desc":"Centerpiece of the first stage is the common core booster, 106.5 feet (32.46 meters) in length and 12.5 feet (3.81 meters) in diameter. It has a throttleable, RD-180 engine from a joint venture of Pratt & Whitney Rocketdyne, West Palm Beach, Fla., and NPO Energomash, Moscow. Thermally stable kerosene fuel (type RP-1) and liquid oxygen is loaded shortly before launch into cylindrical fuel tanks that make up about half of the total height of the vehicle. The common core booster can provide thrust of up to about 850,000 pounds (3.8 million newtons) at full throttle."},
    "Solid Rocket Booster": {"subname":"Solid Rocket Motors", "desc":"Four solid rocket boosters strapped onto the common core booster add to the thrust produced by the first stage. Each of these boosters is 64 feet (19.5 meters) long and 61 inches (155 centimeters) in diameter, and delivers about 306,000 pounds (1.36 million newtons) of thrust."},
    "RD-180 Engine": {"subname":"Engine", "desc":"The RD-180 is a rocket engine designed and built in Russia. It features a dual combustion chamber, dual-nozzle design and is fueled by a RP-1/LOX mixture. Currently, RD-180 engines are used for the first stage of the Atlas V launch vehicle."}
}

init();
// animate();

function init() {

    var scene = new THREE.Scene();

    camera = new THREE.PerspectiveCamera(75,window.innerWidth/window.innerHeight,0.1,1000)
        // camera.position.x = -3.38;
        // camera.position.y = 3;
        // camera.position.z = 2.30;
        camera.position.set(-9.22, 5.45, 17.2)
        // camera.rotation.set(-0.65, -0.82, -0.51)
        
        
    renderer = new THREE.WebGLRenderer({antialias: true, alpha:true});
    renderer.setSize(window.innerWidth,window.innerHeight);

    // set render auto clear false.
    renderer.autoClear = false;

    // initialize global configuration
    THREE.threeDataConfig = {renderer: renderer, camera: camera};


    document.body.appendChild(renderer.domElement);

    var axesHelper = new THREE.AxesHelper( 5 );
    scene.add( axesHelper );

    // var size = 10;
    // var divisions = 10;

    // var gridHelper = new THREE.GridHelper( size, divisions );
    // scene.add( gridHelper );

    // Load the 3D model
    loader = new THREE.GLTFLoader();
    loader.load('atlas.gltf', function(gltf){
        model = gltf.scene
        // model.position.set(0, -1, 0)
        model.scale.set(0.4, 0.4, 0.4)
        model.rotation.set(0, -30, 0)
        scene.add(model);
    });



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
            0.2, 32, 32, 0, 2 * Math.PI, 0,  Math.PI
        );

        var hot_spot = self.entities.hot_spot =  new THREE.Mesh( hotspot_geometry, new THREE.MeshBasicMaterial( {  color: 0xff0000  } ) );
        
        hot_spot.position.set( self.data.position.x, self.data.position.y, self.data.position.z );
    
        hot_spot.callback = function( action ) { self.callback(self, hot_spot, action); };

        hot_spot.name = self.data.name;
        
            
        var hot_spot_transparent = self.entities.hot_spot_transparent = new THREE.Mesh( hotspot_geometry, new THREE.MeshBasicMaterial( {  color: 0xff0000, transparent: true, opacity: 0.3 } ) );
        hot_spot_transparent.scale.set( 1.5, 1.5, 1.5 );
        hot_spot_transparent.position.set( self.data.position.x, self.data.position.y, self.data.position.z );
        hot_spot_transparent.visible = true
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

            console.log("hotpointhover", e);
            // var selectedHotspot = e.hotpoint.entities.hot_spot_transparent
            // selectedHotspot.visible = true
            // if ($('#main-column-container').hasClass('out'))
            //     return;

            // hot_point_name.hotpoint = e.hotpoint;
            // hot_point_name.style.display = "";

            // setHotPointNamePosition( e.hotpoint );
        });

        document.addEventListener("hotspot-out", function(e){

            console.log("hotpointout", e);
            // var selectedHotspot = e.hotpoint.entities.hot_spot_transparent
            // selectedHotspot.visible = false
            // let drawer = state.drawer;
            // let camera = drawer.getCamera();
            // let ipm = state.inputmanager;
            // let canvas = drawer.getRenderer().domElement;

            // let hotpoint = e.hotpoint;

            // let entity = hotpoint.entities.red_dot_transparent;

            // hot_point_name.style.display = "none";
            // hot_point_name.hotpoint = null;
        });

        document.addEventListener("hotspot-clicked", function(e){
            console.log("Trigger camera animation", e.hotpoint)
            controls.enabled = false;
            var hotpoint_pos = e.hotpoint.data.camerapos
            var hotpoint_rot = e.hotpoint.data.camerarot

            controls.maxPolarAngle = Math.PI/2; 
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
            
        });
    

    // // console.log(scene)

    // // raycaster = new THREE.Raycaster();
    // // mouse = new THREE.Vector2();

    //add a light
    function addLight(source, xpos, ypos, zpos) {
        var light = source;
        light.position.x = xpos;
        light.position.y = ypos;
        light.position.z = zpos;
        scene.add(light);
    }




    // using reusable function addLight(source, xpos, ypos, zpos) 
    addLight(new THREE.PointLight(0xFFFFFF, 1, 500), -20.429, 3.363, -22.666);
    addLight(new THREE.PointLight(0xFFFFFF, 0.4, 500), -8.801, 34.722, -11.382);
    addLight(new THREE.PointLight(0xFFFFFF, 1, 500), -0.409, 40.470, 23.343);
    addLight(new THREE.PointLight(0xFFFFFF, 1, 500), -13.785, -17.626, 12.763);
    addLight(new THREE.DirectionalLight(0xFFFFFF, 1, 500), 33.947, -0.972, -8.920);

    var controls = new THREE.OrbitControls(camera);
    controls.enableDamping = true;
    // controls.maxPolarAngle = Math.PI/2;
    controls.enableDamping = true;
    // controls.maxPolarAngle = Math.PI/2;
    // controls.minDistance = 200;
    // controls.maxDistance = 200;
    
    if ($(window).width() < 756) {
        controls.enableZoom = false;
     }
     else {
        controls.enableZoom = true;
     }

    function zoomModel(isZoomOut, scale) {
        if(isZoomOut){
            controls.dollyIn(scale);
        }else{
            controls.dollyOut(scale);
        }
      }

    function onZoomIn() {
        // alert("test")
        controls.zoomIn();
    
    }
    function onZoomOut() {
        // alert("test")
        controls.zoomOut();
    
    }

    var zoomIn = document.getElementById( 'zoom-in' );
	var zoomOut = document.getElementById( 'zoom-out' );
		
    zoomIn.addEventListener( 'click', onZoomIn, false );
    zoomOut.addEventListener( 'click', onZoomOut, false );


    var render = function(){

        requestAnimationFrame(render);
        renderer.render(scene, camera)

    }
    
    render()

    var pickPointObject = null;
    
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
        

        roverparts = ["Spacecraft", "Fairing", "Centaur upper stage", "RL-10-1 Engine", "Atlas V Booster", "Solid Rocket Booster", "RD-180 Engine"]

        if ( intersects.length > 0 ) {
            // console.log("intersects", event)
            
            
            if (roverparts.indexOf(intersects[0].object.name) >= 0) {

                intersects[0].object.callback( "hover" );   

            }else{
            //    console.log("Other elements", intersects[0].object)
            }

            

        }else{
            // console.log("No elements touched")
        }
    }
    
    
    function onClick( event ) {

        var raycaster = new THREE.Raycaster();
        var mouse = new THREE.Vector2();

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

        roverparts = ["Spacecraft", "Fairing", "Centaur upper stage", "RL-10-1 Engine", "Atlas V Booster", "Solid Rocket Booster", "RD-180 Engine"]

        function global_area_clicked(){
            var e=document.createEvent('Event');
            e.initEvent("app-global-area-clicked", true, true);
            e.event = event;
            document.dispatchEvent(e);
        }

        if ( intersects.length > 0 ) {

            if (roverparts.indexOf(intersects[0].object.name) >= 0) {
                console.log("intersects", intersects[0].object.name)
                var selectobj = intersects[0].object.name
                document.getElementById("Objectname").innerHTML = "<h3>"+selectobj+"</h3>"
                // document.getElementById("Objectname").innerHTML += "<p>"+instrumentdata[selectobj]['subname']+"</p>"
                document.getElementById("Objectname").innerHTML += "<p>"+instrumentdata[selectobj]['desc']+"</p>"
                console.log("intersects", intersects[0].object.material.color)
                $('.model3dbox').css('display', 'block');
                $('.model3dbox').addClass('animate__fadeInLeft');
                $('.model3dbox').removeClass('animate__fadeOutLeft');
                // $('.label').removeClass('animate__fadeOutRight');
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
    
    $('.close3dmodel').on("click", function(){
        // $('.model3dbox').css('display', 'block');
        // alert("test")
        $('.model3dbox').removeClass('animate__fadeInLeft');
        $('.model3dbox').addClass('animate__fadeOutLeft');
        controls.enabled = false;
        gsap.to( camera.position, {
            duration: 1,
            x: -1.98,
            y: 1.17,
            z: 3.71,
            onUpdate: () => {
                controls.enabled = false;
            },
            onComplete: () => {
                controls.enabled = true;
                
            }
        } );
        
        gsap.to( camera.rotation, {
            duration: 1,
            x: -0.30,
            y: -0.47,
            z: -0.14,
            onUpdate: () => {
                controls.enabled = false;
            },
            onComplete: () => {
                controls.enabled = true;
                
            }
        } );
        
    })
    $('#resetCam').on("click", function(){
        controls.enabled = false;
        gsap.to( camera.position, {
            duration: 1,
            x: -9.22,
            y: 5.45,
            z: 17.2,
            onUpdate: () => {
                controls.enabled = false;
            },
            onComplete: () => {
                controls.enabled = true;
                
            }
        } );
        gsap.to( camera.rotation, {
            duration: 1,
            x: -0.30,
            y: -0.47,
            z: -0.14,
            onUpdate: () => {
                controls.enabled = false;
            },
            onComplete: () => {
                controls.enabled = true;
                
            }
        } );
        
    })

    $('body').on("click", function(){
        $('.warningicon3d').fadeOut( "slow" );
    })
    
 


} //init()

        

window.addEventListener('resize', () => {
    renderer.setSize(window.innerWidth,window.innerHeight);
    camera.aspect = window.innerWidth / window.innerHeight;

    // camera.updateProjectionMatrix();
})