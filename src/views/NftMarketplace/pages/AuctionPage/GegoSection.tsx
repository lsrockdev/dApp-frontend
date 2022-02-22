import React, { useMemo, useState } from 'react'
import { useRouteMatch } from 'react-router-dom'
import { Button, Flex, Heading, Text } from '@pancakeswap/uikit'
import styled from 'styled-components'
import tokens from 'config/constants/tokens'
import TokenAddress from 'components/TokenAddress'
import { useTranslation } from 'contexts/Localization'
import { DeserializedNFTGego } from 'state/types'
import { getFullDisplayBalance } from 'utils/formatBalance'
import { BIG_TEN } from 'utils/bigNumber'
import useInterval from 'hooks/useInterval'
import Dots from 'components/Loader/Dots'

const Wrapper = styled.div`
    flex: 1 1 100%;
    max-width: 100%;
    width: 100%;
    padding: 16px;
    ${({ theme }) => theme.mediaQueries.md} {
        max-width: 40%;
    }
`

const Group = styled(Flex)`
    padding: 24px;
    border-radius: 12px;
    border: 1px solid ${({ theme }) => theme.colors.cardBorder};
    min-height: 100%;
`

export const InfoRow = styled(Flex)`
    justify-content: space-between;
    padding: 8px 0px;
`

export  const InfoLabel = styled(Text)`
    font-size: 14px;
    padding-right: 8px;
`
export  const InfoValue = styled(Text)`
    font-size: 14px;
`

const GradeImageWrapper = styled.div`
`

const StatusText = styled(Text)`
`

interface GegoSectionProps {
    gego: DeserializedNFTGego
    owner: string
    account?: string
    showCancel: boolean
    onCancel?: () => void
    cancelTitle?: string
    canceling?: boolean
}
const GegoSection: React.FC<GegoSectionProps> = ({gego, owner, account, showCancel, onCancel, cancelTitle, canceling}) => {
    const { t } = useTranslation()
    const { path } = useRouteMatch()

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
          setCountdown('Now!');
        }
      } else {
        setCountdown('');
      }
    }, 1000)

    return (
        <Wrapper>
            <Group flexDirection="column">
                <Heading mb="8px">
                    {t('On-Chain Data')}
                </Heading>
                <Flex flexDirection="column"> 
                    <InfoRow>
                        <InfoLabel>{t('Owner Address')}</InfoLabel>
                        <TokenAddress address={owner} truncate/>
                    </InfoRow>
                    <InfoRow>
                        <InfoLabel>{t('Par Value')}</InfoLabel>
                        <InfoValue>{getFullDisplayBalance(gego.amount, tokens.spy.decimals)} SPY</InfoValue>
                    </InfoRow>
                    <InfoRow>
                        <InfoLabel>{t('Mining Power')}</InfoLabel>
                        <InfoValue>{gego.efficiency.multipliedBy(gego.amount).div(BIG_TEN.pow(tokens.spy.decimals)).div(100000).toFixed(2)} SPY</InfoValue>
                    </InfoRow>
                    <InfoRow>
                        <InfoLabel>{t('Mining Efficiency')}</InfoLabel>
                        <InfoValue>{gego.efficiency.div(1000).toFixed(2)}</InfoValue>
                    </InfoRow>
                    <InfoRow>
                        <InfoLabel>{t('Decomposable in')}</InfoLabel>
                        <InfoValue>{countdown}</InfoValue>
                    </InfoRow>

                    { showCancel && (
                        <Button
                        scale="md" variant="primary" width="100%"
                        disabled={canceling}
                        onClick={onCancel}
                        >
                            {canceling ? (<Dots>{t('Processing')}</Dots>) : cancelTitle}    
                        </Button>
                    )}
                </Flex>
            </Group>
        </Wrapper>
    )
}

export default GegoSection