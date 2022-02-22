import { useCallback } from 'react'
import { getNFTFactoryContract, getNFTMarketplaceContract } from 'utils/contractHelpers'
import BigNumber from 'bignumber.js'
import { BIG_TEN } from 'utils/bigNumber'
import { getFixRate } from 'utils/nftHelpers'
import { DeserializedNFTGego } from 'state/types'
import { NFTAuction, NFTAuctionData, NFTTradeData } from '../types'

const getGego = async(id: string) : Promise<DeserializedNFTGego|undefined> => {
    const factoryContract = getNFTFactoryContract()
    try {
        const rawNFTGego = await factoryContract.getGego(id)
        const quality = new BigNumber(rawNFTGego.quality?._hex).toNumber()
        const grade = new BigNumber(rawNFTGego.grade?._hex).toNumber()
        const efficiency = getFixRate(grade, quality)
        const amount = new BigNumber(rawNFTGego.amount?._hex)
        return {
            id,
            grade,
            lockedDays: new BigNumber(rawNFTGego.lockedDays?._hex).toNumber(),
            blockNum: new BigNumber(rawNFTGego.blockNum?._hex),
            createdTime: new BigNumber(rawNFTGego.createdTime?._hex).toNumber(),
            quality,
            amount,
            efficiency,
            staked: false
        }
    } catch {
        return undefined
    }
}

export const getAuctionData = async (id: string) : Promise<NFTAuctionData> => {
    const marketplaceContract = getNFTMarketplaceContract();
    const {payToken, seller, lastBidder, nft, tokenId, lastPrice, raisedAmount, duration: duration_, startedAt: startedAt_, isTaken} = await marketplaceContract.auctions(id)
    const gego = await getGego(new BigNumber(tokenId._hex).toString())
    const duration = new BigNumber(duration_._hex).toNumber()
    const startedAt = new BigNumber(startedAt_._hex).toNumber()
    return {
        id,
        payToken,
        seller,
        lastBidder,
        tokenId: new BigNumber(tokenId._hex).toString(),
        gego,
        lastPrice: new BigNumber(lastPrice._hex),
        raisedAmount: new BigNumber(raisedAmount._hex),
        duration,
        startedAt,
        isTaken
    }
}


export const getTradeData = async (id: string) : Promise<NFTTradeData> => {
    const marketplaceContract = getNFTMarketplaceContract();
    const {nft, tokenId, price, isSold, payToken, purchaser, seller} = await marketplaceContract.markets(id)
    const gego = await getGego(new BigNumber(tokenId._hex).toString())
    const salePrice = new BigNumber(price._hex)
    return {
        id,
        payToken,
        seller,
        purchaser,
        isSold,
        gego,
        salePrice
    }
}