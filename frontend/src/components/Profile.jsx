import { MdOutlineModeEdit } from "react-icons/md";
import { IoCalendarOutline } from "react-icons/io5";
import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AUTH_API_END_POINT, USERS_API_END_POINT } from "../utils/constants.js";
import axios from "axios";
import EditProfileModal from "./EditProfileModal.jsx";
import toast from "react-hot-toast";
import { setLoading, setUser } from "../redux/slices/auth.slice.js";
import { getMonth } from "../utils/extractTime.js";

const Profile = () => {
  const [profileImg, setProfileImg] = useState(null);
  const [userProfile, setUserProfile] = useState({});

  const profileImgRef = useRef(null);

  const { loading, user } = useSelector((store) => store.auth);

  const dispatch = useDispatch();

  useEffect(() => {
    (async function FetchUserInfo() {
      try {
        dispatch(setLoading(true));
        const response = await axios.get(`${AUTH_API_END_POINT}/me`, {
          withCredentials: true,
        });
        if (response.data.success) {
          dispatch(setUser(response.data.user));
          setUserProfile(response.data.user);
        }
      } catch (error) {
        console.error(error.response.data.message);
      } finally {
        dispatch(setLoading(false));
      }
    })();
  }, []);

  const handleImgChange = (e, state) => {
    const maxLimit = 5242880;
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        state === "profileImg" && setProfileImg(reader.result);
      };
      if (file.size >= maxLimit) {
        toast.error("File size exceeds size limit!");
        e.target.value("");
        setProfileImg(null);
      }
      reader.readAsDataURL(file);
    }
  };

  const handleImgSubmit = async (e) => {
    e.preventDefault();
    let updateInfo = {
      profile: {
        profileImg,
      },
    };

    try {
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
        setUserProfile(response.data.user);
        toast.success(response.data.message);
      }
    } catch (error) {
      toast.error(error.response.data.message);
    } finally {
      setProfileImg(null);
    }
  };

  return (
    <>
      <main className="w-full max-w-6xl md:max-w-full min-h-[90svh] md:min-h-screen transition-all duration-300">
        {/* User Profile Details*/}
        {!loading && user && (
          <section className="flex flex-col flex-nowrap flex-[4_4_0] w-full max-w-full transition-all duration-300 bg-[#fafafa]">
            <div className="relative block h-12 sm:h-16">
              <input
                type="file"
                accept="image/*"
                hidden
                ref={profileImgRef}
                onChange={(e) => handleImgChange(e, "profileImg")}
              />
              {/* User Avatar */}
              <div className="avatar absolute block left-5 md:left-10 -bottom-25 z-0">
                <div className="relative w-28 sm:w-28 md:w-36 ring-slate-400 rounded-full ring-2 ring-offset-2 bg-white">
                  <img
                    src={
                      profileImg ||
                      userProfile?.profile?.profileImg ||
                      "/assets/avatar-placeholder.png"
                    }
                  />
                </div>
                <span
                  className="absolute bottom-0 left-[75%] rounded-full truncate flex place-items-center h-7.5 w-8 hover:scale-105 bg-slate-600 border-2 border-slate-600 hover:bg-slate-300 hover:border-slate-300"
                  onClick={() => profileImgRef.current.click()}
                >
                  <MdOutlineModeEdit className="h-6 w-6 mx-auto cursor-pointer text-white hover:text-slate-800" />
                </span>
              </div>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 w-full bg-[#fafafa]">
              <div className="grid col-start-2 sm:col-start-2 col-span-2 py-1 text-left w-fit">
                <h1 className="flex flex-wrap flex-row gap-1 items-baseline text-base sm:text-lg md:text-xl font-medium">
                  {userProfile?.username}
                </h1>
                <div className="flex flex-col flex-nowrap gap-0 sm:pr-1 mb-2 text-xs sm:text-sm">
                  <span className="font-medium">About me :</span>
                  {userProfile?.profile?.bio ? (
                    <p className="font-normal">{userProfile?.profile?.bio}</p>
                  ) : (
                    <p className="font-mono font-medium text-sm text-gray-400">
                      Hello, I'm using ToDo's Lister.
                    </p>
                  )}
                </div>
                <div className="flex gap-2 items-center mb-2">
                  <IoCalendarOutline className="w-4 h-4 text-slate-500" />
                  <span className="text-xs text-slate-500">
                    Joined{" "}
                    {getMonth(
                      userProfile?.createdAt
                        ?.split("T")[0]
                        ?.split("-")[1]
                        .toString()
                    )}{" "}
                    {userProfile?.createdAt?.split("T")[0]?.split("-")[0]}
                  </span>
                </div>
              </div>
            </div>{" "}
          </section>
        )}

        {!loading && user && (
          <div className="block p-2 md:p-3 bg-[#fafafa]">
            <div className="flex mr-1 px-1 gap-1 sm:gap-2 lg:gap-3 w-full">
              <div className="w-full flex flex-end bg-[#fafafa] my-auto">
                <EditProfileModal />
              </div>

              {profileImg && (
                <div
                  className="bg-[#fafafa] my-auto tooltip tooltip-top"
                  data-tip="Update pictures"
                >
                  <button
                    className="btn amber-gradient text-[#fff] font-semibold border-0 btn-sm px-4 w-fit"
                    onClick={handleImgSubmit}
                  >
                    Update
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        <section></section>
      </main>
    </>
  );
};

export default Profile;
