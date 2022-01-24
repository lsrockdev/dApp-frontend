import BigNumber from 'bignumber.js'
import React, { useCallback, useMemo, useState } from 'react'
import { Button, Modal, Text } from '@pancakeswap/uikit'
import { ModalActions } from 'components/Modal'
import { useTranslation } from 'contexts/Localization'
import { getFullDisplayBalance } from 'utils/formatBalance'
import useToast from 'hooks/useToast'

interface CastConfirmModalProps {
  value: string
  onConfirm: () => void
  onDismiss?: () => void
}

const CastConfirmModal: React.FC<CastConfirmModalProps> = ({ onConfirm, onDismiss, value }) => {
  const { toastSuccess, toastError } = useToast()
  const [pendingTx, setPendingTx] = useState(false)
  const { t } = useTranslation()

  const valNumber = new BigNumber(value)

  return (
    <Modal title={t('Confirm NFT Casting')} onDismiss={onDismiss}>
      <Text>{t('Your par value will be locked randomly from 30-90 days')}</Text>
      <ModalActions>
        <Button variant="secondary" onClick={onDismiss} width="100%" disabled={pendingTx}>
          {t('Cancel')}
        </Button>
        <Button
          disabled={pendingTx || !valNumber.isFinite() || valNumber.eq(0)}
          onClick={async () => {
            onConfirm()
            onDismiss()
          }}
          width="100%"
        >
          {pendingTx ? t('Confirming') : t('Confirm')}
        </Button>
      </ModalActions>
    </Modal>
  )
}

export default CastConfirmModal
