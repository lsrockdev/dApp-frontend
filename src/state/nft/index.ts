
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { SerializedNFTState } from 'state/types'
import { fetchNFTBalance, fetchStakedNFTs } from './fetchNFT'
import { fetchNFTGegos, PublicNFTData } from './fetchNFTData'
import { fetchPublicNFTData } from './fetchPublicNFTData'

const initialState: SerializedNFTState = {
    userDataLoaded: false,
    loadArchivedData: false,
    nftBalance: [],
    stakedNFTBalance: []
}

interface NFTUserDataResponse {
    spyBalance: string
    castNFTAllowance: string
  }

export const fetchNFTUserDataAsync = createAsyncThunk<NFTUserDataResponse, { account: string}>(
    'nft/fetchNFTUserDataAsync',
    async ({account}) => {
        const publicData = await fetchPublicNFTData(account)
        return {
            spyBalance: publicData.tokenAmountTotal,
            castNFTAllowance: publicData.nftCastAllowance
        }
    },
)

export const fetchNFTUserBalanceDataAsync = createAsyncThunk<PublicNFTData[], { account: string}>(
    'nft/fetchNFTuserBalanceDataAsync',
    async ({account}) => {
        const tokenIds = await fetchNFTBalance(account);
        const tokenGegos = await fetchNFTGegos(tokenIds);
        return tokenGegos;
    },
)

export const fetchStakedNFTBalanceDataAsync = createAsyncThunk<PublicNFTData[], { account: string}>(
    'nft/fetchStakedNFTBalanceDataAsync',
    async ({account}) => {
        const tokenIds = await fetchStakedNFTs(account);
        const tokenGegos = await fetchNFTGegos(tokenIds);
        return tokenGegos;
    },
)

export const nftSlice = createSlice({
    name: 'nftv2',
    initialState,
    reducers: {
        setLoadArchivedNFTData: (state, action) => {
            const loadArchivedData = action.payload
            state.loadArchivedData = loadArchivedData
        },
    },
    extraReducers: (builder) => {
        builder.addCase(fetchNFTUserDataAsync.fulfilled, (state,action) => {
            state.spyBalance = action.payload.spyBalance
            state.castNFTAllowance = action.payload.castNFTAllowance
        })
        builder.addCase(fetchNFTUserBalanceDataAsync.fulfilled, (state,action) => {
            state.nftBalance = action.payload.map((gego) => {
                return {
                    staked: false,
                    ...gego
                }
            })
        })
        builder.addCase(fetchStakedNFTBalanceDataAsync.fulfilled, (state,action) => {
            state.stakedNFTBalance = action.payload.map((gego) => {
                return {
                    staked: true,
                    ...gego
                }
            })
        })
    }
})

export const {setLoadArchivedNFTData } = nftSlice.actions
export default nftSlice.reducer