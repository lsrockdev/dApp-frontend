import React, { useCallback, useMemo, useState } from 'react'
import { useAppDispatch } from 'state';
import { Button, Flex, Text } from '@pancakeswap/uikit'
import styled from 'styled-components'
import { nftGrades } from 'config/constants/nft'
import tokens from 'config/constants/tokens';
import { useTranslation } from 'contexts/Localization'
import { useSpyNFT } from 'hooks/useContract';
import useToast from 'hooks/useToast';
import { DeserializedNFTGego } from 'state/types'
import { fetchNFTAllowancesAsync } from 'state/nft';
import { useNFTMarketplaceAllowance } from 'state/nft/hooks';
import { BIG_TEN } from 'utils/bigNumber';
import Dots from 'components/Loader/Dots';
import { ModalActions } from 'components/Modal';
import useApproveMarketplace from '../../hooks/useApproveMarketplace';


const GradeImageWrapper = styled.div`
  display:flex;
  align-items:center;
  justify-content:center;
  > img {
    width: 200px;
    max-width: calc(90vw - 120px);
  }

  ${({ theme }) => theme.mediaQueries.md} {
    > img {
      max-width: calc(100vw - 144px);
    }
  }
`

interface BaseSectionProps {
  gego: DeserializedNFTGego
  account?: string
  handleSell: () => void
  onDismiss: () => void
  pendingTx: boolean
  isInputValid: boolean
}

const BaseSection: React.FC<BaseSectionProps> = ({ gego, account, handleSell, pendingTx, isInputValid, onDismiss, children }) => {
  const { t } = useTranslation()
  const dispatch = useAppDispatch()
  const { toastError, toastSuccess } = useToast()
  const gradeConfig = nftGrades.find((c) => c.level === gego.grade)
  const nftContract = useSpyNFT(tokens.spynft.address)
  const [requestedApproval, setRequestedApproval] = useState(false)
  const { onApproveNFTMarketplace } = useApproveMarketplace(nftContract)
  const allowance = useNFTMarketplaceAllowance()
  const isApproved = account && allowance;


  const handleApprove = useCallback(async() => {
    try {
        setRequestedApproval(true)
        await onApproveNFTMarketplace()
        dispatch(fetchNFTAllowancesAsync({account}))
      } catch (e) {
        toastError(t('Error'), t('Please try again. Confirm the transaction and make sure you are paying enough gas!'))
        console.error(e)
      } finally {
        setRequestedApproval(false)
      }
  }, [onApproveNFTMarketplace, toastError, t, dispatch, account])

  const renderApprovalOrSellButton = () => {
    return isApproved ? (
      <Button
        scale="md" variant="primary" width="100%"
        disabled={pendingTx || !isInputValid}
        onClick={handleSell}
      >
        {pendingTx ? (
          <Dots>{t('Processing')}</Dots>
        ) : t('Sell')}
      </Button>
    ) : (
      <Button scale="md" variant="primary" width="100%" disabled={requestedApproval} onClick={handleApprove}>
        {t('Approve')}
      </Button>
    )
  }

  return (
    <>

    { gradeConfig && (
      <GradeImageWrapper>
        <img src={`/images/nft/${gradeConfig.image}`} alt={gradeConfig.grade}/>
      </GradeImageWrapper>
    )}

    <Text textAlign="center" color="primary" mt="16px">
      #{gego.id} - {gradeConfig.grade.toString()}
    </Text>
    <Flex justifyContent="center">
      <Text color="secondary" mr="8px">{t('Mining Power')}:</Text>
      <Text color="primary">{gego.efficiency.multipliedBy(gego.amount).div(BIG_TEN.pow(tokens.spy.decimals)).div(100000).toFixed(2)} SPY</Text>
    </Flex>
    { children }
    <ModalActions>
      <Button scale="md" variant="secondary" onClick={onDismiss} width="100%">
        {t('Cancel')}
      </Button>
      {renderApprovalOrSellButton()}
    </ModalActions>
    </>
  )
}

export default BaseSection
