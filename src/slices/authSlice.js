import { createSlice } from '@reduxjs/toolkit';

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    token: null,
    isLoggedIn: false,
  },
  reducers: {
    setToken: (state, action) => {
      state.token = action.payload; // Set the token directly
      state.isLoggedIn = !!action.payload; // Set isLoggedIn to true if there is a token
    },
    logout: (state) => {
      state.token = null; // Clears the token on logout
      state.isLoggedIn = false; // Updates the isLoggedIn state to false
    },
  },
});

// Export actions
export const { setToken, logout } = authSlice.actions; // Include setToken here

// Export reducer
export default authSlice.reducer;
