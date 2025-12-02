
import { Video, MessageSquare, FileText, Shield, Clock, Heart } from 'lucide-react';
import { Link } from 'react-router-dom';
import MainLayout from '@/layouts/MainLayout';
import ConsultationCard from '@/components/ConsultationCard';

const Consultation = () => {
  return (
    <MainLayout>
      {/* Hero Section */}
      <section className="pt-32 pb-16 md:pb-24 bg-gradient-to-b from-blue-50 to-white">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center mb-12">
            <div className="inline-block bg-blue-50 px-3 py-1 rounded-full text-medical-600 font-medium text-sm mb-4 border border-medical-100">
              Virtual Care
            </div>
            <h1 className="text-3xl md:text-5xl font-bold text-gray-900 mb-6">
              Healthcare from Anywhere
            </h1>
            <p className="text-lg text-gray-700 mb-8">
              Connect with our healthcare professionals through secure, high-quality video consultations. Get the care you need without leaving your home.
            </p>
            <div className="bg-white p-4 rounded-xl shadow-lg inline-flex items-center border border-gray-200">
              <Video className="h-5 w-5 text-medical-500 mr-3" />
              <span className="text-medical-800 font-medium">Our platform uses end-to-end encryption for your privacy</span>
            </div>
          </div>
          
          <div className="relative mx-auto max-w-5xl rounded-2xl overflow-hidden shadow-xl">
            <img
              src="/virtual-consult.png"
              alt="Virtual consultation interface"
              className="w-full h-auto object-cover"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.src = 'https://placehold.co/1200x600/e0effe/0c96e7?text=Virtual+Consultation';
              }}
            />
          </div>
        </div>
      </section>
      
      {/* Benefits Section */}
      <section className="py-16 md:py-24 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <div className="inline-block bg-blue-50 px-3 py-1 rounded-full text-medical-600 font-medium text-sm mb-4 border border-medical-100">
              Advantages
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Benefits of Virtual Consultations
            </h2>
            <p className="text-lg text-gray-700">
              Our virtual consultation service offers numerous advantages for patients seeking convenient, high-quality care.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="glass-card p-6 text-center">
              <div className="inline-flex items-center justify-center p-3 bg-medical-100 rounded-full text-medical-700 mb-4">
                <Clock className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-3">Time Saving</h3>
              <p className="text-gray-600">
                No travel time or waiting rooms. Connect with healthcare professionals from the comfort of your home.
              </p>
            </div>
            
            <div className="glass-card p-6 text-center">
              <div className="inline-flex items-center justify-center p-3 bg-medical-100 rounded-full text-medical-700 mb-4">
                <Shield className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-3">Privacy & Security</h3>
              <p className="text-gray-600">
                Our platform uses end-to-end encryption and is fully HIPAA compliant to protect your information.
              </p>
            </div>
            
            <Link to="/digital-records" className="glass-card p-6 text-center cursor-pointer hover:shadow-xl hover:-translate-y-2 transition-all duration-300">
              <div className="inline-flex items-center justify-center p-3 bg-medical-100 rounded-full text-medical-700 mb-4">
                <FileText className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-3">Digital Records</h3>
              <p className="text-gray-600">
                Access consultation summaries, prescriptions, and follow-up care instructions online anytime.
              </p>
            </Link>
          </div>
        </div>
      </section>
      
      {/* How It Works */}
      <section className="py-16 md:py-24 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <div className="inline-block bg-blue-50 px-3 py-1 rounded-full text-medical-600 font-medium text-sm mb-4 border border-medical-100">
              Process
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              How Virtual Consultations Work
            </h2>
            <p className="text-lg text-gray-700">
              Our streamlined process makes it easy to connect with healthcare professionals.
            </p>
          </div>
          
          <div className="max-w-5xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="relative">
                <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm h-full">
                  <div className="absolute -top-4 -left-4 w-12 h-12 bg-medical-500 rounded-full text-white flex items-center justify-center text-xl font-bold">1</div>
                  <h3 className="text-xl font-semibold text-gray-800 mb-3 mt-4">Book Your Appointment</h3>
                  <p className="text-gray-600">
                    Schedule a virtual consultation through our online booking system. Select your preferred date and time.
                  </p>
                </div>
                {/* Connector */}
                <div className="hidden md:block absolute top-1/2 left-full w-8 h-2 bg-medical-200 -translate-y-1/2 z-10"></div>
              </div>
              
              <div className="relative">
                <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm h-full">
                  <div className="absolute -top-4 -left-4 w-12 h-12 bg-medical-500 rounded-full text-white flex items-center justify-center text-xl font-bold">2</div>
                  <h3 className="text-xl font-semibold text-gray-800 mb-3 mt-4">Receive Confirmation</h3>
                  <p className="text-gray-600">
                    Get confirmation via email with a secure link to join your virtual consultation room.
                  </p>
                </div>
                {/* Connector */}
                <div className="hidden md:block absolute top-1/2 left-full w-8 h-2 bg-medical-200 -translate-y-1/2 z-10"></div>
              </div>
              
              <div className="relative">
                <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm h-full">
                  <div className="absolute -top-4 -left-4 w-12 h-12 bg-medical-500 rounded-full text-white flex items-center justify-center text-xl font-bold">3</div>
                  <h3 className="text-xl font-semibold text-gray-800 mb-3 mt-4">Join Your Consultation</h3>
                  <p className="text-gray-600">
                    Click the link at your appointment time to join the secure video consultation with your healthcare provider.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Consultation Types */}
      <section className="py-16 md:py-24 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <div className="inline-block bg-blue-50 px-3 py-1 rounded-full text-medical-600 font-medium text-sm mb-4 border border-medical-100">
              Services
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Virtual Consultation Services
            </h2>
            <p className="text-lg text-gray-700">
              We offer a variety of virtual consultation types to meet your healthcare needs.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <ConsultationCard
              title="General Consultation"
              description="Speak with a primary care physician about general health concerns, follow-ups, and prescription refills."
              icon={<MessageSquare className="h-6 w-6" />}
              linkTo="/appointments"
            />
            
            <ConsultationCard
              title="Specialist Consultation"
              description="Connect with specialists in cardiology, dermatology, neurology, and other specialized fields."
              icon={<Video className="h-6 w-6" />}
              linkTo="/appointments"
              primary
            />
            
            <ConsultationCard
              title="Mental Health Services"
              description="Access professional mental health support from psychologists and psychiatrists in a private setting."
              icon={<Heart className="h-6 w-6" />}
              linkTo="/appointments"
            />
          </div>
        </div>
      </section>
      
      {/* Ready To Start */}
      <section className="py-16 md:py-24 bg-gradient-to-br from-medical-600 to-medical-800 text-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Ready to Experience Virtual Healthcare?
            </h2>
            <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
              Book your virtual consultation today and experience healthcare on your terms.
            </p>
            
            <Link to="/appointments" className="btn-primary bg-white text-medical-700 hover:bg-gray-100">
              Book a Virtual Consultation
            </Link>
          </div>
        </div>
      </section>
    </MainLayout>
  );
};

export default Consultation;
