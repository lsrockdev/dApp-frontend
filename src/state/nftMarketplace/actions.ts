import { createAction } from '@reduxjs/toolkit'
import { NFTMarketPlaceSearchFilter } from 'state/types'

export const updateNFTMarketPlaceSearchFilter = createAction<{ searchFilter: NFTMarketPlaceSearchFilter }>('nftmarketplace/updateSearchFilter')
export const updateNFTMarketPlaceSearchGrade = createAction<{ searchGrade: number }>('nftmarketplace/updateSearchGrade')
