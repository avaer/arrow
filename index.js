import * as THREE from 'three';
import metaversefile from 'metaversefile';
const {useFrame} = metaversefile;

export default () => {
  const geometry = new THREE.PlaneBufferGeometry(0.5, 0.5)
	  .applyMatrix4(
		  new THREE.Matrix4()
			  .makeRotationFromQuaternion(
				  new THREE.Quaternion()
					  .setFromAxisAngle(new THREE.Vector3(0, 0, 1), Math.PI)
			  )
	  );

  // console.log('got bounding box', boundingBox);

	const u = `${import.meta.url.replace(/(\/)[^\/]*$/, '$1')}_Down Tap Note 16x16.png`;
  (async () => {
    const img = await new Promise((accept, reject) => {
      const img = new Image();
      img.onload = () => {
        accept(img);
      };
      img.onerror = reject;
      img.crossOrigin = 'Anonymous';
      img.src = u;
    });
    tex.image = img;
    tex.needsUpdate = true;
  })();
	const tex = new THREE.Texture();
	// tex.minFilter = THREE.NearestFilter;
	tex.magFilter = THREE.NearestFilter;

	const material = new THREE.ShaderMaterial({
    uniforms: {
      tex: {
        type: 't',
        value: tex,
        needsUpdate: true,
      },
			uTime: {
        type: 'f',
        value: 0,
        needsUpdate: true,
      },
    },
    vertexShader: `\
      precision highp float;
      precision highp int;
      varying vec2 vUv;
      void main() {
        vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
        gl_Position = projectionMatrix * mvPosition;
				
				vUv = uv;
      }
    `,
    fragmentShader: `\
      precision highp float;
      precision highp int;
      #define PI 3.1415926535897932384626433832795
      uniform sampler2D tex;
			uniform float uTime;
      varying vec2 vUv;
      void main() {
				float t = floor(uTime * 16. * 16.);
				float x = mod(t, 16.);
				// float y = floor((uTime - x) / 16.);
				float y = 0.;
				vec2 uv = (vUv / 16.0) + vec2(x, y)/16.;
        gl_FragColor = texture2D(tex, uv);
				if (gl_FragColor.a < 0.9) {
				  discard;
				}
      }
    `,
    transparent: true,
    // polygonOffset: true,
    // polygonOffsetFactor: -1,
    // polygonOffsetUnits: 1,
  });
  const mesh = new THREE.Mesh(geometry, material);
  useFrame(() => {
	  material.uniforms.uTime.value = (Date.now() % 30000) / 30000;
	});
  return mesh;
};