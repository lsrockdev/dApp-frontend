import React, { useEffect, useMemo, useState } from 'react'
import styled from 'styled-components'
import { useTranslation } from 'contexts/Localization'
import { Skeleton, Flex, Text } from '@pancakeswap/uikit'
import { useNFTMarketplaceSearchFilter, useNFTMarketplaceSearchGrade } from 'state/nftMarketplace/hooks'
import useRefresh from 'hooks/useRefresh'
import { getAllAuctions } from '../../hooks/getAuctions'
import { NFTAuction } from '../../types'
import AuctionCard from '../../components/AuctionCard/AuctionCard'


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

const AuctionSection: React.FC = () => {
    const { t } = useTranslation()
    const { slowRefresh } = useRefresh()
    const [isLoading, setIsLoading] = useState(false)
    const [auctions, setAuctions] = useState<NFTAuction[]>([])
    const [searchFilter,] = useNFTMarketplaceSearchFilter()
    const [searchGrade,] = useNFTMarketplaceSearchGrade()

    useEffect(() => {
        const fetchAuctions = async () => {
            try {
                setIsLoading(true)
                const auctions_ = await getAllAuctions(searchFilter)
                setAuctions(auctions_)
                
            } finally {
                setIsLoading(false)
            }
        }
        
        fetchAuctions()
    }, [searchFilter, slowRefresh])

    const filteredResult = useMemo(() => {
        if (!auctions) {
            return undefined
        }

        if (searchGrade === -1) {
            return auctions
        }

        return auctions.filter((auction) => auction.gego.grade === searchGrade)
    }, [auctions, searchGrade])

    const renderContent = () => {
        if (isLoading) {
            return (
                <Skeleton width="100%" height="300px" animation="waves"/>
            )
        }

        if (!filteredResult || filteredResult.length === 0) {
            return (
            <Flex justifyContent="center" alignItems="center" height="200px">
                <Text>No Records Found</Text>
            </Flex>
            )
        }

        return (
            <NFTCards>
                {filteredResult.map((auction) => {
                    return (
                        <AuctionCard auction={auction} key={auction.id}/>
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

export default AuctionSection