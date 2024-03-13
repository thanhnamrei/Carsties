import { create } from "zustand";

type State = {
    pageNumber: number;
    pageSize: number;
    pageCount: number;
    searchTerm: string;
    orderBy: string;
    filterBy: string;
    seller?: string;
    winner?: string;
}


type Actions = {
    setParams: (params: Partial<State>) => void,
    setSearchValue: (value: string) => void,
    reset: () => void
}


const initialState: State = {
    pageNumber: 1,
    pageSize: 4,
    pageCount: 1,
    searchTerm: '',
    orderBy: 'make',
    filterBy: 'live',
    seller: undefined,
    winner: undefined
}

export const useParamsStore = create<State & Actions>()((set =>({
    ...initialState,
    setParams: (newParams: Partial<State>) => {set((state) => {
        console.log('setParams',newParams)
        if(newParams.pageNumber) {
            return {...state,pageNumber:newParams.pageNumber}
        } else {
            return {...state,...newParams, pageNumber: 1}
        }
    })},
    setSearchValue: (value: string ) => {
        set((state) => {return {...state,searchTerm: value}})
    },
    reset: () => set(initialState)
})));