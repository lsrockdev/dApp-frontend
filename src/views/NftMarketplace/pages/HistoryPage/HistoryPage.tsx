import React, { useMemo } from 'react'
import { Route, useRouteMatch, useLocation, Link } from 'react-router-dom'
import { Button, Flex, Heading } from '@pancakeswap/uikit'
import styled from 'styled-components'
import Page from 'components/Layout/Page'
import { useTranslation } from 'contexts/Localization'
import AuctionsSection from './AuctionsSection'
import TradesSection from './TradesSection'


enum ViewMode {
    Auction,
    Market
}

const NFTMarketplaceHistoryPage: React.FC = () => {
    const { t } = useTranslation()
    const { path, url } = useRouteMatch()
    const { pathname } = useLocation()
    const viewMode = useMemo(() => {
        return pathname.endsWith('auction') ? ViewMode.Auction : ViewMode.Market
    }, [pathname])

    return (
        <>
            <Page>
                <Flex flexDirection="column">
                    <Flex flexDirection="row" flexWrap="wrap" justifyContent="space-between" alignItems="center">
                        <Heading padding="12px 0px 12px 14px">{t('Marketplace History')}</Heading>     
                        <Flex flexDirection="row" flexWrap="wrap">
                            <Button 
                            variant="secondary" 
                            margin="8px"
                            as={Link}
                            to="/nft-marketplace"
                            >Marketplace</Button>
                        </Flex>
                    </Flex>
                    <Flex flexDirection="row" flexWrap="wrap" justifyContent="space-between" alignItems="center"> 
                        <Flex flexDirection="row" flexWrap="wrap">
                            <Button 
                            as={Link}
                            to="/nft-marketplace/history/auction"
                            variant={viewMode === ViewMode.Auction ? "primary" : "secondary"} margin="8px" >
                                Auction
                            </Button>
                            <Button 
                            as={Link}
                            to="/nft-marketplace/history/market"
                            variant={viewMode === ViewMode.Market ? "primary" : "secondary"} margin="8px" >
                                Market
                            </Button>
                        </Flex>
                    </Flex>
                </Flex>
                <Route exact path="/nft-marketplace/history" component={TradesSection} />
                <Route exact path="/nft-marketplace/history/auction" component={AuctionsSection} />
                <Route exact path="/nft-marketplace/history/market" component={TradesSection} />
            </Page>
        </>
    )
}

export default NFTMarketplaceHistoryPage