import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import toast from "react-hot-toast";
import { setLoadingToDos } from "../../redux/slices/todo.slice.js";
import { TODOS_API_END_POINT } from "../../utils/constants.js";
import { FaPencil } from "react-icons/fa6";

const EditTodoModal = ({ todo }) => {
  const dispatch = useDispatch();

  const [todoData, setTodoData] = useState({
    title: todo?.title || "",
    description: todo?.description || "",
    deadline: todo?.deadline || "",
  });

  const handleChange = async (e) => {
    setTodoData({ ...todoData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    let updateInfo = {
      title: todoData.title,
      description: todoData.description,
      deadline: todoData.deadline,
    };
    try {
      dispatch(setLoadingToDos(true));
      const response = await axios.patch(
        `${TODOS_API_END_POINT}/edit/${todo?._id}`,
        updateInfo,
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
      setTodoData({
        title: todo?.title || "",
        description: todo?.description || "",
        deadline: todo?.deadline || "",
      });
      document.getElementById("editModal")?.close();
    }
  };

  return (
    <>
      {/* You can open the modal using document.getElementById('ID').showModal() method */}

      <button
        className="font-semibold text-[#fdfdfd] border-0 ml-auto tooltip tooltip-top"
        onClick={() => document.getElementById("editModal").showModal()}
        data-tip="Edit"
      >
        <FaPencil className="w-5 h-4 fill-gray-900 hover:fill-indigo-600" />
      </button>

      <dialog id="editModal" className="modal">
        <div className="modal-box w-102 bg-white/90">
          <form method="dialog" id="handleClose">
            {/* if there is a button in form, it will close the modal */}
            <button
              className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"
              onClick={() => {
                setTodoData({
                  title: todo?.title || "",
                  description: todo?.description || "",
                  deadline: todo?.deadline || "",
                });
              }}
            >
              ✕
            </button>
          </form>
          <h3 className="font-bold font-serif text-lg md:text-xl">Edit ToDo</h3>
          <form
            method="PATCH"
            className="flex flex-col flex-[2_2_0] flex-wrap gap-1"
            id="handlePatch"
            onSubmit={handleSubmit}
          >
            <div className="w-[90%]">
              <label className="w-fit font-base text-sm" htmlFor="title">
                Title :
              </label>
              <input
                className="rounded-md input w-full border focus:outline-none bg-[#fdfdfd] border-slate-300"
                placeholder="ToDo title"
                name="title"
                id="title"
                value={todoData.title}
                onChange={handleChange}
                maxLength={"50ch"}
                required
              />
            </div>
            <div className="w-[90%]">
              <label className="w-fit font-base text-sm" htmlFor="description">
                Description :
              </label>
              <input
                className="w-full max-w-full border focus:outline-none bg-[#fdfdfd] border-slate-300"
                placeholder="ToDo description"
                name="description"
                id="description"
                value={todoData.description}
                onChange={handleChange}
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

export default EditTodoModal;
