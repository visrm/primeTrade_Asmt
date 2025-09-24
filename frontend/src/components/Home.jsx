import CreateToDo from "./ToDos/CreateToDo";
import ViewToDos from "./ToDos/ViewToDos";

const Home = () => {
  return (
    <>
      <main className="relative flex flex-col flex-nowrap max-w-full h-full w-full min-h-[90svh] md:min-h-screen mx-auto transition-all duration-300">
        <section>
          <article className="w-1/2 my-4 mx-auto">
            <CreateToDo />
          </article>

          <article className="my-4">
            <ViewToDos />
          </article>
        </section>
      </main>
    </>
  );
};

export default Home;
