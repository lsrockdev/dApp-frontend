import React, { useCallback, useMemo, useState } from 'react'
import styled from 'styled-components'
import { ChevronRightIcon, Flex, Button, Text } from '@pancakeswap/uikit'
import { nftGrades } from 'config/constants/nft'
import { useTranslation } from 'contexts/Localization'
import { DeserializedNFTGego } from 'state/types'
import { BIG_TEN } from 'utils/bigNumber';

const RowButton = styled(Button)`
  margin: 4px 0px;
  padding: 12px;
  border: 1px solid ${({ theme }) => theme.colors.cardBorder};
  border-radius: ${({theme}) => theme.radii.default};
`

const RowWrapper = styled(Flex)`
  flex: 1;
  background: ${({ theme }) => theme.colors.backgroundAlt2};

  ${({ theme }) => theme.mediaQueries.md} {
  }
`

const GradeImageWrapper = styled.div`
  display:flex;
  align-items:center;
  justify-content:center;
  margin-right: 12px;
  > img {
    max-height: 60px;
  }

  ${({ theme }) => theme.mediaQueries.md} {
    > img {
      height: 60px;
    }
  }
`

interface NFTGradeRowProps {
  gego: DeserializedNFTGego
  spyDecimals: number
  selectable?: boolean
  onSelect: () => void
}

const NFTGradeRow: React.FC<NFTGradeRowProps> = ({ gego, selectable, spyDecimals, onSelect }) => {
  const { t } = useTranslation()
  const gradeConfig = nftGrades.find((c) => c.level === gego.grade)
  return (
    <Flex flexDirection="column">
      <RowButton variant='text' style={{height: 'auto'}} onClick={() => {
        if (selectable) {
          onSelect()
        }
      }}>
        <RowWrapper alignItems="center" justifyContent="start">
          { gradeConfig && (
            
            <GradeImageWrapper>
              <img src={`/images/nft/${gradeConfig.image}`} alt={gradeConfig.grade}/>
            </GradeImageWrapper>
          )}
          <Flex flexDirection="column" alignItems="start" flex="1">
            <Text fontSize="15px" fontWeight="bold" textAlign="center" color="primary">
              {gradeConfig.grade.toString()}
            </Text>
            <Text fontSize="12px" color="secondary" mr="8px">
              {t('Efficiency')}: {gego.efficiency.div(1000).toFixed(2)}% - {t('Power')}:{gego.efficiency.multipliedBy(gego.amount).div(BIG_TEN.pow(spyDecimals)).div(100000).toFixed(2)}
              </Text>
          </Flex>
          { selectable && (
            <ChevronRightIcon />
          )}

        </RowWrapper>
      </RowButton>
    </Flex>
  )
}

export default NFTGradeRow
