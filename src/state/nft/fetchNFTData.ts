import BigNumber from 'bignumber.js'
import spyNFTABI from 'config/abi/spyNFT.json'
import nftFactoryABI from 'config/abi/spyNFTFactory.json'
import multicall from 'utils/multicall'
import { getOldGeneralNFTRewardAddress, getGeneralNFTRewardAddress, getNFTFactoryAddress, getNFTMarketplaceAddress } from 'utils/addressHelpers'
import { getFixRate } from 'utils/nftHelpers'
import { getSpyNFTContract } from 'utils/contractHelpers'
import tokens from 'config/constants/tokens'

export type PublicNFTData = {
    id: SerializedBigNumber
    grade: number
    lockedDays: number
    blockNum: SerializedBigNumber
    createdTime: number
    quality: number
    amount: SerializedBigNumber
    efficiency: SerializedBigNumber
    staked: boolean
}

export const fetchNFTGegos = async (tokenIds: string[]): Promise<PublicNFTData[]> => {
    
    const factoryAddress = getNFTFactoryAddress()
    const calls = tokenIds.map((tokenId) => {
        return { address: factoryAddress, name: 'getGego', params: [tokenId] }
    })

    const rawNFTGegos = await multicall(nftFactoryABI, calls)
    const parsedNFTGegos = rawNFTGegos.map((rawNFTGego, index) => {
        const quality = new BigNumber(rawNFTGego.quality?._hex).toNumber()
        const grade = new BigNumber(rawNFTGego.grade?._hex).toNumber()
        const efficiency = getFixRate(grade, quality).toJSON()
        return {
            id: tokenIds[index],
            grade,
            lockedDays: new BigNumber(rawNFTGego.lockedDays?._hex).toNumber(),
            blockNum: new BigNumber(rawNFTGego.blockNum?._hex).toJSON(),
            createdTime: new BigNumber(rawNFTGego.createdTime?._hex).toNumber(),
            quality,
            amount: new BigNumber(rawNFTGego.amount?._hex).toJSON(),
            efficiency,
            staked: false
        }
    })

    return parsedNFTGegos;
}

export const fetchNFTAllowances = async (account: string): Promise<{factoryAllowance: boolean, rewardAllowance: boolean, oldRewardAllowance:boolean, marketplaceAllowance: boolean}> => {
    const nftAddress = tokens.spynft.address
    const nftMarketplaceAddress = getNFTMarketplaceAddress();
    const nftFactoryAddress = getNFTFactoryAddress();
    const oldGeneralNFTRewardAddress = getOldGeneralNFTRewardAddress()
    const generalNFTRewardAddress = getGeneralNFTRewardAddress()

    const calls = [
        {
          address: nftAddress,
          name: 'isApprovedForAll',
          params: [account, nftFactoryAddress],
        },
        {
          address: nftAddress,
          name: 'isApprovedForAll',
          params: [account, generalNFTRewardAddress],
        },
        {
          address: nftAddress,
          name: 'isApprovedForAll',
          params: [account, oldGeneralNFTRewardAddress],
        },
        {
          address: nftAddress,
          name: 'isApprovedForAll',
          params: [account, nftMarketplaceAddress],
        },
    ];

    const [[factoryAllowance], [rewardAllowance], [oldRewardAllowance], [marketplaceAllowance]] = await multicall(spyNFTABI, calls)

    return {
        factoryAllowance,
        rewardAllowance,
        oldRewardAllowance,
        marketplaceAllowance
    };
}