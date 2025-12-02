
import { ArrowRight, Heart, Shield, Cpu, Brain, Zap } from 'lucide-react';
import { Link } from 'react-router-dom';
import MainLayout from '@/layouts/MainLayout';

const Mission = () => {
  return (
    <MainLayout>
      {/* Hero Section */}
      <section className="pt-32 pb-16 md:pb-24 bg-gradient-to-b from-blue-50 to-white">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center mb-12">
            <div className="inline-block bg-blue-50 px-3 py-1 rounded-full text-medical-600 font-medium text-sm mb-4 border border-medical-100">
              Our Mission
            </div>
            <h1 className="text-3xl md:text-5xl font-bold text-gray-900 mb-6">
              Revolutionizing Healthcare Through Technology
            </h1>
            <p className="text-lg text-gray-700 mb-8">
              At MediSphere, we're committed to transforming healthcare delivery with cutting-edge technology and compassionate care.
            </p>
          </div>
          
          <div className="relative mx-auto max-w-5xl rounded-2xl overflow-hidden shadow-xl">
            <img
              src="/mission-banner.png"
              alt="Healthcare professionals using advanced technology"
              className="w-full h-auto object-cover"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.src = 'https://placehold.co/1200x600/e0effe/0c96e7?text=Our+Mission';
              }}
            />
          </div>
        </div>
      </section>
      
      {/* Vision & Values */}
      <section className="py-16 md:py-24 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <div className="inline-block bg-blue-50 px-3 py-1 rounded-full text-medical-600 font-medium text-sm mb-4 border border-medical-100">
                Our Vision
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                Healthcare Without Boundaries
              </h2>
              <p className="text-lg text-gray-700 mb-6">
                We envision a world where quality healthcare is accessible to everyone, regardless of location or socioeconomic status. By leveraging AI, blockchain, and IoT technologies, we're breaking down traditional barriers to care.
              </p>
              <p className="text-lg text-gray-700 mb-6">
                Our platform connects patients with healthcare providers seamlessly, while ensuring data security and privacy through blockchain technology. We're not just treating illnesses – we're revolutionizing how healthcare is delivered.
              </p>
              <Link to="/appointments" className="btn-primary">
                Experience the Difference <ArrowRight size={18} className="ml-2" />
              </Link>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="glass-card p-6">
                <div className="inline-flex items-center justify-center p-3 bg-medical-100 rounded-xl text-medical-700 mb-4">
                  <Heart className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-semibold text-gray-800 mb-2">Patient-Centered</h3>
                <p className="text-gray-600">
                  We put patients first in everything we do, designing our technology around their needs and experiences.
                </p>
              </div>
              
              <div className="glass-card p-6">
                <div className="inline-flex items-center justify-center p-3 bg-medical-100 rounded-xl text-medical-700 mb-4">
                  <Shield className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-semibold text-gray-800 mb-2">Security & Privacy</h3>
                <p className="text-gray-600">
                  We employ blockchain technology to ensure your medical data remains secure, private, and under your control.
                </p>
              </div>
              
              <div className="glass-card p-6">
                <div className="inline-flex items-center justify-center p-3 bg-medical-100 rounded-xl text-medical-700 mb-4">
                  <Cpu className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-semibold text-gray-800 mb-2">Technology-Driven</h3>
                <p className="text-gray-600">
                  We harness the latest technologies to improve diagnostics, treatment, and overall patient experience.
                </p>
              </div>
              
              <div className="glass-card p-6">
                <div className="inline-flex items-center justify-center p-3 bg-medical-100 rounded-xl text-medical-700 mb-4">
                  <Brain className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-semibold text-gray-800 mb-2">Continuous Innovation</h3>
                <p className="text-gray-600">
                  We're committed to ongoing research and development to stay at the forefront of healthcare technology.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Our Impact */}
      <section className="py-16 md:py-24 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <div className="inline-block bg-blue-50 px-3 py-1 rounded-full text-medical-600 font-medium text-sm mb-4 border border-medical-100">
              Our Impact
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Transforming Healthcare Outcomes
            </h2>
            <p className="text-lg text-gray-700">
              Our technology has made a significant difference in healthcare delivery and patient outcomes.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-xl border border-gray-200 text-center">
              <div className="text-4xl font-bold text-medical-600 mb-4">94%</div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">Diagnosis Accuracy</h3>
              <p className="text-gray-600">
                Our AI-powered diagnostic system has achieved 94% accuracy in preliminary assessments.
              </p>
            </div>
            
            <div className="bg-white p-8 rounded-xl border border-gray-200 text-center">
              <div className="text-4xl font-bold text-medical-600 mb-4">-35%</div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">Reduced Wait Times</h3>
              <p className="text-gray-600">
                Patients experience 35% shorter wait times for appointments and consultations.
              </p>
            </div>
            
            <div className="bg-white p-8 rounded-xl border border-gray-200 text-center">
              <div className="text-4xl font-bold text-medical-600 mb-4">100K+</div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">Lives Improved</h3>
              <p className="text-gray-600">
                Over 100,000 patients have benefited from our advanced healthcare platform.
              </p>
            </div>
          </div>
        </div>
      </section>
      
      {/* Team */}
      <section className="py-16 md:py-24 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <div className="inline-block bg-blue-50 px-3 py-1 rounded-full text-medical-600 font-medium text-sm mb-4 border border-medical-100">
              Our Team
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Meet the Visionaries
            </h2>
            <p className="text-lg text-gray-700">
              Our diverse team of healthcare professionals, technologists, and innovators is dedicated to transforming healthcare.
            </p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Team members would go here */}
            <div className="text-center">
              <div className="rounded-full overflow-hidden bg-gray-200 w-48 h-48 mx-auto mb-4">
                <img 
                  src="/team-member1.png" 
                  alt="Dr. Jennifer Adams" 
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = 'https://placehold.co/300x300/e0effe/0c96e7?text=Dr.+J+Adams';
                  }}
                />
              </div>
              <h3 className="text-xl font-semibold text-gray-800">Dr. Jennifer Adams</h3>
              <p className="text-medical-600 mb-2">Chief Medical Officer</p>
              <p className="text-gray-600 px-4">
                Leading our medical initiatives with 15+ years of experience in digital health transformation.
              </p>
            </div>
            
            <div className="text-center">
              <div className="rounded-full overflow-hidden bg-gray-200 w-48 h-48 mx-auto mb-4">
                <img 
                  src="/team-member2.png" 
                  alt="David Chen" 
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = 'https://placehold.co/300x300/e0effe/0c96e7?text=D+Chen';
                  }}
                />
              </div>
              <h3 className="text-xl font-semibold text-gray-800">David Chen</h3>
              <p className="text-medical-600 mb-2">Chief Technology Officer</p>
              <p className="text-gray-600 px-4">
                Spearheading our technology development with expertise in AI and blockchain applications.
              </p>
            </div>
            
            <div className="text-center">
              <div className="rounded-full overflow-hidden bg-gray-200 w-48 h-48 mx-auto mb-4">
                <img 
                  src="/team-member3.png" 
                  alt="Dr. Maria Rodriguez" 
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = 'https://placehold.co/300x300/e0effe/0c96e7?text=Dr.+M+Rodriguez';
                  }}
                />
              </div>
              <h3 className="text-xl font-semibold text-gray-800">Dr. Maria Rodriguez</h3>
              <p className="text-medical-600 mb-2">Head of Research</p>
              <p className="text-gray-600 px-4">
                Leading our research initiatives in medical AI and telehealth innovations.
              </p>
            </div>
            
            <div className="text-center">
              <div className="rounded-full overflow-hidden bg-gray-200 w-48 h-48 mx-auto mb-4">
                <img 
                  src="/team-member4.png" 
                  alt="James Wilson" 
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = 'https://placehold.co/300x300/e0effe/0c96e7?text=J+Wilson';
                  }}
                />
              </div>
              <h3 className="text-xl font-semibold text-gray-800">James Wilson</h3>
              <p className="text-medical-600 mb-2">Patient Experience Director</p>
              <p className="text-gray-600 px-4">
                Ensuring our platform provides an exceptional, intuitive experience for all patients.
              </p>
            </div>
          </div>
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="py-16 md:py-24 bg-gradient-to-br from-medical-600 to-medical-800 text-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Join Us in Transforming Healthcare
            </h2>
            <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
              Experience the future of healthcare today. Book an appointment or start a virtual consultation to see the difference.
            </p>
            
            <div className="flex flex-wrap justify-center gap-4">
              <Link to="/appointments" className="btn-primary bg-white text-medical-700 hover:bg-gray-100">
                Book an Appointment
              </Link>
              <Link to="/map" className="btn-secondary border-white/30 bg-transparent text-white hover:bg-white/10">
                Explore our 3D Map
              </Link>
            </div>
          </div>
        </div>
      </section>
    </MainLayout>
  );
};

export default Mission;
