import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axiosClient from './utility/axios';

// Async Thunks
export const fetchCart = createAsyncThunk('cart/fetchCart', async (_, { rejectWithValue }) => {
    try {
        const response = await axiosClient.get('/cart');
        return response.data.cart;
    } catch (error) {
        return rejectWithValue(error.response?.data?.message || 'Failed to fetch cart');
    }
});

export const addToCart = createAsyncThunk('cart/addToCart', async ({ productId, quantity }, { rejectWithValue }) => {
    try {
        const response = await axiosClient.post('/cart/add', { productId, quantity });
        return response.data.cart;
    } catch (error) {
        return rejectWithValue(error.response?.data?.message || 'Failed to add item to cart');
    }
});

export const removeFromCart = createAsyncThunk('cart/removeFromCart', async (productId, { rejectWithValue }) => {
    try {
        const response = await axiosClient.post('/cart/remove', { productId });
        return response.data.cart;
    } catch (error) {
        return rejectWithValue(error.response?.data?.message || 'Failed to remove item from cart');
    }
});

export const updateCartQuantity = createAsyncThunk('cart/updateQuantity', async ({ productId, quantity }, { rejectWithValue }) => {
    try {
        const response = await axiosClient.put('/cart/update', { productId, quantity });
        return response.data.cart;
    } catch (error) {
        return rejectWithValue(error.response?.data?.message || 'Failed to update item quantity');
    }
});

const initialState = {
    cartItems: [],
    loading: false,
    error: null,
};

const cartSlice = createSlice({
    name: 'cart',
    initialState,
    reducers: {
        clearCartState: (state) => {
            state.cartItems = [];
            state.error = null;
        }
    },
    extraReducers: (builder) => {
        builder
            // Fetch Cart
            .addCase(fetchCart.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchCart.fulfilled, (state, action) => {
                state.loading = false;
                state.cartItems = action.payload?.products || [];
            })
            .addCase(fetchCart.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            
            // Add to Cart
            .addCase(addToCart.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(addToCart.fulfilled, (state, action) => {
                state.loading = false;
                state.cartItems = action.payload?.products || [];
            })
            .addCase(addToCart.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            // Remove from Cart
            .addCase(removeFromCart.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(removeFromCart.fulfilled, (state, action) => {
                state.loading = false;
                state.cartItems = action.payload?.products || [];
            })
            .addCase(removeFromCart.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            // Update Quantity
            .addCase(updateCartQuantity.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(updateCartQuantity.fulfilled, (state, action) => {
                state.loading = false;
                state.cartItems = action.payload?.products || [];
            })
            .addCase(updateCartQuantity.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    }
});

export const { clearCartState } = cartSlice.actions;

// Selectors
export const selectCartItemsCount = (state) => 
    state.cart.cartItems.length;  // number of distinct products, not total quantity

export const selectCartTotal = (state) => 
    state.cart.cartItems.reduce((total, item) => total + (item.productId?.price || 0) * item.quantity, 0);

export default cartSlice.reducer;
