import React, { useEffect, useRef, forwardRef } from "react";
import * as THREE from "three";
import { applyProps, Canvas, useFrame, useThree } from "@react-three/fiber";
import {
	Center,
	OrbitControls,
	useGLTF,
	Environment,
	RandomizedLight,
	AccumulativeShadows,
	useScroll,
	ScrollControls,
	Html,
} from "@react-three/drei";
import { FlakesTexture } from "three/examples/jsm/textures/FlakesTexture";

function App() {
	return (
		<Canvas dpr={[1, 2]}>
			<color attach="background" args={["goldenrod"]} />
			<Center>
				<ScrollControls pages={4}>
					<Composition />
				</ScrollControls>
			</Center>
			<Lights />
		</Canvas>
	);
}

function Composition() {
	const title = useRef();
	const scroll = useScroll();
	const { width, height } = useThree((state) => state.viewport);

	useFrame((state, delta) => {
		const r1 = scroll.range(0, 1 / 4);
		const r2 = scroll.range(1 / 4, 1 / 4);
		state.camera.position.set((1 - r1) * 5 - r2 * 5, 0, 5);
		state.camera.lookAt(0, 0, 0);

		console.log(r1);
	});

	return (
		<>
			<Suzi scale={2.5} />
		</>
	);
}

function Suzi(props) {
	const front = useRef();

	const { scene, materials } = useGLTF(
		"https://market-assets.fra1.cdn.digitaloceanspaces.com/market-assets/models/suzanne-high-poly/model.gltf"
	);
	React.useLayoutEffect(() => {
		scene.traverse(
			(obj) => obj.isMesh && (obj.receiveShadow = obj.castShadow = true)
		);
		applyProps(materials.default, {
			color: "silver",
			roughness: 0,
			normalMap: new THREE.CanvasTexture(
				new FlakesTexture(),
				THREE.UVMapping,
				THREE.RepeatWrapping,
				THREE.RepeatWrapping
			),
			"normalMap-flipY": false,
			"normalMap-repeat": [40, 40],
			normalScale: [0.05, 0.05],
		});
	});

	return <primitive object={scene} position={[0, 10, 0]} {...props} />;
}

const Tag = forwardRef(({ text, ...props }, ref) => {
	return (
		<Html ref={ref} className="data" center {...props}>
			<h1>{text}</h1>
		</Html>
	);
});

const Lights = () => {
	return (
		<>
			<AccumulativeShadows
				temporal
				frames={100}
				color="goldenrod"
				alphaTest={0.65}
				opacity={2}
				scale={14}
				position={[0, -0.5, 0]}
			>
				<RandomizedLight
					amount={8}
					radius={4}
					ambient={0.5}
					bias={0.001}
					position={[5, 5, -10]}
				/>
			</AccumulativeShadows>
			<Environment preset="city" />
		</>
	);
};

export default App;
