import React from 'react'
import { Route, useRouteMatch, useLocation, NavLink } from 'react-router-dom'
import { useWeb3React } from '@web3-react/core'
import styled from 'styled-components'
import Page from 'components/Layout/Page'
import { Flex } from '@pancakeswap/uikit'
import { usePollNFTPublicData } from 'state/nft/hooks'
import NFTCharacters from './components/NFTCharacters'
import CastNFT from './components/CastNFT'
import MyNFTs from './components/MyNFTs/MyNFTs'

const Nfts: React.FC = () => {
    const { path } = useRouteMatch()
    const { account } = useWeb3React()
    usePollNFTPublicData()

    return (
        <>
            <Page>
                <Flex flexWrap="wrap" alignItems="stretch">
                    <NFTCharacters />
                    <CastNFT account={account}/>
                    <MyNFTs account={account}/>
                </Flex>
            </Page>
        </>
    )
}

export default Nfts