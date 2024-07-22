import { $api } from "@/API/axios";
import { IDoc, IResponseData } from "@/types";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { AxiosError } from "axios";

type userDocsState = {
  isDocsLoading: boolean;
  errorMessage: string;
  docs: IDoc[] | null;
};

const initialState: userDocsState = {
  isDocsLoading: false,
  errorMessage: "",
  docs: null,
};

export const fetchDocs = createAsyncThunk<IDoc[], void, { rejectValue: string }>(
  "userDocs/fetchDocs",
  async (_, { rejectWithValue }) => {
    try {
      const response = await $api.get<IResponseData<IDoc[]>>("/docs/userdocs/get");

      const data = response.data;

      if (data.error_code) {
        throw new Error(data.error_text);
      }

      if (data.data) {
        return data.data;
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

export const createDoc = createAsyncThunk<IDoc, IDoc, { rejectValue: { error: string; doc: IDoc } }>(
  "userDocs/createDoc",
  async (doc, { rejectWithValue }) => {
    try {
      const response = await $api.post<IResponseData<IDoc>>("/docs/userdocs/create", {
        ...doc,
      });

      if (response.data.data) {
        return response.data.data;
      }

      return rejectWithValue({ error: "Ошибка!", doc });
    } catch (error) {
      if (error instanceof AxiosError) {
        console.log(error);

        return rejectWithValue({ error: error.response?.data || error.message, doc });
      }
      if (error instanceof Error) {
        console.log(error.message);

        return rejectWithValue({ error: error.message, doc });
      }

      return rejectWithValue({ error: "Ошибка!", doc });
    }
  }
);

export const updateDoc = createAsyncThunk<IDoc, IDoc, { rejectValue: { error: string | string[]; doc: IDoc } }>(
  "userDocs/updateDoc",
  async (doc, { rejectWithValue }) => {
    try {
      const response = await $api.post<IResponseData<IDoc>>(`/docs/userdocs/set/${doc.id}`, {
        ...doc,
      });

      if (response.data.data) {
        return response.data.data;
      }

      return rejectWithValue({ error: "Ошибка!", doc });
    } catch (error) {
      if (error instanceof AxiosError) {
        console.log(error);

        const keysOfErrors = Object.keys(error.response?.data.errors);

        const arrayOfErrors = keysOfErrors.reduce((prev, key) => {
          const arrayOfStringErrors = error.response?.data.errors[key];

          return prev.concat(arrayOfStringErrors);
        }, []);

        return rejectWithValue({ error: arrayOfErrors || error.message, doc });
      }
      if (error instanceof Error) {
        console.log(error.message);

        return rejectWithValue({ error: error.message, doc });
      }

      return rejectWithValue({ error: "Ошибка!", doc });
    }
  }
);

export const deleteDoc = createAsyncThunk<IDoc, IDoc, { rejectValue: { error: string; doc: IDoc } }>(
  "userDocs/deleteDoc",
  async (doc, { rejectWithValue }) => {
    try {
      await $api.post(`/docs/userdocs/delete/${doc.id}`);

      return doc;
    } catch (error) {
      if (error instanceof AxiosError) {
        console.log(error);

        return rejectWithValue({ error: error.response?.data || error.message, doc });
      }
      if (error instanceof Error) {
        console.log(error.message);

        return rejectWithValue({ error: error.message, doc });
      }

      return rejectWithValue({ error: "Ошибка!", doc });
    }
  }
);

const userDocsSlice = createSlice({
  name: "userDocs",
  initialState,
  reducers: {},
  extraReducers(builder) {
    builder.addCase(fetchDocs.pending, (state) => {
      state.isDocsLoading = true;
    });
    builder.addCase(fetchDocs.fulfilled, (state, action) => {
      state.docs = action.payload;
      state.isDocsLoading = false;
    });
    builder.addCase(fetchDocs.rejected, (state, action) => {
      if (action.payload) {
        state.errorMessage = action.payload;
      }
      state.isDocsLoading = false;
    });

    builder.addCase(createDoc.fulfilled, (state, action) => {
      if (state.docs) {
        state.docs.push(action.payload);
      } else {
        state.docs = [action.payload];
      }
    });

    builder.addCase(updateDoc.fulfilled, (state, action) => {
      if (state.docs) {
        state.docs = state.docs?.map((doc) => {
          if (doc.id === action.payload.id) {
            return action.payload;
          }
          return doc;
        });
      }
    });

    builder.addCase(deleteDoc.fulfilled, (state, action) => {
      if (state.docs) {
        state.docs = state.docs?.filter((doc) => {
          return doc.id !== action.payload.id;
        });
      }
    });
  },
});

export const userDocsReducer = userDocsSlice.reducer;
export const {} = userDocsSlice.actions;
