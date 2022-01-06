import BigNumber from 'bignumber.js'
import nftFactoryABI from 'config/abi/spyNFTFactory.json'
import multicall from 'utils/multicall'
import { getNFTFactoryAddress } from 'utils/addressHelpers'
import { getFixRate } from 'utils/nftHelpers'

export type PublicNFTData = {
    id: SerializedBigNumber
    grade: number
    lockedDays: number
    blockNum: SerializedBigNumber
    createdTime: number
    quality: number
    amount: SerializedBigNumber
    efficiency: SerializedBigNumber
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
            efficiency
        }
    })

    return parsedNFTGegos;
}