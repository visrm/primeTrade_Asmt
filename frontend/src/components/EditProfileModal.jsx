import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setLoading, setUser } from "../redux/slices/auth.slice.js";
import { USERS_API_END_POINT } from "../utils/constants.js";
import axios from "axios";
import toast from "react-hot-toast";

const EditProfileModal = () => {
  const { user } = useSelector((store) => store.auth);

  const dispatch = useDispatch();

  const [userData, setUserData] = useState({
    username: user?.username || "",
    bio: user?.profile?.bio || "",
    email: user?.email || "",
    currentPassword: "",
    newPassword: "",
  });

  const handleChange = async (e) => {
    setUserData({ ...userData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    let updateInfo = {
      username: userData.username,
      profile: {
        bio: userData.bio,
      },
      email: userData.email,
      currentPassword: userData.currentPassword,
      newPassword: userData.newPassword,
    };
    try {
      dispatch(setLoading(true));
      const response = await axios.patch(
        `${USERS_API_END_POINT}/update`,
        updateInfo,
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      );

      if (response.data.success) {
        dispatch(setUser(response.data.user));
        toast.success(response.data.message);
      }
    } catch (error) {
      toast.error(error.response.data.message);
    } finally {
      dispatch(setLoading(false));
      setUserData({
        username: user?.username || "",
        bio: user?.bio || "",
        email: user?.email || "",
        currentPassword: "",
        newPassword: "",
      });
      document.getElementById("editModal")?.close();
    }
  };

  return (
    <>
      {/* You can open the modal using document.getElementById('ID').showModal() method */}

      <button
        className="btn btn-sm font-semibold text-[#fdfdfd] border-0 w-fit ml-auto"
        onClick={() => document.getElementById("editModal").showModal()}
      >
        Edit Profile
      </button>

      <dialog id="editModal" className="modal">
        <div className="modal-box w-102 bg-white/90 backdrop-blur z-50">
          <form method="dialog" id="handleClose">
            {/* if there is a button in form, it will close the modal */}
            <button
              className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"
              onClick={() => {
                setUserData({
                  username: user?.username || "",
                  email: user?.email || "",
                  bio: user?.bio || "",
                  currentPassword: "",
                  newPassword: "",
                });
              }}
            >
              ✕
            </button>
          </form>
          <h3 className="font-bold font-serif text-lg md:text-xl">
            Edit Profile
          </h3>
          <form
            method="PATCH"
            className="flex flex-col flex-[2_2_0] flex-wrap gap-1"
            id="handlePatch"
            onSubmit={handleSubmit}
          >
            <div>
              <label className="w-fit font-base text-sm" htmlFor="username">
                Username:
              </label>
              <input
                type="input"
                className="input font-medium border border-gray-300 bg-gray-200"
                placeholder="Username"
                id="username"
                name="username"
                value={userData.username}
                pattern="[A-Za-z][A-Za-z0-9\-]*"
                minLength={3}
                maxLength={30}
                title="Only letters, numbers or dash"
                autoComplete="username"
                onChange={handleChange}
              />
            </div>
            <div>
              <label className="w-fit font-base text-sm" htmlFor="bio">
                About me:
              </label>
              <input
                type="input"
                className="input font-medium border border-gray-300 bg-gray-200"
                placeholder="About me"
                id="bio"
                name="bio"
                value={userData.bio}
                maxLength={500}
                autoComplete="username"
                onChange={handleChange}
              />
            </div>
            <div>
              <label className="w-fit font-base text-sm" htmlFor="email">
                Email:
              </label>
              <input
                type="email"
                className="input font-medium border border-gray-300 bg-gray-200"
                placeholder="Email Address"
                id="email"
                name="email"
                value={userData.email}
                autoComplete="username"
                onChange={handleChange}
              />
            </div>
            <div>
              <label className="w-fit font-base text-sm" htmlFor="CrPassword">
                Current Password:
              </label>
              <input
                type="password"
                className="input font-medium border border-gray-300 bg-gray-200"
                id="CrPassword"
                name="currentPassword"
                value={userData.currentPassword}
                minLength={8}
                maxLength={20}
                autoComplete="new-password"
                onChange={handleChange}
              />
            </div>
            <div>
              <label className="w-fit font-base text-sm" htmlFor="NwPassword">
                New Password:
              </label>
              <input
                type="password"
                className="input font-medium border border-gray-300 bg-gray-200"
                id="NwPassword"
                name="newPassword"
                value={userData.newPassword}
                minLength={8}
                maxLength={20}
                autoComplete="new-password"
                onChange={handleChange}
              />
            </div>
            <button className="submit-btn max-w-fit mt-2" type="submit">
              Update
            </button>
          </form>
        </div>
      </dialog>
    </>
  );
};

export default EditProfileModal;
