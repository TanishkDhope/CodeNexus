import React, { useEffect, useState,useRef } from "react";
import { Link } from "react-router-dom";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ArrowRight, Calendar, Check, Star } from "lucide-react";
import Button from "../components/Button";
import MatrixBackground from "../components/MatrixBackground";
import {io} from "socket.io-client";

// Mentor data
const mentors = [
  {
    id: 1,
    name: "Alex Johnson",
    role: "Senior Frontend Developer",
    company: "Google",
    bio: "10+ years of experience in frontend development with expertise in React and modern JavaScript.",
    specialties: ["React", "JavaScript", "CSS", "Performance Optimization"],
    rating: 4.9,
    reviews: 127,
    image: "https://images.unsplash.com/photo-1562159278-1253a58da141?q=80&w=2940&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    availability: "Mon, Wed, Fri",
  },
  {
    id: 2,
    name: "Sarah Chen",
    role: "Full Stack Engineer",
    company: "Microsoft",
    bio: "Full stack developer with a passion for teaching and helping others grow in their development journey.",
    specialties: ["Node.js", "React", "TypeScript", "System Design"],
    rating: 4.8,
    reviews: 93,
    image: "https://images.unsplash.com/photo-1540569014015-19a7be504e3a?q=80&w=3024&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    availability: "Tue, Thu, Sat",
  },
  {
    id: 3,
    name: "Michael Rodriguez",
    role: "DevOps Specialist",
    company: "Amazon",
    bio: "DevOps engineer focused on CI/CD, containerization, and cloud infrastructure.",
    specialties: ["Docker", "Kubernetes", "AWS", "CI/CD Pipelines"],
    rating: 4.7,
    reviews: 85,
    image: "https://plus.unsplash.com/premium_photo-1689977807477-a579eda91fa2?q=80&w=2940&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    availability: "Mon, Thu, Sat",
  },
  {
    id: 4,
    name: "Priya Patel",
    role: "Backend Developer",
    company: "Netflix",
    bio: "Specialized in scalable backend systems and database optimization.",
    specialties: ["Java", "Spring Boot", "Microservices", "Database Design"],
    rating: 4.9,
    reviews: 112,
    image: "https://images.unsplash.com/photo-1517677129300-07b130802f46?q=80&w=2940&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    availability: "Wed, Fri, Sun",
  },
  {
    id: 5,
    name: "David Kim",
    role: "Mobile Developer",
    company: "Airbnb",
    bio: "Mobile app developer with expertise in React Native and native iOS/Android development.",
    specialties: ["React Native", "iOS", "Android", "Mobile UX"],
    rating: 4.8,
    reviews: 76,
    image: "https://images.unsplash.com/photo-1540569014015-19a7be504e3a?q=80&w=3024&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    availability: "Tue, Thu, Sun",
  },
  {
    id: 6,
    name: "Emma Wilson",
    role: "UI/UX Designer & Developer",
    company: "Figma",
    bio: "Designer and developer focused on creating beautiful, accessible, and user-friendly interfaces.",
    specialties: ["UI Design", "UX Research", "CSS", "Accessibility"],
    rating: 4.9,
    reviews: 104,
    image: "https://images.unsplash.com/photo-1507101105822-7472b28e22ac?q=80&w=2946&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    availability: "Mon, Wed, Fri",
  },
];




// Mentorship plans
const plans = [
  {
    id: "basic",
    name: "Basic",
    price: 99,
    features: [
      "1 session per month",
      "Email support",
      "Code reviews",
      "Career guidance",
    ],
    recommended: false,
  },
  {
    id: "pro",
    name: "Professional",
    price: 199,
    features: [
      "2 sessions per month",
      "Priority email support",
      "Unlimited code reviews",
      "Career guidance",
      "Resume & portfolio review",
      "Mock interviews",
    ],
    recommended: true,
  },
  {
    id: "premium",
    name: "Premium",
    price: 299,
    features: [
      "4 sessions per month",
      "24/7 chat support",
      "Unlimited code reviews",
      "Career guidance",
      "Resume & portfolio review",
      "Mock interviews",
      "Personalized learning plan",
      "Project collaboration",
    ],
    recommended: false,
  },
];

// Detailed Mentor Modal component (only declared once)
function MentorProfile({ mentor, onClose }) {

  

  return (
    <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50">
      <div className="bg-gray-900 p-8 rounded-lg relative max-w-xl w-full">
        <button onClick={onClose} className="absolute top-2 right-2 text-gray-300 text-3xl">
          &times;
        </button>
        <div className="flex flex-col items-center">
          <div className="w-32 h-32 rounded-full overflow-hidden mb-4">
            <img
              src={mentor.image || "/placeholder.svg"}
              alt={mentor.name}
              className="object-cover w-full h-full"
            />
          </div>
          <h2 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-pink-400 via-purple-500 to-indigo-500 neon-glow">
            {mentor.name}
          </h2>
          <p className="text-gray-300 mt-2">
            {mentor.role} at {mentor.company}
          </p>
          <p className="text-gray-300 mt-4 text-center">{mentor.bio}</p>
          <div className="mt-4 w-full">
            <h3 className="text-xl font-semibold text-gray-300">Specialties</h3>
            <div className="flex flex-wrap gap-2 mt-2">
              {mentor.specialties.map((s, index) => (
                <span key={index} className="bg-gray-800 px-3 py-1 rounded-full text-xs text-gray-300">
                  {s}
                </span>
              ))}
            </div>
          </div>
          <div className="flex items-center mt-4">
            <Star className="h-5 w-5 text-yellow-500 mr-2" />
            <span className="text-gray-300">
              {mentor.rating} / 5 ({mentor.reviews} reviews)
            </span>
          </div>
          <div className="mt-4">
            <Calendar className="inline-block h-5 w-5 text-gray-400 mr-2" />
            <span className="text-gray-300">Availability: {mentor.availability}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function MentorshipPage() {
  const [selectedMentor, setSelectedMentor] = useState(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    // Animate mentor cards
    const mentorCards = document.querySelectorAll(".mentor-card");
    gsap.fromTo(
      mentorCards,
      { opacity: 0, y: 30 },
      { opacity: 1, y: 0, duration: 0.5, stagger: 0.1, ease: "power2.out" }
    );

    // Animate plan cards
    const planCards = document.querySelectorAll(".plan-card");
    gsap.fromTo(
      planCards,
      { opacity: 0, y: 30 },
      {
        opacity: 1,
        y: 0,
        duration: 0.5,
        stagger: 0.1,
        ease: "power2.out",
        scrollTrigger: {
          trigger: ".plans-section",
          start: "top 80%",
        },
      }
    );
  }, []);

  return (
    <>
      <MatrixBackground opacity={0.03} />

      {/* Header Section */}
      <section className="pt-32 pb-16 md:pt-40 md:pb-20">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-5xl md:text-6xl font-extrabold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-pink-400 via-purple-500 to-indigo-500 neon-glow">
              Personalized Mentorship
            </h1>
            <p className="text-xl text-gray-300 leading-relaxed mb-8">
              Connect with experienced developers who will guide you through your learning journey and help you achieve your career goals.
            </p>
            <Button size="lg" className="animate-glow">
              Find Your Mentor
            </Button>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-16 bg-gray-900/30">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12 text-transparent bg-clip-text bg-gradient-to-r from-pink-400 via-purple-500 to-indigo-500 neon-glow">
            How Mentorship Works
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-gray-900/60 p-6 rounded-xl border border-gray-800 text-center shadow-lg hover:shadow-2xl transition-shadow duration-300">
              <div className="w-16 h-16 bg-neon-green/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-neon-green">1</span>
              </div>
              <h3 className="text-xl font-bold mb-3">Match with a Mentor</h3>
              <p className="text-gray-300">
                Browse our network of experienced developers and find someone who aligns with your learning goals.
              </p>
            </div>
            <div className="bg-gray-900/60 p-6 rounded-xl border border-gray-800 text-center shadow-lg hover:shadow-2xl transition-shadow duration-300">
              <div className="w-16 h-16 bg-neon-blue/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-neon-blue">2</span>
              </div>
              <h3 className="text-xl font-bold mb-3">Schedule Sessions</h3>
              <p className="text-gray-300">
                Book one-on-one video sessions at times that work for you and your mentor.
              </p>
            </div>
            <div className="bg-gray-900/60 p-6 rounded-xl border border-gray-800 text-center shadow-lg hover:shadow-2xl transition-shadow duration-300">
              <div className="w-16 h-16 bg-neon-purple/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-neon-purple">3</span>
              </div>
              <h3 className="text-xl font-bold mb-3">Grow Your Skills</h3>
              <p className="text-gray-300">
                Receive personalized guidance, code reviews, and continuous support to accelerate your growth.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Mentors Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center mb-12">
            <h2 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-pink-400 via-purple-500 to-indigo-500 neon-glow">
              Featured Mentors
            </h2>
            <Link to="/mentors" className="text-neon-green hover:underline inline-flex items-center mt-4 md:mt-0">
              View All Mentors <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {mentors.map((mentor) => (
              <div
                key={mentor.id}
                className="mentor-card bg-gray-900/80 rounded-xl overflow-hidden border border-gray-800 hover:border-neon-green/50 transition-all duration-300 shadow-lg"
              >
                <div className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="relative w-16 h-16 rounded-full overflow-hidden">
                      <img
                        src={mentor.image || "/placeholder.svg"}
                        alt={mentor.name}
                        className="object-cover w-full h-full"
                      />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold">{mentor.name}</h3>
                      <p className="text-gray-300 text-sm">
                        {mentor.role} at {mentor.company}
                      </p>
                      <div className="flex items-center mt-1">
                        <Star className="h-4 w-4 text-yellow-500 fill-yellow-500 mr-1" />
                        <span className="text-gray-300 text-sm">
                          {mentor.rating} ({mentor.reviews} reviews)
                        </span>
                      </div>
                    </div>
                  </div>
                  <p className="text-gray-300 text-sm mt-4 mb-4">{mentor.bio}</p>
                  <div className="mb-4">
                    <h4 className="text-sm font-semibold mb-2">Specialties:</h4>
                    <div className="flex flex-wrap gap-2">
                      {mentor.specialties.map((specialty, index) => (
                        <span
                          key={index}
                          className="bg-gray-800 text-gray-300 px-2 py-1 rounded-full text-xs"
                        >
                          {specialty}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <Calendar className="h-4 w-4 text-gray-400 mr-1" />
                      <span className="text-gray-400 text-xs">{mentor.availability}</span>
                    </div>
                    <Button variant="neon" size="sm" onClick={() => setSelectedMentor(mentor)}>
                      View Profile
                    </Button>
                    <Link to='/mentor'>
                      <Button variant="neon" size="sm" onClick={() => setSelectedMentor(mentor)}>
                        Call Mentor
                      </Button>
                    </Link>                   
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Mentorship Plans Section */}
      <section className="py-16 bg-gray-900/30 plans-section relative z-10">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center mb-12">
            <h2 className="text-3xl font-bold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-pink-400 via-purple-500 to-indigo-500 neon-glow">
              Mentorship Plans
            </h2>
            <p className="text-gray-300">
              Choose a plan that fits your learning needs and budget. All plans include access to our mentor network.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {plans.map((plan) => (
              <div
                key={plan.id}
                className={`plan-card bg-gray-900/80 rounded-xl overflow-hidden border ${
                  plan.recommended ? "border-neon-green glow-border" : "border-gray-800"
                } transition-all duration-300 relative shadow-lg`}
              >
                {plan.recommended && (
                  <div className="absolute top-0 left-0 right-0 bg-neon-green text-black text-center py-1 text-sm font-semibold">
                    Recommended
                  </div>
                )}
                <div className="p-6 pt-8">
                  <h3 className="text-xl font-bold mb-2">{plan.name}</h3>
                  <div className="mb-6">
                    <span className="text-3xl font-bold">${plan.price}</span>
                    <span className="text-gray-400">/month</span>
                  </div>
                  <ul className="space-y-3 mb-8">
                    {plan.features.map((feature, index) => (
                      <li key={index} className="flex items-start">
                        <Check className="h-5 w-5 text-neon-green mr-2 shrink-0" />
                        <span className="text-gray-300">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <Button variant={plan.recommended ? "default" : "outline"} className="w-full">
                    Choose Plan
                  </Button>
                </div>
              </div>
            ))}
          </div>
          <div className="text-center mt-8 text-gray-300 text-sm">
            All plans include a 7-day free trial. Cancel anytime.
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-16 relative z-10">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12 text-transparent bg-clip-text bg-gradient-to-r from-pink-400 via-purple-500 to-indigo-500 neon-glow">
            Success Stories
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-gray-900/60 p-6 rounded-xl border border-gray-800 shadow-lg">
              <div className="flex items-center mb-4">
                <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
              </div>
              <p className="text-gray-300 mb-4">
                "Working with my mentor transformed my career. I went from struggling with basic concepts to landing a job at a top tech company in just 6 months."
              </p>
              <div className="flex items-center">
                <div className="w-10 h-10 bg-gray-700 rounded-full mr-3"></div>
                <div>
                  <div className="font-semibold">Jason Taylor</div>
                  <div className="text-gray-400 text-sm">Frontend Developer at Spotify</div>
                </div>
              </div>
            </div>
            <div className="bg-gray-900/60 p-6 rounded-xl border border-gray-800 shadow-lg">
              <div className="flex items-center mb-4">
                <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
              </div>
              <p className="text-gray-300 mb-4">
                "The personalized guidance I received was invaluable. My mentor helped me identify gaps in my knowledge and create a learning plan that worked for me."
              </p>
              <div className="flex items-center">
                <div className="w-10 h-10 bg-gray-700 rounded-full mr-3"></div>
                <div>
                  <div className="font-semibold">Maria Garcia</div>
                  <div className="text-gray-400 text-sm">Full Stack Developer at Shopify</div>
                </div>
              </div>
            </div>
            <div className="bg-gray-900/60 p-6 rounded-xl border border-gray-800 shadow-lg">
              <div className="flex items-center mb-4">
                <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
              </div>
              <p className="text-gray-300 mb-4">
                "The code reviews and feedback I received helped me level up my skills faster than any course or tutorial could. Worth every penny!"
              </p>
              <div className="flex items-center">
                <div className="w-10 h-10 bg-gray-700 rounded-full mr-3"></div>
                <div>
                  <div className="font-semibold">Raj Patel</div>
                  <div className="text-gray-400 text-sm">Backend Engineer at Stripe</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-neon-green/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-neon-blue/10 rounded-full blur-3xl"></div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto bg-gray-900/80 p-8 md:p-12 rounded-xl border border-gray-800 glow-border text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 glow-text">
              Ready to Accelerate Your Learning?
            </h2>
            <p className="text-gray-300 mb-8 text-lg">
              Join our mentorship program today and get personalized guidance from industry experts.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="animate-glow">
                Find a Mentor
              </Button>
              <Button variant="outline" size="lg">
                Learn More
              </Button>
            </div>
          </div>
        </div>
      </section>

      {selectedMentor && (
        <MentorProfile mentor={selectedMentor} onClose={() => setSelectedMentor(null)} />
      )}
    </>
  );
}
