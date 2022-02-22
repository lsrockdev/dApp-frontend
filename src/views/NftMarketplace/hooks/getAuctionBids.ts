import { Token } from "@pancakeswap/sdk";
import BigNumber from "bignumber.js";
import { GRAPH_API_NFTMARKET_MARKETPLACE } from "config/constants/endpoints"
import tokens from "config/constants/tokens";
import request from "graphql-request"
import { DeserializedNFTGego } from "state/types";
import { getNFTMarketplaceAddress } from "utils/addressHelpers";
import { getFixRate } from "utils/nftHelpers";
import { NFTAuction, NFTAuctionBid } from "../types"

interface GegoFields {
    id: string
    tokenId: string
    amount: string
    creationTime: string
    grade: number
    lockedDays: number
    quality: number
}

interface AuctionFields {
    id: string
    tokenId: string
    auctionId: string
    creationTime: string
    endAt: string
    startingPrice: string
    lastPrice: string
    status: number
    gego: GegoFields
    seller?: string
    lastBidder?: string
    payToken? : {
        id: string
        name: string
        symbol: string
        decimals: string
    }
}

interface BidFields {
    id: string
    auctionId: string
    creationTime: string
    bidder: string
    previousBidder?: string
    price: string
    profit?: string
    txid: string
    auction?: AuctionFields
}

interface BidsQueryResponse {
    bids?: BidFields[]
}

function convertAuctionGegoResponse(gego: GegoFields) : DeserializedNFTGego{
    const {tokenId, amount, creationTime, grade, lockedDays, quality} = gego
    return {
        id: tokenId,
        grade,
        lockedDays,
        quality,
        createdTime: parseInt(creationTime),
        amount: new BigNumber(amount),
        staked: false,
        efficiency: getFixRate(grade, quality)
    };
}

function convertAuctionResponse(auction: AuctionFields) : NFTAuction {
    const {id, auctionId, payToken, creationTime, endAt, startingPrice: startingPrice_, lastPrice, status, gego, seller, lastBidder} = auction
    return {
        id,
        auctionId,
        creationTime: parseInt(creationTime),
        endAt: parseInt(endAt),
        seller,
        lastBidder,
        startingPrice: parseFloat(startingPrice_),
        lastPrice: lastPrice ? parseFloat(lastPrice) : undefined,
        payToken : payToken ? (payToken.id === tokens.spy.address ? tokens.spy : new Token(parseInt(process.env.REACT_APP_CHAIN_ID, 10), payToken.id, parseInt(payToken.decimals), payToken.symbol, payToken.decimals)) : null,
        status,
        gego: convertAuctionGegoResponse(gego)
    }
}

function convertBidResponse(bid: BidFields): NFTAuctionBid {
    const {
        id, 
        auctionId, 
        creationTime: creationTime_, 
        bidder, 
        previousBidder, 
        price: price_, 
        profit: profit_, 
        auction,
        txid} = bid;

    const res: NFTAuctionBid = {
        id,
        auctionId,
        creationTime: parseInt(creationTime_),
        bidder,
        previousBidder,
        price: parseFloat(price_),
        profit: parseFloat(profit_),
        txid
    }
    if (auction) {
        res.auction = convertAuctionResponse(auction)
    }

    return res
}

export const getAuctionBids = async(auctionId: string) : Promise<NFTAuctionBid[]> => {
    const contractAddress = getNFTMarketplaceAddress()
    const query = `
        query get_bids {
            bids: auctionBids(first:30, orderBy: creationTime, orderDirection: desc, where:{auction:"${contractAddress.toLowerCase()}-${auctionId}"}) {
                id
                auctionId
                creationTime
                bidder
                previousBidder
                price
                profit
                txid
            }
        }
    `

    try {
        const data = await request<BidsQueryResponse>(GRAPH_API_NFTMARKET_MARKETPLACE, query)
        return data.bids.map((bid) => {
            return convertBidResponse(bid)
        })
    } catch (error) {
        console.error('Failed to fetch auction data', error)
        return undefined;
    }
}



export const getMyBids = async(address: string) : Promise<NFTAuctionBid[]> => {
    const contractAddress = getNFTMarketplaceAddress()
    const query = `
        query get_bids {
            bids: auctionBids(first:30, orderBy: creationTime, orderDirection: desc, where:{bidder:"${address.toLowerCase()}"}) {
                id
                auctionId
                creationTime
                bidder
                previousBidder
                price
                profit
                txid
                auction {
                    id
                    seller
                    lastBidder
                    tokenId
                    auctionId
                    creationTime
                    endAt
                    startingPrice
                    lastPrice
                    status
                    payToken {
                        id
                        name
                        symbol
                        decimals
                    }
                    gego {
                        id
                        amount
                        creationTime
                        grade
                        lockedDays
                        quality
                        tokenId
                    }
                }
            }
        }
    `

    try {
        const data = await request<BidsQueryResponse>(GRAPH_API_NFTMARKET_MARKETPLACE, query)
        return data.bids.map((bid) => {
            return convertBidResponse(bid)
        })
    } catch (error) {
        console.error('Failed to fetch auction data', error)
        return undefined;
    }
}