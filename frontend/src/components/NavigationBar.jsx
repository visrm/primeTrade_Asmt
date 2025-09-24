import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { setLoading } from "../redux/slices/auth.slice.js";
import { AUTH_API_END_POINT } from "../utils/constants.js";
import axios from "axios";
import toast from "react-hot-toast";
import store from "../redux/store.js";

const NavigationBar = () => {
  const { user } = useSelector((store) => store.auth);
  const dispatch = useDispatch();

  const handleLogOut = async () => {
    try {
      dispatch(setLoading(true));
      const response = await axios.get(`${AUTH_API_END_POINT}/logout`, {
        withCredentials: true,
      });
      if (response.data.success) {
        store.dispatch({ type: "LOGOUT" });
        toast.success(response.data.message);
      }
    } catch (error) {
      toast.error(error);
    } finally {
      dispatch(setLoading(false));
    }
  };

  return (
    <>
      <header className="sticky top-0 left-0 block w-full h-full max-w-full md:min-h-14 bg-gray-600 z-[1000]">
        <nav className="max-w-full p-2 md:p-4 border shadow-md border-black/25 flex flex-row flex-nowrap justify-between text-sm font-sans bg-white/25 transition-all duration-300">
          {/* AppName with Logo(optional) (to be aligned to the left) */}
          <div className="inline-flex self-start">
            <Link to="/">
              <span className="font-bold text-lg md:text-xl font-mono hover:scale-105 text-gray-900 text-nowrap">
                ToDo's List
              </span>
            </Link>
          </div>

          {/* Nav Links (to be aligned to the right) */}
          <div className="inline-flex items-center justify-end gap-0.5 w-full max-w-full text-gray-800 transition-all duration-300">
            {user && (
              <div>
                <Link to="/home">
                  <div className="px-2 py-0.5 text-sm bg-transparent border-0 font-medium hover:scale-105 hover:font-semibold">
                    Dashboard
                  </div>
                </Link>
              </div>
            )}

            {user && (
              <div>
                <Link to="/profile">
                  <div className="px-2 py-0.5 text-sm bg-transparent border-0 font-medium hover:scale-105 hover:font-semibold">
                    Profile
                  </div>
                </Link>
              </div>
            )}

            {user && (
              <div>
                <div>
                  <button
                    className="px-4 py-0.5 border border-black/50 rounded-sm font-medium bg-slate-200 hover:scale-105"
                    onClick={handleLogOut}
                  >
                    LogOut
                  </button>
                </div>
              </div>
            )}

            {!user && (
              <ul className="ml-2 md:ml-4 list-none inline-flex flex-nowrap gap-2 md:gap-4">
                <li className="px-4 py-0.5 border border-black/50 rounded-sm font-medium bg-slate-200 hover:scale-105">
                  <Link to="/login">Login</Link>
                </li>
                <li className="px-4 py-0.5 border border-black/50 rounded-sm font-medium bg-slate-600 text-slate-100 hover:scale-105">
                  <Link to="/register">Register</Link>
                </li>
              </ul>
            )}
          </div>
        </nav>
      </header>
    </>
  );
};

export default NavigationBar;
