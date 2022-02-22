import React, { useState } from 'react'
import { Link } from 'react-router-dom';
import styled from 'styled-components'
import { Card, Flex, Heading, Text } from '@pancakeswap/uikit';
import { nftGrades } from 'config/constants/nft';
import tokens from 'config/constants/tokens';
import { DeserializedNFTGego } from 'state/types';
import { useTranslation } from 'contexts/Localization';
import { getFullDisplayBalance } from 'utils/formatBalance';
import { BIG_TEN } from 'utils/bigNumber';
import useInterval from 'hooks/useInterval';
import { NFTTrade } from 'views/NftMarketplace/types';
import NFTCard from '../NFTCard/NFTCard';

const AuctionCardWrapper = styled(Flex)`
  align-self: baseline;
  padding: 12px;
`
const LinkWrapper = styled(Link)`
  text-decoration: none;
  :hover {
    cursor: pointer;
    opacity: 0.7;
  }
`


interface TradeCardProps {
  market: NFTTrade
}

const TradeCard: React.FC<TradeCardProps> = ({market}) => {


  return (
      <AuctionCardWrapper>
        <LinkWrapper to={`/nft-marketplace/market/${market.listingId}`}>
          <Flex flexDirection="column">
            <NFTCard gego={market.gego}/>
          </Flex>
        </LinkWrapper>
      </AuctionCardWrapper>
  )
}

export default TradeCard
