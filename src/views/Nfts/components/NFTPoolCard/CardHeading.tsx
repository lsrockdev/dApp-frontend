import React from 'react'
import styled from 'styled-components'
import { Tag, Flex, Heading, Skeleton } from '@pancakeswap/uikit'
import { Token } from '@pancakeswap/sdk'
import { CoreTag } from 'components/Tags'
import { TokenPairImage } from 'components/TokenImage'
import tokens from 'config/constants/tokens'

export interface ExpandableSectionProps {
  lpLabel?: string
}

const Wrapper = styled(Flex)`
  svg {
    margin-right: 4px;
  }
`

const MultiplierTag = styled(Tag)`
  margin-left: 4px;
`

const CardHeading: React.FC<ExpandableSectionProps> = ({ lpLabel }) => {
  const spyToken = tokens.spy
  return (
    <Wrapper justifyContent="space-between" alignItems="center" mb="12px">
      <TokenPairImage variant="inverted" primaryToken={spyToken} secondaryToken={spyToken} width={64} height={64} />
      <Flex flexDirection="column" alignItems="flex-end">
        <Heading mb="4px">SPY NFT Pool (V3)</Heading>
        <Flex justifyContent="center">
        <CoreTag />
          {/* {multiplier ? (
            <MultiplierTag variant="secondary">{multiplier}</MultiplierTag>
          ) : (
            <Skeleton ml="4px" width={42} height={28} />
          )} */}
        </Flex>
      </Flex>
    </Wrapper>
  )
}

export default CardHeading
