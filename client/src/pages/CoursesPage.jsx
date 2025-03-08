import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Clock, Filter, Search, Star, Users } from "lucide-react";
import Button from "../components/Button";
import MatrixBackground from "../components/MatrixBackground";
import img1 from "../assets/Courses/img1.jpeg";
import img2 from "../assets/Courses/img2.jpeg";
import img3 from "../assets/Courses/img3.jpeg";
import img4 from "../assets/Courses/img4.jpeg";
import img5 from "../assets/Courses/img5.jpeg";
import img6 from "../assets/Courses/img6.jpeg";

const courses = [
  {
    id: 1,
    title: "Complete Frontend Development Bootcamp",
    description:
      "Master HTML, CSS, JavaScript, and React with hands-on projects and exercises.",
    level: "Beginner to Intermediate",
    duration: "12 weeks",
    students: 3245,
    rating: 4.8,
    image: img1,
    category: "frontend",
    tags: ["HTML", "CSS", "JavaScript", "React"],
  },
  {
    id: 2,
    title: "Backend Development with Node.js & Express",
    description:
      "Build robust server-side applications with Node.js, Express, and MongoDB.",
    level: "Intermediate",
    duration: "10 weeks",
    students: 2187,
    rating: 4.7,
    image: img2,
    category: "backend",
    tags: ["Node.js", "Express", "MongoDB", "REST API"],
  },
  {
    id: 3,
    title: "Full Stack JavaScript Masterclass",
    description:
      "Comprehensive course covering both frontend and backend JavaScript development.",
    level: "Intermediate to Advanced",
    duration: "16 weeks",
    students: 1876,
    rating: 4.9,
    image: img3,
    category: "fullstack",
    tags: ["JavaScript", "React", "Node.js", "MongoDB"],
  },
  {
    id: 4,
    title: "DevOps for Developers",
    description:
      "Learn CI/CD, Docker, Kubernetes, and cloud deployment strategies.",
    level: "Intermediate to Advanced",
    duration: "8 weeks",
    students: 1243,
    rating: 4.6,
    image: img4,
    category: "devops",
    tags: ["Docker", "Kubernetes", "CI/CD", "AWS"],
  },
  {
    id: 5,
    title: "React Native Mobile App Development",
    description:
      "Build cross-platform mobile apps with React Native and JavaScript.",
    level: "Intermediate",
    duration: "10 weeks",
    students: 1987,
    rating: 4.7,
    image: img5,
    category: "mobile",
    tags: ["React Native", "JavaScript", "Mobile", "iOS/Android"],
  },
  {
    id: 6,
    title: "Advanced JavaScript Patterns & Practices",
    description:
      "Deep dive into advanced JavaScript concepts, design patterns, and best practices.",
    level: "Advanced",
    duration: "8 weeks",
    students: 1432,
    rating: 4.9,
    image: img6,
    category: "javascript",
    tags: ["JavaScript", "Design Patterns", "Performance", "Advanced"],
  },
];

export default function CoursesPage() {
  const [filteredCourses, setFilteredCourses] = useState(courses);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    // Animate course cards on load
    const courseCards = document.querySelectorAll(".course-card");
    gsap.fromTo(
      courseCards,
      { opacity: 0, y: 30 },
      {
        opacity: 1,
        y: 0,
        duration: 0.5,
        stagger: 0.1,
        ease: "power2.out",
      }
    );

    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  // Filter courses based on search term and category
  useEffect(() => {
    let results = courses;

    if (searchTerm) {
      results = results.filter(
        (course) =>
          course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          course.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
          course.tags.some((tag) =>
            tag.toLowerCase().includes(searchTerm.toLowerCase())
          )
      );
    }

    if (selectedCategory !== "all") {
      results = results.filter((course) => course.category === selectedCategory);
    }

    setFilteredCourses(results);
  }, [searchTerm, selectedCategory]);

  return (
    <>
      <MatrixBackground opacity={0.03} />

      {/* Header Section */}
      <section className="pt-32 pb-16 md:pt-40 md:pb-20 relative z-10">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-5xl md:text-6xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-pink-400 via-purple-500 to-indigo-500 mb-6 neon-glow">
              Certified Courses
            </h1>
            <p className="text-xl text-gray-300 leading-relaxed mb-8">
              Comprehensive, project-based courses designed to take your development
              skills to the next level.
            </p>

            {/* Search Bar */}
            <div className="relative max-w-xl mx-auto mb-8">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search for courses, topics, or technologies..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="block w-full pl-10 pr-4 py-3 bg-gray-900 border border-gray-700 rounded-lg focus:ring-neon-green focus:border-neon-green text-gray-100 placeholder-gray-500 transition-all duration-300"
              />
            </div>

            {/* Enrolled Courses Tab */}
            <div className="flex justify-center gap-6 mb-8">
              <Link
                to={`/enrolled-courses`}
                className="text-lg text-gray-300 hover:text-neon-green transition-all"
              >
                Enrolled Courses
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Filters & Courses Section */}
      <section className="py-16 relative z-10">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center mb-10 gap-4">
            <div className="flex items-center">
              <Filter className="h-5 w-5 text-neon-green mr-2" />
              <span className="text-gray-300 mr-4">Filter by:</span>
              <div className="flex flex-wrap gap-2">
                {["all", "frontend", "backend", "fullstack", "devops"].map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`px-4 py-2 rounded-full text-sm transition-colors duration-300 ${
                      selectedCategory === cat
                        ? "bg-neon-green text-black"
                        : "bg-gray-800 text-gray-300 hover:bg-gray-700"
                    }`}
                  >
                    {cat === "all"
                      ? "All Courses"
                      : cat.charAt(0).toUpperCase() + cat.slice(1)}
                  </button>
                ))}
              </div>
            </div>
            <div className="text-gray-300">
              Showing {filteredCourses.length} of {courses.length} courses
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredCourses.map((course) => (
              <div
                key={course.id}
                className="course-card bg-gray-900/80 rounded-lg overflow-hidden border border-gray-800 hover:border-neon-green/50 transition-all duration-300 shadow-lg"
              >
                <div className="relative h-48">
                  <img
                    src={course.image || "/placeholder.svg"}
                    alt={course.title}
                    className="object-cover w-full h-full"
                  />
                </div>
                <div className="p-6">
                  <div className="flex flex-wrap gap-2 mb-3">
                    {course.tags.slice(0, 3).map((tag, index) => (
                      <span
                        key={index}
                        className="bg-gray-800 text-gray-300 px-2 py-1 rounded-full text-xs"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                  <h3 className="text-xl font-bold mb-2">{course.title}</h3>
                  <p className="text-gray-300 text-sm mb-4">{course.description}</p>
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center">
                      <Clock className="h-4 w-4 text-gray-400 mr-1" />
                      <span className="text-gray-400 text-sm">{course.duration}</span>
                    </div>
                    <div className="flex items-center">
                      <Users className="h-4 w-4 text-gray-400 mr-1" />
                      <span className="text-gray-400 text-sm">
                        {course.students.toLocaleString()} students
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <Star className="h-4 w-4 text-yellow-500 mr-1 fill-yellow-500" />
                      <span className="text-gray-300">{course.rating}</span>
                    </div>
                    <Button variant="neon" size="sm" asChild>
                      <Link to={`/courses/${course.id}`}>View Course</Link>
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {filteredCourses.length === 0 && (
            <div className="text-center mt-8 text-gray-400">
              <p>No courses match your criteria. Try adjusting your filters or search.</p>
            </div>
          )}
        </div>
      </section>
    </>
  );
}
