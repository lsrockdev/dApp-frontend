import React from 'react'
import styled from 'styled-components'
import { Button, Flex, Heading, useModal } from '@pancakeswap/uikit'
import { useTranslation } from 'contexts/Localization'
import FlexLayout from 'components/Layout/Flex'
import { useNFTs } from 'state/nft/hooks'
import NFTCard from '../NFTCard/NFTCard'

const Wrapper = styled.div`
    flex: 1 1 0;
    max-width: 100%;
    width: 100%;
    min-width: 100%;
    padding: 16px;
`

const Header = styled(Flex)`
    border-radius: 12px;
`


const MyNFTs: React.FC = () => {
    const { t } = useTranslation()
    const { nftBalance, stakedNFTBalance } = useNFTs()

    return (
        <>
            <Wrapper>
                <Header flexDirection="column">
                    <Heading padding="12px 0px 12px 14px">{t('My NFTs')}</Heading>
                </Header>

                <FlexLayout>
                    {
                        nftBalance.map((nftGego) => (
                            <NFTCard gego={nftGego} key={nftGego.id.toJSON()}/>
                        ))
                    }
                    {
                        stakedNFTBalance.map((nftGego) => (
                            <NFTCard gego={nftGego} key={nftGego.id.toJSON()} />
                        ))
                    }
                </FlexLayout>
                
            </Wrapper>
        
        </>
    )
}

export default MyNFTs