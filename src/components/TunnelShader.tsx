import { shaderMaterial } from '@react-three/drei';

export const TunnelShader = shaderMaterial(
  {
    uTime: 0.0,
    uLevel: 0.0,
  },
  /* glsl */ `
  varying vec2 vUv;

  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }`,

  /* glsl */ `
  float PI = 3.1415926535897932384626433832795; 

  uniform float uTime;
  uniform float uLevel;
  varying vec2 vUv;

  
  float sdCircle( vec2 p, float r )
  {
      return length(p) - r;
  }

  float sdEquilateralTriangle( in vec2 p, in float r )
  {
      const float k = sqrt(3.0);
      p.x = abs(p.x) - r;
      p.y = p.y + r/k;
      if( p.x+k*p.y>0.0 ) p = vec2(p.x-k*p.y,-k*p.x-p.y)/2.0;
      p.x -= clamp( p.x, -2.0*r, 0.0 );
      return -length(p)*sign(p.y);
  }

  float sdBox( in vec2 p, in vec2 b )
  {
      vec2 d = abs(p)-b;
      return length(max(d,0.0)) + min(max(d.x,d.y),0.0);
  }

  float sdPentagon( in vec2 p, in float r )
  {
      const vec3 k = vec3(0.809016994,0.587785252,0.726542528);
      p.x = abs(p.x);
      p -= 2.0*min(dot(vec2(-k.x,k.y),p),0.0)*vec2(-k.x,k.y);
      p -= 2.0*min(dot(vec2( k.x,k.y),p),0.0)*vec2( k.x,k.y);
      p -= vec2(clamp(p.x,-r*k.z,r*k.z),r);    
      return length(p)*sign(p.y);
  }

  float sdHexagon( in vec2 p, in float r )
  {
      const vec3 k = vec3(-0.866025404,0.5,0.577350269);
      p = abs(p);
      p -= 2.0*min(dot(k.xy,p),0.0)*k.xy;
      p -= vec2(clamp(p.x, -k.z*r, k.z*r), r);
      return length(p)*sign(p.y);
  }

  float sdOctogon( in vec2 p, in float r )
  {
      const vec3 k = vec3(-0.9238795325, 0.3826834323, 0.4142135623 );
      p = abs(p);
      p -= 2.0*min(dot(vec2( k.x,k.y),p),0.0)*vec2( k.x,k.y);
      p -= 2.0*min(dot(vec2(-k.x,k.y),p),0.0)*vec2(-k.x,k.y);
      p -= vec2(clamp(p.x, -k.z*r, k.z*r), r);
      return length(p)*sign(p.y);
  }

  vec3 palette(float t, vec3 a, vec3 b, vec3 c, vec3 d) {
    return a + b * cos(6.28318 * (c * t + d));
  }

  vec3 a = vec3(0.5, 0.5, 0.5);
  vec3 b = vec3(0.5, 0.5, 0.5);
  vec3 c = vec3(1.0, 1.0, 1.0);
  vec3 d = vec3(0.00, 0.33, 0.67);

  vec2 rotate(vec2 v, float a) {
    float s = sin(a);
    float c = cos(a);
    mat2 m = mat2(c, s, -s, c);
    return m * v;
  }

  void main() {
    // vec2 uv = vUv - vec2(0.5);

    // rotate
    vec2 uv = rotate(vUv - vec2(0.5), uLevel * PI/2.);
    
    // create scene
    // float scene = sdCircle(uv, 0.2);
    // float scene = sdBox(uv, vec2(0.2));
    float scene = mix(
        sdCircle(uv, 0.2),
        // sdEquilateralTriangle(uv, 0.2),
        // sdBox(uv, vec2(0.2)),
        // sdPentagon(uv, 0.2),
        sdHexagon(uv, 0.2),
        // sdOctogon(uv, 0.2),
        2. * (sin(uLevel * PI * 3.) + 1.)
    );

    float dd = scene;

    // coloring
    vec3 col = vec3(1.);
    col *= 1.0 - exp(-6.0*abs(dd * 6.));
    vec3 color = palette(fract(uLevel) * 2., a, b, c, d);

    if (scene < 0.0) {
      discard;
    }
    
    gl_FragColor = vec4(col + color * 0.6, 1.);
  }
  `
);
