import {createSlice, createAsyncThunk} from "@reduxjs/toolkit";
import
{
    searchSuggestions,
    globalSearch,
    searchProducts
} from "../../api/search.api";

// Async Thunks
export const fetchSearchSuggestions=createAsyncThunk(
    "search/fetchSearchSuggestions",
    async (query, {rejectWithValue}) =>
    {
        try
        {
            const response=await searchSuggestions(query);
            return response;
        } catch (error)
        {
            return rejectWithValue(error.response?.data||{message: error.message});
        }
    }
);

export const performGlobalSearch=createAsyncThunk(
    "search/performGlobalSearch",
    async (query, {rejectWithValue}) =>
    {
        try
        {
            const response=await globalSearch(query);
            return response;
        } catch (error)
        {
            return rejectWithValue(error.response?.data||{message: error.message});
        }
    }
);

export const searchForProducts=createAsyncThunk(
    "search/searchForProducts",
    async ({query, params={}}, {rejectWithValue}) =>
    {
        try
        {
            const response=await searchProducts(query, params);
            return response;
        } catch (error)
        {
            return rejectWithValue(error.response?.data||{message: error.message});
        }
    }
);

const searchSlice=createSlice({
    name: "search",
    initialState: {
        suggestions: [],
        searchResults: [],
        globalResults: null,
        pagination: null,
        query: "",
        loading: false,
        suggestionsLoading: false,
        error: null,
    },
    reducers: {
        clearError: (state) =>
        {
            state.error=null;
        },
        clearSuggestions: (state) =>
        {
            state.suggestions=[];
        },
        clearSearchResults: (state) =>
        {
            state.searchResults=[];
            state.globalResults=null;
            state.query="";
        },
        setQuery: (state, action) =>
        {
            state.query=action.payload;
        },
    },
    extraReducers: (builder) =>
    {
        builder
            // Fetch Search Suggestions
            .addCase(fetchSearchSuggestions.pending, (state) =>
            {
                state.suggestionsLoading=true;
                state.error=null;
            })
            .addCase(fetchSearchSuggestions.fulfilled, (state, action) =>
            {
                state.suggestionsLoading=false;
                state.suggestions=action.payload.suggestions||action.payload;
            })
            .addCase(fetchSearchSuggestions.rejected, (state, action) =>
            {
                state.suggestionsLoading=false;
                state.error=action.payload?.message||"Failed to fetch suggestions";
            })
            // Perform Global Search
            .addCase(performGlobalSearch.pending, (state) =>
            {
                state.loading=true;
                state.error=null;
            })
            .addCase(performGlobalSearch.fulfilled, (state, action) =>
            {
                state.loading=false;
                state.globalResults=action.payload;
            })
            .addCase(performGlobalSearch.rejected, (state, action) =>
            {
                state.loading=false;
                state.error=action.payload?.message||"Search failed";
            })
            // Search For Products
            .addCase(searchForProducts.pending, (state) =>
            {
                state.loading=true;
                state.error=null;
            })
            .addCase(searchForProducts.fulfilled, (state, action) =>
            {
                state.loading=false;
                state.searchResults=action.payload.products||action.payload;
                state.pagination=action.payload.pagination||null;
            })
            .addCase(searchForProducts.rejected, (state, action) =>
            {
                state.loading=false;
                state.error=action.payload?.message||"Search failed";
            });
    },
});

export const {clearError, clearSuggestions, clearSearchResults, setQuery}=searchSlice.actions;
export default searchSlice.reducer;
