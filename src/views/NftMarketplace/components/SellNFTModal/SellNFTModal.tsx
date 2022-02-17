import React, { useCallback, useMemo, useState } from 'react'
import styled from 'styled-components'
import { Button, Modal, Heading, Flex, Text, InjectedModalProps, ModalHeader, ModalTitle, ModalCloseButton, ModalContainer, ModalBody, ModalBackButton } from '@pancakeswap/uikit'
import { nftGrades } from 'config/constants/nft';
import tokens from 'config/constants/tokens';
import { NFTGradeConfig } from 'config/constants/nft/types';
import { ModalActions } from 'components/Modal'
import { useTranslation } from 'contexts/Localization'
import { useAppDispatch } from 'state';
import { DeserializedNFTGego } from 'state/types'
import { fetchNFTAllowancesAsync, fetchNFTUserBalanceDataAsync } from 'state/nft';
import { useNFTRewardAllowance, useOldNFTRewardAllowance } from 'state/nft/hooks';
import { BIG_TEN } from 'utils/bigNumber';
import { useSpyNFT } from 'hooks/useContract';
import useToast from 'hooks/useToast';
import Dots from 'components/Loader/Dots';
import NFTSelector from 'views/Nfts/components/NFTSelector';
import NFTGradeRow from 'views/Nfts/components/NFTGradeRow';
import useApproveMarketplace from '../../hooks/useApproveMarketplace';
import AuctionSection from './AuctionSection';
import MarketSection from './MarketSection';

enum ViewMode {
  FIRST,
  LIST,
  AUCTION,
  SELL
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

const TabButton = styled(Button)<{ active: boolean }>`
  ${({ active, theme }) =>
    active ?
    `
      color: ${theme.colors.primary}
    `
    :
    `
      color: ${theme.colors.primary};
      opacity: 0.3;
    `
  }
`

interface StakeNFTModalProps {
  gego?: DeserializedNFTGego
  gegos?: DeserializedNFTGego[]
  account: string
}

const SellNFTModal: React.FC<InjectedModalProps & StakeNFTModalProps> = ({ account, gego, gegos, onDismiss }) => {
  const { t } = useTranslation()
  const [viewMode, setViewMode] = useState<ViewMode>(ViewMode.FIRST)
  const [selectedGego, setSelectedGego] = useState(gego || (gegos && gegos.length > 0 ? gegos[0]: null))

  return (
    <StyledModalContainer minWidth="320px">
      <ModalHeader>
        <ModalTitle>
          { viewMode === ViewMode.FIRST ? (
            <>
            <Heading>{t('Sell NFT')}</Heading>
            </>
          )
          : viewMode === ViewMode.LIST ?
          (
            <>
            <ModalBackButton onBack={() => setViewMode(ViewMode.FIRST)} />
            <Heading>{t('Choose a NFT card')}</Heading>
            </>
          )
          : 
          (
            <>
            <TabButton variant="text" active={viewMode === ViewMode.AUCTION} onClick={() => setViewMode(ViewMode.AUCTION)}>
              {t('Auction')}
            </TabButton>
            <Text>|</Text>
            <TabButton variant="text" active={viewMode === ViewMode.SELL} onClick={() => setViewMode(ViewMode.SELL)}>
              {t('Sell')}
            </TabButton>
            </>
          )}
        </ModalTitle>
        <ModalCloseButton onDismiss={onDismiss} />
      </ModalHeader>
      <StyledModalBody>
          { viewMode === ViewMode.FIRST ? (
            <>
            <NFTGradeRow gego={selectedGego} spyDecimals={tokens.spy.decimals} onSelect={() => setViewMode(ViewMode.LIST)} selectable={gegos && gegos.length > 0} />
            <ModalActions>
              <Button scale="md" variant="secondary" onClick={onDismiss} width="100%">
                {t('Cancel')}
              </Button>
              <Button scale="md" variant="primary" onClick={() => {
                setViewMode(ViewMode.SELL)
              }} width="100%">
                {t('Sell')}
              </Button>
            </ModalActions>
            </>
          )
          : viewMode === ViewMode.LIST ?
          (
            <>
            <NFTSelector gegos={gegos} onSelect={(g) => {
              setSelectedGego(g)
              setViewMode(ViewMode.FIRST)
            }} />
            </>
          )
          : viewMode === ViewMode.SELL ?
          (
            <MarketSection gego={selectedGego} account={account} onDismiss={onDismiss}/>
          )
          :
          (
            <AuctionSection gego={selectedGego} account={account} onDismiss={onDismiss}/>
          )}
      </StyledModalBody>
    </StyledModalContainer>
  )
}

export default SellNFTModal
