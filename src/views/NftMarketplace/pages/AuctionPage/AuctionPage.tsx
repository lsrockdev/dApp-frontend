import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { useRouteMatch, RouteComponentProps, Link } from 'react-router-dom'
import { AddressZero } from '@ethersproject/constants'
import { useWeb3React } from '@web3-react/core'
import { Breadcrumbs, Button, ChevronRightIcon, Flex, Heading, LogoIcon, Skeleton, Text } from '@pancakeswap/uikit'
import Page from 'components/Layout/Page'
import useToast from 'hooks/useToast'
import { useTranslation } from 'contexts/Localization'
import { NFTAuctionData, NFTAuctionStatus } from '../../types'
import { getAuctionData } from '../../hooks/getMarketplace'
import AuctionSection from './AuctionSection'
import GegoSection from './GegoSection'
import { getAuctionById } from '../../hooks/getAuctions'
import { useCancelNFTAuction } from '../../hooks/useCancelList'
import AuctionRuleSection from './AuctionRuleSection'
import BidsSection from './BidsSection'



const AuctionPage: React.FC<RouteComponentProps<{id: string}>> = ({
    match: {
        params: {id: auctionId}
    }
}) => {
    const { t } = useTranslation()
    const { path } = useRouteMatch()
    const { account } = useWeb3React()
    const { toastError, toastSuccess } = useToast()
    const [canceling, setCanceling] = useState(false)
    const [auction, setAuction] = useState<NFTAuctionData|null>(null)
    const [loaded, setLoaded] = useState(false)

    const isSeller = useMemo(() => {
        return account && auction && account.toLocaleLowerCase() === auction.seller.toLocaleLowerCase()
    }, [auction, account])

    const { onCancelNFTAuction } = useCancelNFTAuction()

    const status = useMemo(() => {
        if (!auction) {
            return NFTAuctionStatus.NOT_RUNNING
        }
        if (auction.startedAt === 0) {
            return NFTAuctionStatus.NOT_RUNNING
        }
        if (auction.isTaken) {
            return NFTAuctionStatus.FINISHED
        }

        if (auction.startedAt + auction.duration > Math.floor(new Date().getTime() / 1000)) {
            return NFTAuctionStatus.RUNNING
        }

        if (auction.lastBidder === AddressZero) {
            return NFTAuctionStatus.FAILED
        }

        return NFTAuctionStatus.DEALED
    }, [auction])

    const reloadAuction = useCallback(async () => {
        const auction_ = await getAuctionData(auctionId)
        setAuction(auction_)
        setLoaded(true)
    }, [auctionId])

    useEffect(() => {
        const loadAuction = async() => {
            try {
                // const auction_ = await getAuctionById(auctionId)
                const auction_ = await getAuctionData(auctionId)
                setAuction(auction_)
            } finally {
                setLoaded(true)
            }
            
        }

        if (!loaded) {
            loadAuction()
        }
    }, [loaded, auctionId])

    const handleCancel = useCallback(async () => {
        try {
            setCanceling(true)
            await onCancelNFTAuction(auction.id)
            reloadAuction()
            toastSuccess(
            `${t('Success')}!`,
            t('The auction has been canceled successfully')
            )
        } catch (e) {
            if (typeof e === 'object' && 'message' in e) {
                const err: any = e;
                toastError(t('Error'), err.message)
            } else {
                toastError(t('Error'), t('Please try again. Confirm the transaction and make sure you are paying enough gas!'))
            }
        } finally {
            setCanceling(false)
        }
    }, [onCancelNFTAuction, toastSuccess, toastError, reloadAuction, auction, t])

    return (
        <>
            <Page>
                <Flex flexDirection="column">
                    { !loaded ? (
                        <Skeleton width="100%" height="400px" animation="waves"/>
                    ) 
                    : !auction ? (
                        <Flex flexDirection="column" alignItems="center">
                            <LogoIcon width="64px" mb="8px" />
                            <Heading scale="xxl">404</Heading>
                            <Text mb="16px">{t('Oops, page not found.')}</Text>
                            <Button as={Link} to="/" scale="sm">
                            {t('Back Home')}
                            </Button>
                        </Flex>
                    )
                    : (
                        <>
                        <Flex style={{padding: "12px 16px"}}>
                            <Breadcrumbs mb="32px" separator={<ChevronRightIcon color="secondary" width="24px" />}>
                            <Link to="/nft-marketplace/auction">
                                <Text color="secondary">{t('Auction Market')}</Text>
                            </Link>
                            <Flex>
                                <Text mr="8px" color="primary"> #{auction ? auction.gego.id : ''}</Text>
                            </Flex>
                            </Breadcrumbs>
                        </Flex>
                        <Flex flexDirection="row" flexWrap="wrap">
                            <AuctionSection auction={auction} account={account} reloadAuction={reloadAuction}/>
                            <GegoSection 
                            gego={auction.gego} 
                            owner={auction.seller} 
                            account={account} 
                            showCancel={isSeller && (!auction.lastBidder || auction.lastBidder === AddressZero) && status === NFTAuctionStatus.RUNNING}
                            onCancel={handleCancel} 
                            cancelTitle={t('Cancel Auction')}
                            canceling={canceling}/>
                            <BidsSection auction={auction}/>
                            <AuctionRuleSection/>
                        </Flex>
                        </>
                    )}
                </Flex>
            </Page>
        </>
    )
}

export default AuctionPage