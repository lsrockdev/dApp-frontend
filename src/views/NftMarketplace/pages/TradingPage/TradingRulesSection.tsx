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
`

const Group = styled(Flex)`
    padding: 24px;
    border-radius: 12px;
    border: 1px solid ${({ theme }) => theme.colors.cardBorder};
    min-height: 100%;
`

export const Row = styled(Text).attrs({'fontSize': '14px'})`
`

const TradingRulesSection: React.FC = () => {

    const {t} = useTranslation()

    return (
        <Wrapper>
            <Group flexDirection="column">
                <Heading mb="8px">
                    {t('Trading Rules')}
                </Heading>
                <Flex flexDirection="column"> 
                    <Row>
                        1. {t('NFT can be purchased in the NFT market with SPY or BNB.')}
                    </Row>
                    <Row>
                        2. {t('After NFT is listed in the trading market, operations such as transfer, auction, and stake mining are not allowed.')}
                    </Row>
                    <Row>
                        3. {t('The market will charge 1% of the seller’s revenue as a service fee, of which 100 % is added to the NFT Pool.')}
                    </Row>
                </Flex>
            </Group>
        </Wrapper>
    )
}

export default TradingRulesSection