import BigNumber from 'bignumber.js'
import generalNFTRewardABI from 'config/abi/generalNFTReward.json'
import { getOldGeneralNFTRewardAddress, getGeneralNFTRewardAddress } from 'utils/addressHelpers'
import multicall from 'utils/multicall'
import { BIG_TEN, BIG_ZERO } from 'utils/bigNumber'

export interface PublicNFTRewardUserData {
    balance: SerializedBigNumber
    earning: SerializedBigNumber
    nextHarvestUntil: number
}

export interface PublicNFTRewardPoolData {
    harvestInterval: number
    periodFinish: number
    rewardPerTokenStored: SerializedBigNumber
    rewardRate: SerializedBigNumber
    rewardPrecisionFactor: SerializedBigNumber
    totalSupply: SerializedBigNumber
    totalBalance: SerializedBigNumber
    harvestFee: SerializedBigNumber
}

export const fetchGeneralNFTRewardPublicData = async (isV2 = true): Promise<PublicNFTRewardPoolData> => {
    const nftRewardAddress = isV2 ? getGeneralNFTRewardAddress() : getOldGeneralNFTRewardAddress()

    const calls = [
        {
          address: nftRewardAddress,
          name: '_harvestInterval',
          params: [],
        },
        {
          address: nftRewardAddress,
          name: '_periodFinish',
          params: [],
        },
        {
            address: nftRewardAddress,
            name: '_rewardPerTokenStored',
            params: [],
        },
        {
            address: nftRewardAddress,
            name: '_rewardRate',
            params: [],
        },
        {
            address: nftRewardAddress,
            name: 'REWARDS_PRECISION_FACTOR',
            params: [],
        },
        {
            address: nftRewardAddress,
            name: 'totalSupply',
            params: [],
        },
        {
            address: nftRewardAddress,
            name: '_totalBalance',
            params: [],
        },
        {
            address: nftRewardAddress,
            name: '_teamRewardRate',
            params: [],
        },
    ];

    const [
        _harvestInterval, 
        _periodFinish,
        _rewardPerTokenStored,
        _rewardRate,
        _rewardPrecisionFactor,
        _totalSupply,
        _totalBalance,
        _harvestFee
    ] = await multicall(generalNFTRewardABI, calls)

    const harvestInterval = new BigNumber(_harvestInterval).toNumber()
    const periodFinish = new BigNumber(_periodFinish).toNumber()
    const rewardPerTokenStored = new BigNumber(_rewardPerTokenStored).toJSON()
    const rewardRate = new BigNumber(_rewardRate).toJSON()
    const rewardPrecisionFactor = new BigNumber(_rewardPrecisionFactor).toJSON()
    const totalSupply = new BigNumber(_totalSupply).toJSON()
    const totalBalance = new BigNumber(_totalBalance).toJSON()
    const harvestFee = new BigNumber(_harvestFee).toJSON()

    return {
        harvestInterval,
        periodFinish,
        rewardPerTokenStored,
        rewardRate,
        rewardPrecisionFactor,
        totalSupply,
        totalBalance,
        harvestFee
    }
}

export const fetchGeneralNFTRewardUserData = async (account: string, isV2 = true): Promise<PublicNFTRewardUserData> => {

    const nftRewardAddress = isV2 ? getGeneralNFTRewardAddress() : getOldGeneralNFTRewardAddress()

    const calls = [
        {
          address: nftRewardAddress,
          name: 'balanceOf',
          params: [account],
        },
        {
          address: nftRewardAddress,
          name: 'earned',
          params: [account],
        },
        {
            address: nftRewardAddress,
            name: '_nextHarvestUntil',
            params: [account],
        },
    ];

    const [_balance, earnedRaw, nextHarvestUntilRaw] =
    await multicall(generalNFTRewardABI, calls)

    const balance = new BigNumber(_balance).toJSON()
    const earning = new BigNumber(earnedRaw).toJSON()
    const nextHarvestUntil = new BigNumber(nextHarvestUntilRaw).toNumber();

    return {
        balance,
        earning,
        nextHarvestUntil
    }
}