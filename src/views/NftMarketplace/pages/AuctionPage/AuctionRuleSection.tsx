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

const AuctionRuleSection: React.FC = () => {

    const {t} = useTranslation()

    return (
        <Wrapper>
            <Group flexDirection="column">
                <Heading mb="8px">
                    {t('Auction Rules')}
                </Heading>
                <Flex flexDirection="column"> 
                    <Row>
                        1. {t('Each time you participate in the auction, you need to increase the price by 10%. After the countdown ends, the auction item will be obtained by the last bidder.')}
                    </Row>
                    <Row>
                        2. {t('20% of this increase is obtained by the previous bidder, and 80% by the seller.')}
                    </Row>
                    <Row>
                        3. {t('After the auction is successful, the market will charge 1% of the seller\'s revenue as a service fee, of which 100 % is added to the NFT Pool.')}
                    </Row>
                    <Row>
                        4. {t('When the auction countdown is less than 1 hour, the auction end time will be extended by 10 minutes for every successful bid.')}
                    </Row>
                    <Row>
                        5. {t('After the auction is over, the seller can go to the details page to claim the auction proceeds, and the buyer can claim the NFT.')}
                    </Row>
                </Flex>
            </Group>
        </Wrapper>
    )
}

export default AuctionRuleSection