import BigNumber from 'bignumber.js'
import React, { useCallback, useMemo, useState } from 'react'
import styled from 'styled-components'
import { Button, Modal, Heading, Flex, Text, InjectedModalProps } from '@pancakeswap/uikit'
import { nftGrades } from 'config/constants/nft';
import tokens from 'config/constants/tokens';
import { ModalActions } from 'components/Modal'
import { useTranslation } from 'contexts/Localization'
import { getFullDisplayBalance } from 'utils/formatBalance'
import { DeserializedNFTGego } from 'state/types'
import { BIG_TEN } from 'utils/bigNumber';


const ModalInnerContainer = styled(Flex)`
  flex-direction: column;
  padding: 0px 24px;

  ${({ theme }) => theme.mediaQueries.md} {
    padding: 0px 48px;
  }
`

const GradeImageWrapper = styled.div`
  display:flex;
  align-items:center;
  justify-content:center;
  > img {
    width: 300px;
    max-width: calc(90vw - 120px);
  }

  ${({ theme }) => theme.mediaQueries.md} {
    > img {
      max-width: calc(100vw - 144px);
    }
  }
`

interface CastedModalProps {
  gego: DeserializedNFTGego
  customOnDismiss?: () => void
}

const CastedModal: React.FC<InjectedModalProps & CastedModalProps> = ({ gego, customOnDismiss, onDismiss }) => {
  const { t } = useTranslation()
  const gradeConfig = nftGrades.find((c) => c.level === gego.grade)

  const handleDismiss = useCallback(() => {
    if (customOnDismiss) {
      customOnDismiss()
    }
    onDismiss()
  }, [customOnDismiss, onDismiss])

  return (
    <Modal title={t('Casted NFTs Completed')} onDismiss={handleDismiss}>

      <ModalInnerContainer>

        { gradeConfig && (
          <GradeImageWrapper>
            <img src={`/images/nft/${gradeConfig.image}`} alt={gradeConfig.grade}/>
          </GradeImageWrapper>
        )}

        <Heading textAlign="center" color="primary" mt="16px">
          {gradeConfig.grade.toString()}
        </Heading>
        <Flex justifyContent="center" mt="4px">
          <Text color="secondary" mr="8px">{t('Grade')}:</Text>
          <Text color="primary">{gego.grade}</Text>
        </Flex>
        <Flex justifyContent="center">
          <Text color="secondary" mr="8px">{t('Locked days')}:</Text>
          <Text color="primary">{gego.lockedDays}</Text>
        </Flex>
        <Flex justifyContent="center">
          <Text color="secondary" mr="8px">{t('Mining Power')}:</Text>
          <Text color="primary">{gego.efficiency.multipliedBy(gego.amount).div(BIG_TEN.pow(tokens.spy.decimals)).div(100000).toFixed(2)} SPY</Text>
        </Flex>
        <Flex justifyContent="center">
          <Text color="secondary" mr="8px">{t('Mining Efficiency')}:</Text>
          <Text color="primary">{gego.efficiency.div(1000).toFixed(2)}</Text>
        </Flex>
      <ModalActions>
        <Button variant="primary" onClick={handleDismiss} width="100%">
          {t('OK')}
        </Button>
      </ModalActions>
      </ModalInnerContainer>
    </Modal>
  )
}

export default CastedModal
