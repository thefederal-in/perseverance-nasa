var container, stats;
var camera, controls, scene, renderer, model, raycaster, mouse;
var loader, intersects,modelchildren = [];
// -0.834, 1.985, 0.785
var datapoints = [{"tag":"pilot-hotpoint","name":"Mastcam-Z","position":{"x":-0.834,"y":1.985,"z":0.785},"line-length":350,"link":"app/hotpoints/hotpoint_crew.html","text":"Loading info ...","image":"app/img/hotpoints/CREW.png","image-scale":150},{"tag":"pilot-hotpoint","name":"SuperCam","position":{"x":-0.276,"y":2.132,"z":0.766},"line-length":350,"link":"app/hotpoints/hotpoint_b767-200er_seating.html","text":"Loading info ...","image":"app/img/hotpoints/SEATING.png","image-scale":150}]
// var datapoints = [{"tag":"pilot-hotpoint","name":"Crew","position":{"x":-0.834,"y":1.985,"z":0.785},"line-length":350,"link":"app/hotpoints/hotpoint_crew.html","text":"Loading info ...","image":"app/img/hotpoints/CREW.png","image-scale":150},{"tag":"pilot-hotpoint","name":"Seat Specifications","position":{"x":-110,"y":200,"z":400},"line-length":350,"link":"app/hotpoints/hotpoint_b767-200er_seating.html","text":"Loading info ...","image":"app/img/hotpoints/SEATING.png","image-scale":150},{"tag":"engine-hotpoint","name":"Aircraft Specifications","position":{"x":-370,"y":100,"z":290},"line-length":350,"link":"app/hotpoints/hotpoint_b767-200er_fuel.html","text":"Loading info ...","image":"app/img/hotpoints/FUEL.png","image-scale":150},{"tag":"body-hotpoint","name":"Interior Specifications","position":{"x":-110,"y":210,"z":175},"line-length":350,"link":"app/hotpoints/hotpoint_b767-200er_inflight.html","text":"Loading info ...","image":"app/img/hotpoints/INFLIGHT.png","image-scale":150},{"tag":"tail-hotpoint","name":"Branding and Livery","position":{"x":-40,"y":375,"z":-689},"line-length":350,"link":"app/hotpoints/hotpoint_tail.html","text":"Loading info ...","image":"app/img/hotpoints/ACMI.png","image-scale":150},{"tag":"cargo-hotpoint","name":"Cargo","position":{"x":-120,"y":180,"z":-300},"line-length":350,"link":"app/hotpoints/hotpoint_b767-200er_cargo.html","text":"Loading info ...","image":"app/img/hotpoints/CARGO.png","image-scale":150}]


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



    var Hotpoint = function ( hotpoint_data ) {
        "use strict";
    
        var self = this;
    
        self.callback = function(_this, sprite, action){};
    
        self.data = hotpoint_data;
    
        self.sprite = null;
    
        self.group = new THREE.Group();
    
        self.entities = {
        };
    
        self.makeVisible = function( b ){

            self.entities.red_dot_transparent.visible = !b;
        };
    
        // --------------------------------
    
        var red_dot_geometry_data = {
                radius : 0.04,
                widthSegments : 32,
                heightSegments : 32,
                phiStart : 0,
                phiLength : 2 * Math.PI,
                thetaStart : 0,
                thetaLength : Math.PI
        };
        var red_dot_geometry = new THREE.SphereGeometry( 
            red_dot_geometry_data.radius, 
            red_dot_geometry_data.widthSegments, 
            red_dot_geometry_data.heightSegments, 
            red_dot_geometry_data.phiStart, 
            red_dot_geometry_data.phiLength, 
            red_dot_geometry_data.thetaStart,
            red_dot_geometry_data.thetaLength
        );
        var red_dot = self.entities.red_dot =  new THREE.Mesh( red_dot_geometry, new THREE.MeshBasicMaterial( { 
            color: 0xff0000//,
            //transparent: true,
            //opacity: 0.5 
        } ) );
        red_dot.position.set( self.data.position.x, self.data.position.y, self.data.position.z );
    
        red_dot.callback = function( action ) {
            self.callback(self, red_dot, action);
        };

        // red_dot.name = "red_dot" + self.data.name;
        red_dot.name = self.data.name;
        
        red_dot.old_raycast = red_dot.raycast;
    
        red_dot.raycast = function( raycaster, intersects ){
    
            red_dot.scale.set( 4, 4, 4 );
    
            red_dot.updateMatrixWorld();
    
            var return_value = red_dot.old_raycast(raycaster, intersects );
    
            red_dot.scale.set( 1, 1, 1 );
    
            red_dot.updateMatrixWorld();
    
            return return_value;
        };
    
        var red_dot_transparent = self.entities.red_dot_transparent = new THREE.Mesh( red_dot_geometry, new THREE.MeshBasicMaterial( { 
            color: 0xff0000,
            transparent: true,
            opacity: 0.3 
        } ) );
        red_dot_transparent.scale.set( 1, 1, 1 );
        red_dot_transparent.position.set( self.data.position.x, self.data.position.y, self.data.position.z );
        red_dot_transparent.raycast = function(){};
    
    
        self.group.add(red_dot);
        self.group.add(red_dot_transparent);
    
        return this;
    };

    var hotpoints = datapoints

    var hotpoints_objects_array = [];
    
    hotpoints.forEach( function(currentValue, index, array) {
        // console.log("hotpoints", currentValue)
        var hotPoint = new Hotpoint( currentValue, index, array  );

        scene.add( hotPoint.group );

        hotpoints_objects_array.push(hotPoint);

        hotPoint.callback = function(_this, sprite, action){

            var e;
            if (action === "click"){
                e = document.createEvent('Event');
                e.initEvent("app-hotpoint-clicked", true, true);
                e.hotpoint =_this;
                document.dispatchEvent(e);
            }
            else if (action === "hover"){
                e = document.createEvent('Event');
                e.initEvent("app-hotpoint-hover", true, true);
                e.hotpoint =_this;
                document.dispatchEvent(e);
            }
            else if (action === "focus"){
                e = document.createEvent('Event');
                e.initEvent("app-hotpoint-clicked", true, true);
                e.hotpoint =_this;
                document.dispatchEvent(e);
            } 
            else if (action === "out"){
                e = document.createEvent('Event');
                e.initEvent("app-hotpoint-out", true, true);
                e.hotpoint =_this;
                document.dispatchEvent(e);
            }
            else if (action === "blur"){
                e = document.createEvent('Event');
                e.initEvent("app-hotpoint-clicked", true, true);
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

        document.addEventListener("app-hotpoint-hover", function(e){

            if ($('#main-column-container').hasClass('out'))
                return;

            hot_point_name.hotpoint = e.hotpoint;
            hot_point_name.style.display = "";

            setHotPointNamePosition( e.hotpoint );
        });

        document.addEventListener("app-hotpoint-out", function(e){

            let drawer = state.drawer;
            let camera = drawer.getCamera();
            let ipm = state.inputmanager;
            let canvas = drawer.getRenderer().domElement;

            let hotpoint = e.hotpoint;

            let entity = hotpoint.entities.red_dot_transparent;

            hot_point_name.style.display = "none";
            hot_point_name.hotpoint = null;
        });

        document.addEventListener("app-hotpoint-clicked", function(e){

            console.log("Trigger camera animation")
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

    camera.updateProjectionMatrix();
})