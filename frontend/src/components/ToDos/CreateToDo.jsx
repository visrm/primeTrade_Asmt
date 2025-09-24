import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import toast from "react-hot-toast";
import axios from "axios";
import { TODOS_API_END_POINT } from "../../utils/constants.js";
import { setLoadingToDos } from "../../redux/slices/todo.slice.js";

const CreateToDo = () => {
  const [todo, setTodo] = useState({
    title: "",
    description: "",
    deadline: "",
  });

  const dispatch = useDispatch();

  const { user } = useSelector((store) => store.auth);
  const { loadingToDo } = useSelector((store) => store.todo);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      let todoData = {
        user: user?._id,
        title: todo.title,
        description: todo.description,
        deadline: new Date(todo.deadline),
      };
      const response = await axios.post(
        `${TODOS_API_END_POINT}/create`,
        todoData,
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      );

      if (response.data.success) {
        toast.success(response.data.message);
      }
    } catch (error) {
      toast.error(error.response.data.message);
    } finally {
      dispatch(setLoadingToDos(false));
      setTodo({
        title: "",
        description: "",
        deadline: "",
      });
    }
  };

  const handleInputChange = (e) => {
    // console.log({ ...event, [e.target.name]: e.target.value });
    setTodo({ ...todo, [e.target.name]: e.target.value });
  };

  return (
    <>
      <article className="flex flex-col w-[75%] md:w-[50%] max-w-[90%] mx-auto">
        {/* You can open the modal using document.getElementById('ID').showModal() method */}
        <button
          className="submit-btn transition-all duration-300"
          onClick={() => document.getElementById("addtodoModal").showModal()}
        >
          Add ToDos' 
        </button>
        <dialog id="addtodoModal" className="modal">
          <div className="modal-box flex flex-col flex-nowrap my-2 w-full rounded-xl bg-[#fafafa] items-start border-b border-slate-100">
            <form method="dialog" id="handleCloseTodo">
              {/* if there is a button in form, it will close the modal */}
              <button
                className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"
                onClick={() => {
                  setTodo({
                    title: "",
                    description: "",
                    deadline: "",
                  });
                }}
              >
                ✕
              </button>
            </form>
            <form
              className="flex flex-col gap-1 w-full h-full items-center"
              onSubmit={handleSubmit}
              id="handleCreateTodo"
            >
              <h3 className="font-bold text-lg md:text-xl font-serif">
                Create ToDo
              </h3>
              <div className="w-[90%]">
                <label className="w-fit font-base text-sm" htmlFor="title">
                  Title :
                </label>
                <input
                  className="rounded-md input w-full border focus:outline-none bg-[#fdfdfd] border-slate-300"
                  placeholder="ToDo title"
                  name="title"
                  id="title"
                  value={todo.title}
                  onChange={handleInputChange}
                  maxLength={"50ch"}
                  required
                />
              </div>
              <div className="w-[90%]">
                <label
                  className="w-fit font-base text-sm"
                  htmlFor="description"
                >
                  Description :
                </label>
                <input
                  className="w-full max-w-full border focus:outline-none bg-[#fdfdfd] border-slate-300"
                  placeholder="ToDo description"
                  name="description"
                  id="description"
                  value={todo.description}
                  onChange={handleInputChange}
                  maxLength={"500ch"}
                />
              </div>
              <div className="w-[90%]">
                <label className="w-fit font-base text-sm" htmlFor="deadline">
                  Deadline :
                </label>
                <input
                  className="rounded-md input w-full border focus:outline-none bg-[#fdfdfd] border-slate-300"
                  type="datetime-local"
                  name="deadline"
                  id="deadline"
                  value={todo.deadline}
                  onChange={handleInputChange}
                />
              </div>

              <div className="flex justify-end border-t py-1 md:my-2 border-t-slate-200 w-full">
                <button className="submit-btn px-4" type="submit">
                  {loadingToDo ? "Creating..." : "Create"}
                </button>
              </div>
            </form>
          </div>
        </dialog>
      </article>
    </>
  );
};

export default CreateToDo;
