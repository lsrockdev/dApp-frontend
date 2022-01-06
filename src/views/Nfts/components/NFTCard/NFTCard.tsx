import React, { useState } from 'react'
import styled from 'styled-components'
import { Card, Flex, Heading, Text } from '@pancakeswap/uikit';
import { NFTGradeConfig } from 'config/constants/nft/types'
import { DeserializedNFTGego } from 'state/types';
import { nftGrades } from 'config/constants/nft';
import tokens from 'config/constants/tokens';
import { useTranslation } from 'contexts/Localization';
import { getFullDisplayBalance } from 'utils/formatBalance';
import { BIG_TEN } from 'utils/bigNumber';

const cardWrapper = styled.div`
`;

const StyledCard = styled(Card)`
  align-self: baseline;
`

const CardInnerContainer = styled(Flex)`
  flex-direction: column;
  padding: 24px;
`

const GradeImageWrapper = styled.div`
`

interface NFTCardProps {
  gego?: DeserializedNFTGego
}

const NFTCard: React.FC<NFTCardProps> = ({gego}) => {


  const { t } = useTranslation()
  const gradeConfig = nftGrades.find((c) => c.level === gego.grade)

  return (
    <StyledCard>
      <CardInnerContainer>
        { gradeConfig && (
          <GradeImageWrapper>
            <img src={`/images/nft/${gradeConfig.image}`} alt={gradeConfig.grade}/>
          </GradeImageWrapper>
        )}

        <Heading>
          #{gego.id.toJSON()}
        </Heading>
        <Flex justifyContent="space-between">
          <Text>{t('Par Value')}</Text>
          <Text>{getFullDisplayBalance(gego.amount, tokens.spy.decimals)} SPY</Text>
        </Flex>
        <Flex justifyContent="space-between">
          <Text>{t('Mining Power')}</Text>
          <Text>{gego.efficiency.multipliedBy(gego.amount).div(BIG_TEN.pow(tokens.spy.decimals)).div(100000).toFixed(2)} SPY</Text>
        </Flex>
        <Flex justifyContent="space-between">
          <Text>{t('Mining Efficiency')}</Text>
          <Text>{gego.efficiency.div(1000).toFixed(2)}</Text>
        </Flex>
      </CardInnerContainer>
    </StyledCard>
  )
}

export default NFTCard
