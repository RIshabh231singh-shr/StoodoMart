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

const authSlice = createSlice({
    name:"auth",
    initialState:{
        user:null,
        isAuthenticated:false,
        loading:false,
        error:null
    },
    reducers:{
        LogoutUser: (state) => {
            state.user = null;
            state.isAuthenticated = false;
            state.error = null;
        }
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
    }
});
export const { LogoutUser } = authSlice.actions;

export default authSlice.reducer;