import { AddressZero } from '@ethersproject/constants'
import { Token } from '@pancakeswap/sdk';
import BigNumber from "bignumber.js";
import { GRAPH_API_NFTMARKET_MARKETPLACE } from 'config/constants/endpoints';
import tokens from 'config/constants/tokens';
import request, { gql } from "graphql-request"
import { DeserializedNFTGego, NFTMarketPlaceSearchFilter } from 'state/types';
import { getFixRate } from 'utils/nftHelpers';
import { NFTTrade } from '../types';

interface GegoFields {
    id: string
    tokenId: string
    amount: string
    creationTime: string
    grade: number
    lockedDays: number
    quality: number
}

interface MarketFields {
    id: string
    tokenId: string
    listingId: string
    creationTime: string
    price: string
    seller: string
    purchaser: string
    payToken?: {
        id: string
        symbol: string
        name: string
        decimals: string
    }
    status: number
    gego: GegoFields
}
interface MarketsQueryResponse {
    markets: MarketFields[]
}
interface MyMarketsQueryResponse {
    sells: MarketFields[]
    purchases: MarketFields[]
}

function convertMarketGegoResponse(gego: GegoFields) : DeserializedNFTGego{
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

function convertMarketResponse(auction: MarketFields) : NFTTrade {
    const {id, listingId, creationTime, price, payToken, status, gego, seller, purchaser} = auction
    return {
        id,
        listingId,
        creationTime: parseInt(creationTime),
        price: parseFloat(price),
        status,
        seller, 
        purchaser,
        payToken : auction.payToken ? (auction.payToken.id === tokens.spy.address ? tokens.spy : new Token(parseInt(process.env.REACT_APP_CHAIN_ID, 10), auction.payToken.id, parseInt(auction.payToken.decimals), auction.payToken.symbol, auction.payToken.decimals)) : null,
        gego: convertMarketGegoResponse(gego)
    }
}

export const getAllTrades = async(filter: NFTMarketPlaceSearchFilter) : Promise<NFTTrade[]> => {
    let orderBy = '';
    let orderDirection = '';
    switch(filter) {
        case NFTMarketPlaceSearchFilter.LATEST_RELEASE:
            orderBy = 'creationTime'
            orderDirection = 'desc'
            break
        case NFTMarketPlaceSearchFilter.HIGHEST_PRICE:
            orderBy = 'price'
            orderDirection = 'desc'
            break
        case NFTMarketPlaceSearchFilter.LOWEST_PRICE:
            orderBy = 'price'
            orderDirection = 'asc'
            break
        default:
            // SMART
            orderBy = 'creationTime'
            orderDirection = 'asc'
            break
    }
    const query = `
        query get_markets {
            markets: markets(first:30, where:{status:1}, orderBy: ${orderBy}, orderDirection: ${orderDirection}) {
                id
                tokenId
                listingId
                creationTime
                price
                seller
                purchaser
                payToken {
                    id
                    symbol
                    name
                    decimals
                }
                status
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
        const data = await request<MarketsQueryResponse>(GRAPH_API_NFTMARKET_MARKETPLACE, query)
        return data.markets.map((auction) => {
            return convertMarketResponse(auction)
        })
    } catch (error) {
        console.error('Failed to fetch auction data', error)
        return undefined;
    }
}


export const getMyTrades = async(address:string) : Promise<NFTTrade[]> => {
    const query = `
        query get_markets {
            sells: markets(first:30, where:{seller:"${address.toLowerCase()}"}) {
                id
                tokenId
                listingId
                creationTime
                price
                seller
                purchaser
                payToken {
                    id
                    symbol
                    name
                    decimals
                }
                status
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
            purchases: markets(first:30, where:{purchaser:"${address.toLowerCase()}"}) {
                id
                tokenId
                listingId
                creationTime
                price
                seller
                purchaser
                payToken {
                    id
                    symbol
                    name
                    decimals
                }
                status
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
        const data = await request<MyMarketsQueryResponse>(GRAPH_API_NFTMARKET_MARKETPLACE, query)
        const sells = data.sells.map((auction) => {
            return convertMarketResponse(auction)
        })
        const purchases = data.purchases.map((auction) => {
            return convertMarketResponse(auction)
        })

        return [...sells, ...purchases]
    } catch (error) {
        console.error('Failed to fetch auction data', error)
        return undefined;
    }
}