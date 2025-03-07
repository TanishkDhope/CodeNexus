import React from "react";
import { Link } from "react-router-dom";

const roadmaps = [
  {
    id: 1,
    title: "Frontend Development",
    description: "Master the skills needed to become a frontend developer.",
  },
  {
    id: 2,
    title: "Backend Development",
    description: "Become proficient in building server-side applications.",
  },
  {
    id: 3,
    title: "Fullstack Development",
    description: "Learn both frontend and backend to become a fullstack developer.",
  },
];

const RoadmapsHome = () => {
  return (
    <div className="min-h-screen bg-gradient-to-r from-gray-900 via-black to-gray-900 text-white p-8 sm:p-10 lg:p-14">
      <h1 className="text-4xl font-bold text-center mb-8 text-transparent bg-clip-text bg-gradient-to-r from-pink-400 via-purple-400 to-indigo-500 neon-glow">
        Roadmaps for Development
      </h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {roadmaps.map((roadmap) => (
          <Link
            key={roadmap.id}
            to={`/Roadmaps/${roadmap.id}`}
            className="bg-gradient-to-r from-green-400 to-blue-500 p-6 rounded-xl shadow-lg cursor-pointer transform transition-all hover:scale-105 hover:shadow-2xl focus:outline-none focus:ring-4 focus:ring-blue-300"
            aria-label={`Go to ${roadmap.title} roadmap`}
          >
            <h2 className="text-2xl font-semibold text-transparent bg-clip-text bg-gradient-to-r from-pink-400 via-purple-400 to-indigo-500">
              {roadmap.title}
            </h2>
            <p className="mt-2 text-gray-200">{roadmap.description}</p>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default RoadmapsHome;
