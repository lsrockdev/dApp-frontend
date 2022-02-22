import React, { useState } from 'react'
import styled from 'styled-components'
import { Card, Flex, Heading, Text } from '@pancakeswap/uikit';
import { nftGrades } from 'config/constants/nft';
import tokens from 'config/constants/tokens';
import { DeserializedNFTGego } from 'state/types';
import { useTranslation } from 'contexts/Localization';
import { getFullDisplayBalance } from 'utils/formatBalance';
import { BIG_TEN } from 'utils/bigNumber';
import useInterval from 'hooks/useInterval';

const StyledCard = styled(Card)`
  align-self: baseline;
`

const CardInnerContainer = styled(Flex)`
  flex-direction: column;
  padding: 24px;
`

const Countdown = styled(Text)`
  position: absolute;
  display: flex;
  background: rgba(0,0,0,.8);
  color: white;
  font-size: 14px;
  font-weight: bold;
  font-family: monospace,sans-serif;
  bottom: 5%;
  right: 10%;
  padding: 4px 8px;
  border-radius: 8px;
`

const GradeImageWrapper = styled.div`
  position: relative;
`

interface NFTCardProps {
  gego?: DeserializedNFTGego
}

const NFTCard: React.FC<NFTCardProps> = ({gego}) => {
  const { t } = useTranslation()
  const gradeConfig = nftGrades.find((c) => c.level === gego.grade)

  const [countdown, setCountdown] = useState('')

  useInterval(() => {
    
    if (gego) {
      const target = gego.createdTime + gego.lockedDays * 86400
      const now = Math.floor(new Date().getTime() / 1000);
      const diffTime = target - now;
      if (diffTime > 0) {
        const duration = diffTime;
        const day = Math.floor(duration / 86400);
        const hour = Math.floor((duration % 86400) / 3600);
        const min = Math.floor((duration % 3600) / 60);
        const sec = duration % 60;

        const dayS = day < 10 ? `0${day}`:`${day}`;
        const hourS = hour < 10 ? `0${hour}`:`${hour}`;
        const minS = min < 10 ? `0${min}`:`${min}`;
        const secS = sec < 10 ? `0${sec}`:`${sec}`;
        setCountdown(`${dayS}:${hourS}:${minS}:${secS}`);
      } else {
        setCountdown('');
      }
    } else {
      setCountdown('');
    }
  }, 1000)


  return (
    <StyledCard>
      <CardInnerContainer>
        { gradeConfig && (
          <GradeImageWrapper>
            <img src={`/images/nft/${gradeConfig.image}`} alt={gradeConfig.grade}/>

            { countdown !== '' && (
              <Countdown>
                {countdown}
              </Countdown>
            )}
          </GradeImageWrapper>
        )}

        <Heading mt="16px">
          #{gego.id}
        </Heading>
        <Flex justifyContent="space-between" mt="8px">
          <Text>{t('Par Value')}</Text>
          <Text textAlign="right">{getFullDisplayBalance(gego.amount, tokens.spy.decimals)} SPY</Text>
        </Flex>
        <Flex justifyContent="space-between" mt="8px">
          <Text>{t('Mining Power')}</Text>
          <Text textAlign="right">{gego.efficiency.multipliedBy(gego.amount).div(BIG_TEN.pow(tokens.spy.decimals)).div(100000).toFixed(2)} SPY</Text>
        </Flex>
      </CardInnerContainer>
    </StyledCard>
  )
}

export default NFTCard
