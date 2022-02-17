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
import useInterval from 'hooks/useInterval';
import SellNFTModal from 'views/NftMarketplace/components/SellNFTModal/SellNFTModal';
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

const Countdown = styled(Text)`
  position: absolute;
  display: flex;
  background: rgba(0,0,0,.8);
  color: white;
  font-size: 14px;
  font-weight: bold;
  font-family: monospace,sans-serif;
  bottom: 5%;
  right: 10%;
  padding: 4px 8px;
  border-radius: 8px;
`

const GradeImageWrapper = styled.div`
  position: relative;
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
  const { toastError, toastInfo } = useToast()
  const gradeConfig = nftGrades.find((c) => c.level === gego.grade)
  const [requestedNFTFactoryApproval, setRequestedNFTFactoryApproval] = useState(false)
  const [pendingTx, setPendingTx] = useState(false)
  const nftContract = useSpyNFT(tokens.spynft.address)

  const [countdown, setCountdown] = useState('')

  useInterval(() => {
    
    if (gego) {
      const target = gego.createdTime + gego.lockedDays * 86400
      const now = Math.floor(new Date().getTime() / 1000);
      const diffTime = target - now;
      if (diffTime > 0) {
        const duration = diffTime;
        const day = Math.floor(duration / 86400);
        const hour = Math.floor((duration % 86400) / 3600);
        const min = Math.floor((duration % 3600) / 60);
        const sec = duration % 60;

        const dayS = day < 10 ? `0${day}`:`${day}`;
        const hourS = hour < 10 ? `0${hour}`:`${hour}`;
        const minS = min < 10 ? `0${min}`:`${min}`;
        const secS = sec < 10 ? `0${sec}`:`${sec}`;
        setCountdown(`${dayS}:${hourS}:${minS}:${secS}`);
      } else {
        setCountdown('');
      }
    } else {
      setCountdown('');
    }
  }, 1000)

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

  const [onPresentSellNFTModal] = useModal(
    <SellNFTModal gego={gego} account={account} />
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

            { countdown !== '' && (
              <Countdown>
                {countdown}
              </Countdown>
            )}
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
          <Button scale="sm" ml="8px" width="100%" disabled={gego.staked} onClick={onPresentSellNFTModal}>
            {t('Sell')}
          </Button>
        </Flex>
      </CardInnerContainer>
    </StyledCard>
  )
}

export default NFTCard
