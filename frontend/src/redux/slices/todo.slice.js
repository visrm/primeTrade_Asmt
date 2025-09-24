import { createSlice } from "@reduxjs/toolkit";

const todoSlice = createSlice({
  name: "todo",
  initialState: {
    loadingToDos: false,
    todos: [],
    searchedQuery: "",
  },
  reducers: {
    // actions
    setLoadingToDos: (state, action) => {
      state.loadingToDos = action.payload;
    },
    setToDos: (state, action) => {
      state.todos = action.payload;
    },
    setSearchedQuery: (state, action) => {
      state.searchedQuery = action.payload;
    },
  },
});

export const { setLoadingToDos, setToDos, setSearchedQuery } =
  todoSlice.actions;
export default todoSlice.reducer;
