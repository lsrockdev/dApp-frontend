import React, { useCallback, useState } from 'react'
import styled from 'styled-components'
import { Button, Modal, Heading, Flex, Text, InjectedModalProps } from '@pancakeswap/uikit'
import { nftGrades } from 'config/constants/nft';
import tokens from 'config/constants/tokens';
import { ModalActions } from 'components/Modal'
import Dots from 'components/Loader/Dots';
import { useTranslation } from 'contexts/Localization'
import { useAppDispatch } from 'state';
import { DeserializedNFTGego } from 'state/types'
import { fetchNFTAllowancesAsync, fetchNFTUserBalanceDataAsync } from 'state/nft';
import { useNFTFactoryAllowance } from 'state/nft/hooks';
import { useSpyNFT } from 'hooks/useContract';
import useToast from 'hooks/useToast';
import { getFullDisplayBalance } from 'utils/formatBalance';
import useApproveNFTFactory from '../hooks/useApproveNFTFactory';
import useDecomposeNFT from '../hooks/useDecomposeNFT';

const ModalInnerContainer = styled(Flex)`
  flex-direction: column;

  ${({ theme }) => theme.mediaQueries.md} {
    padding: 0px 12px;
    min-width: 400px;
  }
`
const GradeImageWrapper = styled.div`
  display:flex;
  align-items:center;
  justify-content:center;
  margin-right: 12px;
  > img {
    max-width: calc(min(50vw, 200px));
  }

  ${({ theme }) => theme.mediaQueries.md} {
    > img {
      max-width: 200px;
    }
  }
`

interface DecomposeNFTModalProps {
  gego: DeserializedNFTGego
  account: string
}

const DecomposeNFTModal: React.FC<InjectedModalProps & DecomposeNFTModalProps> = ({ account, gego, onDismiss }) => {
  const { t } = useTranslation()
  const dispatch = useAppDispatch()
  const { toastError, toastSuccess } = useToast()
  const [requestedApproval, setRequestedApproval] = useState(false)
  const [pendingTx, setPendingTx] = useState(false)
  const gradeConfig = nftGrades.find((c) => c.level === gego.grade)
  const nftContract = useSpyNFT(tokens.spynft.address)
  const { onApprove } = useApproveNFTFactory(nftContract)
  const { onDecomposeNFT } = useDecomposeNFT()
  const allowance = useNFTFactoryAllowance()


  const isApproved = account && allowance;


  const handleApprove = useCallback(async() => {
    try {
        setRequestedApproval(true)
        await onApprove()
        dispatch(fetchNFTAllowancesAsync({account}))
      } catch (e) {
        toastError(t('Error'), t('Please try again. Confirm the transaction and make sure you are paying enough gas!'))
        console.error(e)
      } finally {
        setRequestedApproval(false)
      }
  }, [onApprove, toastError, t, dispatch, account])

  const handleDecomposeNFT = useCallback(async() => {

    try {
      setPendingTx(true)
      await onDecomposeNFT(gego.id)
      dispatch(fetchNFTUserBalanceDataAsync({account}))
      toastSuccess(
        `${t('Success')}!`,
        t('%amount% %symbol% have been sent to your wallet!', { amount: getFullDisplayBalance(gego.amount, tokens.spy.decimals), symbol: 'SPY' }),
      )
      onDismiss()
    } catch (e) {
      if (typeof e === 'object' && 'message' in e) {
        const err: any = e;
        toastError(t('Error'), err.message)
      } else {
        toastError(t('Error'), t('Please try again. Confirm the transaction and make sure you are paying enough gas!'))
      }
      console.error(e)
    } finally {
      setPendingTx(false)
    }
  }, [onDecomposeNFT, onDismiss, toastError, toastSuccess, t, dispatch, account, gego])

  const renderApprovalOrDecomposeButton = () => {
    return isApproved ? (
      <Button
        scale="md" variant="primary" width="100%"
        onClick={handleDecomposeNFT}
        disabled={pendingTx}
      >
        {pendingTx ? (
          <Dots>{t('Processing')}</Dots>
        ) : t('Confirm')}
      </Button>
    ) : (
      <Button scale="md" variant="primary" width="100%" disabled={requestedApproval} onClick={handleApprove}>
        {t('Approve')}
      </Button>
    )
  }

  return (
    <Modal title={t('Confirm NFTs Decompose')} onDismiss={onDismiss}>

      <ModalInnerContainer>
        { gradeConfig && (
          
          <GradeImageWrapper>
            <img src={`/images/nft/${gradeConfig.image}`} alt={gradeConfig.grade}/>
          </GradeImageWrapper>
        )}
        <Heading textAlign="center" color="primary" scale="md" mt="16px">
          NFTs Decompose
        </Heading>
        <Text fontSize="16px" color="secondary" mt="8px" textAlign="center">
          {t('Are you sure to Decompose ')}{gradeConfig.grade.toString()}?
        </Text>
        <Flex alignItems="center" justifyContent="center" mt="8px">
          <Text fontSize="16px" color="secondary" mr="8px">
            {t('You will get ')}
          </Text>
          <Text fontSize="16px" color="primary" mr="8px" fontWeight="bold">
          {getFullDisplayBalance(gego.amount, tokens.spy.decimals)}
          </Text>
          <Text fontSize="16px" color="secondary">
            {t('SPY')}
          </Text>
        </Flex>
        <ModalActions>
          <Button scale="md" variant="secondary" onClick={onDismiss} width="100%">
            {t('Cancel')}
          </Button>
          {renderApprovalOrDecomposeButton()}
        </ModalActions>
      </ModalInnerContainer>
    </Modal>
  )
}

export default DecomposeNFTModal
