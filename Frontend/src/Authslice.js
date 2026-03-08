import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axiosClient from "./utility/axios";

export const LoginUser = createAsyncThunk("auth/login", async (logindata , {rejectWithValue}) => {
    try{
        const response = await axiosClient.post("/person/login",logindata);
        return response.data;
    }
    catch(error){
        return rejectWithValue(error.response?.data?.message || "Login failed");
    }
});

export const RegisterUser = createAsyncThunk("auth/register", async (registerData, { rejectWithValue }) => {
    try {
        const response = await axiosClient.post("/person/register", registerData);
        return response.data;
    } catch (error) {
        return rejectWithValue(error.response?.data?.message || "Registration failed");
    }
});

export const CheckAuthThunk = createAsyncThunk("auth/check", async (_, { rejectWithValue }) => {
    try {
        const response = await axiosClient.get("/person/verify");
        return response.data;
    } catch (error) {
        return rejectWithValue(error.response?.data?.message || "Verify failed");
    }
});

export const LogoutUserThunk = createAsyncThunk("auth/logout", async (_, { rejectWithValue }) => {
    try {
        const response = await axiosClient.post("/person/logout");
        return response.data;
    } catch (error) {
        return rejectWithValue(error.response?.data?.message || "Logout failed");
    }
});

const authSlice = createSlice({
    name:"auth",
    initialState:{
        user:null,
        isAuthenticated:false,
        loading:true, // Default to true while we verify
        error:null
    },
    reducers:{
        // Replaced by extraReducers for LogoutUserThunk
    },
    extraReducers:(builder)=>{
        builder
        //for login
        .addCase(LoginUser.pending,(state)=>{
            state.loading = true;
            state.error = null;
        })
        .addCase(LoginUser.fulfilled,(state,action)=>{
            state.loading = false;
            state.user = action.payload.person;
            state.isAuthenticated = !!action.payload.person;
        })
        .addCase(LoginUser.rejected,(state,action)=>{
            state.loading = false;
            state.error = action.payload;
        })
        //for register
        .addCase(RegisterUser.pending, (state) => {
            state.loading = true;
            state.error = null;
        })
        .addCase(RegisterUser.fulfilled, (state, action) => {
            state.loading = false;
            state.user = action.payload.person;
            state.isAuthenticated = !!action.payload.person;
        })
        .addCase(RegisterUser.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload;
        })
        //for check auth
        .addCase(CheckAuthThunk.pending, (state) => {
            state.loading = true;
        })
        .addCase(CheckAuthThunk.fulfilled, (state, action) => {
            state.loading = false;
            state.user = action.payload.person;
            state.isAuthenticated = !!action.payload.person;
        })
        .addCase(CheckAuthThunk.rejected, (state) => {
            state.loading = false;
            state.user = null;
            state.isAuthenticated = false;
        })
        //for logout
        .addCase(LogoutUserThunk.fulfilled, (state) => {
            state.user = null;
            state.isAuthenticated = false;
            state.error = null;
        });
    }
});

export default authSlice.reducer;