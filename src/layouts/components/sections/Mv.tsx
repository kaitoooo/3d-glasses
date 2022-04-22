import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader';
import * as dat from 'dat.gui';
import throttle from 'lodash.throttle';
import gsap from 'gsap';

const WebGL: React.VFC = () => {
    const canvasRef = useRef<HTMLDivElement>(null);
    const buttonBostonRef = useRef<HTMLButtonElement>(null);
    const buttonOvalRef = useRef<HTMLButtonElement>(null);
    const buttonTeardropRef = useRef<HTMLButtonElement>(null);
    const buttonSquareRef = useRef<HTMLButtonElement>(null);
    const buttonRoundRef = useRef<HTMLButtonElement>(null);
    const buttonFoxRef = useRef<HTMLButtonElement>(null);
    const buttonsRef = useRef<HTMLDivElement>(null);
    const linksRef = useRef<HTMLDivElement>(null);

    const winSize = {
        wd: window.innerWidth,
        wh: window.innerHeight,
    };
    const three = {
        scene: new THREE.Scene(),
        clock: new THREE.Clock(),
        camera: new THREE.PerspectiveCamera(75, winSize.wd / winSize.wh, window.innerWidth / window.innerHeight, 100),
        renderer: new THREE.WebGLRenderer({
            antialias: true,
            alpha: true,
        }),
        raycaster: new THREE.Raycaster(),
        material: new THREE.MeshLambertMaterial(),
        ovalMesh: new THREE.Mesh(),
        bostonMesh: new THREE.Mesh(),
        foxMesh: new THREE.Mesh(),
        roundMesh: new THREE.Mesh(),
        squareMesh: new THREE.Mesh(),
        teardropMesh: new THREE.Mesh(),
    };
    const dpr = Math.min(window.devicePixelRatio, 2);
    const srcObj = './obj/glasses-d.glb';
    const ua = window.navigator.userAgent.toLowerCase();
    const mq = window.matchMedia('(max-width: 768px)');
    const sp = mq.matches ? true : false;

    const getLayout = (): void => {
        sp;
    };
    const setCamera = (): void => {
        three.camera.position.set(0, 0, 9);
    };
    const setLight = (): void => {
        // 環境光源(色, 光の強さ)
        const ambientLight = new THREE.AmbientLight(0x666666, 0.5);
        three.scene.add(ambientLight);

        //　平行光源(色, 光の強さ)
        // const directionalLight = new THREE.DirectionalLight(0x00fffc, 0.7);
        const directionalLight = new THREE.DirectionalLight(0xffffff, 5);

        // シャドウニキビを削除
        directionalLight.shadow.normalBias = 0.05;

        // ライトの位置を設定
        directionalLight.position.set(1, 4, 6);

        // 影を有効化
        // directionalLight.castShadow = true;

        // 影のレンダリングサイズの設定
        directionalLight.shadow.mapSize.set(1024, 1024);
        // directionalLight.shadow.mapSize.set(4096, 4096);

        // 平行光源のヘルパー(対象, 大きさ)
        // const directionalLightHelper = new THREE.DirectionalLightHelper(directionalLight, 0.8);
        // three.scene.add(directionalLightHelper);

        // 影の距離を設定
        directionalLight.shadow.camera.near = 1;
        directionalLight.shadow.camera.far = 6;

        // カメラの振幅を設定
        directionalLight.shadow.camera.top = 2;
        directionalLight.shadow.camera.right = 2;
        directionalLight.shadow.camera.bottom = -2;
        directionalLight.shadow.camera.left = -2;

        // カメラヘルパーの追加
        // const directionalLightCameraHelper = new THREE.CameraHelper(directionalLight.shadow.camera);
        // three.scene.add(directionalLightCameraHelper);

        // シーンにライトを追加
        three.scene.add(directionalLight);
    };
    const tick = (): void => {
        setPoints();
        const time = three.clock.getElapsedTime();
        three.ovalMesh.position.y += Math.sin(time) * 0.0015;
        three.ovalMesh.rotation.y += Math.cos(time) * 0.0005;

        three.bostonMesh.position.y += Math.sin(time) * 0.0027;
        three.bostonMesh.rotation.y += Math.cos(time) * 0.0015;

        three.teardropMesh.position.y += Math.sin(time) * 0.002;
        three.teardropMesh.rotation.y += Math.cos(time) * 0.0015;

        three.squareMesh.position.y += Math.sin(time) * 0.0022;
        three.squareMesh.rotation.y += Math.cos(time) * 0.0011;

        three.roundMesh.position.y += Math.sin(time) * 0.0014;
        three.roundMesh.rotation.y += Math.cos(time) * 0.0012;

        three.foxMesh.position.y += Math.sin(time) * 0.0016;
        three.foxMesh.rotation.y += Math.cos(time) * 0.001;
        three.renderer.render(three.scene, three.camera);
        requestAnimationFrame(tick);
        animate();
    };
    const setModels = (): void => {
        // glTF形式の3Dモデルを読み込む
        const dracoLoader = new DRACOLoader();
        dracoLoader.setDecoderPath('/draco/');
        // glTF形式の3Dモデルを読み込む
        const loader = new GLTFLoader();
        loader.setDRACOLoader(dracoLoader);

        loader.load(srcObj, (obj) => {
            three.ovalMesh = obj.scene.children.find((child: THREE.Mesh) => child.name === 'oval');
            three.bostonMesh = obj.scene.children.find((child: THREE.Mesh) => child.name === 'boston');
            three.teardropMesh = obj.scene.children.find((child: THREE.Mesh) => child.name === 'teardrop');
            three.squareMesh = obj.scene.children.find((child: THREE.Mesh) => child.name === 'square');
            three.roundMesh = obj.scene.children.find((child: THREE.Mesh) => child.name === 'round');
            three.foxMesh = obj.scene.children.find((child: THREE.Mesh) => child.name === 'fox');

            // 3dメッシュのサイズ
            three.ovalMesh.scale.set(sp ? 0.6 : 1.5, sp ? 0.6 : 1.5, sp ? 0.6 : 1.5);
            three.ovalMesh.rotation.set(2, 0, 0.6);
            three.ovalMesh.position.set(sp ? -0.3 : -1, 4, 0);

            three.bostonMesh.scale.set(sp ? 0.6 : 1.5, sp ? 0.6 : 1.5, sp ? 0.6 : 1.5);
            three.bostonMesh.rotation.set(2, 0, sp ? 0.6 : 0.2);
            three.bostonMesh.position.set(sp ? -0.3 : -9, sp ? 2.7 : 4, 0);

            three.teardropMesh.scale.set(sp ? 0.6 : 1.5, sp ? 0.6 : 1.5, sp ? 0.6 : 1.5);
            three.teardropMesh.rotation.set(2, 0, sp ? 0.6 : 1);
            three.teardropMesh.position.set(sp ? -0.3 : 8, sp ? 1.4 : 4, sp ? 0 : -1);

            three.foxMesh.scale.set(sp ? 0.6 : 1.5, sp ? 0.6 : 1.5, sp ? 0.6 : 1.5);
            three.foxMesh.rotation.set(sp ? 2 : 1.7, 0, sp ? 0.6 : 1);
            three.foxMesh.position.set(sp ? -0.3 : 8, sp ? 0.1 : -4, sp ? 0 : -1);

            three.roundMesh.scale.set(sp ? 0.6 : 1.5, sp ? 0.6 : 1.5, sp ? 0.6 : 1.5);
            three.roundMesh.rotation.set(sp ? 2 : 1.7, 0, 0.6);
            three.roundMesh.position.set(sp ? -0.3 : -1, sp ? -1.2 : -4, 0);

            three.squareMesh.scale.set(sp ? 0.6 : 1.5, sp ? 0.6 : 1.5, sp ? 0.6 : 1.5);
            three.squareMesh.rotation.set(sp ? 2 : 1.7, 0, sp ? 0.6 : 0.3);
            three.squareMesh.position.set(sp ? -0.3 : -10, sp ? -2.5 : -4, sp ? 0 : -1);

            // シーンに3Dモデルを追加
            three.scene.add(obj.scene);
            // レンダリングを開始する
            tick();
        });
    };
    const animate = (): void => {
        gsap.config({
            force3D: true,
        });
        gsap.to(linksRef.current, {
            duration: 2.5,
            ease: 'power2.easeOut',
            autoAlpha: 1,
        });
    };
    const handleEvents = (): void => {
        // リサイズイベント登録
        window.addEventListener(
            'resize',
            throttle(() => {
                handleResize();
            }, 100),
            false
        );
    };
    const handleResize = (): void => {
        // リサイズ処理
        winSize.wd = window.innerWidth;
        winSize.wh = window.innerHeight;

        if (three.camera) {
            // カメラの位置更新
            three.camera.aspect = winSize.wd / winSize.wh;
            three.camera.updateProjectionMatrix();
        }
        if (three.renderer) {
            // レンダラーの大きさ更新
            three.renderer.setSize(winSize.wd, winSize.wh);
            three.renderer.setPixelRatio(dpr);
        }
    };
    const setPoints = (): void => {
        const points = [
            {
                position: new THREE.Vector3(sp ? 1.4 : -6.5, sp ? 3.6 : 3, 0),
                element: buttonBostonRef.current,
            },
            {
                position: new THREE.Vector3(sp ? 1.4 : 1.6, sp ? 2.2 : 3, 0),
                element: buttonOvalRef.current,
            },
            {
                position: new THREE.Vector3(sp ? 1.4 : 10, sp ? 0.8 : 3, 0),
                element: buttonTeardropRef.current,
            },
            {
                position: new THREE.Vector3(sp ? 1.4 : -6.5, sp ? -0.4 : -2.5, 0),
                element: buttonSquareRef.current,
            },
            {
                position: new THREE.Vector3(sp ? 1.4 : 1.6, sp ? -1.8 : -2.5, 0),
                element: buttonRoundRef.current,
            },
            {
                position: new THREE.Vector3(sp ? 1.4 : 10, sp ? -3.2 : -2.5, 0),
                element: buttonFoxRef.current,
            },
        ];

        // Go through each point
        for (const point of points) {
            // Get 2D screen position
            const screenPosition = point.position.clone();
            screenPosition.project(three.camera);

            // Set the raycaster
            three.raycaster.setFromCamera(screenPosition, three.camera);
            const intersects = three.raycaster.intersectObjects(three.scene.children, true);

            if (intersects.length === 0) {
                point.element.classList.add('is-active');
            } else {
                const intersectionDistance = intersects[0].distance;
                const pointDistance = point.position.distanceTo(three.camera.position);

                if (intersectionDistance > pointDistance) {
                    point.element.classList.add('is-active');
                }
            }

            const translateX = screenPosition.x * window.innerWidth * 0.5;
            const translateY = -screenPosition.y * window.innerHeight * 0.5;
            point.element.style.transform = `translateX(${translateX}px) translateY(${translateY}px)`;
        }
    };
    const selectBoston = (): void => {
        gsap.to(three.ovalMesh.scale, {
            duration: 0.5,
            ease: 'power2.easeOut',
            x: 0,
            y: 0,
            z: 0,
        });
        gsap.to(three.teardropMesh.scale, {
            duration: 0.5,
            ease: 'power2.easeOut',
            x: 0,
            y: 0,
            z: 0,
        });
        gsap.to(three.squareMesh.scale, {
            duration: 0.5,
            ease: 'power2.easeOut',
            x: 0,
            y: 0,
            z: 0,
        });
        gsap.to(three.roundMesh.scale, {
            duration: 0.5,
            ease: 'power2.easeOut',
            x: 0,
            y: 0,
            z: 0,
        });
        gsap.to(three.ovalMesh.scale, {
            duration: 0.5,
            ease: 'power2.easeOut',
            x: 0,
            y: 0,
            z: 0,
        });
        gsap.to(three.foxMesh.scale, {
            duration: 0.5,
            ease: 'power2.easeOut',
            x: 0,
            y: 0,
            z: 0,
        });
        gsap.to(three.bostonMesh.position, {
            duration: 0.5,
            ease: 'power2.easeOut',
            x: 0,
            y: 0,
            z: sp ? 3.3 : 2,
        });
        gsap.to(three.bostonMesh.rotation, {
            duration: 0.5,
            ease: 'power2.easeOut',
            x: 2,
            y: 0,
            z: 0.6,
        });
        gsap.to(buttonBostonRef.current, {
            duration: 0.3,
            ease: 'power2.easeOut',
            autoAlpha: 0,
        });
        gsap.to(buttonOvalRef.current, {
            duration: 0.3,
            ease: 'power2.easeOut',
            autoAlpha: 0,
        });
        gsap.to(buttonTeardropRef.current, {
            duration: 0.3,
            ease: 'power2.easeOut',
            autoAlpha: 0,
        });
        gsap.to(buttonSquareRef.current, {
            duration: 0.3,
            ease: 'power2.easeOut',
            autoAlpha: 0,
        });
        gsap.to(buttonRoundRef.current, {
            duration: 0.3,
            ease: 'power2.easeOut',
            autoAlpha: 0,
        });
        gsap.to(buttonFoxRef.current, {
            duration: 0.3,
            ease: 'power2.easeOut',
            autoAlpha: 0,
        });
        gsap.to(buttonsRef.current, {
            duration: 0.3,
            ease: 'power2.easeOut',
            autoAlpha: 1,
        });
    };
    const selectOval = (): void => {
        gsap.to(three.bostonMesh.scale, {
            duration: 0.5,
            ease: 'power2.easeOut',
            x: 0,
            y: 0,
            z: 0,
        });
        gsap.to(three.teardropMesh.scale, {
            duration: 0.5,
            ease: 'power2.easeOut',
            x: 0,
            y: 0,
            z: 0,
        });
        gsap.to(three.squareMesh.scale, {
            duration: 0.5,
            ease: 'power2.easeOut',
            x: 0,
            y: 0,
            z: 0,
        });
        gsap.to(three.roundMesh.scale, {
            duration: 0.5,
            ease: 'power2.easeOut',
            x: 0,
            y: 0,
            z: 0,
        });
        gsap.to(three.bostonMesh.scale, {
            duration: 0.5,
            ease: 'power2.easeOut',
            x: 0,
            y: 0,
            z: 0,
        });
        gsap.to(three.foxMesh.scale, {
            duration: 0.5,
            ease: 'power2.easeOut',
            x: 0,
            y: 0,
            z: 0,
        });
        gsap.to(three.ovalMesh.position, {
            duration: 0.5,
            ease: 'power2.easeOut',
            x: 0,
            y: 0,
            z: sp ? 3.3 : 2,
        });
        gsap.to(buttonBostonRef.current, {
            duration: 0.3,
            ease: 'power2.easeOut',
            autoAlpha: 0,
        });
        gsap.to(buttonOvalRef.current, {
            duration: 0.3,
            ease: 'power2.easeOut',
            autoAlpha: 0,
        });
        gsap.to(buttonTeardropRef.current, {
            duration: 0.3,
            ease: 'power2.easeOut',
            autoAlpha: 0,
        });
        gsap.to(buttonSquareRef.current, {
            duration: 0.3,
            ease: 'power2.easeOut',
            autoAlpha: 0,
        });
        gsap.to(buttonRoundRef.current, {
            duration: 0.3,
            ease: 'power2.easeOut',
            autoAlpha: 0,
        });
        gsap.to(buttonFoxRef.current, {
            duration: 0.3,
            ease: 'power2.easeOut',
            autoAlpha: 0,
        });
        gsap.to(buttonsRef.current, {
            duration: 0.3,
            ease: 'power2.easeOut',
            autoAlpha: 1,
        });
    };
    const selectTeardrop = (): void => {
        gsap.to(three.ovalMesh.scale, {
            duration: 0.5,
            ease: 'power2.easeOut',
            x: 0,
            y: 0,
            z: 0,
        });
        gsap.to(three.bostonMesh.scale, {
            duration: 0.5,
            ease: 'power2.easeOut',
            x: 0,
            y: 0,
            z: 0,
        });
        gsap.to(three.squareMesh.scale, {
            duration: 0.5,
            ease: 'power2.easeOut',
            x: 0,
            y: 0,
            z: 0,
        });
        gsap.to(three.roundMesh.scale, {
            duration: 0.5,
            ease: 'power2.easeOut',
            x: 0,
            y: 0,
            z: 0,
        });
        gsap.to(three.ovalMesh.scale, {
            duration: 0.5,
            ease: 'power2.easeOut',
            x: 0,
            y: 0,
            z: 0,
        });
        gsap.to(three.foxMesh.scale, {
            duration: 0.5,
            ease: 'power2.easeOut',
            x: 0,
            y: 0,
            z: 0,
        });
        gsap.to(three.teardropMesh.position, {
            duration: 0.5,
            ease: 'power2.easeOut',
            x: 0,
            y: 0,
            z: sp ? 3.3 : 2,
        });
        gsap.to(three.teardropMesh.rotation, {
            duration: 0.5,
            ease: 'power2.easeOut',
            x: 2,
            y: 0,
            z: 0.6,
        });
        gsap.to(buttonBostonRef.current, {
            duration: 0.3,
            ease: 'power2.easeOut',
            autoAlpha: 0,
        });
        gsap.to(buttonOvalRef.current, {
            duration: 0.3,
            ease: 'power2.easeOut',
            autoAlpha: 0,
        });
        gsap.to(buttonTeardropRef.current, {
            duration: 0.3,
            ease: 'power2.easeOut',
            autoAlpha: 0,
        });
        gsap.to(buttonSquareRef.current, {
            duration: 0.3,
            ease: 'power2.easeOut',
            autoAlpha: 0,
        });
        gsap.to(buttonRoundRef.current, {
            duration: 0.3,
            ease: 'power2.easeOut',
            autoAlpha: 0,
        });
        gsap.to(buttonFoxRef.current, {
            duration: 0.3,
            ease: 'power2.easeOut',
            autoAlpha: 0,
        });
        gsap.to(buttonsRef.current, {
            duration: 0.3,
            ease: 'power2.easeOut',
            autoAlpha: 1,
        });
    };
    const selectSquare = (): void => {
        gsap.to(three.bostonMesh.scale, {
            duration: 0.5,
            ease: 'power2.easeOut',
            x: 0,
            y: 0,
            z: 0,
        });
        gsap.to(three.teardropMesh.scale, {
            duration: 0.5,
            ease: 'power2.easeOut',
            x: 0,
            y: 0,
            z: 0,
        });
        gsap.to(three.ovalMesh.scale, {
            duration: 0.5,
            ease: 'power2.easeOut',
            x: 0,
            y: 0,
            z: 0,
        });
        gsap.to(three.roundMesh.scale, {
            duration: 0.5,
            ease: 'power2.easeOut',
            x: 0,
            y: 0,
            z: 0,
        });
        gsap.to(three.bostonMesh.scale, {
            duration: 0.5,
            ease: 'power2.easeOut',
            x: 0,
            y: 0,
            z: 0,
        });
        gsap.to(three.foxMesh.scale, {
            duration: 0.5,
            ease: 'power2.easeOut',
            x: 0,
            y: 0,
            z: 0,
        });
        gsap.to(three.squareMesh.position, {
            duration: 0.5,
            ease: 'power2.easeOut',
            x: 0,
            y: 0,
            z: sp ? 3.3 : 2,
        });
        gsap.to(three.squareMesh.rotation, {
            duration: 0.5,
            ease: 'power2.easeOut',
            x: 2,
            y: 0,
            z: 0.6,
        });
        gsap.to(buttonBostonRef.current, {
            duration: 0.3,
            ease: 'power2.easeOut',
            autoAlpha: 0,
        });
        gsap.to(buttonOvalRef.current, {
            duration: 0.3,
            ease: 'power2.easeOut',
            autoAlpha: 0,
        });
        gsap.to(buttonTeardropRef.current, {
            duration: 0.3,
            ease: 'power2.easeOut',
            autoAlpha: 0,
        });
        gsap.to(buttonSquareRef.current, {
            duration: 0.3,
            ease: 'power2.easeOut',
            autoAlpha: 0,
        });
        gsap.to(buttonRoundRef.current, {
            duration: 0.3,
            ease: 'power2.easeOut',
            autoAlpha: 0,
        });
        gsap.to(buttonFoxRef.current, {
            duration: 0.3,
            ease: 'power2.easeOut',
            autoAlpha: 0,
        });
        gsap.to(buttonsRef.current, {
            duration: 0.3,
            ease: 'power2.easeOut',
            autoAlpha: 1,
        });
    };
    const selectRound = (): void => {
        gsap.to(three.ovalMesh.scale, {
            duration: 0.5,
            ease: 'power2.easeOut',
            x: 0,
            y: 0,
            z: 0,
        });
        gsap.to(three.teardropMesh.scale, {
            duration: 0.5,
            ease: 'power2.easeOut',
            x: 0,
            y: 0,
            z: 0,
        });
        gsap.to(three.squareMesh.scale, {
            duration: 0.5,
            ease: 'power2.easeOut',
            x: 0,
            y: 0,
            z: 0,
        });
        gsap.to(three.bostonMesh.scale, {
            duration: 0.5,
            ease: 'power2.easeOut',
            x: 0,
            y: 0,
            z: 0,
        });
        gsap.to(three.ovalMesh.scale, {
            duration: 0.5,
            ease: 'power2.easeOut',
            x: 0,
            y: 0,
            z: 0,
        });
        gsap.to(three.foxMesh.scale, {
            duration: 0.5,
            ease: 'power2.easeOut',
            x: 0,
            y: 0,
            z: 0,
        });
        gsap.to(three.roundMesh.position, {
            duration: 0.5,
            ease: 'power2.easeOut',
            x: 0,
            y: 0,
            z: sp ? 3.3 : 2,
        });
        gsap.to(buttonBostonRef.current, {
            duration: 0.3,
            ease: 'power2.easeOut',
            autoAlpha: 0,
        });
        gsap.to(buttonOvalRef.current, {
            duration: 0.3,
            ease: 'power2.easeOut',
            autoAlpha: 0,
        });
        gsap.to(buttonTeardropRef.current, {
            duration: 0.3,
            ease: 'power2.easeOut',
            autoAlpha: 0,
        });
        gsap.to(buttonSquareRef.current, {
            duration: 0.3,
            ease: 'power2.easeOut',
            autoAlpha: 0,
        });
        gsap.to(buttonRoundRef.current, {
            duration: 0.3,
            ease: 'power2.easeOut',
            autoAlpha: 0,
        });
        gsap.to(buttonFoxRef.current, {
            duration: 0.3,
            ease: 'power2.easeOut',
            autoAlpha: 0,
        });
        gsap.to(buttonsRef.current, {
            duration: 0.3,
            ease: 'power2.easeOut',
            autoAlpha: 1,
        });
    };
    const selectFox = (): void => {
        gsap.to(three.bostonMesh.scale, {
            duration: 0.5,
            ease: 'power2.easeOut',
            x: 0,
            y: 0,
            z: 0,
        });
        gsap.to(three.teardropMesh.scale, {
            duration: 0.5,
            ease: 'power2.easeOut',
            x: 0,
            y: 0,
            z: 0,
        });
        gsap.to(three.squareMesh.scale, {
            duration: 0.5,
            ease: 'power2.easeOut',
            x: 0,
            y: 0,
            z: 0,
        });
        gsap.to(three.roundMesh.scale, {
            duration: 0.5,
            ease: 'power2.easeOut',
            x: 0,
            y: 0,
            z: 0,
        });
        gsap.to(three.bostonMesh.scale, {
            duration: 0.5,
            ease: 'power2.easeOut',
            x: 0,
            y: 0,
            z: 0,
        });
        gsap.to(three.ovalMesh.scale, {
            duration: 0.5,
            ease: 'power2.easeOut',
            x: 0,
            y: 0,
            z: 0,
        });
        gsap.to(three.foxMesh.position, {
            duration: 0.5,
            ease: 'power2.easeOut',
            x: 0,
            y: 0,
            z: sp ? 3.3 : 2,
        });
        gsap.to(three.foxMesh.rotation, {
            duration: 0.5,
            ease: 'power2.easeOut',
            x: 2,
            y: 0,
            z: 0.6,
        });
        gsap.to(buttonBostonRef.current, {
            duration: 0.3,
            ease: 'power2.easeOut',
            autoAlpha: 0,
        });
        gsap.to(buttonOvalRef.current, {
            duration: 0.3,
            ease: 'power2.easeOut',
            autoAlpha: 0,
        });
        gsap.to(buttonTeardropRef.current, {
            duration: 0.3,
            ease: 'power2.easeOut',
            autoAlpha: 0,
        });
        gsap.to(buttonSquareRef.current, {
            duration: 0.3,
            ease: 'power2.easeOut',
            autoAlpha: 0,
        });
        gsap.to(buttonRoundRef.current, {
            duration: 0.3,
            ease: 'power2.easeOut',
            autoAlpha: 0,
        });
        gsap.to(buttonFoxRef.current, {
            duration: 0.3,
            ease: 'power2.easeOut',
            autoAlpha: 0,
        });
        gsap.to(buttonsRef.current, {
            duration: 0.3,
            ease: 'power2.easeOut',
            autoAlpha: 1,
        });
    };
    const changeBoston = (): void => {
        gsap.to(three.bostonMesh.scale, {
            duration: 0.5,
            ease: 'power2.easeOut',
            x: sp ? 0.6 : 1.5,
            y: sp ? 0.6 : 1.5,
            z: sp ? 0.6 : 1.5,
        });
        gsap.to(three.ovalMesh.scale, {
            duration: 0.5,
            ease: 'power2.easeOut',
            x: 0,
            y: 0,
            z: 0,
        });
        gsap.to(three.teardropMesh.scale, {
            duration: 0.5,
            ease: 'power2.easeOut',
            x: 0,
            y: 0,
            z: 0,
        });
        gsap.to(three.squareMesh.scale, {
            duration: 0.5,
            ease: 'power2.easeOut',
            x: 0,
            y: 0,
            z: 0,
        });
        gsap.to(three.roundMesh.scale, {
            duration: 0.5,
            ease: 'power2.easeOut',
            x: 0,
            y: 0,
            z: 0,
        });
        gsap.to(three.foxMesh.scale, {
            duration: 0.5,
            ease: 'power2.easeOut',
            x: 0,
            y: 0,
            z: 0,
        });
        gsap.to(three.bostonMesh.position, {
            duration: 0.5,
            ease: 'power2.easeOut',
            x: 0,
            y: 0,
            z: sp ? 3.3 : 2,
        });
        gsap.to(three.bostonMesh.rotation, {
            duration: 0.5,
            ease: 'power2.easeOut',
            x: 2,
            y: 0,
            z: 0.6,
        });
    };
    const changeOval = (): void => {
        gsap.to(three.ovalMesh.scale, {
            duration: 0.5,
            ease: 'power2.easeOut',
            x: sp ? 0.6 : 1.5,
            y: sp ? 0.6 : 1.5,
            z: sp ? 0.6 : 1.5,
        });
        gsap.to(three.bostonMesh.scale, {
            duration: 0.5,
            ease: 'power2.easeOut',
            x: 0,
            y: 0,
            z: 0,
        });
        gsap.to(three.teardropMesh.scale, {
            duration: 0.5,
            ease: 'power2.easeOut',
            x: 0,
            y: 0,
            z: 0,
        });
        gsap.to(three.squareMesh.scale, {
            duration: 0.5,
            ease: 'power2.easeOut',
            x: 0,
            y: 0,
            z: 0,
        });
        gsap.to(three.roundMesh.scale, {
            duration: 0.5,
            ease: 'power2.easeOut',
            x: 0,
            y: 0,
            z: 0,
        });
        gsap.to(three.foxMesh.scale, {
            duration: 0.5,
            ease: 'power2.easeOut',
            x: 0,
            y: 0,
            z: 0,
        });
        gsap.to(three.ovalMesh.position, {
            duration: 0.5,
            ease: 'power2.easeOut',
            x: 0,
            y: 0,
            z: sp ? 3.3 : 2,
        });
    };
    const changeTeardrop = (): void => {
        gsap.to(three.teardropMesh.scale, {
            duration: 0.5,
            ease: 'power2.easeOut',
            x: sp ? 0.6 : 1.5,
            y: sp ? 0.6 : 1.5,
            z: sp ? 0.6 : 1.5,
        });
        gsap.to(three.ovalMesh.scale, {
            duration: 0.5,
            ease: 'power2.easeOut',
            x: 0,
            y: 0,
            z: 0,
        });
        gsap.to(three.bostonMesh.scale, {
            duration: 0.5,
            ease: 'power2.easeOut',
            x: 0,
            y: 0,
            z: 0,
        });
        gsap.to(three.squareMesh.scale, {
            duration: 0.5,
            ease: 'power2.easeOut',
            x: 0,
            y: 0,
            z: 0,
        });
        gsap.to(three.roundMesh.scale, {
            duration: 0.5,
            ease: 'power2.easeOut',
            x: 0,
            y: 0,
            z: 0,
        });
        gsap.to(three.foxMesh.scale, {
            duration: 0.5,
            ease: 'power2.easeOut',
            x: 0,
            y: 0,
            z: 0,
        });
        gsap.to(three.teardropMesh.position, {
            duration: 0.5,
            ease: 'power2.easeOut',
            x: 0,
            y: 0,
            z: sp ? 3.3 : 2,
        });
        gsap.to(three.teardropMesh.rotation, {
            duration: 0.5,
            ease: 'power2.easeOut',
            x: 2,
            y: 0,
            z: 0.6,
        });
    };
    const changeSquare = (): void => {
        gsap.to(three.squareMesh.scale, {
            duration: 0.5,
            ease: 'power2.easeOut',
            x: sp ? 0.6 : 1.5,
            y: sp ? 0.6 : 1.5,
            z: sp ? 0.6 : 1.5,
        });
        gsap.to(three.ovalMesh.scale, {
            duration: 0.5,
            ease: 'power2.easeOut',
            x: 0,
            y: 0,
            z: 0,
        });
        gsap.to(three.teardropMesh.scale, {
            duration: 0.5,
            ease: 'power2.easeOut',
            x: 0,
            y: 0,
            z: 0,
        });
        gsap.to(three.bostonMesh.scale, {
            duration: 0.5,
            ease: 'power2.easeOut',
            x: 0,
            y: 0,
            z: 0,
        });
        gsap.to(three.roundMesh.scale, {
            duration: 0.5,
            ease: 'power2.easeOut',
            x: 0,
            y: 0,
            z: 0,
        });
        gsap.to(three.foxMesh.scale, {
            duration: 0.5,
            ease: 'power2.easeOut',
            x: 0,
            y: 0,
            z: 0,
        });
        gsap.to(three.squareMesh.position, {
            duration: 0.5,
            ease: 'power2.easeOut',
            x: 0,
            y: 0,
            z: sp ? 3.3 : 2,
        });
        gsap.to(three.squareMesh.rotation, {
            duration: 0.5,
            ease: 'power2.easeOut',
            x: 2,
            y: 0,
            z: 0.6,
        });
    };
    const changeRound = (): void => {
        gsap.to(three.roundMesh.scale, {
            duration: 0.5,
            ease: 'power2.easeOut',
            x: sp ? 0.6 : 1.5,
            y: sp ? 0.6 : 1.5,
            z: sp ? 0.6 : 1.5,
        });
        gsap.to(three.ovalMesh.scale, {
            duration: 0.5,
            ease: 'power2.easeOut',
            x: 0,
            y: 0,
            z: 0,
        });
        gsap.to(three.teardropMesh.scale, {
            duration: 0.5,
            ease: 'power2.easeOut',
            x: 0,
            y: 0,
            z: 0,
        });
        gsap.to(three.squareMesh.scale, {
            duration: 0.5,
            ease: 'power2.easeOut',
            x: 0,
            y: 0,
            z: 0,
        });
        gsap.to(three.bostonMesh.scale, {
            duration: 0.5,
            ease: 'power2.easeOut',
            x: 0,
            y: 0,
            z: 0,
        });
        gsap.to(three.foxMesh.scale, {
            duration: 0.5,
            ease: 'power2.easeOut',
            x: 0,
            y: 0,
            z: 0,
        });
        gsap.to(three.roundMesh.position, {
            duration: 0.5,
            ease: 'power2.easeOut',
            x: 0,
            y: 0,
            z: sp ? 3.3 : 2,
        });
    };
    const changeFox = (): void => {
        gsap.to(three.foxMesh.scale, {
            duration: 0.5,
            ease: 'power2.easeOut',
            x: sp ? 0.6 : 1.5,
            y: sp ? 0.6 : 1.5,
            z: sp ? 0.6 : 1.5,
        });
        gsap.to(three.ovalMesh.scale, {
            duration: 0.5,
            ease: 'power2.easeOut',
            x: 0,
            y: 0,
            z: 0,
        });
        gsap.to(three.teardropMesh.scale, {
            duration: 0.5,
            ease: 'power2.easeOut',
            x: 0,
            y: 0,
            z: 0,
        });
        gsap.to(three.squareMesh.scale, {
            duration: 0.5,
            ease: 'power2.easeOut',
            x: 0,
            y: 0,
            z: 0,
        });
        gsap.to(three.roundMesh.scale, {
            duration: 0.5,
            ease: 'power2.easeOut',
            x: 0,
            y: 0,
            z: 0,
        });
        gsap.to(three.bostonMesh.scale, {
            duration: 0.5,
            ease: 'power2.easeOut',
            x: 0,
            y: 0,
            z: 0,
        });
        gsap.to(three.foxMesh.position, {
            duration: 0.5,
            ease: 'power2.easeOut',
            x: 0,
            y: 0,
            z: sp ? 3.3 : 2,
        });
        gsap.to(three.foxMesh.rotation, {
            duration: 0.5,
            ease: 'power2.easeOut',
            x: 2,
            y: 0,
            z: 0.6,
        });
    };
    const reset = (): void => {
        gsap.to(three.foxMesh.scale, {
            duration: 0.5,
            ease: 'power2.easeOut',
            x: sp ? 0.6 : 1.5,
            y: sp ? 0.6 : 1.5,
            z: sp ? 0.6 : 1.5,
        });
        gsap.to(three.ovalMesh.scale, {
            duration: 0.5,
            ease: 'power2.easeOut',
            x: sp ? 0.6 : 1.5,
            y: sp ? 0.6 : 1.5,
            z: sp ? 0.6 : 1.5,
        });
        gsap.to(three.teardropMesh.scale, {
            duration: 0.5,
            ease: 'power2.easeOut',
            x: sp ? 0.6 : 1.5,
            y: sp ? 0.6 : 1.5,
            z: sp ? 0.6 : 1.5,
        });
        gsap.to(three.squareMesh.scale, {
            duration: 0.5,
            ease: 'power2.easeOut',
            x: sp ? 0.6 : 1.5,
            y: sp ? 0.6 : 1.5,
            z: sp ? 0.6 : 1.5,
        });
        gsap.to(three.roundMesh.scale, {
            duration: 0.5,
            ease: 'power2.easeOut',
            x: sp ? 0.6 : 1.5,
            y: sp ? 0.6 : 1.5,
            z: sp ? 0.6 : 1.5,
        });
        gsap.to(three.bostonMesh.scale, {
            duration: 0.5,
            ease: 'power2.easeOut',
            x: sp ? 0.6 : 1.5,
            y: sp ? 0.6 : 1.5,
            z: sp ? 0.6 : 1.5,
        });
        gsap.to(three.foxMesh.position, {
            duration: 0.5,
            ease: 'power2.easeOut',
            x: sp ? -0.3 : 8,
            y: sp ? 0.1 : -4,
            z: sp ? 0 : -1,
        });
        gsap.to(three.teardropMesh.position, {
            duration: 0.5,
            ease: 'power2.easeOut',
            x: sp ? -0.3 : 8,
            y: sp ? 1.4 : 4,
            z: sp ? 0 : -1,
        });
        gsap.to(three.squareMesh.position, {
            duration: 0.5,
            ease: 'power2.easeOut',
            x: sp ? -0.3 : -10,
            y: sp ? -2.5 : -4,
            z: sp ? 0 : -1,
        });
        gsap.to(three.roundMesh.position, {
            duration: 0.5,
            ease: 'power2.easeOut',
            x: sp ? -0.3 : -1,
            y: sp ? -1.2 : -4,
            z: 0,
        });
        gsap.to(three.bostonMesh.position, {
            duration: 0.5,
            ease: 'power2.easeOut',
            x: sp ? -0.3 : -9,
            y: sp ? 2.7 : 4,
            z: 0,
        });
        gsap.to(three.ovalMesh.position, {
            duration: 0.5,
            ease: 'power2.easeOut',
            x: sp ? -0.3 : -1,
            y: 4,
            z: 0,
        });
        gsap.to(three.foxMesh.rotation, {
            duration: 0.5,
            ease: 'power2.easeOut',
            x: sp ? 2 : 1.7,
            y: 0,
            z: sp ? 0.6 : 1,
        });
        gsap.to(three.teardropMesh.rotation, {
            duration: 0.5,
            ease: 'power2.easeOut',
            x: 2,
            y: 0,
            z: sp ? 0.6 : 1,
        });
        gsap.to(three.squareMesh.rotation, {
            duration: 0.5,
            ease: 'power2.easeOut',
            x: sp ? 2 : 1.7,
            y: 0,
            z: sp ? 0.6 : 0.3,
        });
        gsap.to(three.roundMesh.rotation, {
            duration: 0.5,
            ease: 'power2.easeOut',
            x: sp ? 2 : 1.7,
            y: 0,
            z: 0.6,
        });
        gsap.to(three.bostonMesh.rotation, {
            duration: 0.5,
            ease: 'power2.easeOut',
            x: 2,
            y: 0,
            z: sp ? 0.6 : 0.2,
        });
        gsap.to(three.ovalMesh.rotation, {
            duration: 0.5,
            ease: 'power2.easeOut',
            x: 2,
            y: 0,
            z: 0.6,
        });
        gsap.to(buttonBostonRef.current, {
            duration: 0.3,
            ease: 'power2.easeOut',
            autoAlpha: 1,
        });
        gsap.to(buttonOvalRef.current, {
            duration: 0.3,
            ease: 'power2.easeOut',
            autoAlpha: 1,
        });
        gsap.to(buttonTeardropRef.current, {
            duration: 0.3,
            ease: 'power2.easeOut',
            autoAlpha: 1,
        });
        gsap.to(buttonSquareRef.current, {
            duration: 0.3,
            ease: 'power2.easeOut',
            autoAlpha: 1,
        });
        gsap.to(buttonRoundRef.current, {
            duration: 0.3,
            ease: 'power2.easeOut',
            autoAlpha: 1,
        });
        gsap.to(buttonFoxRef.current, {
            duration: 0.3,
            ease: 'power2.easeOut',
            autoAlpha: 1,
        });
        gsap.to(buttonsRef.current, {
            duration: 0.3,
            ease: 'power2.easeOut',
            autoAlpha: 0,
        });
    };
    const initGUI = (): void => {
        // 値を調整するコントロールパネルを追加
        const gui = new dat.GUI();
        const folder = gui.addFolder('MATERIAL');
        let params = {
            color: 0xff00ff,
        };
        three.material = new THREE.MeshLambertMaterial({ color: params.color });
        folder.addColor(params, 'color').onChange(() => {
            three.ovalMesh.material.color.set(params.color);
            three.foxMesh.material.color.set(params.color);
            three.roundMesh.material.color.set(params.color);
            three.squareMesh.material.color.set(params.color);
            three.bostonMesh.material.color.set(params.color);
            three.teardropMesh.material.color.set(params.color);
        });
        folder.open();
    };

    useEffect(() => {
        getLayout();
        // initRenderer
        const elm = canvasRef.current;
        three.renderer.setPixelRatio(window.devicePixelRatio);
        three.renderer.setSize(winSize.wd, winSize.wh);
        three.renderer.setPixelRatio(dpr); // retina対応
        three.renderer.setSize(winSize.wd, winSize.wh); // 画面サイズをセット
        three.renderer.physicallyCorrectLights = true;
        three.renderer.shadowMap.enabled = true; // シャドウを有効にする
        three.renderer.shadowMap.type = THREE.PCFSoftShadowMap; // PCFShadowMapの結果から更に隣り合う影との間を線形補間して描画する
        elm?.appendChild(three.renderer.domElement);
        // カメラ設定
        setCamera();
        // ライト設定
        setLight();
        // 3Dメッシュ設定
        setModels();
        initGUI();
        // イベントリスナー設定
        handleEvents();

        if (ua.indexOf('msie') !== -1 || ua.indexOf('trident') !== -1) {
            return;
        } else {
            mq.addEventListener('change', getLayout.bind(this));
        }
        return () => {
            elm?.removeChild(three.renderer.domElement);
        };
    }, []);

    return (
        <section className="mv">
            <div ref={canvasRef} />
            <button className="mv__button" onClick={selectBoston} ref={buttonBostonRef}>
                <p className="mv__label">1</p>
            </button>
            <button className="mv__button" onClick={selectOval} ref={buttonOvalRef}>
                <p className="mv__label">2</p>
            </button>
            <button className="mv__button" onClick={selectTeardrop} ref={buttonTeardropRef}>
                <p className="mv__label">3</p>
            </button>
            <button className="mv__button" onClick={selectSquare} ref={buttonSquareRef}>
                <p className="mv__label">4</p>
            </button>
            <button className="mv__button" onClick={selectRound} ref={buttonRoundRef}>
                <p className="mv__label">5</p>
            </button>
            <button className="mv__button" onClick={selectFox} ref={buttonFoxRef}>
                <p className="mv__label">6</p>
            </button>

            <div className="mv__links" ref={linksRef}>
                <a href="/" className="mv__link" data-hover="Home">
                    Home
                </a>
                <a href="https://github.com/kaitoooo/3d-glasses" target="_blank" rel="noopener noreferrer" className="mv__link" data-hover="GitHub">
                    GitHub
                </a>
                <a href="https://note.com/kaito_takase/n/n353aefd3961e" target="_blank" rel="noopener noreferrer" className="mv__link" data-hover="Note">
                    Note
                </a>
            </div>
            <div className="mv__buttons" ref={buttonsRef}>
                <button className="mv__text" onClick={changeBoston}>
                    Boston
                </button>
                <button className="mv__text" onClick={changeOval}>
                    Oval
                </button>
                <button className="mv__text" onClick={changeTeardrop}>
                    Teardrop
                </button>
                <button className="mv__text" onClick={changeSquare}>
                    Square
                </button>
                <button className="mv__text" onClick={changeRound}>
                    Round
                </button>
                <button className="mv__text" onClick={changeFox}>
                    Fox
                </button>
                <button className="mv__text" onClick={reset}>
                    Reset
                </button>
            </div>
        </section>
    );
};

export default WebGL;
