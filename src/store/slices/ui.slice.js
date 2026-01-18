import {createSlice} from "@reduxjs/toolkit";

const uiSlice=createSlice({
    name: "ui",
    initialState: {
        sidebarOpen: false,
        mobileMenuOpen: false,
        cartDrawerOpen: false,
        searchModalOpen: false,
        filterModalOpen: false,
        toast: null,
        modal: {
            isOpen: false,
            type: null,
            data: null,
        },
        theme: "light",
        isLoading: false,
    },
    reducers: {
        toggleSidebar: (state) =>
        {
            state.sidebarOpen=!state.sidebarOpen;
        },
        setSidebarOpen: (state, action) =>
        {
            state.sidebarOpen=action.payload;
        },
        toggleMobileMenu: (state) =>
        {
            state.mobileMenuOpen=!state.mobileMenuOpen;
        },
        setMobileMenuOpen: (state, action) =>
        {
            state.mobileMenuOpen=action.payload;
        },
        toggleCartDrawer: (state) =>
        {
            state.cartDrawerOpen=!state.cartDrawerOpen;
        },
        setCartDrawerOpen: (state, action) =>
        {
            state.cartDrawerOpen=action.payload;
        },
        toggleSearchModal: (state) =>
        {
            state.searchModalOpen=!state.searchModalOpen;
        },
        setSearchModalOpen: (state, action) =>
        {
            state.searchModalOpen=action.payload;
        },
        toggleFilterModal: (state) =>
        {
            state.filterModalOpen=!state.filterModalOpen;
        },
        setFilterModalOpen: (state, action) =>
        {
            state.filterModalOpen=action.payload;
        },
        showToast: (state, action) =>
        {
            state.toast={
                message: action.payload.message,
                type: action.payload.type||"info",
                duration: action.payload.duration||3000,
            };
        },
        hideToast: (state) =>
        {
            state.toast=null;
        },
        openModal: (state, action) =>
        {
            state.modal={
                isOpen: true,
                type: action.payload.type,
                data: action.payload.data||null,
            };
        },
        closeModal: (state) =>
        {
            state.modal={
                isOpen: false,
                type: null,
                data: null,
            };
        },
        setTheme: (state, action) =>
        {
            state.theme=action.payload;
        },
        toggleTheme: (state) =>
        {
            state.theme=state.theme==="light"? "dark":"light";
        },
        setGlobalLoading: (state, action) =>
        {
            state.isLoading=action.payload;
        },
    },
});

export const {
    toggleSidebar,
    setSidebarOpen,
    toggleMobileMenu,
    setMobileMenuOpen,
    toggleCartDrawer,
    setCartDrawerOpen,
    toggleSearchModal,
    setSearchModalOpen,
    toggleFilterModal,
    setFilterModalOpen,
    showToast,
    hideToast,
    openModal,
    closeModal,
    setTheme,
    toggleTheme,
    setGlobalLoading,
}=uiSlice.actions;
export default uiSlice.reducer;
