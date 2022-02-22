import { createReducer } from '@reduxjs/toolkit'
import { NFTMarketPlaceSearchFilter } from 'state/types'
import {
  updateNFTMarketPlaceSearchFilter,
  updateNFTMarketPlaceSearchGrade
} from './actions'

export interface NFTMarketplaceState {
  searchFilter: NFTMarketPlaceSearchFilter
  searchGrade: number
}

function pairKey(token0Address: string, token1Address: string) {
  return `${token0Address};${token1Address}`
}

export const initialState: NFTMarketplaceState = {
  searchFilter: NFTMarketPlaceSearchFilter.SMART,
  searchGrade: -1
}

export default createReducer(initialState, (builder) =>
  builder
    .addCase(updateNFTMarketPlaceSearchFilter, (state, action) => {
      state.searchFilter = action.payload.searchFilter
    })
    .addCase(updateNFTMarketPlaceSearchGrade, (state, action) => {
      state.searchGrade = action.payload.searchGrade
    }),
)
