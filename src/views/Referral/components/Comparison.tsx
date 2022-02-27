import React, { useMemo, useState } from 'react'
import { Input, Heading, Text, Flex, ArrowForwardIcon } from '@pancakeswap/uikit'
import styled from 'styled-components'
import { useTranslation } from 'contexts/Localization'
import { getFullDisplayBalance } from 'utils/formatBalance'
import tokens from 'config/constants/tokens'
import { usePriceCakeBusd } from 'state/farms/hooks'
import BigNumber from 'bignumber.js'
import { Token } from '@pancakeswap/sdk'
import { BIG_ZERO } from 'utils/bigNumber'


const StyledText = styled(Text).attrs({fontSize: "14px"})`
`

interface ComparisonProps {
    current: BigNumber
    old: BigNumber
    token: Token
}

const Comparison: React.FC<ComparisonProps> = ({current, old, token}) => {

    const { t } = useTranslation()
    const cakePriceUsd = usePriceCakeBusd()

    const changeSign = useMemo(() => {
        if (current.lt(old)) {
            return '-';
        }

        if (current.gt(old)) {
            return '+';
        }

        return '+';
    }, [current, old])

    const changeAmount = useMemo(() => {
        if (current.lt(old)) {
            return old.minus(current);
        }

        if (current.gt(old)) {
            return current.minus(old);
        }

        return BIG_ZERO;
    }, [current, old])

    const changePercent = useMemo(() => {
        if (current.lt(old)) {
            return old.minus(current).multipliedBy(100).dividedBy(old);
        }

        if (current.gt(old)) {
            return current.minus(old).multipliedBy(100).dividedBy(old);
        }

        return BIG_ZERO;
    }, [current, old])

    const statusColor = useMemo(() => {
        if (current.lt(old)) {
            return 'red';
        }

        if (current.gt(old)) {
            return 'green';
        }

        return '';
    }, [current, old])

    const renderContent = () => {

        return (
            <Flex alignItems="center">
                <StyledText color={statusColor}>
                    {changeSign} {getFullDisplayBalance(changeAmount, token.decimals)} {token.symbol}
                </StyledText>
                <ArrowForwardIcon color={statusColor} margin="0px 8px"/>
                <StyledText color={statusColor}>
                    {changePercent.toFixed(2)}%
                </StyledText>
            </Flex>
        )
    }

    return renderContent()

}

export default Comparison