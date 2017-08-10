import React, { Component} from 'react';
import {Scene} from 'react-babylonjs';
import {SceneLoader, ShaderMaterial, HemisphericLight, PointLight, Vector3, Color3, PhysicsEngine, OimoJSPlugin,
    StandardMaterial, Mesh, CubeTexture, ArcRotateCamera, Texture, Engine } from 'babylonjs';


export default class App extends Component {
     constructor (props) {
        super(props);

        this.scene = undefined;
        this.engine = undefined;
        this.onSceneMount = this.onSceneMount.bind(this);
        this.onMeshPicked = this.onMeshPicked.bind(this);
        this.initEnvironment = this.initEnvironment.bind(this)
        this.getIDFromMesh = this.getIDFromMesh.bind(this);
        this.moveRobber = this.moveRobber.bind(this);
        this.placeRoad = this.placeRoad.bind(this);
        this.placeHouseAndCity = this.placeHouseAndCity.bind(this);
        this.showPossibleRoadAndHousePlacement = this.showPossibleRoadAndHousePlacement.bind(this);

        this.player1 = 1;
        this.player2 = 2;
        this.player3 = 3;
        this.player3 = 4;



     }

    
    onMeshPicked(mesh, scene) {
        // This will be called when a mesh is picked in the canvas
       
        if(mesh != null){
            
            //TODO: Put code into a condition and will be use to put materials on roads and houses/cities. 
            //Material color will be dependent on whose turn it is.
            var mat = new StandardMaterial("Color", scene);

            //Red
            //mat.diffuseColor = new Color3(1, 0, 0);

            //Yellow
            //mat.diffuseColor = new Color3(1, 1, 0);

            //blue
            mat.diffuseColor = new Color3(0, 0, 1);


            //Makes a house appear when click makes a city appear when click twice
            if (mesh.name.includes('House')){             
               this.placeHouseAndCity(mesh, mat, scene);    
               this.showPossibleRoadAndHousePlacement(mesh);
 
            }

            if (mesh.name.includes('Road')){
                this.placeRoad(mesh, mat);
                this.showPossibleRoadAndHousePlacement(mesh);


            }

            //Move the robber on a resource tile
            if(mesh.name.includes('Rock') || mesh.name.includes('Hay') || 
               mesh.name.includes('Brick') || mesh.name.includes('Sheep') || 
               mesh.name.includes('Tree')) {
                this.moveRobber(mesh, scene);
            }

          

        }
       
        
    }

    placeHouseAndCity(mesh, mat, scene){
        mesh.material = mat;             
        if(mesh.visibility > 0) {
            var city = 'City' + this.getIDFromMesh(mesh.name);
            var city = scene.getMeshByID(city);  
            city.material = mat;   
            city.visibility = 1;
        } 
            mesh.visibility = 1;  

    }

    moveRobber(mesh, scene) {
        var robber = scene.getMeshByID('Robber'); 
        robber.position.x = mesh.position.x;
        robber.position.z = mesh.position.z;
    }

    placeRoad(mesh, mat) {
        mesh.visibility = 1;   
        mesh.material = mat;
    }

    showPossibleRoadAndHousePlacement(mesh){
        mesh.visibility = 0.5;
    }

    getIDFromMesh(name){
        return name.slice(-2);
    }


    
    onSceneMount(e) {
        const { canvas, scene, engine} = e;   
        this.scene = scene;   
        this.engine = engine;
        console.log('Engine is: ' + this.engine);
        this.initEnvironment(canvas, scene);
        SceneLoader.ImportMesh("", "", "boardTemplate.babylon", scene, function (newMeshes) {       
            for(var mesh of newMeshes) {
                mesh.convertToFlatShadedMesh();
                if(mesh.name.includes('City') || mesh.name.includes('House') || mesh.name.includes('Road')) {       
                    mesh.visibility = 0.0;                                
                } 
            }              
        });
       

        engine.runRenderLoop(() => {
            if (scene) {
                scene.render();
            }
        });

    
    }

    initEnvironment(canvas, scene) {
        
        var light = new HemisphericLight('hemi', new Vector3(0, 1, 0), scene);
        light.intensity = 1.35;
       

        var camera = new ArcRotateCamera('Camera', 0, 1.05, 20, Vector3.Zero(), scene)
        camera.lowerRadiusLimit = 10
        camera.upperRadiusLimit = 35
        camera.upperBetaLimit = Math.PI / 2
        camera.attachControl(canvas, false)
        

        scene.registerBeforeRender(function () {
                light.position = camera.position;
        });

      
    }

     render() {
         return (
             <div>
                 <Scene              
                    onSceneMount={this.onSceneMount} 
                    onMeshPicked={this.onMeshPicked}
                    visible={true} />    
             </div>
         )
     }
}