var container, stats;
var camera, controls, scene, renderer, model, raycaster, mouse;
var loader, intersects,modelchildren = [];
var datapoints = [{"name":"Mastcam-Z", "position":{"x":-0.834,"y":1,"z":0.785}, "camerapos":{ "x": -1.4448278530518521, "y": 1.0025775380665005, "z": 2.1155599850918647}, "camerarot":{"x": -0.44, "y": -0.55, "z": -0.24}},{"name":"SuperCam", "position":{"x":-0.276,"y":1.132,"z":0.766}, "camerapos":{"x": -0.83, "y": 1.27, "z": 2.47}, "camerarot":{"x": -0.47, "y": -0.29, "z": -0.14}}]

var instrumentdata = {
    "Mastcam-Z": {"subname":"Zoomable Panoramic Cameras", "desc":"The Mastcam-Z is the name of the mast-mounted camera system that is equipped with a zoom function on the Perseverance rover. Mastcam-Z has cameras that can zoom in, focus, and take 3D pictures and video at high speed to allow detailed examination of distant objects."},
    "SuperCam": {"subname":"Laser Micro-Imager", "desc":"The SuperCam on the Perseverance rover examines rocks and soils with a camera, laser and spectrometers to seek organic compounds that could be related to past life on Mars. It can identify the chemical and mineral makeup of targets as small as a pencil point from a distance of more than 20 feet (7 meters)."},
    "Meda": {"subname":"Weather Station", "desc":"The Mars Environmental Dynamics Analyzer is known as MEDA. It makes weather measurements including wind speed and direction, temperature and humidity, and also measures the amount and size of dust particles in the Martian atmosphere."},
    "Rimfax": {"subname":"Subsurface Radar", "desc":"The Radar Imager for Mars' Subsurface Experiment, known as RIMFAX, uses radar waves to probe the ground under the rover."},
    "Moxie": {"subname":"Produces Oxygen from Martian CO2", "desc":"The Mars Oxygen In-Situ Resource Utilization Experiment is better known as MOXIE. NASA is preparing for human exploration of Mars, and MOXIE will demonstrate a way that future explorers might produce oxygen from the Martian atmosphere for propellant and for breathing."},
    "Sherloc": {"subname":"Ultraviolet Spectrometer/ Watson (camera)", "desc":"The Scanning Habitable Environments with Raman & Luminescence for Organics & Chemicals has a nickname: SHERLOC. Mounted on the rover's robotic arm, SHERLOC uses spectrometers, a laser and a camera to search for organics and minerals that have been altered by watery environments and may be signs of past microbial life."},
    "PIXL": {"subname":"X-ray Spectrometer", "desc":"The Planetary Instrument for X-ray Lithochemistry is called PIXL. PIXL has a tool called an X-ray spectrometer. It identifies chemical elements at a tiny scale. PIXL also has a camera that takes super close-up pictures of rock and soil textures. It can see features as small as a grain of salt! Together, this information helps scientists look for signs of past microbial life on Mars."}
}

init();
// animate();

function init() {

    var scene = new THREE.Scene();

    camera = new THREE.PerspectiveCamera(75,window.innerWidth/window.innerHeight,0.1,1000)
        // camera.position.x = -3.38;
        // camera.position.y = 3;
        // camera.position.z = 2.30;
        camera.position.set(-1.98, 1.17, 3.71)
        // camera.rotation.set(-0.65, -0.82, -0.51)
        
        
    renderer = new THREE.WebGLRenderer({antialias: true, alpha:true});
    renderer.setSize(window.innerWidth,window.innerHeight);

    // set render auto clear false.
    renderer.autoClear = false;

    // initialize global configuration
    THREE.threeDataConfig = {renderer: renderer, camera: camera};


    document.body.appendChild(renderer.domElement);

    // var axesHelper = new THREE.AxesHelper( 5 );
    // scene.add( axesHelper );

    // var size = 10;
    // var divisions = 10;

    // var gridHelper = new THREE.GridHelper( size, divisions );
    // scene.add( gridHelper );

    // Load the 3D model
    loader = new THREE.GLTFLoader();
    loader.load('perseverance.gltf', function(gltf){
        model = gltf.scene
        model.position.set(0, -1, 0)
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
            0.04, 32, 32, 0, 2 * Math.PI, 0,  Math.PI
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
    controls.enableDamping = true;
    controls.maxPolarAngle = Math.PI/2;
    controls.minDistance = 2;
    controls.maxDistance = 6;
    
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
        

        roverparts = ["Mastcam-Z", "SuperCam"]

        if ( intersects.length > 0 ) {
            console.log("intersects", event)
            
            
            if (roverparts.indexOf(intersects[0].object.name) >= 0) {

                intersects[0].object.callback( "hover" );   

            }else{
               console.log("Other elements", intersects[0].object)
            }

            

        }else{
            console.log("No elements touched")
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

        roverparts = ["Mastcam-Z", "SuperCam"]

        function global_area_clicked(){
            var e=document.createEvent('Event');
            e.initEvent("app-global-area-clicked", true, true);
            e.event = event;
            document.dispatchEvent(e);
        }

   
            $('.warningicon3d').fadeOut( "slow" );

        if ( intersects.length > 0 ) {

            if (roverparts.indexOf(intersects[0].object.name) >= 0) {
                console.log("intersects", intersects[0].object.name)
                var selectobj = intersects[0].object.name
                document.getElementById("Objectname").innerHTML = "<h3>"+selectobj+"</h3>"
                document.getElementById("Objectname").innerHTML += "<p>"+instrumentdata[selectobj]['subname']+"</p>"
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
    
 


} //init()






document.addEventListener('touchmove', function (event) {
    if (event.scale !== 1) { event.preventDefault(); }
  }, { passive: false });
        

window.addEventListener('resize', () => {
    renderer.setSize(window.innerWidth,window.innerHeight);
    camera.aspect = window.innerWidth / window.innerHeight;

    // camera.updateProjectionMatrix();
})