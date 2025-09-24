import { NavLink, useNavigate } from "react-router-dom";
import { useState } from "react";
import axios from "axios";
import { AUTH_API_END_POINT } from "../../utils/constants.js";
import { useDispatch } from "react-redux";
import { setLoading, setUser } from "../../redux/slices/auth.slice.js";
import toast from "react-hot-toast";
import { LuEye, LuEyeClosed } from "react-icons/lu";

const SignIn = () => {
  const [userInfo, setUserInfo] = useState({
    email: "",
    password: "",
  });
  const [togglePwd, setTogglePwd] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleChange = (event) => {
    // console.log({ ...userInfo, [event.target.name]: event.target.value });
    setUserInfo({
      ...userInfo,
      [event.target.name]: event.target.value,
    });
  };

  const handleSubmit = async (event) => {
    try {
      event.preventDefault();
      dispatch(setLoading(true));
      let loginInfo = {
        email: userInfo.email,
        password: userInfo.password,
      };
      // console.log(loginInfo);

      const response = await axios.post(
        `${AUTH_API_END_POINT}/login`,
        loginInfo,
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      );
      if (response.data.success) {
        toast.success(response.data.message);
        dispatch(setUser(response.data.user));
        navigate("/home");
      }
    } catch (err) {
      toast.error(err.response.data.message);
    } finally {
      dispatch(setLoading(false));
    }
  };

  function togglePasswordVisibility(e) {
    const passwordInput = e.target
      .closest(".form-control")
      .querySelector("input");
    if (passwordInput.type === "password") {
      passwordInput.type = "text";
      setTogglePwd(true);
    } else {
      passwordInput.type = "password";
      setTogglePwd(false);
    }
  }

  return (
    <>
      <main>
        <section className="grid fixed top-0 left-0 place-content-center max-w-full w-full min-h-svh md:min-h-dvh bg-[#f0f0f0]">
          <article className="relative p-3 w-90 bg-white rounded-xl md:px-6 lg:px-8 text-left z-10">
            <form
              method="POST"
              className="block min-w-72 md:min-h-74 text-base"
              onSubmit={handleSubmit}
            >
              <h2 className="section-title font-bold text-gray-800">Sign In</h2>

              <label htmlFor="email">Email Address :</label>
              <input
                type="email"
                id="email"
                name="email"
                placeholder="yourname@domain.com"
                value={userInfo.email}
                className="border rounded-xs text-sm text-left font-normal focus:outline-0 w-full backdrop-blur-sm border-black/50 bg-[#fdfdfd]"
                autoComplete="username"
                onChange={handleChange}
                required
              />

              <label htmlFor="password">Password :</label>
              <div className="flex flex-row flex-nowrap form-control">
                <input
                  type="password"
                  id="password"
                  name="password"
                  placeholder="********"
                  value={userInfo.password}
                  maxLength={"20ch"}
                  className="border rounded-xs  text-sm text-left font-normal focus:outline-0 w-full backdrop-blur-sm border-black/50 bg-[#fdfdfd]"
                  autoComplete="current-password"
                  onChange={handleChange}
                  required
                />
                <button
                  type="button"
                  className="absolute right-5 md:right-9 py-0.5 px-1 btn-outline-none border-0 bg-transparent rounded-full transition-all duration-300 overflow-hidden"
                  onClick={togglePasswordVisibility}
                >
                  {togglePwd ? (
                    <LuEye className="h-5 w-5" />
                  ) : (
                    <LuEyeClosed className="h-5 w-5" />
                  )}
                </button>
              </div>

              <button type="submit" className="submit-btn">
                Sign In
              </button>
              <span className="inline-block my-2 text-sm text-neutral-600">
                Create a new account?{" "}
                <span>
                  <NavLink
                    to="/register"
                    className="text-blue-700 font-semibold cursor-pointer"
                  >
                    Register
                  </NavLink>
                </span>
              </span>
            </form>
          </article>
        </section>
      </main>
    </>
  );
};

export default SignIn;
