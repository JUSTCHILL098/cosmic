import { useEffect, useRef } from "react";

const FS = `
precision mediump float;
uniform float iTime;
uniform vec2 iResolution;
uniform float u_speed;
uniform float u_amplitude;
uniform float u_frequency;
uniform float u_starDensity;
uniform float u_colorShift;

float hash(vec2 p){return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453);}
float noise(vec2 p){
  vec2 i=floor(p);vec2 f=fract(p);
  f=f*f*(3.0-2.0*f);
  float a=hash(i),b=hash(i+vec2(1,0)),c=hash(i+vec2(0,1)),d=hash(i+vec2(1,1));
  return mix(mix(a,b,f.x),mix(c,d,f.x),f.y);
}
float fbm(vec2 p){
  float v=0.0,a=0.5;
  for(int i=0;i<4;i++){v+=a*noise(p);p*=2.0;a*=0.5;}
  return v;
}
float stars(vec2 p,float density){
  vec2 g=floor(p*density),l=fract(p*density);
  float h=hash(g);
  if(h>0.95){float d=length(l-0.5);return exp(-d*20.0)*(0.5+0.5*sin(iTime*2.0+h*10.0));}
  return 0.0;
}
void main(){
  vec2 uv=gl_FragCoord.xy/iResolution.xy;
  vec2 p=uv*2.0-1.0;
  p.x*=iResolution.x/iResolution.y;
  float t=iTime*u_speed;
  vec2 wp=p*u_frequency;
  wp.y+=t*0.3;
  float w1=sin(wp.x+cos(wp.y+t)*0.5)*u_amplitude;
  float w2=sin(wp.x*1.3-wp.y*0.7+t*1.2)*u_amplitude*0.7;
  float w3=sin(wp.x*0.8+wp.y*1.1-t*0.8)*u_amplitude*0.5;
  float waves=(w1+w2+w3)*0.3;
  float nv=fbm(p*1.5+vec2(t*0.1,t*0.05))*0.4;
  float pattern=waves+nv;
  vec3 c1=vec3(0.1,0.2,0.8),c2=vec3(0.6,0.1,0.9),c3=vec3(0.1,0.8,0.9),c4=vec3(0.9,0.3,0.6);
  float ct=fract((t*u_colorShift+pattern*2.0)*0.2);
  vec3 col;
  if(ct<0.25)col=mix(c1,c2,ct*4.0);
  else if(ct<0.5)col=mix(c2,c3,(ct-0.25)*4.0);
  else if(ct<0.75)col=mix(c3,c4,(ct-0.5)*4.0);
  else col=mix(c4,c1,(ct-0.75)*4.0);
  col*=(0.5+pattern*0.8);
  float sf=stars(p+vec2(t*0.02,t*0.01),u_starDensity*15.0);
  sf+=stars(p*1.5+vec2(-t*0.015,t*0.008),u_starDensity*12.0);
  col+=vec3(sf*0.8);
  col+=exp(-length(p)*0.5)*0.3*vec3(0.2,0.4,0.8);
  float vig=1.0-length(uv-0.5)*1.2;
  col*=smoothstep(0.0,1.0,vig);
  gl_FragColor=vec4(col,1.0);
}`;

const VS = `attribute vec2 a_pos;void main(){gl_Position=vec4(a_pos,0,1);}`;

export default function CosmicWaves({ speed=1, amplitude=1, frequency=1, starDensity=1, colorShift=1, style={}, className="" }) {
  const canvasRef = useRef(null);
  const rafRef    = useRef(null);
  const glRef     = useRef(null);
  const uRef      = useRef({});

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // Force canvas to fill its parent immediately
    const setSize = () => {
      const w = canvas.parentElement?.clientWidth  || window.innerWidth;
      const h = canvas.parentElement?.clientHeight || window.innerHeight;
      if (canvas.width !== w || canvas.height !== h) {
        canvas.width  = w;
        canvas.height = h;
        if (glRef.current) glRef.current.viewport(0, 0, w, h);
      }
    };

    const gl = canvas.getContext("webgl", { antialias: false, alpha: false });
    if (!gl) return;
    glRef.current = gl;

    const compile = (type, src) => {
      const s = gl.createShader(type);
      gl.shaderSource(s, src);
      gl.compileShader(s);
      if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) {
        console.error("Shader error:", gl.getShaderInfoLog(s));
      }
      return s;
    };

    const prog = gl.createProgram();
    gl.attachShader(prog, compile(gl.VERTEX_SHADER, VS));
    gl.attachShader(prog, compile(gl.FRAGMENT_SHADER, FS));
    gl.linkProgram(prog);
    gl.useProgram(prog);

    const buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1,-1, 1,-1, -1,1, 1,1]), gl.STATIC_DRAW);
    const loc = gl.getAttribLocation(prog, "a_pos");
    gl.enableVertexAttribArray(loc);
    gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);

    uRef.current = {
      iTime:        gl.getUniformLocation(prog, "iTime"),
      iResolution:  gl.getUniformLocation(prog, "iResolution"),
      u_speed:      gl.getUniformLocation(prog, "u_speed"),
      u_amplitude:  gl.getUniformLocation(prog, "u_amplitude"),
      u_frequency:  gl.getUniformLocation(prog, "u_frequency"),
      u_starDensity:gl.getUniformLocation(prog, "u_starDensity"),
      u_colorShift: gl.getUniformLocation(prog, "u_colorShift"),
    };

    gl.uniform1f(uRef.current.u_speed,       speed);
    gl.uniform1f(uRef.current.u_amplitude,   amplitude);
    gl.uniform1f(uRef.current.u_frequency,   frequency);
    gl.uniform1f(uRef.current.u_starDensity, starDensity);
    gl.uniform1f(uRef.current.u_colorShift,  colorShift);

    setSize();
    const ro = new ResizeObserver(setSize);
    ro.observe(canvas.parentElement || document.body);

    const start = performance.now();
    const draw = () => {
      setSize();
      gl.uniform1f(uRef.current.iTime, (performance.now() - start) / 1000);
      gl.uniform2f(uRef.current.iResolution, canvas.width, canvas.height);
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
      rafRef.current = requestAnimationFrame(draw);
    };
    draw();

    return () => {
      cancelAnimationFrame(rafRef.current);
      ro.disconnect();
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className={className}
      style={{ display: "block", width: "100%", height: "100%", ...style }}
    />
  );
}
