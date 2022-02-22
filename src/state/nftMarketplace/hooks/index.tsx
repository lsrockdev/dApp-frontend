import { useCallback } from "react"
import { useDispatch, useSelector } from "react-redux"
import { AppDispatch, AppState } from "state"
import { NFTMarketPlaceSearchFilter } from "state/types"
import { updateNFTMarketPlaceSearchFilter, updateNFTMarketPlaceSearchGrade } from "../actions"

export function useNFTMarketplaceSearchFilter(): [NFTMarketPlaceSearchFilter, (filter: NFTMarketPlaceSearchFilter) => void] {
    const dispatch = useDispatch<AppDispatch>()
    const searchFilter = useSelector<AppState, AppState['nftmarketplace']['searchFilter']>((state) => {
        return state.nftmarketplace.searchFilter
    })
  
    const setSearchFilter = useCallback(
        (filter: NFTMarketPlaceSearchFilter) => {
            dispatch(updateNFTMarketPlaceSearchFilter({ searchFilter: filter }))
        },
        [dispatch],
    )
  
    return [searchFilter, setSearchFilter]
}
export function useNFTMarketplaceSearchGrade(): [number, (grade: number) => void] {
    const dispatch = useDispatch<AppDispatch>()
    const searchGrade = useSelector<AppState, AppState['nftmarketplace']['searchGrade']>((state) => {
        return state.nftmarketplace.searchGrade
    })
  
    const setSearchGrade = useCallback(
        (grade: number) => {
            dispatch(updateNFTMarketPlaceSearchGrade({ searchGrade: grade }))
        },
        [dispatch],
    )
  
    return [searchGrade, setSearchGrade]
}