import React, { useRef, useEffect, useState } from 'react';
import styled from 'styled-components';
import * as THREE from 'three';
import { media } from '../styles';

const StyledViewerContainer = styled.div`
  position: relative;
  width: 100%;
  height: 400px;
  background: var(--navy);
  border-radius: 10px;
  border: 1px solid var(--light-navy);
  overflow: hidden;

  ${media.tablet`
    height: 300px;
  `}

  ${media.phone`
    height: 250px;
  `}
`;

const StyledCanvas = styled.canvas`
  width: 100% !important;
  height: 100% !important;
`;

const StyledControls = styled.div`
  position: absolute;
  top: 15px;
  right: 15px;
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const StyledControlButton = styled.button`
  width: 35px;
  height: 35px;
  background: rgba(100, 255, 218, 0.1);
  border: 1px solid var(--green);
  border-radius: 6px;
  color: var(--green);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
  backdrop-filter: blur(10px);

  &:hover {
    background: rgba(100, 255, 218, 0.2);
    transform: scale(1.05);
  }

  svg {
    width: 16px;
    height: 16px;
  }
`;

const StyledInfo = styled.div`
  position: absolute;
  bottom: 15px;
  left: 15px;
  background: rgba(10, 25, 47, 0.9);
  border: 1px solid var(--light-navy);
  border-radius: 8px;
  padding: 12px 16px;
  backdrop-filter: blur(10px);

  h4 {
    color: var(--green);
    font-size: var(--fz-sm);
    font-family: var(--font-mono);
    margin: 0 0 5px 0;
  }

  p {
    color: var(--slate);
    font-size: var(--fz-xs);
    margin: 0;
    line-height: 1.3;
  }
`;

const StyledLoading = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  color: var(--green);
  font-family: var(--font-mono);
  font-size: var(--fz-sm);
  display: flex;
  align-items: center;
  gap: 10px;

  .spinner {
    width: 20px;
    height: 20px;
    border: 2px solid var(--light-navy);
    border-top: 2px solid var(--green);
    border-radius: 50%;
    animation: spin 1s linear infinite;
  }

  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`;

const Bot3DViewer = () => {
  const canvasRef = useRef(null);
  const sceneRef = useRef(null);
  const rendererRef = useRef(null);
  const cameraRef = useRef(null);
  const animationIdRef = useRef(null);
  const [isLoading, setIsLoading] = useState(true);
  const [currentAnimation, setCurrentAnimation] = useState('idle');

  // Financial data visualization objects
  const objectsRef = useRef({
    financialSphere: null,
    dataRings: [],
    particles: [],
    chart: null
  });

  useEffect(() => {
    if (!canvasRef.current) return;

    initThreeJS();
    createFinancialVisualization();
    animate();

    // Clean up
    return () => {
      if (animationIdRef.current) {
        cancelAnimationFrame(animationIdRef.current);
      }
      if (rendererRef.current) {
        rendererRef.current.dispose();
      }
    };
  }, []);

  const initThreeJS = () => {
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();

    // Scene
    sceneRef.current = new THREE.Scene();
    sceneRef.current.background = new THREE.Color(0x0a192f);

    // Camera
    cameraRef.current = new THREE.PerspectiveCamera(
      75,
      rect.width / rect.height,
      0.1,
      1000
    );
    cameraRef.current.position.set(0, 0, 5);

    // Renderer
    rendererRef.current = new THREE.WebGLRenderer({
      canvas: canvas,
      antialias: true,
      alpha: true
    });
    rendererRef.current.setSize(rect.width, rect.height);
    rendererRef.current.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    // Lighting
    const ambientLight = new THREE.AmbientLight(0x64ffda, 0.3);
    sceneRef.current.add(ambientLight);

    const pointLight = new THREE.PointLight(0x64ffda, 1, 100);
    pointLight.position.set(5, 5, 5);
    sceneRef.current.add(pointLight);

    const directionalLight = new THREE.DirectionalLight(0x64ffda, 0.5);
    directionalLight.position.set(-5, 5, 5);
    sceneRef.current.add(directionalLight);
  };

  const createFinancialVisualization = () => {
    // Central financial sphere (brain of the bot)
    const sphereGeometry = new THREE.SphereGeometry(1, 32, 32);
    const sphereMaterial = new THREE.MeshPhongMaterial({
      color: 0x64ffda,
      transparent: true,
      opacity: 0.7,
      wireframe: false
    });
    
    objectsRef.current.financialSphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
    sceneRef.current.add(objectsRef.current.financialSphere);

    // Data rings around the sphere
    for (let i = 0; i < 3; i++) {
      const ringGeometry = new THREE.RingGeometry(1.5 + i * 0.5, 1.7 + i * 0.5, 64);
      const ringMaterial = new THREE.MeshBasicMaterial({
        color: 0x64ffda,
        transparent: true,
        opacity: 0.3 - i * 0.1,
        side: THREE.DoubleSide
      });
      
      const ring = new THREE.Mesh(ringGeometry, ringMaterial);
      ring.rotation.x = Math.PI / 2 + (i * 0.2);
      ring.rotation.y = i * 0.5;
      
      objectsRef.current.dataRings.push(ring);
      sceneRef.current.add(ring);
    }

    // Floating particles (data points)
    const particleCount = 100;
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);

    for (let i = 0; i < particleCount; i++) {
      const i3 = i * 3;
      
      // Position
      const radius = 3 + Math.random() * 3;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.random() * Math.PI;
      
      positions[i3] = radius * Math.sin(phi) * Math.cos(theta);
      positions[i3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
      positions[i3 + 2] = radius * Math.cos(phi);
      
      // Colors (green spectrum)
      colors[i3] = 0.4 + Math.random() * 0.6; // R
      colors[i3 + 1] = 1; // G
      colors[i3 + 2] = 0.85 + Math.random() * 0.15; // B
    }

    const particleGeometry = new THREE.BufferGeometry();
    particleGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    particleGeometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    const particleMaterial = new THREE.PointsMaterial({
      size: 0.05,
      vertexColors: true,
      transparent: true,
      opacity: 0.8,
      blending: THREE.AdditiveBlending
    });

    objectsRef.current.particles = new THREE.Points(particleGeometry, particleMaterial);
    sceneRef.current.add(objectsRef.current.particles);

    // Financial chart visualization
    createFinancialChart();

    setIsLoading(false);
  };

  const createFinancialChart = () => {
    const chartGroup = new THREE.Group();
    
    // Create bar chart representing financial data
    const barCount = 7;
    const barWidth = 0.15;
    const barSpacing = 0.3;
    const startX = -(barCount - 1) * barSpacing / 2;

    for (let i = 0; i < barCount; i++) {
      const height = 0.5 + Math.random() * 1.5;
      const barGeometry = new THREE.BoxGeometry(barWidth, height, barWidth);
      const barMaterial = new THREE.MeshPhongMaterial({
        color: new THREE.Color().setHSL(0.35 + i * 0.1, 0.8, 0.6),
        transparent: true,
        opacity: 0.8
      });
      
      const bar = new THREE.Mesh(barGeometry, barMaterial);
      bar.position.set(startX + i * barSpacing, height / 2 - 2.5, 0);
      
      chartGroup.add(bar);
    }

    chartGroup.position.y = -1;
    objectsRef.current.chart = chartGroup;
    sceneRef.current.add(chartGroup);
  };

  const animate = () => {
    if (!sceneRef.current || !rendererRef.current || !cameraRef.current) return;

    // Rotate financial sphere
    if (objectsRef.current.financialSphere) {
      objectsRef.current.financialSphere.rotation.x += 0.01;
      objectsRef.current.financialSphere.rotation.y += 0.01;
    }

    // Rotate data rings
    objectsRef.current.dataRings.forEach((ring, index) => {
      ring.rotation.z += 0.005 * (index + 1);
    });

    // Animate particles
    if (objectsRef.current.particles) {
      objectsRef.current.particles.rotation.y += 0.002;
      
      const positions = objectsRef.current.particles.geometry.attributes.position.array;
      for (let i = 0; i < positions.length; i += 3) {
        positions[i + 1] += Math.sin(Date.now() * 0.001 + i) * 0.002;
      }
      objectsRef.current.particles.geometry.attributes.position.needsUpdate = true;
    }

    // Animate financial chart
    if (objectsRef.current.chart) {
      objectsRef.current.chart.rotation.y += 0.003;
    }

    // Camera orbit animation
    const time = Date.now() * 0.0005;
    cameraRef.current.position.x = Math.cos(time) * 6;
    cameraRef.current.position.z = Math.sin(time) * 6;
    cameraRef.current.lookAt(0, 0, 0);

    rendererRef.current.render(sceneRef.current, cameraRef.current);
    animationIdRef.current = requestAnimationFrame(animate);
  };

  const handleReset = () => {
    if (cameraRef.current) {
      cameraRef.current.position.set(0, 0, 5);
      cameraRef.current.lookAt(0, 0, 0);
    }
  };

  const handleZoomIn = () => {
    if (cameraRef.current) {
      cameraRef.current.position.multiplyScalar(0.9);
    }
  };

  const handleZoomOut = () => {
    if (cameraRef.current) {
      cameraRef.current.position.multiplyScalar(1.1);
    }
  };

  const handleResize = () => {
    if (!canvasRef.current || !rendererRef.current || !cameraRef.current) return;
    
    const rect = canvasRef.current.getBoundingClientRect();
    cameraRef.current.aspect = rect.width / rect.height;
    cameraRef.current.updateProjectionMatrix();
    rendererRef.current.setSize(rect.width, rect.height);
  };

  useEffect(() => {
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <StyledViewerContainer>
      <StyledCanvas ref={canvasRef} />
      
      {isLoading && (
        <StyledLoading>
          <div className="spinner"></div>
          Loading 3D Model...
        </StyledLoading>
      )}

      <StyledControls>
        <StyledControlButton onClick={handleZoomIn} title="Zoom In">
          <svg viewBox="0 0 24 24" fill="currentColor">
            <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/>
          </svg>
        </StyledControlButton>
        
        <StyledControlButton onClick={handleZoomOut} title="Zoom Out">
          <svg viewBox="0 0 24 24" fill="currentColor">
            <path d="M19 13H5v-2h14v2z"/>
          </svg>
        </StyledControlButton>
        
        <StyledControlButton onClick={handleReset} title="Reset View">
          <svg viewBox="0 0 24 24" fill="currentColor">
            <path d="M17.65,6.35C16.2,4.9 14.21,4 12,4A8,8 0 0,0 4,12A8,8 0 0,0 12,20C15.73,20 18.84,17.45 19.73,14H17.65C16.83,16.33 14.61,18 12,18A6,6 0 0,1 6,12A6,6 0 0,1 12,6C13.66,6 15.14,6.69 16.22,7.78L13,11H20V4L17.65,6.35Z"/>
          </svg>
        </StyledControlButton>
      </StyledControls>

      <StyledInfo>
        <h4>AI Financial Brain</h4>
        <p>Visualisasi real-time dari proses analisis keuangan AI</p>
      </StyledInfo>
    </StyledViewerContainer>
  );
};

export default Bot3DViewer;