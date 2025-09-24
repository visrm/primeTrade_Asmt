import { Navigate, Route, Routes } from "react-router-dom";
import LandingPage from "./components/LandingPage";
import SignIn from "./components/Auth/SignIn";
import SignUp from "./components/Auth/SignUp";
import Home from "./components/Home";
import { Toaster } from "react-hot-toast";
import Profile from "./components/Profile";
import { useSelector } from "react-redux";
import NavigationBar from "./components/NavigationBar";

function App() {
  const { user } = useSelector((store) => store.auth);
  return (
    <>
      <div>
        <Toaster />
      </div>
      <NavigationBar />
      <div className="flex p-0 m-0 max-w-full h-full mx-auto scroll-smooth transition-all overflow-hidden">
        <Routes>
          <Route
            path="/"
            element={!user ? <LandingPage /> : <Navigate to="/login" />}
          />
          <Route
            path="/login"
            element={!user ? <SignIn /> : <Navigate to="/home" />}
          />
          <Route
            path="/register"
            element={!user ? <SignUp /> : <Navigate to="/home" />}
          />
          <Route
            path="/home"
            element={user ? <Home /> : <Navigate to="/login" />}
          />
          <Route
            path="/profile"
            element={user ? <Profile /> : <Navigate to="/login" />}
          />
        </Routes>
      </div>
    </>
  );
}

export default App;
