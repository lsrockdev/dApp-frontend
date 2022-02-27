import React, { useEffect, useState } from 'react'
import styled, { keyframes } from 'styled-components'
import { Flex, Heading, Text } from '@pancakeswap/uikit'
import { useWeb3React } from '@web3-react/core'
import { useTranslation } from 'contexts/Localization'
import ConnectWalletButton from 'components/ConnectWalletButton'
import useTheme from 'hooks/useTheme'
import useRefresh from 'hooks/useRefresh'
import { SlideSvgDark, SlideSvgLight } from './SlideSvg'
import { getSrcSet } from './CompositeImage'
import ReferralLink from './ReferralLink'
import { ReferralStatistics } from '../types'
import { getReferralStatistics } from '../hooks/getStatistics'
import Statistics from './Statistics'

const ReferralSection = styled(Flex).attrs({flex: "1", flexDirection:"column"})`
  border: 1px solid ${({ theme }) => theme.colors.cardBorder};
  border-radius: ${({ theme }) => theme.radii.default};
  padding: 24px 16px 16px 16px;
`

const flyingAnim = () => keyframes`
  from {
    transform: translate(0,  0px);
  }
  50% {
    transform: translate(-5px, -5px);
  }
  to {
    transform: translate(0, 0px);
  }
`

const BunnyWrapper = styled.div`
  width: 100%;
  max-width: 200px;
  animation: ${flyingAnim} 3.5s ease-in-out infinite;
`

const imagePath = '/images/home/lunar-bunny/'
const imageSrc = 'bunny'

const Hero = () => {
  const { t } = useTranslation()
  const { account } = useWeb3React()
  const { theme } = useTheme()
  const [stats, setStats] = useState<ReferralStatistics|undefined>(undefined)
  const [loaded, setLoaded] = useState(false)

  const { slowRefresh } = useRefresh()
  useEffect(() => {
    const loadStats = async() => {
      try {
        if (account) {
          const stats_ = await getReferralStatistics(account)
          setStats(stats_)
        } else {
          setStats(undefined)
        }
      } finally {
        setLoaded(true)
      }
    }

    loadStats()
  }, [account, slowRefresh])

  return (
    <>
      <Flex flexDirection="column">
        <Flex flexWrap="wrap" flexDirection={["column", null, null, "row"]}>
          <Flex flex="1" flexDirection="column" paddingBottom="24px">
            <Heading scale="xl" color="secondary" mb="8px" padding="8px">
              {t('Smarty Pay Referral Program')}
            </Heading>
            <Text padding="8px">
              {t('Share the referral link below to invite your friends and earn 5% of your friends earnings FOREVER!')}
            </Text>
            { !account  && (
              <ConnectWalletButton mr="8px" mt="24px"/>
            )}
          </Flex>
          <Flex flex="1" flexDirection="column" padding="8px 8px 24px 8px">
            {account ? (
              <ReferralSection>
                <ReferralLink /> 
                {/* <TotalReferralCount /> */}
              </ReferralSection>
            ) : (
              <Flex justifyContent="center" alignItems="center">
                <BunnyWrapper>
                  <img src={`${imagePath}${imageSrc}.png`} srcSet={getSrcSet(imagePath, imageSrc)} alt={t('Lunar bunny')} />
                </BunnyWrapper>
              </Flex>
            )}
          </Flex>
        </Flex>
        { account && stats && (
          <Flex flexDirection="column">
            <Statistics stats={stats}/>
          </Flex>
        )}
      </Flex>
    </>
  )
}

export default Hero
