import { configureStore } from '@reduxjs/toolkit';
import toDosReducer from './slices/toDosSlice'

export default configureStore({
  reducer: {
    toDos: toDosReducer,
  },
})