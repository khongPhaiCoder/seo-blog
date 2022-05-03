import { configureStore } from "@reduxjs/toolkit";

import reducerSlice from "./reducer-slice";

const store = configureStore({
    reducer: {
        reducer: reducerSlice.reducer,
    },
});

export default store;
