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

     }

    
    onMeshPicked(mesh, scene) {
        // This will be called when a mesh is picked in the canvas
        console.log(mesh.name);
        var redMat = new StandardMaterial("floor", scene);
        redMat.diffuseColor = new Color3(1, 0, 0);
        //redMat.specularColor = new Color3(1, 0, 0);
        redMat.emissiveColor = Color3.Red();
        if (mesh != null && mesh.name.includes('House')){             
            mesh.material = redMat;             
            if(mesh.visibility > 0) {
                var city = 'City' + this.getIDFromMesh(mesh.name);
                
                var garage = scene.getMeshByID(city);  
                garage.material = redMat;   
                garage.visibility = 1;
            } 
                 mesh.visibility = 1;           
        }
        if (mesh != null && mesh.name.includes('Road')){
            mesh.visibility = 1;   
            mesh.material = redMat;

        }  

        
    }
    
    getIDFromMesh(name){
        return name.slice(-2);
    }
    
    onSceneMount(e) {
        const { canvas, scene, engine} = e;   
        this.scene = scene;   
        this.engine = engine;
        this.initEnvironment(canvas, scene);
        SceneLoader.ImportMesh("", "", "boardTemplate.babylon", scene, function (newMeshes) {
          
            var garage;
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