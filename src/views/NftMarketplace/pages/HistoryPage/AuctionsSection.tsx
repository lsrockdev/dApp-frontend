import React, { useEffect, useState } from 'react'
import styled from 'styled-components'
import { useWeb3React } from '@web3-react/core'
import { useTranslation } from 'contexts/Localization'
import { Skeleton } from '@pancakeswap/uikit'
import { getMyAuctions } from '../../hooks/getAuctions'
import { NFTAuction } from '../../types'
import { getMyBids } from '../../hooks/getAuctionBids'
import AuctionTable from './AuctionTable'


const AuctionSection: React.FC = () => {
    const { t } = useTranslation()
    const { account } = useWeb3React()
    const [isLoading, setIsLoading] = useState(false)
    const [auctions, setAuctions] = useState<NFTAuction[]>([])

    useEffect(() => {
        const fetchAuctions = async () => {
            try {
                setIsLoading(true)
                const auctions_ = await getMyAuctions(account)
                const bids_ = await getMyBids(account)
                const allAuctions_: NFTAuction[] = []
                auctions_.forEach((auction) => {
                    let contains = false
                    allAuctions_.forEach((a) => {
                        if (a.id === auction.id) {
                            contains = true
                        }
                    })

                    if (!contains) {
                        allAuctions_.push(auction)
                    }
                })
                bids_.forEach((bid) => {
                    let contains = false
                    allAuctions_.forEach((a) => {
                        if (a.id === bid.auction?.id) {
                            contains = true
                        }
                    })

                    if (!contains && bid.auction) {
                        allAuctions_.push(bid.auction)
                    }
                })
                setAuctions(allAuctions_)
                
            } finally {
                setIsLoading(false)
            }
        }
        
        if (account) {
            fetchAuctions()
        } else {
            setIsLoading(false)
            setAuctions([])
        }
    }, [account])

    const renderContent = () => {
        if (isLoading || !auctions) {
            return (
                <Skeleton width="100%" height="300px" animation="waves"/>
            )
        }
        return (
            <AuctionTable auctions={auctions} loading={isLoading}/>
        )
    }

    return (
        <>
        {renderContent()}
        </>
    )
}

export default AuctionSection