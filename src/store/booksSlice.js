import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { collection, getDocs, query, where, doc, updateDoc, deleteDoc, addDoc } from 'firebase/firestore';
import { db, auth } from '../firebase/config.js';


export const booksSlice = createSlice({
  name: 'books',
  initialState: {
    books: [],
    status: 'idle' // 'idle' | 'loading' | 'succeeded' | 'failed'
  },
  //reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchBooks.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchBooks.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.books = action.payload;
      })
      .addCase(fetchBooks.rejected, (state, action) => {
        state.status = 'failed';
        console.log(action.error.message);
      })
      .addCase(toggleRead.fulfilled, (state, action) => {
        state.books.map(book => {
          if (book.id == action.payload) {
            book.isRead = !book.isRead;
          }
        });
      })
      .addCase(toggleRead.rejected, (state, action) => {
        state.status = 'failed';
        console.log(action.error.message);
      })
      .addCase(eraseBook.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(eraseBook.fulfilled, (state, action) => {
        state.books = state.books.filter(book => book.id != action.payload);
        state.status = 'succeeded';
      })
      .addCase(eraseBook.rejected, (state, action) => {
        state.status = 'failed';
        console.log(action.error.message);
      })
      .addCase(addBook.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(addBook.fulfilled, (state, action) => {
        state.books.push(action.payload);
        state.status = 'succeeded';
      })
      .addCase(addBook.rejected, (state, action) => {
        state.status = 'failed';
        console.log(action.error.message);
      });
  }
})


export const selectBooks = state => state.books;

export default booksSlice.reducer;

export const fetchBooks = createAsyncThunk(
  'books/fetchBooks',
  async () => {
    const q = query(collection(db, "books"), where("user_id", "==", auth.currentUser.uid));// Query to fetch books for the current user
    const querySnapshot = await getDocs(q);// Fetch the documents based on the query asynchronously
    let bookList = [];
    querySnapshot.forEach((doc) => {
      bookList.push({ id: doc.id, ...doc.data() });// Add the document ID to the book data because it's separate from the document data in Firestore
    });
    return bookList;
  }
);

export const toggleRead = createAsyncThunk(
  'books/toggleRead',
  async (payload) => {
    const bookRef = doc(db, "books", payload.id);
    await updateDoc(bookRef, {
      isRead: !payload.isRead
    });
    return payload.id;
  });

export const eraseBook = createAsyncThunk(
  'books/eraseBook',
  async (payload) => {
    const bookRef = doc(db, "books", payload);
    await deleteDoc(bookRef);
    return payload;
  }
);

export const addBook = createAsyncThunk(
  'books/addBook',
  async (payload) => {
    let newBook = payload;
    newBook.user_id = auth.currentUser.uid;
    const docRef = await addDoc(collection(db, "books"), newBook);
    newBook.id = docRef.id;
    return newBook;
  }
);


