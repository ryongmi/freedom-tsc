import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface CounterState {
    value: number;
}

const initialState = {
    value: 0,
} as CounterState;

export const { reducer: counterReducer, actions } = createSlice({
    name: 'counter',
    initialState,
    reducers: {
        reset: () => initialState,
        setIncrementValue: (state) => {
            state.value += 1;
        },
        setDecrementValue: (state) => {
            state.value -= 1;
        },
        setIncrementValueByAmount: (state, action: PayloadAction<number>) => {
            state.value += action.payload;
        },
        setDecrementValueByAmount: (state, action: PayloadAction<number>) => {
            state.value -= action.payload;
        },
    },
});

export const {
    reset,
    setIncrementValue,
    setDecrementValue,
    setIncrementValueByAmount,
    setDecrementValueByAmount,
} = actions;
export default counterReducer;
