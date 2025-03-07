import React, { useState, useEffect } from "react";
import { database, ref, get } from "../../Firebase/firebase"; // Adjust the import path as necessary

const UserProfile = () => {
  const [userData, setUserData] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [newBio, setNewBio] = useState("");

  // Fetch user data from Firebase
  useEffect(() => {
    const userRef = ref(database, '/users/H3VHVfhVc7IhRRcuZDzs/UserProfile/lljPFwKVR5GJ0vBGNBlN');
    get(userRef).then(snapshot => {
      if (snapshot.exists()) {
        const data = snapshot.val();
        
        // Map the fields to a more structured format
        setUserData({
          bio: data.bio || '',
          age: data.age || 'Not Available',
          location: data.location || 'Not Available',
          rank: data.rank || 'Unknown',
          points: data.points || 0,
          skills: data.skills || [],
          resumeUrl: data.resumeUrl || '',
          badges: data.badges || []
        });
        setNewBio(data.bio);  // Set initial bio value for editing
      } else {
        console.log("No data available");
      }
    }).catch(error => {
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
      const userRef = ref(database, '/users/H3VHVfhVc7IhRRcuZDzs/UserProfile/lljPFwKVR5GJ0vBGNBlN');
      update(userRef, {
        bio: newBio,
      }).then(() => {
        console.log("Bio updated successfully!");
      }).catch(error => {
        console.error("Error updating bio: ", error);
      });
    }
    setIsEditing(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 text-white py-8 px-6">
      <div className="max-w-4xl mx-auto">
        {/* Profile Header */}
        <div className="text-center space-y-4 mb-10">
          <div className="relative inline-block">
            <img
              src={userData ? userData.profilePic : "default-image.jpg"}  // Placeholder image if no profile pic
              alt="Profile"
              className="w-32 h-32 rounded-full object-cover border-4 border-gradient-to-r from-blue-500 to-teal-400 shadow-lg"
            />
            <div className="absolute bottom-0 right-0 bg-gradient-to-r from-purple-500 to-pink-600 text-white rounded-full p-2">
              <button className="text-xl" onClick={handleEditToggle}>
                <i className="fas fa-pencil-alt"></i>
              </button>
            </div>
          </div>

          <h2 className="text-3xl font-semibold">{userData ? userData.rank : 'Unknown'}</h2>
          <p className="text-gray-400">Rank: {userData ? userData.rank : 'Unknown'}</p>
          <p className="text-xl font-bold">Points: {userData ? userData.points : 0}</p>
        </div>

        {/* Bio Section */}
        <div className="bg-gradient-to-r from-gray-800 to-gray-700 p-6 rounded-lg shadow-lg space-y-4">
          <h3 className="text-2xl font-semibold">Bio</h3>
          <p className="text-gray-300">
            {isEditing ? (
              <textarea
                className="w-full p-2 bg-gray-900 text-white rounded-md"
                value={newBio}
                onChange={handleBioChange}
              />
            ) : (
              userData ? userData.bio : "No bio available"
            )}
          </p>

          {isEditing ? (
            <button
              className="px-6 py-2 bg-gradient-to-r from-green-500 to-teal-600 text-white rounded-lg hover:bg-teal-700 transition-all"
              onClick={handleSaveBio}
            >
              Save Bio
            </button>
          ) : (
            <button
              className="px-6 py-2 bg-gradient-to-r from-yellow-500 to-orange-600 text-white rounded-lg hover:bg-orange-700 transition-all"
              onClick={handleEditToggle}
            >
              Edit Bio
            </button>
          )}
        </div>

        {/* Additional Information Section */}
        <div className="mt-10">
          <div className="bg-gradient-to-r from-gray-800 to-gray-700 p-6 rounded-lg shadow-lg space-y-4">
            <h3 className="text-2xl font-semibold">Additional Info</h3>

            <p className="text-gray-300">
              <strong>Age:</strong> {userData ? userData.age : "Not Available"}
            </p>
            <p className="text-gray-300">
              <strong>Location:</strong> {userData ? userData.location : "Not Available"}
            </p>
            <div className="flex flex-wrap gap-4">
              <strong>Skills:</strong>
              {userData && userData.skills.map((skill, index) => (
                <span
                  key={index}
                  className="px-4 py-2 bg-gradient-to-r from-blue-500 to-teal-400 text-white rounded-full"
                >
                  {skill}
                </span>
              ))}
            </div>

            <div className="mt-4">
              <strong>Resume:</strong>
              <a
                href={userData ? userData.resumeUrl : "#"}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-400 hover:underline"
              >
                View Resume
              </a>
            </div>
          </div>
        </div>

        {/* Badges Section */}
        <div className="mt-10">
          <h3 className="text-2xl font-semibold mb-4">Achievements</h3>
          <div className="grid grid-cols-3 gap-4">
            {userData && userData.badges.map((badge, index) => (
              <div
                key={index}
                className="bg-gradient-to-r from-purple-500 to-pink-600 text-white p-4 rounded-lg shadow-lg flex items-center justify-center"
              >
                {badge}
              </div>
            ))}
          </div>
        </div>

        {/* Social Links Section */}
        <div className="mt-10 text-center space-x-6">
          <a
            href={userData ? userData.github : "#"}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xl text-gray-400 hover:text-white transition-all"
          >
            <i className="fab fa-github"></i> GitHub
          </a>
          <a
            href={userData ? userData.linkedin : "#"}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xl text-gray-400 hover:text-white transition-all"
          >
            <i className="fab fa-linkedin"></i> LinkedIn
          </a>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
