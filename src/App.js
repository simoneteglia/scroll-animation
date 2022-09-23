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
	const container = useRef();
	return (
		<div style={{ width: "100vw", height: "100vh", margin: 0, padding: 0 }}>
			<Canvas
				dpr={[1, 2]}
				camera={{ position: [0, 0, 8] }}
				ref={container}
			>
				<color attach="background" args={["goldenrod"]} />
				<Center>
					<ScrollControls pages={4} damping={5}>
						<Composition containerRef={container} />
					</ScrollControls>
				</Center>
				<Lights />
			</Canvas>
		</div>
	);
}

function Composition({ containerRef }) {
	const title = useRef();
	const scroll = useScroll();
	const { width, height } = useThree((state) => state.viewport);

	useFrame((state, delta) => {
		const r1 = scroll.range(0, 1 / 4);
		const r2 = scroll.range(1 / 4, 1 / 4);
		const r3 = scroll.range(2 / 4, 1 / 4);
		const r4 = scroll.range(3 / 4, 1 / 4);
		const offset = -1 - r1 - 1 - r2 - 1 - r3 - 1 - r4;
		const radius = 1;
		state.camera.position.set(
			Math.sin((offset * Math.PI) / 2),
			0,
			Math.cos((offset * Math.PI) / 2)
		);
		state.camera.lookAt(0, 0, 0);

		if (containerRef.current) {
			containerRef.current.style.width = `${100 * (1 - r1)}vw`;
			console.log(containerRef.current);
		}
	});

	return (
		<>
			<Suzi scale={0.4} />
		</>
	);
}

function Suzi(props) {
	const { scene, materials } = useGLTF(
		"https://market-assets.fra1.cdn.digitaloceanspaces.com/market-assets/models/suzanne-high-poly/model.gltf"
	);
	React.useLayoutEffect(() => {
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

	return <primitive object={scene} {...props} />;
}

const Lights = () => {
	return (
		<>
			<AccumulativeShadows
				temporal
				frames={100}
				color="red"
				alphaTest={0.65}
				opacity={2}
				scale={14}
				position={[0, -0.5, 0]}
			>
				<RandomizedLight
					amount={10}
					radius={4}
					ambient={0.5}
					bias={0.001}
					position={[5, 5, -10]}
				/>
			</AccumulativeShadows>
			<Environment preset="sunset" />
		</>
	);
};

export default App;
