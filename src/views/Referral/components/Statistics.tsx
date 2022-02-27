import React, { useState } from 'react'
import { Input, Heading, Text, Flex } from '@pancakeswap/uikit'
import styled from 'styled-components'
import { useTranslation } from 'contexts/Localization'
import { getFullDisplayBalance } from 'utils/formatBalance'
import tokens from 'config/constants/tokens'
import { usePriceCakeBusd } from 'state/farms/hooks'
import { ReferralStatistics } from '../types'
import Comparison from './Comparison'

const StyleInput = styled(Input)`
    margin-top: 10px;
`

const StyledCard = styled(Flex).attrs({flexDirection: "column"})`
    border: 1px solid ${({ theme }) => theme.colors.cardBorder};
    border-radius: ${({ theme }) => theme.radii.default};
    padding: 16px;
`

const CardWrapper = styled.div`
    display: flex;
    flex-direction: column;
    flex: 1;
    width: 100%;
    padding: 8px;
    ${({ theme }) => theme.mediaQueries.md} {
        width: 33%;
    }
`

interface StatisticsProps {
    stats: ReferralStatistics
}

const Statistics: React.FC<StatisticsProps> = ({stats}) => {

    const { t } = useTranslation()
    const token = tokens.spy
    const cakePriceUsd = usePriceCakeBusd()

    const renderDailyStats = () => {
        return (
        <Flex flexDirection="column">
            <Heading padding="8px">
                {t('Your Referral Statistics')}
            </Heading>
            <Flex flexDirection={["column", null, null, "row"]}>
                <CardWrapper>
                    <StyledCard>
                        <Text fontSize="14px">
                            {t('Today')}
                        </Text>
                        <Text color="secondary" fontSize="18px" fontWeight="bold">
                            {getFullDisplayBalance(stats.today, token.decimals)} {t('SPY')}
                        </Text>
                        <Text color="secondary">
                            {cakePriceUsd && cakePriceUsd.isFinite() ? `~$${stats.today.multipliedBy(cakePriceUsd).toNumber()}` : '-'}
                        </Text>
                        <Comparison current={stats.today} old={stats.yesterday} token={token}/>
                    </StyledCard>
                </CardWrapper>
                <CardWrapper>
                    <StyledCard>
                        <Text fontSize="14px">
                            {t('This Week')}
                        </Text>
                        <Text color="secondary" fontSize="18px" fontWeight="bold">
                            {getFullDisplayBalance(stats.thisweek, token.decimals)} {t('SPY')}
                        </Text>
                        <Text color="secondary">
                            {cakePriceUsd && cakePriceUsd.isFinite() ? `~$${stats.thisweek.multipliedBy(cakePriceUsd).toNumber()}` : '-'}
                        </Text>
                        <Comparison current={stats.thisweek} old={stats.lastweek} token={token}/>
                    </StyledCard>
                </CardWrapper>
                <CardWrapper>
                    <StyledCard>
                        <Text fontSize="14px">
                            {t('This Month')}
                        </Text>
                        <Text color="secondary" fontSize="18px" fontWeight="bold">
                            {getFullDisplayBalance(stats.thismonth, token.decimals)} {t('SPY')}
                        </Text>
                        <Text color="secondary">
                            {cakePriceUsd && cakePriceUsd.isFinite() ? `~$${stats.thismonth.multipliedBy(cakePriceUsd).toNumber()}` : '-'}
                        </Text>
                        <Comparison current={stats.thismonth} old={stats.lastmonth} token={token}/>
                    </StyledCard>
                </CardWrapper>
            </Flex>
        </Flex>
        )
    }

    const renderDashStats = () => {
        return (
        <Flex flexDirection="column" mt="16px">
            <Heading padding="8px">
                {t('Dashboard')}
            </Heading>
            <Flex flexDirection={["column", null, null, "row"]}>
                <CardWrapper>
                    <StyledCard>
                        <Text fontSize="14px">
                            {t('Active Friends/Total Friends')}
                        </Text>
                        <Text color="secondary" fontSize="18px" fontWeight="bold">
                            {stats.activeReferrals} / {stats.totalReferrals}
                        </Text>
                    </StyledCard>
                </CardWrapper>
                <CardWrapper>
                    <StyledCard>
                        <Flex flexDirection={["column", null, null, "row"]}>
                            <Flex flexDirection="column" width={["100%", null, null, "50%"]}>
                                <Text fontSize="14px">
                                    {t('Total Farm Friends')}
                                </Text>
                                <Text color="secondary" fontSize="18px" fontWeight="bold">
                                    {stats.activeReferrals}
                                </Text>
                            </Flex>
                            <Flex flexDirection="column" width={["100%", null, null, "50%"]}>
                                <Text fontSize="14px">
                                    {t('Total Farm Earned')}
                                </Text>
                                <Text color="secondary" fontSize="18px" fontWeight="bold">
                                    {getFullDisplayBalance(stats.totalRewards, token.decimals)} {token.symbol}
                                </Text>
                            </Flex>
                        </Flex>
                    </StyledCard>
                </CardWrapper>
            </Flex>
        </Flex>
        )
    }

    return (
        <Flex flexDirection="column">
            {renderDailyStats()}
            {renderDashStats()}
        </Flex>
    )

}

export default Statistics