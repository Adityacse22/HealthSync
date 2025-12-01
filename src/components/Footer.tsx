
import { Link } from "react-router-dom";
import { 
  Phone, 
  Mail, 
  MapPin, 
  Facebook, 
  Twitter, 
  Instagram, 
  Linkedin, 
  ChevronRight,
  Heart,
  Shield,
  Clock
} from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-gray-50 pt-16 pb-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div>
            <Link to="/" className="text-2xl font-bold text-medical-800 flex items-center mb-6 hover:text-medical-600 transition-colors duration-300">
              <span className="text-medical-500">Health</span>
              <span>Sync</span>
            </Link>
            <p className="text-gray-600 mb-6">
              Revolutionizing healthcare with cutting-edge technology, ensuring better care for all.
            </p>
            <div className="flex space-x-4">
              <a 
                href="#" 
                className="w-10 h-10 rounded-full bg-white border border-gray-200 flex items-center justify-center text-medical-500 hover:bg-medical-500 hover:text-white transition-colors duration-300 hover:border-medical-500 transform hover:-translate-y-1"
                aria-label="Facebook"
              >
                <Facebook size={18} />
              </a>
              <a 
                href="#" 
                className="w-10 h-10 rounded-full bg-white border border-gray-200 flex items-center justify-center text-medical-500 hover:bg-medical-500 hover:text-white transition-colors duration-300 hover:border-medical-500 transform hover:-translate-y-1"
                aria-label="Twitter"
              >
                <Twitter size={18} />
              </a>
              <a 
                href="#" 
                className="w-10 h-10 rounded-full bg-white border border-gray-200 flex items-center justify-center text-medical-500 hover:bg-medical-500 hover:text-white transition-colors duration-300 hover:border-medical-500 transform hover:-translate-y-1"
                aria-label="Instagram"
              >
                <Instagram size={18} />
              </a>
              <a 
                href="#" 
                className="w-10 h-10 rounded-full bg-white border border-gray-200 flex items-center justify-center text-medical-500 hover:bg-medical-500 hover:text-white transition-colors duration-300 hover:border-medical-500 transform hover:-translate-y-1"
                aria-label="LinkedIn"
              >
                <Linkedin size={18} />
              </a>
            </div>
          </div>
          
          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-6">Quick Links</h3>
            <ul className="space-y-3">
              <li>
                <Link 
                  to="/" 
                  className="text-gray-600 hover:text-medical-500 transition-colors duration-300 flex items-center group"
                >
                  <ChevronRight size={16} className="mr-2 text-medical-400 group-hover:translate-x-1 transition-transform duration-300" />
                  Home
                </Link>
              </li>
              <li>
                <Link 
                  to="/mission" 
                  className="text-gray-600 hover:text-medical-500 transition-colors duration-300 flex items-center group"
                >
                  <ChevronRight size={16} className="mr-2 text-medical-400 group-hover:translate-x-1 transition-transform duration-300" />
                  Our Mission
                </Link>
              </li>
              <li>
                <Link 
                  to="/appointments" 
                  className="text-gray-600 hover:text-medical-500 transition-colors duration-300 flex items-center group"
                >
                  <ChevronRight size={16} className="mr-2 text-medical-400 group-hover:translate-x-1 transition-transform duration-300" />
                  Appointments
                </Link>
              </li>
              <li>
                <Link 
                  to="/consultation" 
                  className="text-gray-600 hover:text-medical-500 transition-colors duration-300 flex items-center group"
                >
                  <ChevronRight size={16} className="mr-2 text-medical-400 group-hover:translate-x-1 transition-transform duration-300" />
                  Virtual Consult
                </Link>
              </li>
              <li>
                <Link 
                  to="/map" 
                  className="text-gray-600 hover:text-medical-500 transition-colors duration-300 flex items-center group"
                >
                  <ChevronRight size={16} className="mr-2 text-medical-400 group-hover:translate-x-1 transition-transform duration-300" />
                  3D Map
                </Link>
              </li>
            </ul>
          </div>
          
          {/* Services */}
          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-6">Our Services</h3>
            <ul className="space-y-3">
              <li className="flex items-start gap-3 group">
                <Heart size={18} className="text-medical-500 mt-0.5 flex-shrink-0 transition-transform duration-300 group-hover:scale-110" />
                <span className="text-gray-600 group-hover:text-medical-600 transition-colors duration-300">AI-Powered Diagnostics</span>
              </li>
              <li className="flex items-start gap-3 group">
                <Shield size={18} className="text-medical-500 mt-0.5 flex-shrink-0 transition-transform duration-300 group-hover:scale-110" />
                <span className="text-gray-600 group-hover:text-medical-600 transition-colors duration-300">Blockchain Medical Records</span>
              </li>
              <li className="flex items-start gap-3 group">
                <Clock size={18} className="text-medical-500 mt-0.5 flex-shrink-0 transition-transform duration-300 group-hover:scale-110" />
                <span className="text-gray-600 group-hover:text-medical-600 transition-colors duration-300">24/7 Emergency Services</span>
              </li>
              <li className="flex items-start gap-3 group">
                <MapPin size={18} className="text-medical-500 mt-0.5 flex-shrink-0 transition-transform duration-300 group-hover:scale-110" />
                <span className="text-gray-600 group-hover:text-medical-600 transition-colors duration-300">Real-time Facility Mapping</span>
              </li>
            </ul>
          </div>
          
          {/* Contact Info */}
          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-6">Contact Us</h3>
            <ul className="space-y-4">
              <li className="flex items-start group">
                <MapPin 
                  size={18} 
                  className="text-medical-500 mr-3 mt-1 flex-shrink-0 group-hover:text-medical-600 transition-colors duration-300" 
                />
                <span className="text-gray-600 group-hover:text-gray-700 transition-colors duration-300">
                  123 Innovation Drive, Medical District<br />
                  San Francisco, CA 94107
                </span>
              </li>
              <li className="flex items-center group">
                <Phone 
                  size={18} 
                  className="text-medical-500 mr-3 flex-shrink-0 group-hover:text-medical-600 transition-colors duration-300" 
                />
                <a 
                  href="tel:+18001234567" 
                  className="text-gray-600 hover:text-medical-500 transition-colors duration-300"
                >
                  +91-9000000000
                </a>
              </li>
              <li className="flex items-center group">
                <Mail 
                  size={18} 
                  className="text-medical-500 mr-3 flex-shrink-0 group-hover:text-medical-600 transition-colors duration-300" 
                />
                <a 
                  href="mailto:info@medisphere.com" 
                  className="text-gray-600 hover:text-medical-500 transition-colors duration-300"
                >
                  info@healthsync.com
                </a>
              </li>
            </ul>
          </div>
        </div>
        
        {/* Divider */}
        <div className="border-t border-gray-200 mt-12 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-500 text-sm mb-4 md:mb-0">
              &copy; {new Date().getFullYear()} HealthSync. All rights reserved. | HIPAA Compliant
            </p>
            <div className="flex space-x-6">
              <a 
                href="#" 
                className="text-gray-500 hover:text-medical-500 transition-colors duration-300 text-sm hover-underline"
              >
                Privacy Policy
              </a>
              <a 
                href="#" 
                className="text-gray-500 hover:text-medical-500 transition-colors duration-300 text-sm hover-underline"
              >
                Terms of Service
              </a>
              <a 
                href="#" 
                className="text-gray-500 hover:text-medical-500 transition-colors duration-300 text-sm hover-underline"
              >
                Cookie Policy
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
