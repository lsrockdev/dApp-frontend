import { useEffect } from 'react'
import { useSelector } from 'react-redux'
import { useAppDispatch } from 'state'
import { useWeb3React } from '@web3-react/core'

import BigNumber from 'bignumber.js'
import { BIG_ZERO } from 'utils/bigNumber'
import useRefresh from 'hooks/useRefresh'
import { fetchNFTAllowancesAsync, fetchNFTPoolPublicDataAsync, fetchNFTPoolUserDataAsync, fetchNFTUserBalanceDataAsync, fetchNFTUserDataAsync } from '.'
import { DeserialzedNFTPoolUserData, DeserialzedNFTPoolPublicData, State } from '../types'


export const usePollNFTPublicData = () => {
    const dispatch = useAppDispatch()
    const { slowRefresh } = useRefresh()
    const { account } = useWeb3React()
    useEffect(() => {
      dispatch(fetchNFTPoolPublicDataAsync())
      if (account) {
        dispatch(fetchNFTUserDataAsync({account}))
        dispatch(fetchNFTPoolUserDataAsync({account}))
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

export const useOldNFTBalances = () => {
  const nftBalance = useSelector((state: State) => state.nft.oldNftBalance)

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

export const useNFTMarketplaceAllowance = () => {
  return useSelector((state: State) => state.nft.marketplaceAllowance)
}

export const useOldNFTRewardAllowance = () => {
  return useSelector((state: State) => state.nft.oldRewardAllowance)
}
export const useNFTPoolUserData = () : DeserialzedNFTPoolUserData => {
  const userData = useSelector((state: State) => state.nft.poolUserData)
  return {
    balance: userData ? new BigNumber(userData.balance) : BIG_ZERO,
    earning: userData ? new BigNumber(userData.earning) : BIG_ZERO,
    nextHarvestUntil: userData ? userData.nextHarvestUntil : 0,
    userDataLoaded: userData ? userData.userDataLoaded : false
  }
}
export const useOldNFTPoolUserData = () : DeserialzedNFTPoolUserData => {
  const userData = useSelector((state: State) => state.nft.oldPoolUserData)
  return {
    balance: userData ? new BigNumber(userData.balance) : BIG_ZERO,
    earning: userData ? new BigNumber(userData.earning) : BIG_ZERO,
    nextHarvestUntil: userData ? userData.nextHarvestUntil : 0,
    userDataLoaded: userData ? userData.userDataLoaded : false
  }
}

export const useNFTPoolPublicData = () : DeserialzedNFTPoolPublicData => {
  const publidData = useSelector((state: State) => state.nft.poolPublicData)
  return {
    harvestInterval: publidData ? publidData.harvestInterval : 0,
    periodFinish: publidData ? publidData.periodFinish : 0,
    rewardPerTokenStored: publidData ? new BigNumber(publidData.rewardPerTokenStored) : BIG_ZERO,
    rewardRate: publidData ? new BigNumber(publidData.rewardRate) : BIG_ZERO,
    rewardPrecisionFactor: publidData ? new BigNumber(publidData.rewardPrecisionFactor) : BIG_ZERO,
    totalSupply: publidData ? new BigNumber(publidData.totalSupply) : BIG_ZERO,
    totalBalance: publidData ? new BigNumber(publidData.totalBalance) : BIG_ZERO,
    harvestFee: publidData ? new BigNumber(publidData.harvestFee) : BIG_ZERO
  }
}

export const useOldNFTPoolPublicData = () : DeserialzedNFTPoolPublicData => {
  const publidData = useSelector((state: State) => state.nft.oldPoolPublicData)
  return {
    harvestInterval: publidData ? publidData.harvestInterval : 0,
    periodFinish: publidData ? publidData.periodFinish : 0,
    rewardPerTokenStored: publidData ? new BigNumber(publidData.rewardPerTokenStored) : BIG_ZERO,
    rewardRate: publidData ? new BigNumber(publidData.rewardRate) : BIG_ZERO,
    rewardPrecisionFactor: publidData ? new BigNumber(publidData.rewardPrecisionFactor) : BIG_ZERO,
    totalSupply: publidData ? new BigNumber(publidData.totalSupply) : BIG_ZERO,
    totalBalance: publidData ? new BigNumber(publidData.totalBalance) : BIG_ZERO,
    harvestFee: publidData ? new BigNumber(publidData.harvestFee) : BIG_ZERO
  }
}