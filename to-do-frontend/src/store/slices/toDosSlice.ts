import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import {  ToDosInfo } from "../../Models/Models";

interface ToDosInfoState {
  value: ToDosInfo | undefined;
}

const initialState: ToDosInfoState = {value: undefined};

export const toDosSlice = createSlice({
  name: 'toDos',
  initialState,
  reducers: {
    load: (state, action: PayloadAction<ToDosInfo>) => {
      state.value = action.payload;
    }
  },
})

// Action creators are generated for each case reducer function
export const { load } = toDosSlice.actions

export default toDosSlice.reducer