import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setLoadingToDos, setToDos } from "../redux/slices/todo.slice.js";
import { TODOS_API_END_POINT } from "../utils/constants.js";
import axios from "axios";
import toast from "react-hot-toast";

const useGetUserTodos = () => {
  const dispatch = useDispatch();
  const { searchedQuery } = useSelector((store) => store.todo);

  useEffect(() => {
    (async function FetchToDos() {
      try {
        dispatch(setLoadingToDos(true));

        const response = await axios.get(
          `${TODOS_API_END_POINT}/my?keyword=${searchedQuery}`,
          {
            withCredentials: true,
          }
        );

        if (response.data.success) {
          dispatch(setToDos(response.data.toDos));
        }
      } catch (error) {
        toast.error(error.response.data.message);
      } finally {
        dispatch(setLoadingToDos(false));
      }
    })();
  }, [searchedQuery]);
};

export default useGetUserTodos;
