import React, { useEffect, useMemo, useState } from 'react'
import styled from 'styled-components'
import { useTranslation } from 'contexts/Localization'
import { Skeleton } from '@pancakeswap/uikit'
import { useNFTMarketplaceSearchFilter, useNFTMarketplaceSearchGrade } from 'state/nftMarketplace/hooks'
import { getAllTrades } from '../../hooks/getTrades'
import { NFTTrade } from '../../types'
import TradeCard from '../../components/TradeCard/TradeCard'



const NFTCards = styled.div`
  display: flex;
  justify-content: start;
  flex-wrap: wrap;
  & > * {
    min-width: 250px;
    max-width: 100%;
    width: 100%;
  }
  ${({ theme }) => theme.mediaQueries.sm} {
    & > * {
        min-width: 50%;
        width: 50%;
        max-width: 50%;
    }
  }
  ${({ theme }) => theme.mediaQueries.md} {
    & > * {
        min-width: 33%;
        width: 33%;
        max-width: 33%;
    }
  }
  ${({ theme }) => theme.mediaQueries.lg} {
    & > * {
        min-width: 25%;
        width: 25%;
        max-width: 25%;
    }
  }
`

const TradesSection: React.FC = () => {
    const { t } = useTranslation()
    const [isLoading, setIsLoading] = useState(false)
    const [trades, setTrades] = useState<NFTTrade[]>([])
    const [searchFilter,] = useNFTMarketplaceSearchFilter()
    const [searchGrade,] = useNFTMarketplaceSearchGrade()

    useEffect(() => {
        const fetchTrades = async () => {
            try {
                setIsLoading(true)
                const trades_ = await getAllTrades(searchFilter)
                setTrades(trades_)
                
            } finally {
                setIsLoading(false)
            }
        }
        
        fetchTrades()
    }, [searchFilter])

    const filteredResult = useMemo(() => {
        if (!trades) {
            return undefined;
        }
        if (searchGrade === -1) {
            return trades
        }

        return trades.filter((trade) => trade.gego.grade === searchGrade)
    }, [trades, searchGrade])

    const renderContent = () => {
        if (isLoading || !filteredResult) {
            return (
                <Skeleton width="100%" height="300px" animation="waves"/>
            )
        }
        return (
            <NFTCards>
                {filteredResult.map((market) => {
                    return (
                        <TradeCard market={market} key={market.id}/>
                    )
                })}
            </NFTCards>
        )
    }

    return (
        <>
        {renderContent()}
        </>
    )
}

export default TradesSection