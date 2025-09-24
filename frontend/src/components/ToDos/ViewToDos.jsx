import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import ToDoCard from "./ToDoCard.jsx";
import { LuSearch } from "react-icons/lu";
import useGetUserTodos from "../../hooks/useGetUserTodos.jsx";
import { setSearchedQuery } from "../../redux/slices/todo.slice.js";

const ViewToDos = () => {
  const [item, setItem] = useState("");

  useGetUserTodos();
  const dispatch = useDispatch();

  const handleSearch = (e) => {
    e.preventDefault();
    dispatch(setSearchedQuery(item.trim()));
  };
  useEffect(() => {
    dispatch(setSearchedQuery(""));
  }, []);

  const { loadingTodos, todos } = useSelector((store) => store.todo);

  return (
    <>
      <section className="transition-all duration-300">
        <div className="flex my-4 items-center justify-center">
          <form
            onSubmit={handleSearch}
            className="flex flex-row flex-nowrap items-center justify-center gap-2 px-4 h-full w-full"
            id="search-bar-form1"
          >
            <input
              type="text"
              name="q"
              value={item}
              onChange={(e) => {
                setItem(e.target.value);
              }}
              placeholder="Search"
              className="input input-sm w-4/5 border border-gray-300 bg-[#fff] focus:outline-none rounded-full"
            />
            <button
              className="flex w-fit p-0.5 px-1 bg-gray-300 border-none rounded-full"
              type="submit"
            >
              <LuSearch className="h-5 w-5 my-auto" />
            </button>
          </form>
        </div>
        {loadingTodos && (
          <article className="flex flex-col flex-nowrap place-content-center">
            <div className="block mx-auto text-slate-900 font-medium text-sm font-mono">
              Loading ToDo List...
            </div>
          </article>
        )}
        {!loadingTodos && todos && todos.length === 0 && (
          <article className="flex flex-col flex-nowrap place-content-center">
            <div className="block mx-auto text-slate-900 font-medium text-sm font-mono">
              No ToDo's found.
            </div>
          </article>
        )}
        {!loadingTodos && todos && (
          <article className="flex flex-col flex-nowrap gap-2">
            {todos.length > 0 &&
              todos.map((todo) => (
                <ToDoCard key={`td-${todo?._id}`} todo={todo} />
              ))}
          </article>
        )}
      </section>
    </>
  );
};

export default ViewToDos;
