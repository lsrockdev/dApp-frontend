import React from 'react'
import { Route, useRouteMatch, useLocation, NavLink } from 'react-router-dom'
import { useWeb3React } from '@web3-react/core'
import styled from 'styled-components'
import Page from 'components/Layout/Page'
import { Flex } from '@pancakeswap/uikit'

const NftMarketplace: React.FC = () => {
    const { path } = useRouteMatch()
    const { account } = useWeb3React()

    return (
        <>
            <Page>
                <Flex flexWrap="wrap" alignItems="stretch">
                    Here
                </Flex>
            </Page>
        </>
    )
}

export default NftMarketplace