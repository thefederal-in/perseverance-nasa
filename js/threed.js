var container, stats;
var camera, controls, scene, renderer, model, raycaster, mouse;
var loader, modelchildren = [];


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

    document.body.appendChild(renderer.domElement);

    //Load the 3D model
    loader = new THREE.GLTFLoader();
    loader.load('perseverance.gltf', function(gltf){
        model = gltf.scene

        modelchildren.push(model.children[0].children)
        // console.log()
        scene.add(model);
    });
    console.log(modelchildren)
    raycaster = new THREE.Raycaster();
    mouse = new THREE.Vector2();

    //add a light
    function addLight(source, xpos, ypos, zpos) {
        var light = source;
        light.position.x = xpos;
        light.position.y = ypos;
        light.position.z = zpos;
        scene.add(light);
    }

    

    function onMouseMove(event){
        event.preventDefault();

        mouse.x = ( event.clientX / window.innerWidth ) * 2 - 1;
        mouse.y = ( event.clientY / window.innerHeight ) * 2 + 1;

        raycaster.setFromCamera(mouse, camera)
        var intersects = raycaster.intersectObjects(modelchildren, true);


        for (var i = 0; i < intersects.length; i++) {
            console.log(intersects[i])
        }

        console.log("hover works", intersects);

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


    window.addEventListener("mousemove", onMouseMove);
        

 


} //init()

        

window.addEventListener('resize', () => {
    renderer.setSize(window.innerWidth,window.innerHeight);
    camera.aspect = window.innerWidth / window.innerHeight;

    camera.updateProjectionMatrix();
})