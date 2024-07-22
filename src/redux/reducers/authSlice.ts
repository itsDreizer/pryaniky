import { $api } from "@/API/axios";
import { IResponseData } from "@/types";
import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { AxiosError } from "axios";

type AuthState = {
  errorMessage: string;
  isAuthorized: boolean;
  isAuthLoading: boolean;
  authChecking: boolean;
};

const initialState: AuthState = {
  errorMessage: "",
  isAuthorized: false,
  isAuthLoading: false,
  authChecking: true,
};

interface ILoginData {
  username: string;
  password: string;
}

export const login = createAsyncThunk<string, ILoginData, { rejectValue: string }>(
  "auth/login",
  async (data, { rejectWithValue }) => {
    const { username, password } = data;
    try {
      const response = await $api.post<IResponseData<{ token: string }>>("/docs/login", {
        username,
        password,
      });

      const data = response.data;

      if (data.error_code) {
        throw new Error(data.error_text);
      }

      if (data.data?.token) {
        return data.data.token;
      }

      throw new Error("Непредвиденная ошибка");
    } catch (error) {
      if (error instanceof AxiosError) {
        return rejectWithValue(error.response?.data || error.message);
      }

      if (error instanceof Error) {
        return rejectWithValue(error.message);
      }

      return rejectWithValue("Непредвиденная ошибка!");
    }
  }
);

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setIsAuthLoading(state, action: PayloadAction<boolean>) {
      state.isAuthLoading = action.payload;
    },
    setIsAuthorized(state, action: PayloadAction<boolean>) {
      state.isAuthorized = action.payload;
    },
    setErrorMessage(state, action: PayloadAction<string>) {
      state.errorMessage = action.payload;
    },
    setAuthChecking(state, action: PayloadAction<boolean>) {
      state.authChecking = action.payload;
    },
  },

  extraReducers(builder) {
    builder.addCase(login.pending, (state) => {
      state.isAuthLoading = true;
    });
    builder.addCase(login.fulfilled, (state, action) => {
      localStorage.setItem("token", action.payload);
      state.isAuthorized = true;
      state.isAuthLoading = false;
    });
    builder.addCase(login.rejected, (state, action) => {
      if (action.payload) {
        state.errorMessage = action.payload;
      }
      state.isAuthLoading = false;
    });
  },
});

export const authReducer = authSlice.reducer;
export const { setIsAuthLoading, setIsAuthorized, setErrorMessage, setAuthChecking } = authSlice.actions;
