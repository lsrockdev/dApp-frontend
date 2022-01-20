import { Flex } from '@pancakeswap/uikit'
import { nftGrades } from 'config/constants/nft'
import tokens from 'config/constants/tokens';
import { useTranslation } from 'contexts/Localization'
import React, { useCallback, useMemo, useState } from 'react'
import { DeserializedNFTGego } from 'state/types'
import styled from 'styled-components'
import NFTGradeRow from './NFTGradeRow'


interface NFTSelectorProps {
  gegos?: DeserializedNFTGego[]
  onSelect: (gego: DeserializedNFTGego) => void
}

const NFTSelector: React.FC<NFTSelectorProps> = ({ gegos, onSelect }) => {
  const { t } = useTranslation()
  const getGradeConfig = (g: DeserializedNFTGego) =>  {
    return nftGrades.find((c) => c.level === g.grade)
  }

  return (
    <Flex flexDirection="column">
      { gegos.map((gego) => (
          <NFTGradeRow gego={gego} key={gego.id} onSelect={() => onSelect(gego)} spyDecimals={tokens.spy.decimals} selectable/>
        )
      )}
    </Flex>
  )
}

export default NFTSelector
