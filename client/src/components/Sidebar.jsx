import React from "react";
import assets, { userDummyData } from "../assets/assets";
import { useNavigate } from "react-router-dom";

const Sidebar = ({ selectedUser, setSelectedUser }) => {
  const navigate = useNavigate();
  return (
    <div
      className={`bg-[#8185b2]/10 h-full p-5 rounded-r-xl overflow-y-scroll text-white ${
        selectedUser ? "max-md:hidden" : ""
      }`}
    >
      <div className="pb-5">
        <div className="flex justify-between items-center">
          <img src={assets.logo} alt="logo" className="max-w-40" />
          <div className="relative py-2 group">
            <img
              src={assets.menu_icon}
              alt="menu_icon"
              className="max-h-5 cursor-pointer"
            />
            <div className="absolute top-full right-0 z-20 w-32 p-5 rounded-md bg-[#282142] border border-gray-600 hidden group-hover:block">
              <p
                onClick={() => navigate("/profile")}
                className="cursor-pointer text-sm"
              >
                Edit Profile
              </p>
              <hr className="border-gray-500 my-2 border-t" />
              <p className="cursor-pointer text-sm">Logout</p>
            </div>
          </div>
        </div>
        <div className="bg-[#282142] rounded-full flex items-center gap-2 py-3 px-4 mt-5">
          <img src={assets.search_icon} alt="search_icon" className="w-3 cursor-pointer" />
          <input type="text" className="bg-transparent border-none outline-none text-white text-xs placeholder-[#c8c8c8] flex-1" placeholder="Search..." />
        </div>
      </div>
      <div className="flex flex-col">
        {userDummyData.map((user, i) => (
          <div onClick={() => setSelectedUser(user)} key={i} className={`relative flex items-center gap-2 p-2 pl-4 rounded cursor-pointer max-sm:text-sm ${
            selectedUser?._id === user._id && "bg-[#282142]/50"
          }`}>
            <img src={user?.profilePic || assets.avatar_icon} alt="" className="w-[35px] aspect-[1/1] rounded-full"  />
            <div className="flex flex-col leading-5">
              <p>{user.fullName}</p>
              {
                i < 3 ? 
                <span className="text-xs text-green-400">Online</span> :
                <span className="text-xs text-neutral-400">Offline</span>
              }
            </div>
            {i > 2 && <p className="absolute top-4 right-4 text-xs h-5 w-5 flex justify-center items-center rounded-full bg-violet-500/50">{i}</p>}
          </div>
          
        ))}
      </div>
    </div>
  );
};

export default Sidebar;
