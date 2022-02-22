import { AddressZero } from '@ethersproject/constants'
import { Token } from '@pancakeswap/sdk';
import BigNumber from "bignumber.js";
import { GRAPH_API_NFTMARKET_MARKETPLACE } from 'config/constants/endpoints';
import tokens from 'config/constants/tokens';
import request, { gql } from "graphql-request"
import { DeserializedNFTGego, NFTMarketPlaceSearchFilter } from 'state/types';
import { getNFTMarketplaceAddress } from 'utils/addressHelpers';
import { getFixRate } from 'utils/nftHelpers';
import { BIG_TEN } from 'utils/bigNumber'
import { NFTAuction, NFTAuctionData } from '../types';

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
interface AuctionsQueryResponse {
    auctions: AuctionFields[]
}


interface AuctionQueryResponse {
    auction?: AuctionFields
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

export const getAuctionById = async(id: string): Promise<NFTAuctionData> => {
    const contractAddress = getNFTMarketplaceAddress()
    const query = `
        query get_auction {
            auction: auction(id:"${contractAddress.toLowerCase()}-${id}") {
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
    `

    try {
        const data = await request<AuctionQueryResponse>(GRAPH_API_NFTMARKET_MARKETPLACE, query)

        if (!data.auction) {
            return undefined
        }

        const {  seller, lastBidder: lastBidder_, tokenId, gego, startingPrice: startingPrice_, lastPrice: lastPrice_, endAt, creationTime, status, payToken} = data.auction
        const lastBidder = lastBidder_ === undefined || lastBidder_ === null ? AddressZero : lastBidder_
        const lastPrice = new BigNumber(lastPrice_ === undefined || lastPrice_ === null ? startingPrice_ : lastPrice_).multipliedBy(BIG_TEN.pow(payToken ? payToken.decimals : 18))
        return {
            id,
            payToken : payToken ? payToken.id : AddressZero,
            seller,
            lastBidder,
            tokenId,
            gego : convertAuctionGegoResponse(gego),
            lastPrice,
            raisedAmount: new BigNumber(0),
            duration : parseInt(endAt) - parseInt(creationTime),
            startedAt: parseInt(creationTime),
            isTaken : status === 0
        }
    } catch (error) {
        console.error('Failed to fetch auction data', error)
        return undefined;
    }
}

export const getAllAuctions = async(filter: NFTMarketPlaceSearchFilter) : Promise<NFTAuction[]> => {
    let orderBy = '';
    let orderDirection = '';
    switch(filter) {
        case NFTMarketPlaceSearchFilter.END_TIME:
            orderBy = 'endAt'
            orderDirection = 'desc'
            break
        case NFTMarketPlaceSearchFilter.LATEST_RELEASE:
            orderBy = 'creationTime'
            orderDirection = 'desc'
            break
        case NFTMarketPlaceSearchFilter.HIGHEST_PRICE:
            orderBy = 'startingPrice'
            orderDirection = 'desc'
            break
        case NFTMarketPlaceSearchFilter.LOWEST_PRICE:
            orderBy = 'startingPrice'
            orderDirection = 'asc'
            break
        default:
            // SMART
            orderBy = 'creationTime'
            orderDirection = 'asc'
            break
    }
    const query = `
        query get_auctions {
            auctions: auctions(first:30, where:{status:1}, orderBy: ${orderBy}, orderDirection: ${orderDirection}) {
                id
                tokenId
                auctionId
                creationTime
                endAt
                startingPrice
                seller
                lastBidder
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
    `

    try {
        const data = await request<AuctionsQueryResponse>(GRAPH_API_NFTMARKET_MARKETPLACE, query)
        return data.auctions.map((auction) => {
            return convertAuctionResponse(auction)
        })
    } catch (error) {
        console.error('Failed to fetch auction data', error)
        return undefined;
    }
}

export const getMyAuctions = async(address: string) : Promise<NFTAuction[]> => {
    const query = `
        query get_auctions {
            auctions: auctions(first:30, where:{seller:"${address.toLowerCase()}"}) {
                id
                tokenId
                auctionId
                creationTime
                endAt
                startingPrice
                seller
                lastBidder
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
    `

    try {
        const data = await request<AuctionsQueryResponse>(GRAPH_API_NFTMARKET_MARKETPLACE, query)
        return data.auctions.map((auction) => {
            return convertAuctionResponse(auction)
        })
    } catch (error) {
        console.error('Failed to fetch auction data', error)
        return undefined;
    }
}

