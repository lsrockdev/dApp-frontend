import React, { useState, useCallback } from 'react'
import styled from 'styled-components'
import BigNumber from 'bignumber.js'
import { Button, Flex, HelpIcon, Text, useModal, useTooltip } from '@pancakeswap/uikit'
import { String } from 'lodash'
import { useTranslation } from 'contexts/Localization'
import useToast from 'hooks/useToast'
import { useDispatch } from 'react-redux'
import { useNFTBalances, useNFTPoolUserData, useNFTRewardAllowance, usePollNFTAllowanceData } from 'state/nft/hooks'
import { useSpyNFT } from 'hooks/useContract'
import tokens from 'config/constants/tokens'
import { fetchNFTAllowancesAsync } from 'state/nft'
import ConnectWalletButton from 'components/ConnectWalletButton'
import useApproveGeneralReward from '../../hooks/useApproveGeneralReward'
import HarvestAction from './HarvestAction'
import UnstakeNFTModal from '../UnstakeNFTModal'
import StakeNFTModal from '../StakeNFTModal'

const Action = styled.div`
  padding-top: 16px;
`

interface NFTCardActionsProps {
  account?: string
  earnings: BigNumber
  nextHarvestUntil?: number
}

const CardActions: React.FC<NFTCardActionsProps> = ({ account, earnings, nextHarvestUntil }) => {
  const { t } = useTranslation()
  const { toastError } = useToast()
  const [requestedApproval, setRequestedApproval] = useState(false)
  const nftBalances = useNFTBalances()
  const allowance = useNFTRewardAllowance()
  const isApproved = account && allowance
  const dispatch = useDispatch()

  const stakedBalances = nftBalances.filter((nft) => nft.staked)
  const unstakedBalances = nftBalances.filter((nft) => !nft.staked)

  const {
    targetRef: harvestRef,
    tooltip: harvestTooltip,
    tooltipVisible: harvestTooltipVisible,
  } = useTooltip(
    <>
      <Text>
        {t(
          'Harvest button is enabled only when your earnings is over 20 SPY',
        )}
      </Text>
    </>,
    { placement: 'top-end', tooltipOffset: [20, 10] },
  )


  
  const nftContract = useSpyNFT(tokens.spynft.address)
  const { onApproveGeneralReward: onApprove } = useApproveGeneralReward(nftContract)

  const [onPresentUnstkeModal] = useModal(
    <UnstakeNFTModal gegos={stakedBalances} account={account} />
  )
    
  const [onPresentStakeNFTModal] = useModal(
    <StakeNFTModal gegos={unstakedBalances} account={account}/>
  )

  const handleApprove = useCallback(async () => {
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
  }, [onApprove, dispatch, account, t, toastError])

  const renderApprovalOrStakeButton = () => {
    return isApproved ? (
      <Flex>
        <Button disabled={!stakedBalances || stakedBalances.length === 0} variant="secondary" mr="4px" width="100%" onClick={onPresentUnstkeModal}>
          {t('Unstake')}
        </Button>
        <Button disabled={!unstakedBalances || unstakedBalances.length === 0} variant="primary" ml="4px" width="100%" onClick={onPresentStakeNFTModal}>
          {t('Stake')}
        </Button>
      </Flex>
    ) : (
      <Button mt="8px" width="100%" disabled={requestedApproval} onClick={handleApprove}>
        {t('Enable Contract')}
      </Button>
    )
  }

  return (
    <Action>
      <Flex>
        <Text bold textTransform="uppercase" color="secondary" fontSize="12px" pr="4px">
          SPY
        </Text>
        <Text bold textTransform="uppercase" color="textSubtle" fontSize="12px" mr="8px">
          {t('Earned')}
        </Text>

        <span 
        ref={harvestRef}>
          <HelpIcon color="textSubtle" width="16px" height="16px" />
        </span>
      </Flex>
      { harvestTooltipVisible && harvestTooltip }
      <HarvestAction earnings={earnings} nextHarvestUntil={nextHarvestUntil} />
      {!account ? <ConnectWalletButton mt="8px" width="100%" /> : renderApprovalOrStakeButton()}
    </Action>
  )
}

export default CardActions
