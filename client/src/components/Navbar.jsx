import { useState, useEffect, useContext } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { gsap } from 'gsap';
import { Code, Menu, X, User } from "lucide-react";
import { getUserInfo } from '../hooks/getUserInfo';
import { get } from 'firebase/database';
import { useRole } from '../context/RoleContext';
import RoleContext from '../context/RoleContext'
import { useNavigate } from 'react-router-dom';


const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  const {isAuth}=getUserInfo()
  const [profileOpen, setProfileOpen] = useState(false);
  const navigate = useNavigate();

  const {role, setRole} = useContext(RoleContext);
  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Challenges', path: '/quizzes' },
    { name: 'Courses', path: '/Courses' },
    { name: 'Recruitment', path: '/recruitment' },
    { name: 'Hackathons', path: '/hackathons' },
    { name: 'Community', path: '/community' },
    { name: 'Mentorship', path: '/mentorship' },
    { name: 'Roadmaps', path: '/Roadmaps' },
  ];

  const otherLinks = [
    { name: 'Home', path: '/' },
    { name: 'Challenges', path: '/quizzes' },
    { name: 'Community', path: '/community' },
    { name: 'Mentorship', path: '/mentorship' },

  ];

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setIsOpen(false);
  }, [location]);

  useEffect(() => {
    if (isOpen) {
      gsap.fromTo(
        '.mobile-nav-link',
        { y: 20, opacity: 0 },
        { y: 0, opacity: 1, stagger: 0.1, ease: 'power2.out' }
      );
    }
  }, [isOpen]);

  const navigateToProfile = () => {
    navigate('/userprofile');
  };

  return (
    role === 'user' ? (
    <nav className={`fixed w-full z-50 transition-all duration-300 ${scrolled ? 'bg-gray-900/90 backdrop-blur-md py-2 shadow-lg' : 'bg-transparent py-4'}`}>
      <div className="container mx-auto px-4 flex justify-between items-center">
        <Link to="/" className="flex items-center space-x-2">
          <Code className="h-8 w-8 text-green-500" />
          <span className="text-xl font-bold gradient-text">CodeNexus</span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex space-x-3 ml-30">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className={`nav-link ${location.pathname === link.path ? 'text-green-400' : ''}`}
            >
              {link.name}
            </Link>
          ))}
                    {/* Profile Dropdown */}
                    {isAuth && (
            <div 
              className="relative"
              onMouseEnter={() => setProfileOpen(true)}
              onMouseLeave={() => setProfileOpen(false)}
            >
              <button className="flex mt-2 items-center space-x-2 px-4 text-gray-300 hover:text-green-400 transition-colors duration-200">
                <User className="h-6 w-6" />
                <span onClick={navigateToProfile}>Profile</span>
              </button>

              {/* Dropdown Menu: Appears on hover */}
              {profileOpen && (
                <div className="absolute right-0 mt-2 w-40 bg-gray-800 shadow-lg rounded-md overflow-hidden">
                  <Link to="/progress" className="block px-4 py-2 text-gray-200 hover:bg-gray-700">
                    Dashboard
                  </Link>
                </div>
              )}
            </div>
          )}

          {!isAuth && (
            <Link to="/login" className="ml-4 btn-primary text-sm py-2">
              Login
            </Link>
          )}
        </div>

        {/* Mobile Navigation Toggle */}
        <button
          className="md:hidden text-gray-200 focus:outline-none"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {/* Mobile Navigation Menu */}
      {isOpen && (
        <div className="md:hidden absolute top-full left-0 w-full bg-gray-900/95 backdrop-blur-md border-t border-gray-800 py-4 shadow-lg">
          <div className="container mx-auto px-4 flex flex-col space-y-3">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`mobile-nav-link block py-2 px-4 rounded-md ${
                  location.pathname === link.path
                    ? 'bg-gray-800 text-green-400'
                    : 'text-gray-300 hover:bg-gray-800 hover:text-green-400'
                } transition-colors duration-200`}
              >
                {link.name}
              </Link>
            ))}
            <Link
              to="/login"
              className="mobile-nav-link block py-2 px-4 mt-2 bg-green-600 hover:bg-green-500 text-white rounded-md transition-colors duration-200"
            >
              Login
            </Link>
            
          </div>
        </div>
      )}
    </nav>
    ) : role === 'instructor' ? (
      <nav className={`fixed w-full z-50 transition-all duration-300 ${scrolled ? 'bg-gray-900/90 backdrop-blur-md py-2 shadow-lg' : 'bg-transparent py-4'}`}>
      <div className="container mx-auto px-4 flex justify-between items-center">
        <Link to="/" className="flex items-center space-x-2">
          <Code className="h-8 w-8 text-green-500" />
          <span className="text-xl font-bold gradient-text">CodeNexus</span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex space-x-3 ml-30">
          {otherLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className={`nav-link ${location.pathname === link.path ? 'text-green-400' : ''}`}
            >
              {link.name}
            </Link>
          ))}
          {isAuth?(<Link to="/profile" className="flex items-center space-x-2 mt-0 px-4 text-gray-300 hover:text-green-400 transition-colors duration-200">
              <User className="h-6 w-6" />
              <span>Profile</span>
          </Link>):(<Link to="/login" className="ml-4 btn-primary text-sm py-2">
            Login
          </Link>)} 

        </div>

        {/* Mobile Navigation Toggle */}
        <button
          className="md:hidden text-gray-200 focus:outline-none"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {/* Mobile Navigation Menu */}
      {isOpen && (
        <div className="md:hidden absolute top-full left-0 w-full bg-gray-900/95 backdrop-blur-md border-t border-gray-800 py-4 shadow-lg">
          <div className="container mx-auto px-4 flex flex-col space-y-3">
            {otherLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`mobile-nav-link block py-2 px-4 rounded-md ${
                  location.pathname === link.path
                    ? 'bg-gray-800 text-green-400'
                    : 'text-gray-300 hover:bg-gray-800 hover:text-green-400'
                } transition-colors duration-200`}
              >
                {link.name}
              </Link>
            ))}
            <Link
              to="/login"
              className="mobile-nav-link block py-2 px-4 mt-2 bg-green-600 hover:bg-green-500 text-white rounded-md transition-colors duration-200"
            >
              Login
            </Link>
            
          </div>
        </div>
      )}
    </nav>
    ) : null
  );
};

export default Navbar;