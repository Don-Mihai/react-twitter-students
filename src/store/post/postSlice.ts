import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

export interface CustomPostDto {
	id: number;
	idUser: number;
	body: string;
}

export interface CustomPost extends CustomPostDto {}

export interface PostStore {
    posts: CustomPostDto[];
    isLoading: boolean;
}

const initialState: PostStore = {
    posts: [],
    isLoading: false,
};

export const fetch = createAsyncThunk(
    'posts/fetchPosts', // просто айдишнки, тоесть пишем любое название, но семантичное
    async () => {
        // Здесь только логика запроса и возврата данных
        // Никакой обработки ошибок
        const response = await axios.get('http://localhost:3001/posts');
        return response.data;
    }
);

export const fetchByUser = createAsyncThunk(
    'posts/fetchPostsByUser', // просто айдишнки, тоесть пишем любое название, но семантичное
    async (id: number) => {
        // Здесь только логика запроса и возврата данных
        // Никакой обработки ошибок
        const response = await axios.get(`http://localhost:3001/posts?idUser=${id}`);
        return response.data;
    }
);

export const post = createAsyncThunk(
    'posts/postPosts', // просто айдишнки, тоесть пишем любое название, но семантичное
    async (value: object) => {
        // Здесь только логика запроса и возврата данных
        // Никакой обработки ошибок
        await axios.post('http://localhost:3001/posts', value);
    }
);

export const update = createAsyncThunk(
    'posts/updatePosts', // просто айдишнки, тоесть пишем любое название, но семантичное
    async (value: CustomPost) => {
        // Здесь только логика запроса и возврата данных
        // Никакой обработки ошибок
        const payload = {
            body: value.body
        }
        const response = await axios.put(`http://localhost:3001/posts/${value.id}`, payload);
        return response.data;
    }
);

export const remove = createAsyncThunk(
    'posts/removePosts', // просто айдишнки, тоесть пишем любое название, но семантичное
    async (id: number) => {
        // Здесь только логика запроса и возврата данных
        // Никакой обработки ошибок
        await axios.delete(`http://localhost:3001/posts/${id}`);
    }
);

export const postSlice: any = createSlice({
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
                state.posts = action.payload;
            })
            .addCase(fetch.pending, state => {
                state.isLoading = true;
            })
            .addCase(fetch.rejected, (_state, action) => {
                console.log('Не удалось получить данные.', action.payload);
            })
            .addCase(fetchByUser.fulfilled, (state, action) => {
                state.posts = action.payload;
                state.isLoading = false;
            })
            .addCase(fetchByUser.pending, state => {
                state.isLoading = true;
            })
    },
});

// Action creators are generated for each case reducer function
export const {} = postSlice.actions;

export default postSlice.reducer;
