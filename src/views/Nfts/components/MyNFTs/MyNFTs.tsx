import React from 'react'
import styled from 'styled-components'
import { Button, Flex, Heading, useModal } from '@pancakeswap/uikit'
import { useTranslation } from 'contexts/Localization'
import FlexLayout from 'components/Layout/Flex'
import { useNFTBalances, useNFTFactoryAllowance, useNFTRewardAllowance, usePollNFTAllowanceData } from 'state/nft/hooks'
import NFTCard from '../NFTCard/NFTCard'


const Wrapper = styled.div`
    flex: 1 1 0;
    max-width: 100%;
    width: 100%;
    min-width: 100%;
    margin-top: 16px;
`

const Header = styled(Flex)`
    border-radius: 12px;
`

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

const CardWrapper = styled.div`
  padding: 12px;
`

interface MyNFTsProps {
account: string
}

const MyNFTs: React.FC<MyNFTsProps> = ({account}) => {
    const { t } = useTranslation()
    const nftBalance = useNFTBalances ()
    const factoryAllowed = useNFTFactoryAllowance()
    const generalRewardAllowed = useNFTRewardAllowance()

    usePollNFTAllowanceData()

    return (
        <>
            <Wrapper>
                <Header flexDirection="column">
                    <Heading padding="12px 0px 12px 14px">{t('My NFTs')}</Heading>
                </Header>

                <NFTCards>
                    { account && nftBalance.map((nftGego) => (
                        <CardWrapper>
                            <NFTCard account={account} gego={nftGego} key={nftGego.id} factoryAllowed={factoryAllowed} generalRewardAllowed={generalRewardAllowed}/>
                        </CardWrapper>
                    ))
                    }
                </NFTCards>
                
            </Wrapper>
        
        </>
    )
}

export default MyNFTs