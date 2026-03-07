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

const authSlice = createSlice({
    name:"auth",
    initialState:{
        user:null,
        isAuthenticated:false,
        loading:false,
        error:null
    },
    reducers:{},
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
    }
});

export default authSlice.reducer;