import {createSlice, createAsyncThunk} from '@reduxjs/toolkit'    
import authService from './authService'

const user = JSON.parse(localStorage.getItem('user'))   

// ONLY PARTAINS TO THE USER PART OF OUR STATE.
const initialState = {
  user: user ? user : null,   
  isError: false,
  isSuccess: false,
  isLoading: false,
  message: ''
}

export const register = createAsyncThunk('auth/register', async (user, thunkAPI) => {
  // 'auth/register' IS THE PREFIX, e.g for 'auth/register/pending'
  try {   
    return await authService.register(user);       
  } catch (error) {
    const message = 
    (error.response && 
      error.response.data && 
      error.response.data.message) || 
      error.message || 
      error.toString() 
    return thunkAPI.rejectWithValue(message)  
    /* what's up w/ this syntax? I fixed it up a little to make it more readable. If any of the above 
    conditions are true, return thunkAPI.rejectWithValue(message) */
  }
})

export const login = createAsyncThunk('auth/login', async (user, thunkAPI) => {
  try {   
    return await authService.login(user);   
  } catch (error) {                         
    const message = 
    (error.response && 
      error.response.data && 
      error.response.data.message) || 
      error.message || 
      error.toString() 
    return thunkAPI.rejectWithValue(message)
  }
})

export const logout = createAsyncThunk('auth/logout', async () => {
  await authService.logout()    
})

export const authSlice = createSlice({
  name: 'auth',
  initialState, 
  reducers: {         
    reset: (state) => {         
      state.isLoading = false
      state.isError = false
      state.isSuccess = false
      state.isLoading = false
    }
  },
  extraReducers: (builder) => {     
    builder
      .addCase(register.pending, (state) => {     
        state.isLoading = true  
      })
      .addCase(register.fulfilled, (state, action) => {   
        state.isLoading = false
        state.isSuccess = true
        state.user = action.payload
      })
      .addCase(register.rejected, (state, action) => {
        state.isLoading = false
        state.isError = true
        state.message = action.payload
       
        state.user = null
      })

      .addCase(login.pending, (state) => {            
        state.isLoading = true                        
      })
      .addCase(login.fulfilled, (state, action) => {   
        state.isLoading = false
        state.isSuccess = true
        state.user = action.payload
      })
      .addCase(login.rejected, (state, action) => {
        state.isLoading = false
        state.isError = true
        state.message = action.payload
        state.user = null
      })

      .addCase(logout.fulfilled, (state) => {     
        state.user = null
      })
  }    
})

export const {reset} = authSlice.actions   // here's how to export reducers (reset here)
export default authSlice.reducer           // authReducer