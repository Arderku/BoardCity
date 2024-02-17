import "@babylonjs/core/Debug/debugLayer";
import "@babylonjs/inspector";
import { Engine, Scene, ArcRotateCamera, Vector3, HemisphericLight, Mesh, MeshBuilder } from "@babylonjs/core";

class App {
    constructor() {
        // create the canvas html element and attach it to the webpage
        var canvas = document.createElement("canvas");
        canvas.style.width = "100%";
        canvas.style.height = "100%";
        canvas.id = "gameCanvas";
        document.body.appendChild(canvas);

        // initialize babylon scene and engine
        var engine = new Engine(canvas, true);
        var scene = new Scene(engine);

         // Parameters for an isometric view
         const alpha = -Math.PI / 4; // 45 degrees rotation around the Y axis
         const beta = Math.atan(Math.sqrt(2)); // Elevation angle
         const radius = 10; // Distance from the object

        var camera = new ArcRotateCamera("Camera", alpha, beta, radius, new Vector3(0, 0, 0), scene);
        camera.attachControl(canvas, true);

        // Set camera limits to prevent it from moving from the isometric view
        camera.lowerAlphaLimit = alpha;
        camera.upperAlphaLimit = alpha;
        camera.lowerBetaLimit = beta;
        camera.upperBetaLimit = beta;
        camera.lowerRadiusLimit = radius;
        camera.upperRadiusLimit = radius;
        camera.panningSensibility = 0;
        
        var light: HemisphericLight = new HemisphericLight("light", new Vector3(1, 1, 0), scene);
        
        light.intensity = 0.7;

        
        var sphere: Mesh = MeshBuilder.CreateSphere("sphere", { diameter: 1 }, scene);

        sphere.position.y = 1;

        var ground = MeshBuilder.CreateGround("ground", {width: 6, height: 6}, scene);

        // hide/show the Inspector
        window.addEventListener("keydown", (ev) => {
            // Shift+Ctrl+Alt+I
            if (ev.shiftKey && ev.ctrlKey && ev.altKey && ev.keyCode === 73) {
                if (scene.debugLayer.isVisible()) {
                    scene.debugLayer.hide();
                } else {
                    scene.debugLayer.show();
                }
            }
        });

        // run the main render loop
        engine.runRenderLoop(() => {
            scene.render();
        });

        window.addEventListener("resize", function () {
            engine.resize();
        });
    }
}
new App();