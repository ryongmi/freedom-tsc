import { configureStore } from '@reduxjs/toolkit';
import counterReducer from './slice/counterSlice';

const store = configureStore({
    reducer: {
        counter: counterReducer,
    },
    devTools: process.env.NODE_ENV !== 'production',
});

export default store;

export type RootState = ReturnType<typeof store.getState>;

export type AppDispatch = typeof store.dispatch;
