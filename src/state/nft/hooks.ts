import { useEffect } from 'react'
import { useSelector } from 'react-redux'
import { useAppDispatch } from 'state'
import { useWeb3React } from '@web3-react/core'

import BigNumber from 'bignumber.js'
import { BIG_ZERO } from 'utils/bigNumber'
import useRefresh from 'hooks/useRefresh'
import { fetchNFTAllowancesAsync, fetchNFTRewardsDataAsync, fetchNFTUserBalanceDataAsync, fetchNFTUserDataAsync } from '.'
import { DeserializedNFTState, State } from '../types'

export const usePollNFTPublicData = () => {
    const dispatch = useAppDispatch()
    const { slowRefresh } = useRefresh()
    const { account } = useWeb3React()
    useEffect(() => {
      if (account) {
        dispatch(fetchNFTUserDataAsync({account}))
        dispatch(fetchNFTRewardsDataAsync({account}))
        dispatch(fetchNFTUserBalanceDataAsync({account}))
      }
      
    }, [dispatch, slowRefresh, account])
}

export const usePollNFTAllowanceData = () => {
    const dispatch = useAppDispatch()
    const { account } = useWeb3React()
    useEffect(() => {
      if (account) {
        dispatch(fetchNFTAllowancesAsync({account}))
      }
      
    }, [dispatch, account])
}

export const useNFTBalances = () => {
  const nftBalance = useSelector((state: State) => state.nft.nftBalance)

  const deserlizedNFTBalance = nftBalance.map((gego) => {
    return {
      staked: gego.staked,
      id: gego.id,
      grade: gego.grade,
      lockedDays: gego.lockedDays,
      blockNum: new BigNumber(gego.blockNum),
      createdTime: gego.createdTime,
      quality: gego.quality,
      amount: new BigNumber(gego.amount),
      efficiency: gego.efficiency ? new BigNumber(gego.efficiency) : BIG_ZERO
    }
  })

  return deserlizedNFTBalance
}

export const useNFTCastAllowance = () =>  {
  const castNFTAllowance = useSelector((state: State) => state.nft.castNFTAllowance)
  return castNFTAllowance ? new BigNumber(castNFTAllowance) : BIG_ZERO
}

export const useNFTFactoryAllowance = () => {
  return useSelector((state: State) => state.nft.factoryAllowance)
}

export const useNFTRewardAllowance = () => {
  return useSelector((state: State) => state.nft.rewardAllowance)
}

export const useNFTUserData = () =>  {
  const nftState = useSelector((state: State) => state.nft)
  const { userDataLoaded, loadArchivedData, spyBalance, castNFTAllowance, rewardEarned, nextHarvestUntil, rewardAllowance, factoryAllowance } = nftState

  return { 
    userDataLoaded,
    loadArchivedData,
    spyBalance: spyBalance ? new BigNumber(spyBalance) : BIG_ZERO,
    castNFTAllowance: castNFTAllowance ? new BigNumber(castNFTAllowance) : BIG_ZERO,
    rewardEarned: rewardEarned ? new BigNumber(rewardEarned) : BIG_ZERO,
    nextHarvestUntil,
    rewardAllowance,
    factoryAllowance
  }
}

export const useNFTs = (): DeserializedNFTState => {
    const nftState = useSelector((state: State) => state.nft)
    const { userDataLoaded, loadArchivedData, spyBalance, castNFTAllowance, nftBalance, rewardEarned, nextHarvestUntil, rewardAllowance, factoryAllowance } = nftState

    const deserlizedNFTBalance = nftBalance.map((gego) => {
      return {
        staked: gego.staked,
        id: gego.id,
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
      rewardEarned: rewardEarned ? new BigNumber(rewardEarned) : BIG_ZERO,
      nextHarvestUntil,
      nftBalance: deserlizedNFTBalance,
      rewardAllowance,
      factoryAllowance,
    }
}