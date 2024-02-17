import "@babylonjs/core/Debug/debugLayer";
import "@babylonjs/inspector";
import {
    Engine,
    Scene,
    ArcRotateCamera,
    Vector3,
    HemisphericLight,
    MeshBuilder,
    Color3,
    StandardMaterial,
    TransformNode
} from "@babylonjs/core";

class App {
    constructor() {
        // Create the canvas HTML element and attach it to the webpage
        const canvas = document.createElement("canvas");
        canvas.style.width = "100%";
        canvas.style.height = "100%";
        canvas.id = "gameCanvas";
        document.body.appendChild(canvas);

        // Initialize Babylon scene and engine
        const engine = new Engine(canvas, true);
        const scene = new Scene(engine);

        // Parameters for an isometric view
        const alpha = -Math.PI / 4; // 45 degrees rotation around the Y axis
        const beta = Math.atan(Math.sqrt(2)); // Elevation angle
        const radius = 20; // Distance from the object

        const camera = new ArcRotateCamera("Camera", alpha, beta, radius, Vector3.Zero(), scene);
        camera.attachControl(canvas, true);

        // Set camera limits to prevent it from moving from the isometric view
        camera.lowerAlphaLimit = alpha;
        camera.upperAlphaLimit = alpha;
        camera.lowerBetaLimit = beta;
        camera.upperBetaLimit = beta;
        camera.lowerRadiusLimit = radius;
        camera.upperRadiusLimit = radius;
        camera.panningSensibility = 0;

        const light = new HemisphericLight("light", new Vector3(1, 1, 0), scene);
        light.intensity = 0.7;

        // Create a tile (cube) with a random color or white for corners
        const createTile = (name: string, width: number, height: number, depth: number, position: Vector3, rotation: number, scene: Scene, isCorner: boolean) => {
            const color = isCorner ? Color3.White() : Color3.Random();
            const tileMaterial = new StandardMaterial("tileMaterial", scene);
            tileMaterial.diffuseColor = color;

            const tile = MeshBuilder.CreateBox(name, { width, height, depth }, scene);
            tile.position = position;
            tile.rotation.y = rotation; // Rotate tiles to face the center
            tile.material = tileMaterial;
            return tile;
        };

        // Function to create the Monopoly-like board
const createBoard = (scene: Scene, numTilesPerSide: number, tileSize: number) => {
    const board = new TransformNode("board", scene);

    // Constants for tile sizes and positions
    const TILE_HEIGHT = 0.1; // Adjust as needed
    const HALF_TILE_SIZE = tileSize / 2;

    // Create corner tiles
    const createCornerTiles = () => {
        const positions = [
            new Vector3(-HALF_TILE_SIZE * (numTilesPerSide - 1), 0, HALF_TILE_SIZE * (numTilesPerSide - 1)),
            new Vector3(HALF_TILE_SIZE * (numTilesPerSide - 1), 0, HALF_TILE_SIZE * (numTilesPerSide - 1)),
            new Vector3(-HALF_TILE_SIZE * (numTilesPerSide - 1), 0, -HALF_TILE_SIZE * (numTilesPerSide - 1)),
            new Vector3(HALF_TILE_SIZE * (numTilesPerSide - 1), 0, -HALF_TILE_SIZE * (numTilesPerSide - 1))
        ];
        positions.forEach((position, index) => {
            createTile(`cornerTile${index + 1}`, tileSize, TILE_HEIGHT, tileSize, position, 0, scene, true).parent = board;
        });
    };

    // Create edge tiles
    const createEdgeTiles = () => {
        for (let i = 1; i < numTilesPerSide - 1; i++) {
            const offset = HALF_TILE_SIZE * (numTilesPerSide - 1) - tileSize * i;
            // Top edge
            createTile(`edgeTileTop${i}`, tileSize, TILE_HEIGHT, tileSize, new Vector3(-offset, 0, HALF_TILE_SIZE * (numTilesPerSide - 1)), 0, scene, false).parent = board;
            // Bottom edge
            createTile(`edgeTileBottom${i}`, tileSize, TILE_HEIGHT, tileSize, new Vector3(offset, 0, -HALF_TILE_SIZE * (numTilesPerSide - 1)), 0, scene, false).parent = board;
            // Left edge
            createTile(`edgeTileLeft${i}`, tileSize, TILE_HEIGHT, tileSize, new Vector3(-HALF_TILE_SIZE * (numTilesPerSide - 1), 0, offset), 0, scene, false).parent = board;
            // Right edge
            createTile(`edgeTileRight${i}`, tileSize, TILE_HEIGHT, tileSize, new Vector3(HALF_TILE_SIZE * (numTilesPerSide - 1), 0, -offset), 0, scene, false).parent = board;
        }
    };

    createCornerTiles();
    createEdgeTiles();

    return board;
};


        // Create the Monopoly-like board with 11 tiles per side and tile size 1
        const board = createBoard(scene, 11, 1);

        // Hide/show the Inspector
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

        // Run the main render loop
        engine.runRenderLoop(() => {
            scene.render();
        });

        // Handle browser resizing
        window.addEventListener("resize", () => {
            engine.resize();
        });
    }
}

new App();
