
import { useState, useEffect } from "react";
import { NavLink, Link } from "react-router-dom";
import { Menu, X, ChevronDown, Phone } from "lucide-react";

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Change navbar style on scroll
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled 
          ? "py-3 bg-white/80 backdrop-blur-lg shadow-md" 
          : "py-5 bg-transparent"
      }`}
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link 
            to="/" 
            className="text-2xl font-bold text-medical-800 flex items-center hover:text-medical-600 transition-colors duration-300"
          >
            <span className="text-medical-500">Health</span>
            <span>Sync</span>
            <span className="ml-1.5 inline-flex h-2 w-2 rounded-full bg-medical-500 animate-pulse-soft"></span>
          </Link>
          
          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-1">
            <NavLink 
              to="/" 
              className={({ isActive }) => 
                `nav-link ${isActive ? "nav-link-active" : ""} hover:scale-105 transition-transform duration-300`
              }
              end
            >
              Home
            </NavLink>
            <NavLink 
              to="/mission" 
              className={({ isActive }) => 
                `nav-link ${isActive ? "nav-link-active" : ""} hover:scale-105 transition-transform duration-300`
              }
            >
              Our Mission
            </NavLink>
            <NavLink 
              to="/appointments" 
              className={({ isActive }) => 
                `nav-link ${isActive ? "nav-link-active" : ""} hover:scale-105 transition-transform duration-300`
              }
            >
              Appointments
            </NavLink>
            <NavLink 
              to="/consultation" 
              className={({ isActive }) => 
                `nav-link ${isActive ? "nav-link-active" : ""} hover:scale-105 transition-transform duration-300`
              }
            >
              Virtual Consult
            </NavLink>
            <NavLink 
              to="/map" 
              className={({ isActive }) => 
                `nav-link ${isActive ? "nav-link-active" : ""} hover:scale-105 transition-transform duration-300`
              }
            >
              3D Map
            </NavLink>
          </nav>
          
          {/* Call to Action Button */}
          <div className="hidden md:flex items-center">
            <a href="tel:+1800MEDISPHERE" className="btn-primary flex items-center gap-2 group">
              <Phone size={16} className="group-hover:animate-pulse" />
              <span>Emergency Call</span>
            </a>
          </div>
          
          {/* Mobile Menu Button */}
          <button 
            className="md:hidden focus:outline-none hover:bg-gray-100 p-2 rounded-lg transition-colors duration-300"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? (
              <X className="h-6 w-6 text-medical-800" />
            ) : (
              <Menu className="h-6 w-6 text-medical-800" />
            )}
          </button>
        </div>
      </div>
      
      {/* Mobile Menu */}
      <div 
        className={`md:hidden fixed inset-0 bg-white z-40 transform transition-transform duration-300 ease-in-out pt-20 ${
          mobileMenuOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <nav className="container mx-auto px-4 flex flex-col space-y-6 py-6">
          <NavLink 
            to="/" 
            className={({ isActive }) => 
              `text-xl font-medium transition-all duration-300 ${isActive ? "text-medical-500" : "text-gray-800"} hover:translate-x-2`
            }
            onClick={() => setMobileMenuOpen(false)}
            end
          >
            Home
          </NavLink>
          <NavLink 
            to="/mission" 
            className={({ isActive }) => 
              `text-xl font-medium transition-all duration-300 ${isActive ? "text-medical-500" : "text-gray-800"} hover:translate-x-2`
            }
            onClick={() => setMobileMenuOpen(false)}
          >
            Our Mission
          </NavLink>
          <NavLink 
            to="/appointments" 
            className={({ isActive }) => 
              `text-xl font-medium transition-all duration-300 ${isActive ? "text-medical-500" : "text-gray-800"} hover:translate-x-2`
            }
            onClick={() => setMobileMenuOpen(false)}
          >
            Appointments
          </NavLink>
          <NavLink 
            to="/consultation" 
            className={({ isActive }) => 
              `text-xl font-medium transition-all duration-300 ${isActive ? "text-medical-500" : "text-gray-800"} hover:translate-x-2`
            }
            onClick={() => setMobileMenuOpen(false)}
          >
            Virtual Consult
          </NavLink>
          <NavLink 
            to="/map" 
            className={({ isActive }) => 
              `text-xl font-medium transition-all duration-300 ${isActive ? "text-medical-500" : "text-gray-800"} hover:translate-x-2`
            }
            onClick={() => setMobileMenuOpen(false)}
          >
            3D Map
          </NavLink>
          
          <div className="pt-6 border-t border-gray-100">
            <a 
              href="tel:+1800MEDISPHERE" 
              className="btn-primary w-full justify-center group"
              onClick={() => setMobileMenuOpen(false)}
            >
              <Phone size={16} className="mr-2 group-hover:animate-pulse" />
              <span>Emergency Call</span>
            </a>
          </div>
        </nav>
      </div>
    </header>
  );
};

export default Navbar;
