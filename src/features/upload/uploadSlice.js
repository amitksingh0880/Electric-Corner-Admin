import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import uploadService from "./uploadService";

// Async Thunk for Image Upload
export const uploadImg = createAsyncThunk(
  "upload/images",
  async (data, thunkAPI) => {
    try {
      const formData = new FormData();
      data.forEach((file) => formData.append("images", file));

      const response = await uploadService.uploadImg(formData);
      return response; // response is already the data from the service
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Image upload failed"
      );
    }
  }
);

// Async Thunk for Deleting Image
export const delImg = createAsyncThunk(
  "delete/images",
  async (id, thunkAPI) => {
    try {
      await uploadService.deleteImg(id);
      return id; // Return only the ID of the deleted image
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed to delete image"
      );
    }
  }
);

// Initial State
const initialState = {
  images: [],
  isLoading: false,
  isError: false,
  isSuccess: false,
  message: "",
};

// Upload Slice
export const uploadSlice = createSlice({
  name: "images",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(uploadImg.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(uploadImg.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isError = false;
        state.isSuccess = true;
        state.images = [...state.images, ...action.payload];
      })
      .addCase(uploadImg.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.isSuccess = false;
        state.message = action.payload;
      })
      .addCase(delImg.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(delImg.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isError = false;
        state.isSuccess = true;
        state.images = state.images.filter((img) => img.public_id !== action.payload);
      })
      .addCase(delImg.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.isSuccess = false;
        state.message = action.payload;
      });
  },
});

export default uploadSlice.reducer;
