import React, { useEffect, useMemo, useState } from 'react'
import { Route, useRouteMatch, useLocation, NavLink, Link } from 'react-router-dom'
import { useWeb3React } from '@web3-react/core'
import { Button, Flex, Heading, Skeleton, useModal } from '@pancakeswap/uikit'
import styled from 'styled-components'
import { nftGrades } from 'config/constants/nft';
import { useNFTBalances, usePollNFTPublicData } from 'state/nft/hooks'
import { useNFTMarketplaceSearchFilter, useNFTMarketplaceSearchGrade } from 'state/nftMarketplace/hooks'
import { NFTMarketPlaceSearchFilter } from 'state/types'
import Page from 'components/Layout/Page'
import Select, { OptionProps } from 'components/Select/Select'
import { useTranslation } from 'contexts/Localization'
import SellNFTModal from '../../components/SellNFTModal/SellNFTModal'
import AuctionsSection from './AuctionsSection'
import TradesSection from './TradesSection'


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

enum ViewMode {
    Auction,
    Market
}

const NFTMarketplaceBrowsePage: React.FC = () => {
    const { t } = useTranslation()
    const { path, url } = useRouteMatch()
    const { pathname } = useLocation()
    const { account } = useWeb3React()
    const viewMode = useMemo(() => {
        return pathname.endsWith('auction') ? ViewMode.Auction : ViewMode.Market
    }, [pathname])
    const nftBalances = useNFTBalances()
    const unstakedBalances = nftBalances.filter((nft) => !nft.staked)
    const [searchFilter, setSearchFilter] = useNFTMarketplaceSearchFilter()
    const [searchGrade, setSearchGrade] = useNFTMarketplaceSearchGrade()
    usePollNFTPublicData()

    const filterOptions = useMemo(() => {
        if (viewMode === ViewMode.Auction) {
            return [
                {
                    label: t('Smart Filter'),
                    value: NFTMarketPlaceSearchFilter.SMART
                },
                {
                    label: t('End Time'),
                    value: NFTMarketPlaceSearchFilter.END_TIME
                },
                {
                    label: t('Latest Release'),
                    value: NFTMarketPlaceSearchFilter.LATEST_RELEASE
                },
                {
                    label: t('Lowest Price'),
                    value: NFTMarketPlaceSearchFilter.LOWEST_PRICE
                },
                {
                    label: t('Highest Price'),
                    value: NFTMarketPlaceSearchFilter.HIGHEST_PRICE
                },
            ]
        }
        return [
            {
                label: t('Smart Filter'),
                value: NFTMarketPlaceSearchFilter.SMART
            },
            {
                label: t('Latest Release'),
                value: NFTMarketPlaceSearchFilter.LATEST_RELEASE
            },
            {
                label: t('Lowest Price'),
                value: NFTMarketPlaceSearchFilter.LOWEST_PRICE
            },
            {
                label: t('Highest Price'),
                value: NFTMarketPlaceSearchFilter.HIGHEST_PRICE
            },
        ]
        

    }, [viewMode, t])
    
    
  const [onPresentSellModal] = useModal(
    <SellNFTModal gegos={unstakedBalances} account={account}/>
  )

    const handleTypeOptionChange = (option: OptionProps): void => {
        setSearchGrade(option.value)
    }

    const handleFilterOptionChange = (option: OptionProps): void => {
        setSearchFilter(option.value)
    }

    return (
        <>
            <Page>
                <Flex flexDirection="column">
                    <Flex flexDirection="row" flexWrap="wrap" justifyContent="space-between" alignItems="center">
                        <Heading padding="12px 0px 12px 14px">{t('My NFTs')}</Heading>    
                        <Flex flexDirection="row" flexWrap="wrap">
                            <Button variant="primary" margin="8px" disabled={!account || !unstakedBalances || unstakedBalances.length === 0} onClick={onPresentSellModal}>Sell NFT</Button>
                            <Button 
                            variant="secondary" 
                            margin="8px"
                            as={Link}
                            to="/nft-marketplace/history"
                            >Marketplace History</Button>
                        </Flex>
                    </Flex>
                    <Flex flexDirection="row" flexWrap="wrap" justifyContent="space-between" alignItems="center"> 
                        <Flex flexDirection="row" flexWrap="wrap">
                            <Button 
                            as={Link}
                            to="/nft-marketplace/auction"
                            variant={viewMode === ViewMode.Auction ? "primary" : "secondary"} margin="8px" >
                                Auction
                            </Button>
                            <Button 
                            as={Link}
                            to="/nft-marketplace/market"
                            variant={viewMode === ViewMode.Market ? "primary" : "secondary"} margin="8px" >
                                Market
                            </Button>
                        </Flex>
                        <Flex flexDirection="row">
                            <Select margin="8px"
                                defaultOptionIndex={searchGrade < 0 ? 0 : searchGrade}
                                options={[
                                    {
                                        label: t('All NFTs'),
                                        value: -1,
                                    },
                                    ...nftGrades.map((grade) => {
                                        return {
                                            label: grade.grade.toString(),
                                            value: grade.level
                                        }
                                    })
                                ]}
                                onOptionChange={handleTypeOptionChange}
                            />
                            <Select margin="8px"
                                defaultOptionIndex={searchFilter < filterOptions.length ? searchFilter : 0}
                                options={filterOptions}
                                onOptionChange={handleFilterOptionChange}
                            />
                        </Flex>
                    </Flex>
                </Flex>
                <Route exact path="/nft-marketplace" component={TradesSection} />
                <Route exact path="/nft-marketplace/auction" component={AuctionsSection} />
                <Route exact path="/nft-marketplace/market" component={TradesSection} />
            </Page>
        </>
    )
}

export default NFTMarketplaceBrowsePage