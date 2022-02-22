import { Token } from "@pancakeswap/sdk";
import BigNumber from "bignumber.js";
import { DeserializedNFTGego } from "state/types";

export enum NFTAuctionStatus {
    NOT_RUNNING,
    RUNNING,
    FAILED,
    DEALED,
    FINISHED,
    CANCELED
}

export interface NFTTradeData {
    id: string
    payToken: string
    seller: string
    purchaser: string
    salePrice: BigNumber
    isSold: boolean
    gego?: DeserializedNFTGego
}

export interface NFTAuctionData {
    id: string
    payToken: string
    seller: string
    lastBidder: string
    tokenId: string
    lastPrice: BigNumber
    raisedAmount: BigNumber
    duration: number
    startedAt: number
    isTaken: boolean
    gego?: DeserializedNFTGego
}

export interface NFTListing {
    id: string
    creationTime: number
    status: number
    payToken?: Token
    gego: DeserializedNFTGego
}

export interface NFTAuction extends NFTListing {
    auctionId:string
    endAt: number
    startingPrice?: number
    lastPrice?: number
    seller?: string
    lastBidder?: string
}

export interface NFTTrade extends NFTListing {
    listingId: string
    price: number
    status: number
    seller?: string
    purchaser?: string
}

export interface NFTAuctionBid {
    id: string
    auctionId: string
    creationTime: number
    bidder: string
    previousBidder: string
    txid: string
    price: number
    profit: number
    auction?: NFTAuction
}