import { useEffect } from 'react'
import { useSelector } from 'react-redux'
import { useAppDispatch } from 'state'
import { useWeb3React } from '@web3-react/core'

import BigNumber from 'bignumber.js'
import { BIG_ZERO } from 'utils/bigNumber'
import useRefresh from 'hooks/useRefresh'
import { fetchNFTUserBalanceDataAsync, fetchNFTUserDataAsync, fetchStakedNFTBalanceDataAsync } from '.'
import { DeserializedNFTState, State } from '../types'

export const usePollNFTPublicData = () => {
    const dispatch = useAppDispatch()
    const { slowRefresh } = useRefresh()
    const { account } = useWeb3React()
    useEffect(() => {
      if (account) {
        dispatch(fetchNFTUserDataAsync({account}))
        dispatch(fetchNFTUserBalanceDataAsync({account}))
        dispatch(fetchStakedNFTBalanceDataAsync({account}))
      }
      
    }, [dispatch, slowRefresh, account])
}

export const useNFTs = (): DeserializedNFTState => {
    const nftState = useSelector((state: State) => state.nft)
    const { userDataLoaded, loadArchivedData, spyBalance, castNFTAllowance, nftBalance, stakedNFTBalance } = nftState

    const deserlizedNFTBalance = nftBalance.map((gego) => {
      return {
        staked: gego.staked,
        id: new BigNumber(gego.id),
        grade: gego.grade,
        lockedDays: gego.lockedDays,
        blockNum: new BigNumber(gego.blockNum),
        createdTime: gego.createdTime,
        quality: gego.quality,
        amount: new BigNumber(gego.amount),
        efficiency: gego.efficiency ? new BigNumber(gego.efficiency) : BIG_ZERO
      }
    })

    const deseralizedStakedNFTBalance = stakedNFTBalance.map((gego) => {
      return {
        staked: gego.staked,
        id: new BigNumber(gego.id),
        grade: gego.grade,
        lockedDays: gego.lockedDays,
        blockNum: new BigNumber(gego.blockNum),
        createdTime: gego.createdTime,
        quality: gego.quality,
        amount: new BigNumber(gego.amount),
        efficiency: gego.efficiency ? new BigNumber(gego.efficiency) : BIG_ZERO
      }
    })

    return { 
      userDataLoaded,
      loadArchivedData,
      spyBalance: spyBalance ? new BigNumber(spyBalance) : BIG_ZERO,
      castNFTAllowance: castNFTAllowance ? new BigNumber(castNFTAllowance) : BIG_ZERO,
      nftBalance: deserlizedNFTBalance,
      stakedNFTBalance: deseralizedStakedNFTBalance
    }
}