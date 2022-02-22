import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { useRouteMatch, RouteComponentProps, Link } from 'react-router-dom'
import { useWeb3React } from '@web3-react/core'
import { Breadcrumbs, Button, ChevronRightIcon, Flex, Heading, LogoIcon, Skeleton, Text } from '@pancakeswap/uikit'
import Page from 'components/Layout/Page'
import useToast from 'hooks/useToast'
import { useTranslation } from 'contexts/Localization'
import { NFTTradeData } from '../../types'
import { getTradeData } from '../../hooks/getMarketplace'
import GegoSection from '../AuctionPage/GegoSection'
import { useCancelNFTMarket } from '../../hooks/useCancelList'
import TradingSection from './TradingSection'
import TradingRulesSection from './TradingRulesSection'



const TradingPage: React.FC<RouteComponentProps<{id: string}>> = ({
    match: {
        params: {id: tradeId}
    }
}) => {
    const { t } = useTranslation()
    const { path } = useRouteMatch()
    const { account } = useWeb3React()
    const { toastError, toastSuccess } = useToast()
    const [canceling, setCanceling] = useState(false)
    const [trade, setTrade] = useState<NFTTradeData|null>(null)
    const [loaded, setLoaded] = useState(false)

    const isSeller = useMemo(() => {
        return account && trade && account.toLocaleLowerCase() === trade.seller.toLocaleLowerCase()
    }, [trade, account])

    const { onCancelNFTMarket } = useCancelNFTMarket()

    const reloadTrade = useCallback(async () => {
        const trade_ = await getTradeData(tradeId)
        setTrade(trade_)
        setLoaded(true)
    }, [tradeId])

    useEffect(() => {
        const loadTrade = async() => {
            try {
                // const auction_ = await getAuctionById(auctionId)
                const trade_ = await getTradeData(tradeId)
                setTrade(trade_)
            } finally {
                setLoaded(true)
            }
            
        }

        if (!loaded) {
            loadTrade()
        }
    }, [loaded, tradeId])

    const handleCancel = useCallback(async () => {
        try {
            setCanceling(true)
            await onCancelNFTMarket(trade.id)
            reloadTrade()
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
    }, [onCancelNFTMarket, toastSuccess, toastError, reloadTrade, trade, t])

    return (
        <>
            <Page>
                <Flex flexDirection="column">
                    { !loaded ? (
                        <Skeleton width="100%" height="400px" animation="waves"/>
                    ) 
                    : !trade ? (
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
                                <Text color="secondary">{t('Trading Market')}</Text>
                            </Link>
                            <Flex>
                                <Text mr="8px" color="primary"> #{trade ? trade.gego.id : ''}</Text>
                            </Flex>
                            </Breadcrumbs>
                        </Flex>
                        <Flex flexDirection="row" flexWrap="wrap">
                            <TradingSection trade={trade} account={account} reloadTrade={reloadTrade}/>
                            <GegoSection 
                            gego={trade.gego} 
                            owner={trade.seller} 
                            account={account} 
                            showCancel={isSeller && !trade.isSold}
                            onCancel={handleCancel} 
                            cancelTitle={t('Cancel Trading')}
                            canceling={canceling}/>
                            <TradingRulesSection/>
                        </Flex>
                        </>
                    )}
                </Flex>
            </Page>
        </>
    )
}

export default TradingPage