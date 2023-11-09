import * as THREE from 'three'
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";


const gltfLoader = new GLTFLoader();
export function convertCanvasAxes2GlAxes(x: number, y: number, canvas: HTMLCanvasElement): THREE.Vector2 {
    const vector = new THREE.Vector2()
    const {clientWidth : width,clientHeight : height} = canvas
    vector.set(
        x / width * 2 - 1,
        -y / height * 2 + 1
    )
    return vector
}


export class Stage extends THREE.EventDispatcher{
    public camera: THREE.PerspectiveCamera;
    public scene:THREE.Scene
    public renderer:THREE.WebGLRenderer
    public control: OrbitControls;
    public cabinets: THREE.Mesh[]
    public maps: Map<string,THREE.Texture>
    private readonly modelPath: string;

    constructor(canvasEle: HTMLCanvasElement,enableOutlinePass=false) {
        super()
        canvasEle.height = canvasEle.clientHeight
        canvasEle.width = canvasEle.clientWidth
        this.scene = new THREE.Scene()
        this.scene.background = new THREE.Color(0x00FFFF)
        this.renderer = new THREE.WebGLRenderer({canvas:canvasEle,antialias:true})
        // 开启高清
        this.renderer.setSize(canvasEle.clientHeight*devicePixelRatio,canvasEle.clientHeight*devicePixelRatio,false)
        this.camera = new THREE.PerspectiveCamera(45,canvasEle.clientWidth/canvasEle.clientHeight,0.1,1000)
        this.camera.position.set(0, 10, 15);
        this.camera.lookAt(0, 0, 0);
        this.control = new OrbitControls(this.camera,this.renderer.domElement)
        this.modelPath = 'https://ycyy-cdn.oss-cn-beijing.aliyuncs.com/'
        this.maps = new Map()
        this.cabinets = []
        this.crtTexture("cabinet-hover.jpg");
    }

    render(){
        this.renderer.render(this.scene,this.camera)
        requestAnimationFrame(() =>this.render())
    }

    loadGLTF(modelName: string) {
        gltfLoader.load(this.modelPath + modelName, ({ scene: { children } }) => {
            children.forEach((obj: THREE.Mesh) => {
                const { map, color } = obj.material as THREE.MeshStandardMaterial;
                this.changeMat(obj, map, color);
                if (obj.name.includes("cabinet")) {
                    this.cabinets.push(obj);
                }
            });
            this.scene.add(...children);
        });
    }

    changeMat(obj:THREE.Mesh,map:THREE.Texture,color:THREE.Color){
        if (map) {
            obj.material = new THREE.MeshBasicMaterial({
                map: this.crtTexture(map.name),
            });
        } else {
            obj.material = new THREE.MeshBasicMaterial({ color });
        }
    }

    crtTexture(imgName: string) {
        let curTexture = this.maps.get(imgName);
        if (!curTexture) {
            curTexture = new THREE.TextureLoader().load(this.modelPath + imgName);
            curTexture.flipY = false;
            curTexture.wrapS = 1000;
            curTexture.wrapT = 1000;
            this.maps.set(imgName, curTexture);
        }
        return curTexture;
    }
}