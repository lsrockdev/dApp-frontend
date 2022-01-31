import React, { useCallback, useMemo, useState } from 'react'
import styled from 'styled-components'
import { Button, Flex, InjectedModalProps, ModalHeader, ModalTitle, ModalCloseButton, ModalContainer, ModalBody, ModalBackButton, Heading } from '@pancakeswap/uikit'
import { nftGrades } from 'config/constants/nft';
import tokens from 'config/constants/tokens';
import { NFTGradeConfig } from 'config/constants/nft/types';
import { ModalActions } from 'components/Modal'
import Dots from 'components/Loader/Dots';
import { useTranslation } from 'contexts/Localization'
import { useAppDispatch } from 'state';
import { DeserializedNFTGego } from 'state/types'
import { fetchNFTUserBalanceDataAsync } from 'state/nft';
import { BIG_TEN } from 'utils/bigNumber';
import { useSpyNFT } from 'hooks/useContract';
import useToast from 'hooks/useToast';
import useUnstakeNFT from '../hooks/useUnstakeNFT';
import NFTGradeRow from './NFTGradeRow';
import NFTSelector from './NFTSelector';


enum UnstakeModalView {
  main,
  list,
}


const StyledModalContainer = styled(ModalContainer)`
  max-width: 420px;
  width: 100%;
`


const StyledModalBody = styled(ModalBody)`
  padding: 24px;
  overflow-y: auto;
  -ms-overflow-style: none;
  scrollbar-width: none;
  &::-webkit-scrollbar {
    display: none;
  }
`

interface UnstakeNFTModalProps {
  gego?: DeserializedNFTGego
  gegos?: DeserializedNFTGego[]
  account: string
  isV2?: boolean
}

const UnstakeNFTModal: React.FC<InjectedModalProps & UnstakeNFTModalProps> = ({ account, gego, gegos, isV2 = true, onDismiss }) => {
  const { t } = useTranslation()
  const dispatch = useAppDispatch()
  const { toastError, toastSuccess } = useToast()
  const [pendingTx, setPendingTx] = useState(false)
  const [modalView, setModalView] = useState<UnstakeModalView>(UnstakeModalView.main)
  const [selectedGego, setSelectedGego] = useState(gego || (gegos && gegos.length > 0 ? gegos[0]: null))
  const nftContract = useSpyNFT(tokens.spynft.address)
  const { onUnstakeNFT } = useUnstakeNFT()
  const handleUnstakeNFT = useCallback(async() => {

    try {
      setPendingTx(true)
      await onUnstakeNFT(selectedGego.id, isV2)
      dispatch(fetchNFTUserBalanceDataAsync({account}))
      toastSuccess(t('Success'), t('Your NFT #%id% has been unstaked', {id: selectedGego.id}))
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
  }, [onUnstakeNFT, onDismiss, toastError, toastSuccess, t, dispatch, account, selectedGego, isV2])

  return (
    <StyledModalContainer minWidth="320px">
      <ModalHeader>
        <ModalTitle>
          { modalView === UnstakeModalView.list && (
            <ModalBackButton onBack={() => setModalView(UnstakeModalView.main)} />
          )}
          <Heading>{ modalView === UnstakeModalView.main ? 'Unstake your NFT card' : 'Choose a NFT card'}</Heading>
        </ModalTitle>
        <ModalCloseButton onDismiss={onDismiss} />
      </ModalHeader>

      { modalView === UnstakeModalView.main ? (
      <StyledModalBody>
        <NFTGradeRow gego={selectedGego} spyDecimals={tokens.spy.decimals} onSelect={() => setModalView(UnstakeModalView.list)} selectable={gegos && gegos.length > 0} />
        <ModalActions>
          <Button scale="md" variant="secondary" onClick={onDismiss} width="100%">
            {t('Cancel')}
          </Button>
          <Button
            scale="md" variant="primary" width="100%"
            onClick={handleUnstakeNFT}
            disabled={pendingTx || !selectedGego}
          >
            {pendingTx ? (
              <Dots>{t('Processing')}</Dots>
            ) : t('Confirm')}
          </Button>
        </ModalActions>
      </StyledModalBody>
      ) : (
      <StyledModalBody>
        <NFTSelector gegos={gegos} onSelect={(g) => {
          setSelectedGego(g)
          setModalView(UnstakeModalView.main)
        }} />
      </StyledModalBody>
      )}
    </StyledModalContainer>
  )
}

export default UnstakeNFTModal
