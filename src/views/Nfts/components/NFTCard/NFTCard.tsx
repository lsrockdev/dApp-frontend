import React, { useCallback, useState } from 'react'
import styled from 'styled-components'
import { Card, Flex, Heading, Text, Button, useModal } from '@pancakeswap/uikit';
import { nftGrades } from 'config/constants/nft';
import tokens from 'config/constants/tokens';
import { useAppDispatch } from 'state';
import { DeserializedNFTGego } from 'state/types';
import { fetchNFTAllowancesAsync } from 'state/nft';
import { useTranslation } from 'contexts/Localization';
import { getFullDisplayBalance } from 'utils/formatBalance';
import { BIG_TEN } from 'utils/bigNumber';
import useToast from 'hooks/useToast';
import { useSpyNFT } from 'hooks/useContract';
import useApproveNFTFactory from '../../hooks/useApproveNFTFactory';
import StakeNFTModal from '../StakeNFTModal';
import UnstakeNFTModal from '../UnstakeNFTModal';
import DecomposeNFTModal from '../DecomposeNFTModal';

const StyledCard = styled(Card)`
  align-self: baseline;
`

const CardInnerContainer = styled(Flex)`
  flex-direction: column;
  padding: 24px;
`

const GradeImageWrapper = styled.div`
`

interface NFTCardProps {
  account?: string
  gego?: DeserializedNFTGego
  factoryAllowed?: boolean,
  generalRewardAllowed?: boolean
}

const NFTCard: React.FC<NFTCardProps> = ({account, gego, factoryAllowed, generalRewardAllowed}) => {
  const { t } = useTranslation()
  const dispatch = useAppDispatch()
  const { toastError } = useToast()
  const gradeConfig = nftGrades.find((c) => c.level === gego.grade)
  const [requestedNFTFactoryApproval, setRequestedNFTFactoryApproval] = useState(false)
  const [pendingTx, setPendingTx] = useState(false)
  const nftContract = useSpyNFT(tokens.spynft.address)

  const isNFTFactoryApproved = account && factoryAllowed;

  const { onApprove } = useApproveNFTFactory(nftContract)

  const [onPresentUnstkeModal] = useModal(
    <UnstakeNFTModal gego={gego} account={account} />
  )
    
  const [onPresentStakeNFTModal] = useModal(
    <StakeNFTModal gego={gego} account={account}/>
  )

  const [onPresentDecomposeNFTModal] = useModal(
    <DecomposeNFTModal gego={gego} account={account} />
  )

  const handleApproveNFTFactory = useCallback(async() => {
    try {
        setRequestedNFTFactoryApproval(true)
        await onApprove()
        dispatch(fetchNFTAllowancesAsync({account}))
      } catch (e) {
        toastError(t('Error'), t('Please try again. Confirm the transaction and make sure you are paying enough gas!'))
        console.error(e)
      } finally {
        setRequestedNFTFactoryApproval(false)
      }
  }, [onApprove, toastError, t, dispatch, account])

  const renderApprovalOrDecomposeButton = () => {
    return isNFTFactoryApproved ? (
      <Button
        scale="sm"
        disabled={gego.staked || gego.createdTime + gego.lockedDays * 86400 > Date.now() / 1000}
        width="100%"
        onClick={onPresentDecomposeNFTModal}
      >
        {pendingTx ? t('Decomposing...') : t('Decompose')}
      </Button>
    ) : (
      <Button scale="sm" mt="8px" width="100%" disabled={requestedNFTFactoryApproval} onClick={handleApproveNFTFactory}>
        {t('Approve SPY NFT')}
      </Button>
    )
  }

  return (
    <StyledCard>
      <CardInnerContainer>
        { gradeConfig && (
          <GradeImageWrapper>
            <img src={`/images/nft/${gradeConfig.image}`} alt={gradeConfig.grade}/>
          </GradeImageWrapper>
        )}

        <Heading mt="16px">
          #{gego.id}
        </Heading>
        <Flex justifyContent="space-between" mt="8px">
          <Text>{t('Par Value')}</Text>
          <Text textAlign="right">{getFullDisplayBalance(gego.amount, tokens.spy.decimals)} SPY</Text>
        </Flex>
        <Flex justifyContent="space-between" mt="8px">
          <Text>{t('Mining Power')}</Text>
          <Text textAlign="right">{gego.efficiency.multipliedBy(gego.amount).div(BIG_TEN.pow(tokens.spy.decimals)).div(100000).toFixed(2)} SPY</Text>
        </Flex>
        <Flex justifyContent="space-between"  mt="8px" mb="8px">
          <Text>{t('Mining Efficiency')}</Text>
          <Text textAlign="right">{gego.efficiency.div(1000).toFixed(2)}</Text>
        </Flex>
        {
          renderApprovalOrDecomposeButton()
        }
        <Flex mt="8px">
          { !gego.staked ? (
            <Button variant="secondary" scale="sm" mr="8px" width="100%" onClick={onPresentStakeNFTModal}>
              {t('Stake')}
            </Button>
          ) : (
            <Button variant="secondary" scale="sm" mr="8px" width="100%" onClick={onPresentUnstkeModal}>
              {t('Unstake')}
            </Button>
          )}
          <Button scale="sm" ml="8px" width="100%">
            {t('Sell')}
          </Button>
        </Flex>
      </CardInnerContainer>
    </StyledCard>
  )
}

export default NFTCard
