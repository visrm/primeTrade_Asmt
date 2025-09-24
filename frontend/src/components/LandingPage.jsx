import SignIn from "./Auth/SignIn";

const LandingPage = () => {
  return (
    <>
      <main className="relative flex flex-col flex-nowrap max-w-full h-full w-full mx-auto transition-all duration-300 overflow-hidden">
        <SignIn />
      </main>
    </>
  );
};

export default LandingPage;
