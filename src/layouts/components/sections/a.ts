import throttle from 'lodash.throttle';
import * as THREE from 'three';
import { gsap } from 'gsap';
const lerp = (a: number, b: number, n: number) => (1 - n) * a + n * b;

type Mouse = {
    x: number;
    y: number;
};

export default class Study3 {
    elms: Record<string, HTMLElement>;
    colorButtons: NodeListOf<HTMLElement>;
    winSize: Record<string, number>;
    dpr: number = Math.min(window.devicePixelRatio, 2);
    three: {
        scene: THREE.Scene;
        camera: THREE.PerspectiveCamera;
        spotLight: THREE.SpotLight;
        renderer: THREE.WebGLRenderer;
        group: THREE.Group;
        groupList: THREE.Group[];
        raycaster: THREE.Raycaster;
    };
    colors: Readonly<Record<string, string>> = {
        light: '#1e4275',
        renderer: '#000',
        wall: '#ccc',
        cylinder: '#ccc',
        torus: '#fff',
    };
    mouse: Mouse = {
        x: 0.5,
        y: 0.5,
    };
    transX: Record<string, number> = {
        current: 0.0,
        next: 0.0,
    };
    flgs: Record<string, boolean> = {
        isHover: false,
        isZoomOut: false,
    };
    constructor() {
        this.elms = {
            canvas: document.querySelector('[data-gl="canvas"]'),
            zoomButton: document.querySelector('[data-zoom]'),
        };
        this.colorButtons = document.querySelectorAll('[data-color]');
        this.winSize = {
            wd: window.innerWidth,
            wh: window.innerHeight,
        };
        this.three = {
            scene: new THREE.Scene(),
            camera: null,
            spotLight: null,
            renderer: null,
            group: null,
            groupList: [],
            raycaster: new THREE.Raycaster(),
        };
        this.init();
    }
    init(): void {
        for (const key in this.elms) {
            if (!this.elms[key]) return;
        }
        // カメラ作成
        this.three.camera = this.initCamera();
        this.three.scene.add(this.three.camera);

        // レンダラー作成
        this.three.renderer = this.initRenderer();
        this.elms.canvas.appendChild(this.three.renderer.domElement);

        // ライトを作成
        const ambientLight = this.initAmbientLight();
        this.three.scene.add(ambientLight);

        // ＊＊スポットライト作成＊＊
        this.three.spotLight = this.initSpotLight();
        this.three.scene.add(this.three.spotLight);

        // ＊＊背面の壁作成＊＊
        const wall = this.initWall();
        this.three.scene.add(wall);

        // ＊＊リング+台座作成＊＊
        this.initObject({ count: 5 });

        this.render();
        this.handleEvents();
    }
    initCamera(): THREE.PerspectiveCamera {
        // カメラ作成
        const aspect = this.winSize.wd / this.winSize.wh;
        const camera = new THREE.PerspectiveCamera(45, aspect, 0.1, 100);
        camera.position.set(0, 4, 40);
        camera.lookAt(new THREE.Vector3(0, 0, 0));
        return camera;
    }
    initAmbientLight(): THREE.AmbientLight {
        // 空間全体に均等に光を当てる
        // new THREE.AmbientLight(色, 光の強さ)
        const ambientLight = new THREE.AmbientLight(this.colors.light, 0.1);
        return ambientLight;
    }
    initSpotLight(): THREE.SpotLight {
        // ＊＊スポットライト作成＊＊
        // new THREE.SpotLight(色, 光の強さ)
        const spotLight = new THREE.SpotLight(this.colors.light, 1.5);
        spotLight.position.set(0, 60, 0); // 位置
        spotLight.angle = Math.PI / 4; // 照射角
        spotLight.penumbra = 0.5; // 減衰率
        spotLight.castShadow = true; // 影を付ける
        return spotLight;
    }
    initRenderer(): THREE.WebGLRenderer {
        // レンダラー作成
        const renderer = new THREE.WebGLRenderer({
            alpha: true,
            antialias: true,
        });
        renderer.setClearColor(this.colors.renderer, 1);
        renderer.setPixelRatio(this.dpr);
        // ＊＊影を付ける＊＊
        renderer.shadowMap.enabled = true;
        renderer.shadowMap.type = THREE.PCFSoftShadowMap;
        renderer.setSize(this.winSize.wd, this.winSize.wh);
        return renderer;
    }
    initWall(): THREE.Mesh {
        // ＊＊壁の作成を実行＊＊
        // new THREE.MeshStandardMaterial(色, 不透明の指定)
        const material = new THREE.MeshStandardMaterial({
            color: new THREE.Color(this.colors.wall),
            transparent: false,
            depthWrite: false,
        });
        const wall = new THREE.Mesh(
            new THREE.PlaneGeometry(256, 256), // new THREE.PlaneGeometry(width, height)
            material
        );
        wall.receiveShadow = true;
        wall.rotation.set(Math.PI * 2, 0, 0);
        wall.position.set(0, 0, -20);
        return wall;
    }
    initObject({ count }: { count: number }): void {
        // ＊＊リング + 台座を作成実行＊＊
        // リング + 台座の数をチェック
        if (count <= 0) return;

        // 中央値取得
        // (例) countが4の時は2、5の時は3を中央値とする
        const halfCount = count % 2 === 0 ? count / 2 : Math.round(count / 2) - 1;

        // ＊＊リングを作成＊＊
        const torus = this.initTorus();
        // ＊＊台座（下）を作成＊＊
        const cylinderBottom = this.initCylinder({ radius: 10, height: 1, y: 0 });
        // ＊＊台座（上）を作成＊＊
        const cylinderTop = this.initCylinder({ radius: 9, height: 0.9, y: 0.75 });

        // ＊＊ループ処理で複製する＊＊
        for (let i = 0; i < count; i++) {
            // 中央からのx座標を計算
            const x = i - halfCount;

            // 複製を作成
            const torusClone = torus.clone();
            const cylinderBottomClone = cylinderBottom.clone();
            const cylinderTopClone = cylinderTop.clone();

            // x軸の表示位置を調整
            torusClone.position.x *= x;
            cylinderBottomClone.position.x *= x;
            cylinderTopClone.position.x *= x;

            // グループ化
            const group = new THREE.Group();
            group.add(torusClone);
            group.add(cylinderBottomClone);
            group.add(cylinderTopClone);

            // シーンに追加
            this.three.scene.add(group);
            this.three.groupList.push(group);
        }
    }
    initCylinder({ radius, height, y }: { radius: number; height: number; y: number }): THREE.Mesh {
        // ＊＊台座の作成を実行＊＊
        // new THREE.CylinderGeometry(上部の円柱の半径, 下部の円柱の半径, 円柱の高さ, セグメント数)
        const geometry = new THREE.CylinderGeometry(radius, radius, height, 64, 64);
        const material = new THREE.MeshLambertMaterial({
            color: new THREE.Color(this.colors.cylinder),
            transparent: false,
        });
        const cylinder = new THREE.Mesh(geometry, material);
        cylinder.castShadow = true;
        cylinder.receiveShadow = true;
        cylinder.position.set(40, y - 4, -14);
        return cylinder;
    }
    initTorus(): THREE.Mesh {
        // ＊＊リングの作成を実行＊＊
        // new THREE.TorusGeometry(半径, 太さ, セグメント数, 中心角)
        const geometry = new THREE.TorusGeometry(2.5, 0.1, 256, 256);
        const material = new THREE.MeshPhongMaterial({
            color: new THREE.Color(this.colors.torus),
            transparent: false,
        });
        const torus = new THREE.Mesh(geometry, material);
        torus.castShadow = true;
        torus.receiveShadow = true;
        torus.position.set(41, -0.2, -14);
        return torus;
    }
    render(): void {
        requestAnimationFrame(this.render.bind(this));

        // ＊＊マウスのx座標の位置を線形補完する＊＊
        this.transX.next = this.mouse.x * 2.0;
        this.transX.current = lerp(this.transX.current, this.transX.next, 0.05);

        if (this.three.groupList.length === 0) return;
        if (this.three.camera) {
            // ＊＊カメラの位置をマウスの動きに合わせて移動＊＊
            this.three.camera.position.x = this.transX.current;

            // ＊＊3Dモデルにホバーした時の処理＊＊
            this.three.raycaster.setFromCamera(this.mouse, this.three.camera);
            const intersects = this.three.raycaster.intersectObjects(this.three.groupList, true);
            if (intersects.length > 0 && !this.flgs.isHover) {
                this.three.groupList.map((group) => {
                    if (group === intersects[0].object.parent && group.children[0]) {
                        const target = group.children[0];
                        this.hoverAnimation(target);
                    }
                });
            }
        }
        this.three.renderer.render(this.three.scene, this.three.camera);
    }
    hoverAnimation(target: THREE.Object3D): void {
        // ＊＊ホバーアニメーション実行＊＊
        if (!target) return;
        gsap.fromTo(
            target.rotation,
            {
                y: 0,
            },
            {
                duration: 0.8,
                ease: 'power3.inOut',
                y: Math.PI * 2,
                onStart: () => {
                    this.flgs.isHover = true;
                },
                onComplete: () => {
                    this.flgs.isHover = false;
                },
            }
        );
    }
    handleEvents(): void {
        // イベント登録
        // ＊＊マウスカーソル移動イベント＊＊
        document.addEventListener('pointermove', this.handleMouse.bind(this), false);

        // ＊＊カラー変更ボタン クリックイベント＊＊
        if (this.colorButtons.length > 0) {
            this.colorButtons.forEach((button) => {
                button.addEventListener('click', (e) => {
                    e.preventDefault();
                    this.handleColorChange(button);
                });
            });
        }

        // ＊＊Zoomアウト＊＊
        if (this.elms.zoomButton) {
            this.elms.zoomButton.addEventListener('click', (e) => {
                e.preventDefault();
                this.handleZoomOutChange();
            });
        }

        // リサイズ登録
        window.addEventListener(
            'resize',
            throttle(() => {
                this.handleResize();
            }, 100),
            false
        );
    }
    handleMouse(e: PointerEvent): void {
        // ＊＊マウス座標の取得と正規化＊＊
        this.mouse.x = (e.clientX / this.winSize.wd) * 2.0 - 1.0;
        this.mouse.y = -(e.clientY / this.winSize.wh) * 2.0 + 1.0;
    }
    handleColorChange(button: HTMLElement): void {
        // ＊＊スポットライトの色を変更＊＊
        if (!button) return;
        const color = button.getAttribute('data-color');
        this.three.spotLight.color = new THREE.Color(color);
    }
    handleZoomOutChange(): void {
        // ＊＊カメラの奥行きの位置を変更＊＊
        gsap.to(this.three.camera.position, {
            duration: 0.8,
            ease: 'power3.inOut',
            z: this.flgs.isZoomOut ? 40 : 70,
            onComplete: () => {
                this.flgs.isZoomOut = this.flgs.isZoomOut ? false : true;
            },
        });
    }
    handleResize(): void {
        // リサイズイベント実行
        this.winSize = {
            wd: window.innerWidth,
            wh: window.innerHeight,
        };
        this.dpr = Math.min(window.devicePixelRatio, 2);
        if (this.three.camera) {
            this.three.camera.aspect = this.winSize.wd / this.winSize.wh;
            this.three.camera.updateProjectionMatrix();
        }
        if (this.three.renderer) {
            this.three.renderer.setSize(this.winSize.wd, this.winSize.wh);
            this.three.renderer.setPixelRatio(this.dpr);
        }
    }
}
