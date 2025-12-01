
import { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Calendar, MessageSquare, Shield } from 'lucide-react';
import AIChatAssistant from '@/components/AIChatAssistant';
import * as THREE from 'three';

const HeroSection = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Only load Three.js on client-side
    let scene: THREE.Scene, 
        camera: THREE.PerspectiveCamera, 
        renderer: THREE.WebGLRenderer,
        sphere: THREE.Mesh,
        animationFrameId: number;

    const init = async () => {
      if (!canvasRef.current || !containerRef.current) return;

      try {
        // Dynamic import of Three.js for client-side rendering
        const THREE = await import('three');
        
        // Initialize scene
        scene = new THREE.Scene();

        // Set up camera
        const width = containerRef.current.clientWidth;
        const height = containerRef.current.clientHeight;
        camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
        camera.position.z = 5;

        // Initialize renderer
        renderer = new THREE.WebGLRenderer({
          canvas: canvasRef.current,
          alpha: true,
          antialias: true
        });
        renderer.setSize(width, height);
        renderer.setPixelRatio(window.devicePixelRatio);

        // Create sphere geometry
        const geometry = new THREE.SphereGeometry(2, 64, 64);
        
        // Create material with custom shader
        const material = new THREE.MeshStandardMaterial({
          color: 0x0096e7,
          wireframe: true,
          transparent: true,
          opacity: 0.3,
        });

        // Create mesh
        sphere = new THREE.Mesh(geometry, material);
        scene.add(sphere);

        // Add ambient light
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
        scene.add(ambientLight);

        // Add directional light
        const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
        directionalLight.position.set(5, 5, 5);
        scene.add(directionalLight);

        // Handle window resize
        const handleResize = () => {
          if (!containerRef.current) return;
          
          const width = containerRef.current.clientWidth;
          const height = containerRef.current.clientHeight;
          
          camera.aspect = width / height;
          camera.updateProjectionMatrix();
          renderer.setSize(width, height);
        };

        window.addEventListener('resize', handleResize);

        // Animation loop
        const animate = () => {
          sphere.rotation.x += 0.001;
          sphere.rotation.y += 0.002;
          
          renderer.render(scene, camera);
          animationFrameId = requestAnimationFrame(animate);
        };

        animate();

        // Clean up
        return () => {
          window.removeEventListener('resize', handleResize);
          cancelAnimationFrame(animationFrameId);
          
          // Dispose resources
          geometry.dispose();
          material.dispose();
          renderer.dispose();
        };
      } catch (error) {
        console.error('Error initializing 3D scene:', error);
      }
    };

    init();

    return () => {
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
      }
    };
  }, []);

  return (
    <section className="min-h-screen relative overflow-hidden flex items-center pt-20 bg-gradient-to-b from-white to-blue-50">
      {/* Background 3D Sphere */}
      <div 
        ref={containerRef} 
        className="absolute inset-0 -z-10 opacity-70"
        aria-hidden="true"
      >
        <canvas
          ref={canvasRef}
          className="w-full h-full"
        />
      </div>
      
      <div className="container mx-auto px-4 py-16 md:py-24 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="stagger-animation">
            <div className="inline-block bg-blue-50 px-3 py-1 rounded-full text-medical-600 font-medium text-sm mb-6 border border-medical-100">
              Next-Gen Healthcare Platform
            </div>
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-gray-900 leading-tight mb-6">
              Advanced Medical <span className="text-medical-500">Technology</span> For Better Care
            </h1>
            <p className="text-lg text-gray-700 mb-8 max-w-lg">
              Experience the future of healthcare with AI diagnostics, blockchain records, and real-time facility mapping—all in one secure platform.
            </p>
            
            <div className="flex flex-wrap gap-4">
              <Link to="/appointments" className="btn-primary">
                <Calendar size={18} className="mr-2" />
                Book Appointment
              </Link>
              <Link to="/mission" className="btn-secondary">
                Learn More <ArrowRight size={18} className="ml-2" />
              </Link>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-12">
              <div className="flex items-start gap-3">
                <div className="bg-white p-2 rounded-lg shadow-md">
                  <Shield className="h-6 w-6 text-medical-500" />
                </div>
                <div>
                  <h3 className="font-medium text-gray-900">HIPAA Compliant</h3>
                  <p className="text-sm text-gray-600">Secure and protected data</p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <div className="bg-white p-2 rounded-lg shadow-md">
                  <MessageSquare className="h-6 w-6 text-medical-500" />
                </div>
                <div>
                  <h3 className="font-medium text-gray-900">24/7 Support</h3>
                  <p className="text-sm text-gray-600">Always here to help</p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <div className="bg-white p-2 rounded-lg shadow-md">
                  <Calendar className="h-6 w-6 text-medical-500" />
                </div>
                <div>
                  <h3 className="font-medium text-gray-900">Easy Scheduling</h3>
                  <p className="text-sm text-gray-600">Book appointments online</p>
                </div>
              </div>
            </div>
          </div>
          
          <div className="lg:ml-auto animate-float">
            <div className="absolute -inset-1 bg-gradient-to-r from-medical-200 to-medical-400 rounded-2xl blur-3xl opacity-30 pointer-events-none"></div>
            <AIChatAssistant />
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
