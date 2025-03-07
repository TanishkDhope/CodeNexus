import { useParams } from "react-router-dom";
import Button from "../components/Button";
import { ArrowRight, Clock, Star, Users, BookOpen, User } from "lucide-react";

// Static course data for the sake of this example.
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
    image: "/placeholder.svg?height=400&width=600",
    instructor: "John Doe",
    startDate: "April 15, 2025",
    syllabus: [
      "HTML & CSS Basics",
      "Responsive Web Design",
      "JavaScript Fundamentals",
      "React Introduction",
      "State Management with Redux",
      "Project: Build a Portfolio Website",
    ],
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
    image: "/placeholder.svg?height=400&width=600",
    instructor: "Jane Smith",
    startDate: "May 1, 2025",
    syllabus: [
      "Introduction to Node.js and Express",
      "Building RESTful APIs",
      "Connecting to MongoDB",
      "Authentication and Security",
      "Project: Build a Blog API",
    ],
    category: "backend",
    tags: ["Node.js", "Express", "MongoDB", "REST API"],
  },
  // Other courses...
];

const CourseDetailsPage = () => {
  const { courseId } = useParams(); // Get the courseId from the URL
  const course = courses.find((course) => course.id === parseInt(courseId));

  if (!course) {
    return <div className="text-center text-white">Course not found</div>;
  }

  return (
    <div className="bg-gray-900 min-h-screen text-white mt-15">
      <div className="container mx-auto px-4 py-16 grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Left Column (Image, Title, Description, and Additional Details) */}
        <div className="space-y-8">
          <div className="relative h-72 mb-8">
            <img
              src={course.image}
              alt={course.title}
              className="object-cover w-full h-full rounded-lg shadow-lg"
            />
          </div>

          <h1 className="text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 mb-6">
            {course.title}
          </h1>
          <p className="text-lg text-gray-300">{course.description}</p>

          {/* Additional Details */}
          <div className="space-y-4 mt-8">
            <div className="flex items-center text-lg text-gray-200">
              <Clock className="h-5 w-5 text-gray-200 mr-2" />
              <span>Start Date: {course.startDate}</span>
            </div>
            <div className="flex items-center text-lg text-gray-200">
              <User className="h-5 w-5 text-gray-200 mr-2" />
              <span>Instructor: {course.instructor}</span>
            </div>
          </div>
        </div>

        {/* Right Column (Detailed Information) */}
        <div className="space-y-8">
          {/* Course Overview */}
          <section className="bg-gradient-to-r from-blue-500 to-teal-500 p-6 rounded-lg shadow-lg">
            <h2 className="text-3xl font-semibold text-white mb-6">Course Overview</h2>
            <div className="text-lg text-gray-200">
              <div>Level: <span className="font-medium">{course.level}</span></div>
              <div>Duration: <span className="font-medium">{course.duration}</span></div>
              <div>Students Enrolled: <span className="font-medium">{course.students.toLocaleString()}</span></div>
            </div>

            <div className="flex justify-between items-center mt-6">
              <div className="flex items-center">
                <Star className="h-5 w-5 text-yellow-500 mr-1" />
                <span className="text-white">{course.rating}</span>
              </div>

              <div className="flex items-center">
                <Users className="h-5 w-5 text-gray-200 mr-1" />
                <span className="text-white">{course.students.toLocaleString()} students</span>
              </div>
            </div>
          </section>

          {/* Course Syllabus */}
          <section className="bg-gradient-to-r from-purple-500 to-pink-500 p-6 rounded-lg shadow-lg">
            <h2 className="text-3xl font-semibold text-white mb-6">Course Syllabus</h2>
            <div className="space-y-4 text-gray-200">
              {course.syllabus.map((item, index) => (
                <div key={index} className="flex items-center">
                  <BookOpen className="h-5 w-5 text-gray-200 mr-2" />
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </section>

          {/* Course Tags */}
          <section className="bg-gradient-to-r from-indigo-500 to-purple-600 p-6 rounded-lg shadow-lg">
            <h2 className="text-3xl font-semibold text-white mb-6">Tags</h2>
            <div className="flex flex-wrap gap-2">
              {course.tags.map((tag, index) => (
                <span key={index} className="bg-gray-800 text-gray-300 px-4 py-2 rounded-full text-xs">
                  {tag}
                </span>
              ))}
            </div>
          </section>

          {/* Enroll CTA */}
          <section className="text-center mt-8">
            <Button variant="neon" size="lg" className="bg-gradient-to-r from-pink-500 to-purple-500">
              Enroll Now <ArrowRight className="inline ml-2" />
            </Button>
          </section>
        </div>
      </div>
    </div>
  );
};

export default CourseDetailsPage;
