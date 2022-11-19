import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

export interface BookmarksDto {
    id: number;
    idUser: number;
    idPost: number;
}


export interface PBookmark {
    idUser: number;
    idPost: number;
    time: Date;
}

export interface BookmarksData {
    isLoading: boolean;
    bookmarks: BookmarksDto[];
}

const initialState: BookmarksData = {
    isLoading: false,
    bookmarks: [],
};

// 1) создание сущности закладки
// 2) кто создал, какой пост добавили в закладки? => idUser, idPost
// 3) написать запрос который создаст новую сущность
    // 1) описать интерфейс данных которые мы добавим (idUser, idPost)
    // 2) отправляем данные на сервер (передем их в payload)




// 4) получение всех сущностей (в network)

export const fetchBookmarks = createAsyncThunk(
    'bookmarks/fetchUsers', // просто айдишнки, тоесть пишем любое название, но семантичное
    async () => {
        // Здесь только логика запроса и возврата данных
        // Никакой обработки ошибок
        const response = await axios.get(`http://localhost:3001/bookmarks`);
        return response.data;
    }
);

export const fetchByUser = createAsyncThunk(
    'bookmarks/fetchPostsByUser', // просто айдишнки, тоесть пишем любое название, но семантичное
    async (id: number) => {
        // Здесь только логика запроса и возврата данных
        // Никакой обработки ошибок
        const response = await axios.get(`http://localhost:3001/bookmarks?idUser=${id}`);
        console.log(response)
        return response.data;
    }
);

export const post = createAsyncThunk(
    'bookmarks/postBookmarks', // просто айдишнки, тоесть пишем любое название, но семантичное
    async (value: PBookmark) => {
        // Здесь только логика запроса и возврата данных
        // Никакой обработки ошибок
        await axios.post('http://localhost:3001/bookmarks', value);
    }
);

export const remove = createAsyncThunk(
    'bookmarks/removeBookmarks', // просто айдишнки, тоесть пишем любое название, но семантичное
    async (idBookmarks: number) => {
        await axios.delete(`http://localhost:3001/bookmarks/${idBookmarks}`);
    }
);


export const BookmarkSlice: any = createSlice({
    name: 'bookmarks',
    initialState,
    reducers: {
    },
    extraReducers(builder) {
        builder
        .addCase(fetchBookmarks.fulfilled, (state, action) => {
            // сохранение данных в редакс
            state.bookmarks = action.payload;
            state.isLoading = false;
        })
        .addCase(fetchBookmarks.pending, state => {
            state.isLoading = true;
        })
        .addCase(fetchBookmarks.rejected, (_state, action) => {
            console.log('Не удалось получить данные.', action.payload);
        })
        .addCase(fetchByUser.fulfilled, (state, action) => {
            state.bookmarks = action.payload;
            
            state.isLoading = false;
        })
        .addCase(fetchByUser.pending, state => {
            state.isLoading = true;
        });
    },
});

export const {  } = BookmarkSlice.actions;

export default BookmarkSlice.reducer;
