import React, { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import assets from "../assets/assets";
import { AuthContext } from "../../context/AuthContext.jsx";

const Profile = () => {
  const { authUser, updateProfile } = useContext(AuthContext);

  const [selectedImage, setSelectedImage] = useState(null);
  const navigate = useNavigate();
  const [name, setName] = useState(authUser?.fullName);
  const [bio, setBio] = useState(authUser?.bio);

const handleSubmit = async (e) => {
  e.preventDefault();

  if (selectedImage) {
    const base64Image = await new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(selectedImage);
      reader.onloadend = () => resolve(reader.result);
      reader.onerror = reject;
    });

    await updateProfile({ fullName: name, bio, profilePic: base64Image });
  } else {
    await updateProfile({ fullName: name, bio });
  }

  navigate("/");
};

  return (
    <div className="min-h-screen bg-cover bg-no-repeat flex items-center justify-center">
      <div className="w-5/6 max-w-2xl backdrop-blur-2xl text-gray-300 border-2 border-gray-500 rounded-lg flex items-center justify-between max-sm:flex-col-reverse">
        <form
          onSubmit={handleSubmit}
          className="p-10 flex-1 flex flex-col gap-5"
        >
          <h3 className="text-lg">Profile Details</h3>
          <label
            htmlFor="avatar"
            className="flex items-center gap-3 cursor-pointer"
          >
            <input
              onChange={(e) => setSelectedImage(e.target.files[0])}
              type="file"
              id="avatar"
              accept=".png, .jpg, .jpeg"
              hidden
            />
            <img
              src={
                selectedImage
                  ? URL.createObjectURL(selectedImage)
                  : assets.avatar_icon
              }
              alt="Avatar"
              className={`w-12 h-12 ${selectedImage && "rounded-full"}`}
            />
            Upload Profile Image
          </label>
          <input
            onChange={(e) => setName(e.target.value)}
            value={name}
            type="text"
            required
            placeholder="Your Name"
            className="p-2 border border-gray-500 rounded-md focus:outline-none focus:ring-2 focus:ring-violet-500"
          />
          <textarea
            onChange={(e) => setBio(e.target.value)}
            value={bio}
            placeholder="Write profile bio"
            required
            className="p-2 border border-gray-500 rounded-md focus:outline-none focus:ring-2 focus:ring-violet-500"
            rows={4}
          ></textarea>
          <button
            type="submit"
            className="bg-gradient-to-r from-purple-400 to-violet-600 text-white rounded-full p-2 text-lg cursor-pointer"
          >
            Save
          </button>
        </form>
        <img
          src={assets.logo_icon}
          alt=""
          className={`max-w-44 aspect-square rounded-full mx-10 max-sm:mt-10 ${
            selectedImage && "rounded-full"
          }`}
        />
      </div>
    </div>
  );
};

export default Profile;
