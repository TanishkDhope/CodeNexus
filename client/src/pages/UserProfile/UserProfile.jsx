import React, { useState } from "react";

const UserProfile = () => {
  // Hardcoded User Data
  const initialUserData = {
    name: "Tanishk Dhope",
    age: 19,
    rank: 1,
    points: 2500,
    skills: [
      "JavaScript",
      "React",
      "Node.js",
      "Express.js",
      "MongoDB",
      "PostgreSQL",
      "MySQL",
      "HTML",
      "CSS",
      "Git",
      "GSAP",
      "Three.js",
      "Firebase",
    ],
    bio: "Frontend developer passionate about creating interactive and high-performance web applications.",
    location: "Pune, India",
    badges: ["Top Coder", "React Master", "Open Source Contributor"],
    profilePic: "https://via.placeholder.com/150", // Replace with actual image URL
    github: "https://github.com/tanishkdhope",
    linkedin: "https://linkedin.com/in/tanishkdhope",
    resumeUrl: "https://tanishkdhope-resume.com",
  };

  const [userData, setUserData] = useState(initialUserData);
  const [isEditing, setIsEditing] = useState(false);
  const [newBio, setNewBio] = useState(userData.bio);

  const handleEditToggle = () => {
    setIsEditing(!isEditing);
  };

  const handleBioChange = (e) => {
    setNewBio(e.target.value);
  };

  const handleSaveBio = () => {
    setUserData({ ...userData, bio: newBio });
    setIsEditing(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-gray-900 via-black to-gray-900 text-white py-12 px-6 mt-20">
      <div className="max-w-4xl mx-auto">
        {/* Profile Header */}
        <div className="text-center space-y-6 mb-12">
          <div className="relative inline-block">
            <img
              src={userData.profilePic}
              alt="Profile"
              className="w-32 h-32 rounded-full object-cover border-4 border-transparent bg-gradient-to-r from-blue-500 to-teal-400 p-1 shadow-lg"
            />
          </div>
          <h2 className="text-4xl md:text-5xl font-bold">{userData.name}</h2>
          <p className="text-gray-400">Rank: {userData.rank}</p>
          <p className="text-xl font-bold">Points: {userData.points}</p>
        </div>

        {/* Bio Section */}
        <div className="bg-gradient-to-r from-gray-800 to-gray-700 p-8 rounded-xl shadow-2xl mb-12">
          <h3 className="text-2xl font-semibold mb-4">Bio</h3>
          {isEditing ? (
            <textarea
              className="w-full p-3 bg-gray-900 text-white rounded-lg border border-gray-600 focus:outline-none focus:ring-2 focus:ring-green-500 transition-all"
              value={newBio}
              onChange={handleBioChange}
              rows="4"
            />
          ) : (
            <p className="text-gray-300 leading-relaxed">{userData.bio}</p>
          )}
          <div className="mt-4 text-right">
            {isEditing ? (
              <button
                onClick={handleSaveBio}
                className="px-6 py-2 bg-gradient-to-r from-green-500 to-teal-600 text-white rounded-lg hover:from-green-600 hover:to-teal-700 transition-all"
              >
                Save Bio
              </button>
            ) : (
              <button
                onClick={handleEditToggle}
                className="px-6 py-2 bg-gradient-to-r from-yellow-500 to-orange-600 text-white rounded-lg hover:from-yellow-600 hover:to-orange-700 transition-all"
              >
                Edit Bio
              </button>
            )}
          </div>
        </div>

        {/* Additional Information */}
        <div className="bg-gradient-to-r from-gray-800 to-gray-700 p-8 rounded-xl shadow-2xl mb-12">
          <h3 className="text-2xl font-semibold mb-4">Additional Information</h3>
          <p className="text-gray-300 mb-2">
            <span className="font-semibold">Age:</span> {userData.age}
          </p>
          <p className="text-gray-300 mb-4">
            <span className="font-semibold">Location:</span> {userData.location}
          </p>
          <div className="mb-4">
            <span className="font-semibold mr-2">Skills:</span>
            {userData.skills.map((skill, index) => (
              <span
                key={index}
                className="inline-block bg-gradient-to-r from-blue-500 to-teal-400 text-white px-3 py-1 rounded-full mr-2 mb-2"
              >
                {skill}
              </span>
            ))}
          </div>
          <div className="mb-4">
            <span className="font-semibold mr-2">Badges:</span>
            {userData.badges.map((badge, index) => (
              <span
                key={index}
                className="inline-block bg-gradient-to-r from-yellow-500 to-orange-500 text-white px-3 py-1 rounded-full mr-2 mb-2"
              >
                {badge}
              </span>
            ))}
          </div>
        </div>

        {/* Social Links */}
        <div className="mt-10 text-center space-x-6">
          <a
            href={userData.github}
            target="_blank"
            rel="noopener noreferrer"
            className="text-2xl text-gray-400 hover:text-white transition-all"
          >
            <i className="fab fa-github"></i> GitHub
          </a>
          <a
            href={userData.linkedin}
            target="_blank"
            rel="noopener noreferrer"
            className="text-2xl text-gray-400 hover:text-white transition-all"
          >
            <i className="fab fa-linkedin"></i> LinkedIn
          </a>
          <a
            href={userData.resumeUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-2xl text-gray-400 hover:text-white transition-all"
          >
            <i className="fas fa-file"></i> Resume
          </a>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
