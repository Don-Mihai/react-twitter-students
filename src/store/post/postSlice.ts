import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { UserDto} from '../user/userSlice'

export interface CustomPostDto {
	id: number;
	idUser: number;
	body: string;
    img: Blob;
}

export interface CustomPost extends CustomPostDto {
    name: string;
    login: string;
}

export interface PostStore {
    posts: CustomPostDto[];
    processPosts: CustomPost[]
    isLoading: boolean;
}

const initialState: PostStore = {
    posts: [],
    processPosts: [],
    isLoading: false,
};

export const fetchPosts = createAsyncThunk(
    'posts/fetchPosts', // просто айдишнки, тоесть пишем любое название, но семантичное
    async () => {
        
        
        const responsePosts = await axios.get('http://localhost:3001/posts');
        const responseUsers = await axios.get(`http://localhost:3001/users`);

        const newProcessPosts = await responsePosts.data.map( (item: any) => {

            const findedUser: UserDto | undefined = responseUsers.data.find((user: UserDto) => user.id === item.idUser);
    
            return {
                ...item,
                name: findedUser?.name ? findedUser.name : '',
                login: findedUser?.login ? findedUser.login : '',
            } as CustomPost
        })

        return newProcessPosts
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
    
        await axios.delete(`http://localhost:3001/posts/${id}`);
    }
);

export const uploadImg = createAsyncThunk(
    'posts/uploadImg', 
    async (file: Blob) => {
        const formData = new FormData();

        formData.append('file', file)

        console.log(formData)
         
        fetch('http://localhost:5000/upload-img', {
            method: 'POST',
            body: formData
        })
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
            .addCase(fetchPosts.fulfilled, (state, action) => {
                state.processPosts = action.payload;
                state.isLoading = false;
            })
            .addCase(fetchPosts.pending, state => {
                state.isLoading = true;
            })
            .addCase(fetchPosts.rejected, (_state, action) => {
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
