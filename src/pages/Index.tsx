
import { Link } from 'react-router-dom';
import { 
  ArrowRight, 
  Heart, 
  Shield, 
  Cpu, 
  Clock, 
  Activity, 
  Zap, 
  Calendar, 
  MessageSquare,
  Video,
  MapPin,
  ChevronRight
} from 'lucide-react';
import MainLayout from '@/layouts/MainLayout';
import HeroSection from '@/components/HeroSection';
import ServiceCard from '@/components/ServiceCard';

const Index = () => {
  return (
    <MainLayout>
      {/* Hero Section */}
      <HeroSection />
      
      {/* Services Section */}
      <section className="py-16 md:py-24 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <div className="inline-block bg-blue-50 px-3 py-1 rounded-full text-medical-600 font-medium text-sm mb-4 border border-medical-100">
              Our Services
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Advanced Healthcare Solutions
            </h2>
            <p className="text-lg text-gray-700">
              Cutting-edge technology and personalized care come together to provide you with the best medical experience possible.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <ServiceCard
              title="AI-Powered Diagnostics"
              description="Our advanced AI algorithms analyze your symptoms and medical history to provide rapid, accurate diagnostic insights."
              icon={<Cpu className="h-6 w-6" />}
            />
            
            <ServiceCard
              title="Blockchain Medical Records"
              description="Your medical data is securely stored using blockchain technology, ensuring privacy, integrity, and easy access when needed."
              icon={<Shield className="h-6 w-6" />}
            />
            
            <ServiceCard
              title="Real-time IoT Monitoring"
              description="Continuous health monitoring through connected devices for early detection and prevention of medical issues."
              icon={<Activity className="h-6 w-6" />}
            />
            
            <ServiceCard
              title="Virtual Consultations"
              description="Connect with our specialists from anywhere through secure, high-definition video consultations."
              icon={<Video className="h-6 w-6" />}
            />
            
            <ServiceCard
              title="Emergency Response"
              description="Rapid emergency services with real-time tracking and immediate medical attention when you need it most."
              icon={<Zap className="h-6 w-6" />}
            />
            
            <ServiceCard
              title="Interactive 3D Mapping"
              description="Locate the nearest healthcare facilities and track emergency services in real-time with our interactive 3D map."
              icon={<MapPin className="h-6 w-6" />}
            />
          </div>
          
          <div className="text-center mt-12">
            <Link to="/mission" className="btn-secondary">
              Learn More About Our Services <ArrowRight size={18} className="ml-2" />
            </Link>
          </div>
        </div>
      </section>
      
      {/* Feature Highlight */}
      <section className="py-16 md:py-24 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="order-2 lg:order-1">
              <div className="inline-block bg-blue-50 px-3 py-1 rounded-full text-medical-600 font-medium text-sm mb-4 border border-medical-100">
                Featured Technology
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                Interactive 3D Healthcare Map
              </h2>
              <p className="text-lg text-gray-700 mb-6">
                Our revolutionary 3D mapping technology allows you to visualize and locate healthcare services in real-time. Find the nearest hospitals, track ambulances, and get estimated arrival times during emergencies.
              </p>
              
              <ul className="space-y-4 mb-8">
                <li className="flex items-start">
                  <div className="bg-medical-100 p-1 rounded-full text-medical-700 mr-3 mt-1">
                    <ChevronRight size={16} />
                  </div>
                  <span className="text-gray-700">Real-time location tracking of medical facilities</span>
                </li>
                <li className="flex items-start">
                  <div className="bg-medical-100 p-1 rounded-full text-medical-700 mr-3 mt-1">
                    <ChevronRight size={16} />
                  </div>
                  <span className="text-gray-700">Live ambulance tracking during emergencies</span>
                </li>
                <li className="flex items-start">
                  <div className="bg-medical-100 p-1 rounded-full text-medical-700 mr-3 mt-1">
                    <ChevronRight size={16} />
                  </div>
                  <span className="text-gray-700">Facility availability status updates</span>
                </li>
              </ul>
              
              <Link to="/map" className="btn-primary">
                Explore 3D Map <MapPin size={18} className="ml-2" />
              </Link>
            </div>
            
            <div className="order-1 lg:order-2">
              <div className="relative">
                <div className="absolute -inset-2 bg-gradient-to-r from-medical-200 to-medical-400 rounded-2xl blur-xl opacity-30"></div>
                <div className="relative overflow-hidden rounded-2xl shadow-2xl">
                  <img 
                    src="/map-preview.png" 
                    alt="3D Healthcare Map" 
                    className="w-full h-auto object-cover"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = 'https://placehold.co/600x400/e0effe/0c96e7?text=3D+Healthcare+Map';
                    }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="py-16 md:py-24 bg-gradient-to-br from-medical-600 to-medical-800 text-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Ready to Experience the Future of Healthcare?
            </h2>
            <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
              Join thousands of patients who have transformed their healthcare experience with our cutting-edge platform.
            </p>
            
            <div className="flex flex-wrap justify-center gap-4">
              <Link to="/appointments" className="btn-primary bg-white text-medical-700 hover:bg-gray-100">
                <Calendar size={18} className="mr-2" />
                Book an Appointment
              </Link>
              <Link to="/consultation" className="btn-secondary border-white/30 bg-transparent text-white hover:bg-white/10">
                <MessageSquare size={18} className="mr-2" />
                Start a Consultation
              </Link>
            </div>
          </div>
        </div>
      </section>
      
      {/* Testimonials */}
      <section className="py-16 md:py-24 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <div className="inline-block bg-blue-50 px-3 py-1 rounded-full text-medical-600 font-medium text-sm mb-4 border border-medical-100">
              Testimonials
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              What Our Patients Say
            </h2>
            <p className="text-lg text-gray-700">
              Don't just take our word for it. Here's what our patients have to say about their experience with MediSphere.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-gray-50 p-6 rounded-xl border border-gray-200">
              <div className="flex items-center mb-4">
                <div className="h-12 w-12 rounded-full bg-medical-200 flex-shrink-0 mr-4 flex items-center justify-center font-bold text-medical-700">
                  JD
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900">John Doe</h4>
                  <p className="text-sm text-gray-600">Patient since 2022</p>
                </div>
              </div>
              <p className="text-gray-700 mb-4">
                "The 3D map feature was incredibly helpful during my emergency. I could see exactly where the ambulance was and how long it would take to arrive."
              </p>
              <div className="flex text-yellow-400">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path></svg>
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path></svg>
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path></svg>
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path></svg>
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path></svg>
              </div>
            </div>
            
            <div className="bg-gray-50 p-6 rounded-xl border border-gray-200">
              <div className="flex items-center mb-4">
                <div className="h-12 w-12 rounded-full bg-medical-200 flex-shrink-0 mr-4 flex items-center justify-center font-bold text-medical-700">
                  SP
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900">Sarah Parker</h4>
                  <p className="text-sm text-gray-600">Patient since 2021</p>
                </div>
              </div>
              <p className="text-gray-700 mb-4">
                "I love how I can access my medical records securely with blockchain. It's given me peace of mind knowing my data is protected."
              </p>
              <div className="flex text-yellow-400">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path></svg>
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path></svg>
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path></svg>
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path></svg>
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path></svg>
              </div>
            </div>
            
            <div className="bg-gray-50 p-6 rounded-xl border border-gray-200">
              <div className="flex items-center mb-4">
                <div className="h-12 w-12 rounded-full bg-medical-200 flex-shrink-0 mr-4 flex items-center justify-center font-bold text-medical-700">
                  ML
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900">Michael Lee</h4>
                  <p className="text-sm text-gray-600">Patient since 2023</p>
                </div>
              </div>
              <p className="text-gray-700 mb-4">
                "The virtual consultations are seamless. I was able to speak with a specialist without having to drive across town. It saved me so much time."
              </p>
              <div className="flex text-yellow-400">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path></svg>
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path></svg>
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path></svg>
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path></svg>
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path></svg>
              </div>
            </div>
          </div>
        </div>
      </section>
    </MainLayout>
  );
};

export default Index;
