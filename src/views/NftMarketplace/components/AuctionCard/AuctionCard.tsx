import React, { useState } from 'react'
import styled from 'styled-components'
import { Link } from 'react-router-dom';
import { Card, Flex, Heading, Text } from '@pancakeswap/uikit';
import { nftGrades } from 'config/constants/nft';
import tokens from 'config/constants/tokens';
import { DeserializedNFTGego } from 'state/types';
import { useTranslation } from 'contexts/Localization';
import { getFullDisplayBalance } from 'utils/formatBalance';
import { BIG_TEN } from 'utils/bigNumber';
import useInterval from 'hooks/useInterval';
import { NFTAuction } from 'views/NftMarketplace/types';
import NFTCard from '../NFTCard/NFTCard';

const AuctionCardWrapper = styled(Flex)`
  align-self: baseline;
  padding: 12px;
  flex-direction: column;
`
const LinkWrapper = styled(Link)`
  text-decoration: none;
  :hover {
    cursor: pointer;
    opacity: 0.7;
  }
`


interface AuctionCardProps {
  auction: NFTAuction
}

const AuctionCard: React.FC<AuctionCardProps> = ({auction}) => {

  const { t } = useTranslation()

  return (
      <AuctionCardWrapper>
        <LinkWrapper to={`/nft-marketplace/auction/${auction.auctionId}`}>
          <Flex flexDirection="column">
            <NFTCard gego={auction.gego}/>
              <Flex justifyContent="space-between" padding="8px">
                <Text color="secondary">
                  {t('Latest Price')}:
                </Text>
                <Text color="primary">
                  {auction.lastPrice ? auction.lastPrice : auction.startingPrice} {auction.payToken ? auction.payToken.symbol : 'BNB'}
                </Text>
              </Flex>
          </Flex>
        </LinkWrapper>
      </AuctionCardWrapper>
  )
}

export default AuctionCard
