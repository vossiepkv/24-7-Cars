import { configureStore } from '@reduxjs/toolkit';
import userReducer from './slices/userSlice'; 
import authReducer from './slices/authSlice';
import { composeWithDevTools } from 'redux-devtools-extension'; // Import DevTools
// import postReducer from './slices/postSlice';

const store = configureStore({
  reducer: {
    user: userReducer,
    auth: authReducer,
    // post: postReducer,
  },
  devTools: composeWithDevTools(),
});

export default store;
