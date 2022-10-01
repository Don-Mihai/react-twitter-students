import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

interface UserDto {
    id: number;
    name: string;
    login: string;
    password: string;
    day: string;
    month: string;
    year: string;
    tel: string;
    email: string;
}

export interface UserProc extends UserDto {}

interface Data {
    isLoading: boolean;
    user: UserProc;
    userInRegister: UserProc;
}

export interface authData {
    login: string;
    password: string;
}

const initialState: Data = {
    isLoading: false,
    user: {} as UserProc,
    userInRegister: {} as UserProc,
};

// запрос для авторизации
// http://localhost:3001/users?login=admin&?password=admin

export const fetch = createAsyncThunk(
    'user/fetchUser', // просто айдишнки, тоесть пишем любое название, но семантичное
    async (id: number) => {
        // Здесь только логика запроса и возврата данных
        // Никакой обработки ошибок
        const response = await axios.get(`http://localhost:3001/users?id=${id}`);
        return response.data;
    }
);

export const addUser = createAsyncThunk(
    'user/addUser',
    async (value: UserDto) => {
        const response = await axios.post(`http://localhost:3001/users`, value);
        return response.data;
    }
);

export const auth = createAsyncThunk(
    'user/authUser',
    async (value: authData) => {
        const response = await axios.get(`http://localhost:3001/users?login=${value.login}&password=${value.password}`);
        return response.data;
    }
);

export const UserSlice: any = createSlice({
    name: 'user',
    initialState,
    reducers: {
        addValuesInRegisterUser: (state, action) => {
            state.userInRegister = {...state.userInRegister, ...action.payload}
          },
    },
    extraReducers(builder) {
        builder
            .addCase(fetch.fulfilled, (state, action) => {
                state.user = action.payload;
            })
            .addCase(fetch.pending, state => {
                state.isLoading = true;
            })
            .addCase(fetch.rejected, (_state, action) => {
                console.log('Не удалось получить данные.', action.payload);
            })
            .addCase(addUser.fulfilled, (state, action) => {
                state.user = action.payload;
            })
            .addCase(addUser.rejected, (_state, action) => {
                console.log('Не удалось получить данные.', action.payload);
            })
            .addCase(auth.fulfilled, (state, action) => {
                const newObj: UserDto[] = (Array.isArray(action.payload) ? action.payload : [action.payload]) as UserDto[];

                state.user = newObj[0];
            })

    },
});

export const { addValuesInRegisterUser } = UserSlice.actions;

export default UserSlice.reducer;
