import React, { useCallback, useEffect, useMemo, useState } from 'react'
import styled from 'styled-components'
import BigNumber from 'bignumber.js'
import { Flex, Heading, Text, Button, useModal } from '@pancakeswap/uikit'
import ConnectWalletButton from 'components/ConnectWalletButton'
import { ModalActions } from 'components/Modal'
import { useTranslation } from 'contexts/Localization'
import tokens from 'config/constants/tokens'
import useTokenBalance,  { FetchStatus } from 'hooks/useTokenBalance'
import { useERC20 } from 'hooks/useContract'
import useToast from 'hooks/useToast'
import { useAppDispatch } from 'state'
import { DeserializedNFTGego } from 'state/types'
import { useNFTCastAllowance } from 'state/nft/hooks'
import { fetchNFTUserBalanceDataAsync, fetchNFTUserDataAsync } from 'state/nft'
import { getFullDisplayBalance } from 'utils/formatBalance'
import { getNFTMintroxyAddress } from 'utils/addressHelpers'
import SPYInput from '../SPYInput'
import useApproveCastNFT from '../../hooks/useApproveCastNFT'
import useCastNFT from '../../hooks/useCastNFT'
import CastConfirmModal from './CastConfirmModal'
import CastedModal from './CastedModal'

const Wrapper = styled.div`
    flex: 1 1 0;
    max-width: 100%;
    min-width: 100%;
    width: 100%;
    padding: 16px;
    ${({ theme }) => theme.mediaQueries.md} {
        max-width: 50%;
        min-width: 50%;
    }
`

const Group = styled(Flex)`
    padding: 24px;
    border-radius: 12px;
    height: 100%;
    border: 1px solid ${({ theme }) => theme.colors.cardBorder};
`

const BalanceWrapper = styled(Flex)`
    margin: 12px 0px 36px 0px;
    padding: 12px;
    border-radius: 12px;
    border: 1px solid ${({ theme }) => theme.colors.cardBorder};
`

const SpyInputWrapper = styled.div `{
  padding: 12px;
}`
const ModalActionsWrapper = styled.div `{
  padding: 12px;
}`


interface CastNFTProps {
    account: string
  }

const CastNFT: React.FC<CastNFTProps> = ({account}) => {
    const { t } = useTranslation()
    const { toastError } = useToast()
    const [val, setVal] = useState('')
    const [castedNFT, setCastedNFT] = useState<DeserializedNFTGego|null>(null)
    const dispatch = useAppDispatch()
    const [requestedApproval, setRequestedApproval] = useState(false)
    const [pendingTx, setPendingTx] = useState(false)
    const { balance: userBalance, fetchStatus: userBalanceFetchStatus } = useTokenBalance(tokens.spy.address)
    const castNFTAllowance = useNFTCastAllowance()
    const { balance: spyBalance, fetchStatus: spyFetchStatus } = useTokenBalance(tokens.spy.address)

    const isApproved = account && castNFTAllowance && castNFTAllowance.isGreaterThan(0);

    const valNumber = useMemo(() => {
        return new BigNumber(val)
      }, [val])

    const handleChange = useCallback(
        (value: string) => {
        setVal(value)
        },
        [setVal],
    )

    const spyToken = useERC20(tokens.spy.address)
    const { onApprove } = useApproveCastNFT(spyToken, getNFTMintroxyAddress())
    const { onCastNFT } = useCastNFT()

    const handleApprove = useCallback(async() => {
        try {
            setRequestedApproval(true)
            await onApprove()
            dispatch(fetchNFTUserDataAsync({account}))
          } catch (e) {
            toastError(t('Error'), t('Please try again. Confirm the transaction and make sure you are paying enough gas!'))
            console.error(e)
          } finally {
            setRequestedApproval(false)
          }
    }, [onApprove, toastError, t, dispatch, account])

    const handleCastNFT = useCallback(async() => {

        try {
            setPendingTx(true)
            const nft = await onCastNFT(val)
            if (nft) {
              setCastedNFT(nft)
              dispatch(fetchNFTUserBalanceDataAsync({account}))
            }
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
    }, [onCastNFT, toastError, t, dispatch, account, val])

    const handleCastedModalDismiss = useCallback(() => {
      setCastedNFT(null);
    }, [setCastedNFT])

    
    const [onPresentCastConfrimModal] = useModal(
      <CastConfirmModal value={val} onConfirm={handleCastNFT}/>
    )
    
    const [onPresentCastedModal] = useModal(
      <CastedModal gego={castedNFT} customOnDismiss={handleCastedModalDismiss}/>,
      false,
      true,
      "CastedNFTModal"
    )

    useEffect(() => {
      if (castedNFT) {
        onPresentCastedModal()
      }
      // exhaustive deps disabled as the useModal dep causes re-render loop
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [castedNFT])

    const renderApprovalOrCastButton = () => {
        return isApproved ? (
          <Button
            disabled={pendingTx || !valNumber.isFinite() || valNumber.eq(0) || valNumber.gt(userBalance)}
            onClick={onPresentCastConfrimModal}
            width="100%"
          >
            {pendingTx ? t('Processing...') : t('Cast NFTs')}
          </Button>
        ) : (
          <Button mt="8px" width="100%" disabled={requestedApproval} onClick={handleApprove}>
            {t('Enable Contract')}
          </Button>
        )
      }
    return (
        <>
            <Wrapper>
                <Group flexDirection="column">
                    <Heading padding="12px 0px 12px 2px">{t('Cast NFTs')}</Heading>

                    <Text padding="12px 0px">
                    {t("We're introducing Crypto NFTs as a new feature. Users can mint NFTs with unique characteristics and different rarities(by depositing SPY tokens) then stake it in the NFT Pools to generate rewards. Issue, trade NFTs and participate in auctions!")}
                    </Text>

                    <BalanceWrapper flexDirection={["column", "column", "row"]}>
                        <Flex flexDirection="column" flex="1">
                            <Text>Available balance</Text>
                            { account && spyFetchStatus === FetchStatus.SUCCESS ? (
                              <Text>{getFullDisplayBalance(spyBalance, 0, 0)} SPY</Text>
                            ) : (
                              <Text> - </Text>
                            )}
                            
                        </Flex>
                        <Flex style={{width:'fit-content'}}>
                            <Button mt="8px" width="100%" style={{whiteSpace:'nowrap'}}
                              as="a" href={`/swap?outputCurrency=${tokens.spy.address}`}>
                                {t('Buy SPY')}
                            </Button>
                        </Flex>
                        
                    </BalanceWrapper>
                    <SPYInput
                        enabled
                        value={val}
                        max="277777"
                        symbol="CROW"
                        onChange={handleChange}
                    />
                    <ModalActions>
                    {!account ? <ConnectWalletButton mt="8px" width="100%" /> : renderApprovalOrCastButton()}
                    </ModalActions>
                </Group>
                
            </Wrapper>
        
        </>
    )
}

export default CastNFT