import { useState } from "react";
import axios from "axios";
import { AUTH_API_END_POINT } from "../../utils/constants.js";
import { NavLink, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { LuEye, LuEyeClosed } from "react-icons/lu";

const SignUp = () => {
  const [registerInfo, setRegisterInfo] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [togglePwd, setTogglePwd] = useState(false);

  const navigate = useNavigate();

  const handleChange = (event) => {
    // console.log({ ...registerInfo, [event.target.name]: event.target.value });
    setRegisterInfo({
      ...registerInfo,
      [event.target.name]: event.target.value,
    });
  };

  const handleSubmit = async (event) => {
    try {
      event.preventDefault();
      if (registerInfo.confirmPassword !== registerInfo.password) {
        toast.error("Passwords doesn't match.");
        return;
      }
      let registration = {
        username: registerInfo.username.toLocaleLowerCase(),
        email: registerInfo.email,
        password: registerInfo.password,
      };

      const response = await axios.post(
        `${AUTH_API_END_POINT}/register`,
        registration,
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      );
      if (response.data.success) {
        toast.success(response.data.message);
        navigate("/login");
      }
    } catch (err) {
      toast.error(err.response.data.message);
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
      <section className="grid fixed top-0 left-0 place-content-center max-w-full w-full min-h-svh md:min-h-dvh bg-[#f0f0f0]">
        <article className="relative p-3 w-90 bg-white rounded-xl md:px-6 lg:px-8 text-left z-10">
          <form
            method="POST"
            className="block min-w-72 md:min-h-74 text-base"
            onSubmit={handleSubmit}
          >
            <h2 className="section-title font-bold text-gray-800">Sign Up</h2>
            <label htmlFor="username">Username :</label>
            <input
              type="text"
              id="username"
              name="username"
              placeholder="johndoe123"
              value={registerInfo.username}
              maxLength={"20ch"}
              pattern="^[a-zA-Z][a-zA-Z0-9._]{2,19}$"
              title="Only use letters, numbers, dots or underscores."
              className="border rounded-xs text-sm text-left font-normal w-full backdrop-blur-sm focus:outline-0 border-black/50 bg-[#fdfdfd]"
              onChange={handleChange}
              autoComplete="username"
              required
            />
            <label htmlFor="email">Email Address :</label>
            <input
              type="email"
              id="email"
              name="email"
              placeholder="johndoe123@gmail.com"
              value={registerInfo.email}
              autoComplete="username"
              className="border rounded-xs text-sm text-left font-normal w-full backdrop-blur-sm focus:outline-0 border-black/50 bg-[#fdfdfd]"
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
                value={registerInfo.password}
                autoComplete="current-password"
                maxLength={"20ch"}
                className="border rounded-xs text-sm text-left font-normal w-full backdrop-blur-sm focus:outline-0 border-black/50 bg-[#fdfdfd]"
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

            <label htmlFor="confirmPassword">Confirm Password :</label>
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              placeholder="********"
              value={registerInfo.confirmPassword}
              autoComplete="current-password"
              maxLength={"20ch"}
              className="border rounded-xs text-sm text-left font-normal w-full backdrop-blur-sm focus:outline-0 border-black/50 bg-[#fdfdfd]"
              onChange={handleChange}
              required
            />
            <button type="submit" className="submit-btn max-w-fit">
              Sign Up
            </button>
            <span className="inline-block my-2 text-sm text-neutral-600">
              Already have an account?{" "}
              <span>
                <NavLink
                  to="/login"
                  className="text-blue-700 font-semibold cursor-pointer"
                >
                  Log in
                </NavLink>
              </span>
            </span>
          </form>
        </article>
      </section>
    </>
  );
};

export default SignUp;
