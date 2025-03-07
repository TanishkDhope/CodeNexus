import React, { useState, useEffect } from "react";
import { database, ref, get, update } from "../../Firebase/firebase"; // Adjust the import path as necessary

const UserProfile = () => {
  const [userData, setUserData] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [newBio, setNewBio] = useState("");

  // Fetch user data from Firebase
  useEffect(() => {
    const userRef = ref(
      database,
      "/users/H3VHVfhVc7IhRRcuZDzs/UserProfile/lljPFwKVR5GJ0vBGNBlN"
    );
    get(userRef)
      .then((snapshot) => {
        if (snapshot.exists()) {
          const data = snapshot.val();

          // Map fields to a structured format
          setUserData({
            bio: data.bio || "",
            age: data.age || "Not Available",
            location: data.location || "Not Available",
            rank: data.rank || "Unknown",
            points: data.points || 0,
            skills: data.skills || [],
            resumeUrl: data.resumeUrl || "",
            badges: data.badges || [],
            profilePic: data.profilePic || "default-image.jpg",
            github: data.github || "",
            linkedin: data.linkedin || "",
          });
          setNewBio(data.bio); // Set initial bio value for editing
        } else {
          console.log("No data available");
        }
      })
      .catch((error) => {
        console.error("Error fetching data: ", error);
      });
  }, []);

  const handleEditToggle = () => {
    setIsEditing(!isEditing);
  };

  const handleBioChange = (e) => {
    setNewBio(e.target.value);
  };

  const handleSaveBio = () => {
    if (userData) {
      const userRef = ref(
        database,
        "/users/H3VHVfhVc7IhRRcuZDzs/UserProfile/lljPFwKVR5GJ0vBGNBlN"
      );
      update(userRef, {
        bio: newBio,
      })
        .then(() => {
          console.log("Bio updated successfully!");
          setUserData({ ...userData, bio: newBio });
        })
        .catch((error) => {
          console.error("Error updating bio: ", error);
        });
    }
    setIsEditing(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-gray-900 via-black to-gray-900 text-white py-12 px-6">
      <div className="max-w-4xl mx-auto">
        {/* Profile Header */}
        <div className="text-center space-y-6 mb-12">
          <div className="relative inline-block">
            <img
              src={userData ? userData.profilePic : "default-image.jpg"}
              alt="Profile"
              className="w-32 h-32 rounded-full object-cover border-4 border-transparent bg-gradient-to-r from-blue-500 to-teal-400 p-1 shadow-lg neon-glow"
            />
            <button
              onClick={handleEditToggle}
              className="absolute bottom-0 right-0 bg-gradient-to-r from-purple-500 to-pink-600 text-white rounded-full p-2 shadow-lg hover:scale-110 transform transition-all duration-300"
            >
              <i className="fas fa-pencil-alt"></i>
            </button>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold neon-glow">
            {userData ? userData.rank : "Unknown"}
          </h2>
          <p className="text-gray-400">Rank: {userData ? userData.rank : "Unknown"}</p>
          <p className="text-xl font-bold">Points: {userData ? userData.points : 0}</p>
        </div>

        {/* Bio Section */}
        <div className="bg-gradient-to-r from-gray-800 to-gray-700 p-8 rounded-xl shadow-2xl mb-12">
          <h3 className="text-2xl font-semibold mb-4">Bio</h3>
          {isEditing ? (
            <textarea
              className="w-full p-3 bg-gray-900 text-white rounded-lg border border-gray-600 focus:outline-none focus:ring-2 focus:ring-neon-green transition-all"
              value={newBio}
              onChange={handleBioChange}
              rows="4"
            />
          ) : (
            <p className="text-gray-300 leading-relaxed">
              {userData ? userData.bio : "No bio available"}
            </p>
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

        {/* Additional Information Section */}
        <div className="bg-gradient-to-r from-gray-800 to-gray-700 p-8 rounded-xl shadow-2xl mb-12">
          <h3 className="text-2xl font-semibold mb-4">Additional Information</h3>
          <p className="text-gray-300 mb-2">
            <span className="font-semibold">Age:</span>{" "}
            {userData ? userData.age : "Not Available"}
          </p>
          <p className="text-gray-300 mb-4">
            <span className="font-semibold">Location:</span>{" "}
            {userData ? userData.location : "Not Available"}
          </p>
          <div className="mb-4">
            <span className="font-semibold mr-2">Skills:</span>
            {userData && userData.skills.length > 0 ? (
              userData.skills.map((skill, index) => (
                <span
                  key={index}
                  className="inline-block bg-gradient-to-r from-blue-500 to-teal-400 text-white px-3 py-1 rounded-full mr-2 mb-2"
                >
                  {skill}
                </span>
              ))
            ) : (
              <span className="text-gray-400">No skills listed</span>
            )}
          </div>
          <div>
            <span className="font-semibold">Resume:</span>{" "}
            <a
              href={userData ? userData.resumeUrl : "#"}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-400 hover:underline transition-all"
            >
              View Resume
            </a>
          </div>
        </div>

        {/* Achievements / Badges Section */}
        <div className="mb-12">
          <h3 className="text-2xl font-semibold mb-4">Achievements</h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            {userData && userData.badges && userData.badges.length > 0 ? (
              userData.badges.map((badge, index) => (
                <div
                  key={index}
                  className="bg-gradient-to-r from-purple-500 to-pink-600 text-white p-4 rounded-xl shadow-lg flex items-center justify-center"
                >
                  {badge}
                </div>
              ))
            ) : (
              <p className="text-gray-300">No achievements yet</p>
            )}
          </div>
        </div>

        {/* Social Links Section */}
        <div className="mt-10 text-center space-x-6">
          <a
            href={userData ? userData.github : "#"}
            target="_blank"
            rel="noopener noreferrer"
            className="text-2xl text-gray-400 hover:text-white transition-all"
          >
            <i className="fab fa-github"></i> GitHub
          </a>
          <a
            href={userData ? userData.linkedin : "#"}
            target="_blank"
            rel="noopener noreferrer"
            className="text-2xl text-gray-400 hover:text-white transition-all"
          >
            <i className="fab fa-linkedin"></i> LinkedIn
          </a>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
