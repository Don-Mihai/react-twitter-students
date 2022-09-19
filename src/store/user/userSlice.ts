import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

interface UserDto {
    f: string;
    i: string;
    o: string;
    login: string;
    password: string;
    birthDate: string;
}

interface UserProc extends UserDto {}

interface Data {
    isLoading: boolean;
    user: UserProc
}

const initialState: Data = {
    isLoading: false,
    user: {} as UserProc
};

// запрос для авторизации
// http://localhost:3001/users?login=admin&?password=admin

export const fetch = createAsyncThunk(
    'user/fetchUser', // просто айдишнки, тоесть пишем любое название, но семантичное
    async (id) => {
        // Здесь только логика запроса и возврата данных
        // Никакой обработки ошибок
        const response = await axios.get(`http://localhost:3001/users/${id}`);
        return response.data;
    }
);

export const post = createAsyncThunk(
    'user/postUser', // просто айдишнки, тоесть пишем любое название, но семантичное
    async (value: object) => {
        // Здесь только логика запроса и возврата данных
        // Никакой обработки ошибок
        await axios.post('http://localhost:3001/posts', value);
    }
);

// export const update = createAsyncThunk(
//     'user/updateUser', // просто айдишнки, тоесть пишем любое название, но семантичное
//     async (value: CustomPost) => {
//         // Здесь только логика запроса и возврата данных
//         // Никакой обработки ошибок
//         const payload = {
//             body: value.body
//         }
//         const response = await axios.put(`http://localhost:3001/user/${value.id}`, payload);
//         return response.data;
//     }
// );

export const remove = createAsyncThunk(
    'posts/removeUser', // просто айдишнки, тоесть пишем любое название, но семантичное
    async (id: number) => {
        // Здесь только логика запроса и возврата данных
        // Никакой обработки ошибок
        await axios.delete(`http://localhost:3001/posts/${id}`);
    }
);

export const UserSlice: any = createSlice({
    name: 'post',
    initialState,
    reducers: {},
    extraReducers(builder) {
        // addCase тут как в качестве then
        // fullfield это успешное выполнение
        // pending это ожидание выполнения запроса
        // rejected это отклоненный запрос
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
    },
});

export default UserSlice.reducer;
