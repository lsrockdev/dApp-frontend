import BigNumber from 'bignumber.js'
import generalNFTRewardABI from 'config/abi/generalNFTReward.json'
import { getGeneralNFTRewardAddress } from 'utils/addressHelpers'
import multicall from 'utils/multicall'
import { BIG_TEN, BIG_ZERO } from 'utils/bigNumber'

export interface PublicNFTRewardData {
    earned: SerializedBigNumber
    nextHarvestUntil: number
}

export const fetchGeneralNFTReward = async (account: string): Promise<PublicNFTRewardData> => {

    const nftRewardAddress = getGeneralNFTRewardAddress()

    const calls = [
        // Balance of SPY token
        {
          address: nftRewardAddress,
          name: 'earned',
          params: [account],
        },
        // Balance of SPY token
        {
            address: nftRewardAddress,
            name: '_nextHarvestUntil',
            params: [account],
        },
    ];

    const [earnedRaw, nextHarvestUntilRaw] =
    await multicall(generalNFTRewardABI, calls)

    const earned = new BigNumber(earnedRaw).toJSON()
    const nextHarvestUntil = new BigNumber(nextHarvestUntilRaw).toNumber();

    return {
        earned,
        nextHarvestUntil
    }
}