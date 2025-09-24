import { MdDelete } from "react-icons/md";
import EditTodoModal from "./EditTodoModal";
import axios from "axios";
import { TODOS_API_END_POINT } from "../../utils/constants";
import toast from "react-hot-toast";
import { setLoadingToDos } from "../../redux/slices/todo.slice";
import { useDispatch } from "react-redux";

const ToDoCard = ({ todo }) => {
  const datetime = new Date(todo?.deadline);

  const dispatch = useDispatch();

  const handleDelete = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.delete(
        `${TODOS_API_END_POINT}/delete/${todo._id}`,
        { withCredentials: true }
      );

      if (response.data.success) {
        toast.success(response.data.message);
      }
    } catch (error) {
      toast.error(error.response.data.message);
    } finally {
      dispatch(setLoadingToDos(false));
    }
  };
  return (
    <>
      <div className="relative block mx-auto p-2 py-1 sm:p-3 sm:py-2 md:py-4 w-full h-full min-h-16 max-w-[95%] sm:max-w-[90%] border border-gray-600 rounded-md bg-[#fdfdfd]">
        {/* todo Name & Description */}
        <div className="block h-full w-full max-w-[80%] ">
          <p className="text-slate-900 font-semibold text-base sm:text-lg md:text-xl truncate">
            {todo?.title}
          </p>
          {todo?.description && (
            <p className="text-slate-900 text-sm sm:text-base">
              {todo?.description}
            </p>
          )}
          {todo?.deadline && (
            <p className="mt-4 text-slate-600 text-xs">
              <span className="text-slate-900">deadline : </span>{" "}
              {datetime.toDateString()}
            </p>
          )}
        </div>
        <div className="absolute bottom-2 right-2">
          <div className="flex flex-row gap-2">
            <EditTodoModal todo={todo} />
            <button
              className="font-semibold text-[#fdfdfd] border-0 ml-auto tooltip tooltip-top"
              onClick={handleDelete}
              data-tip="Delete"
            >
              <MdDelete className="w-5 h-5 fill-gray-900 hover:fill-red-600" />
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default ToDoCard;
