import React, { useCallback, useState } from 'react'
import styled from 'styled-components'
import { Button, Modal, Heading, Flex, Text, InjectedModalProps } from '@pancakeswap/uikit'
import { nftGrades } from 'config/constants/nft';
import tokens from 'config/constants/tokens';
import { ModalActions } from 'components/Modal'
import { useTranslation } from 'contexts/Localization'
import { useAppDispatch } from 'state';
import { DeserializedNFTGego } from 'state/types'
import { fetchNFTAllowancesAsync, fetchNFTUserBalanceDataAsync } from 'state/nft';
import { useNFTRewardAllowance } from 'state/nft/hooks';
import { BIG_TEN } from 'utils/bigNumber';
import { useSpyNFT } from 'hooks/useContract';
import useToast from 'hooks/useToast';
import useApproveGeneralReward from '../hooks/useApproveGeneralReward';
import useStakeNFT from '../hooks/useStakeNFT';
import useUnstakeNFT from '../hooks/useUnstakeNFT';

const ModalInnerContainer = styled(Flex)`
  flex-direction: column;

  ${({ theme }) => theme.mediaQueries.md} {
    padding: 0px 12px;
    min-width: 400px;
  }
`

const ModalContentContainer = styled(Flex)`
  padding: 12px;
  background: ${({ theme }) => theme.colors.backgroundAlt2};
  border: 1px solid ${({ theme }) => theme.colors.cardBorder};
  border-radius: ${({theme}) => theme.radii.default};

  ${({ theme }) => theme.mediaQueries.md} {
    padding: 12px;
  }
`

const GradeImageWrapper = styled.div`
  display:flex;
  align-items:center;
  justify-content:center;
  margin-right: 12px;
  > img {
    max-height: 80px;
  }

  ${({ theme }) => theme.mediaQueries.md} {
    > img {
      height: 80px;
    }
  }
`

interface UnstakeNFTModalProps {
  gego: DeserializedNFTGego
  account: string
}

const UnstakeNFTModal: React.FC<InjectedModalProps & UnstakeNFTModalProps> = ({ account, gego, onDismiss }) => {
  const { t } = useTranslation()
  const dispatch = useAppDispatch()
  const { toastError } = useToast()
  const [pendingTx, setPendingTx] = useState(false)
  const gradeConfig = nftGrades.find((c) => c.level === gego.grade)
  const nftContract = useSpyNFT(tokens.spynft.address)
  const { onUnstakeNFT } = useUnstakeNFT()

  const handleUnstakeNFT = useCallback(async() => {

    try {
      setPendingTx(true)
      await onUnstakeNFT(gego.id)
      dispatch(fetchNFTUserBalanceDataAsync({account}))
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
  }, [onUnstakeNFT, onDismiss, toastError, t, dispatch, account, gego])

  return (
    <Modal title={t('Unstake your NFT card')} onDismiss={onDismiss}>

      <ModalInnerContainer>

        <ModalContentContainer alignItems="center" justifyContent="start">
          { gradeConfig && (
            
            <GradeImageWrapper>
              <img src={`/images/nft/${gradeConfig.image}`} alt={gradeConfig.grade}/>
            </GradeImageWrapper>
          )}
          <Flex flexDirection="column" alignItems="start">
            <Heading textAlign="center" color="primary" scale="md">
              {gradeConfig.grade.toString()}
            </Heading>
            <Text fontSize="14px" color="secondary" mr="8px">{t('Efficiency')}: {gego.efficiency.div(1000).toFixed(2)}% - {t('Power')}:{gego.efficiency.multipliedBy(gego.amount).div(BIG_TEN.pow(tokens.spy.decimals)).div(100000).toFixed(2)}</Text>
          </Flex>

        </ModalContentContainer>
      <ModalActions>
        <Button scale="md" variant="secondary" onClick={onDismiss} width="100%">
          {t('Cancel')}
        </Button>
        <Button
          scale="md" variant="primary" width="100%"
          onClick={handleUnstakeNFT}
          disabled={pendingTx}
        >
          {pendingTx ? t('Processing...') : t('Confirm')}
        </Button>
      </ModalActions>
      </ModalInnerContainer>
    </Modal>
  )
}

export default UnstakeNFTModal
