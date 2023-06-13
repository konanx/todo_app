import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

export interface authState {
  login: string;
  id: string | null;
}

const initialState: authState = {
  login: "",
  id: null,
};

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setAuthData: (state, action: PayloadAction<authState>) => {
      state.login = action.payload.login;
      state.id = action.payload.id;
    },
  },
});
export const { setAuthData } = authSlice.actions;

export default authSlice.reducer;
