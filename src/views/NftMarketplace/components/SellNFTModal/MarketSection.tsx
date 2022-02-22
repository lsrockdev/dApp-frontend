import React, { useCallback, useMemo, useState } from 'react'
import history from 'routerHistory'
import { Button, Flex, Radio, Text } from '@pancakeswap/uikit';
import { useAppDispatch } from 'state';
import BigNumber from 'bignumber.js';
import tokens from 'config/constants/tokens';
import { fetchNFTUserBalanceDataAsync } from 'state/nft';
import { DeserializedNFTGego } from 'state/types'
import styled from 'styled-components'
import { useTranslation } from 'contexts/Localization';
import Select, { OptionProps } from 'components/Select/Select';
import useToast from 'hooks/useToast';
import { BIG_TEN, BIG_ZERO } from 'utils/bigNumber';
import BaseSection from './BaseSection';
import { useListNFTAuction, useListNFTMarket } from '../../hooks/useListNFT';
import SPYInput from './SPYInput';


const GradeImageWrapper = styled.div`
  display:flex;
  align-items:center;
  justify-content:center;
  > img {
    width: 300px;
    max-width: calc(90vw - 120px);
  }

  ${({ theme }) => theme.mediaQueries.md} {
    > img {
      max-width: calc(100vw - 144px);
    }
  }
`

const RadioGroup = styled(Flex)`
  align-items: center;
  margin-right: 16px;
  margin-top: 8px;
  cursor: pointer;
`

interface MarketSectionProps {
  gego?: DeserializedNFTGego
  account?: string
  onDismiss?: () => void
}

const MarketSection: React.FC<MarketSectionProps> = ({ gego, account, onDismiss }) => {
  const dispatch = useAppDispatch()
  const { t } = useTranslation()
  const { toastError, toastSuccess } = useToast()
  const [pendingTx, setPendingTx] = useState(false)
  const [useToken, setUseToken] = useState(false)
  const [price, setPrice] = useState('')
  
  const priceNumber = useMemo(() => {
    const number = price && price.length > 0 ? new BigNumber(price) : BIG_ZERO
    return number.multipliedBy(BIG_TEN.pow(useToken ? tokens.spy.decimals : 18))
  }, [price, useToken])

  const { onListMarket } = useListNFTMarket()

  const isInputValid = useMemo(() => {
    return priceNumber && priceNumber.isFinite() && priceNumber.gt(BIG_ZERO)
  }, [priceNumber])

  const handleChangePrice = useCallback(
      (value: string) => {
      setPrice(value)
      },
      [setPrice],
  )
  const handleSell = useCallback(async() => {

    try {
      setPendingTx(true)
      const marketId = await onListMarket(useToken, gego.id, priceNumber.toString())
      dispatch(fetchNFTUserBalanceDataAsync({account}))
      toastSuccess(t('Success'), t('Your NFT #%id% has been listed on the market', {id: gego.id}))
      onDismiss()
      if (marketId) {
        history.push(`/nft-marketplace/market/${marketId}`)
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
  }, [onListMarket, onDismiss, toastError, toastSuccess, t, dispatch, account, gego, useToken, priceNumber])

  return (
    <BaseSection gego={gego} pendingTx={pendingTx} account={account} onDismiss={onDismiss} handleSell={handleSell} isInputValid={isInputValid}>
      <Flex flexDirection='row' justifyContent="center" margin="8px 0px">
        <RadioGroup onClick={() => setUseToken(false)}>
          <Radio onChange={() => null} scale="sm" checked={!useToken} />
          <Text ml="8px">{t('Sell with BNB')}</Text>
        </RadioGroup>

        <RadioGroup onClick={() => setUseToken(true)}>
          <Radio onChange={() => null} scale="sm" checked={useToken} />
          <Text ml="8px">{t('Sell with SPY')}</Text>
        </RadioGroup>
      </Flex>
      <Flex  margin="8px 0px" flexDirection="column">
        <SPYInput
          enabled
          value={price}
          symbol={useToken ? tokens.spy.symbol : "BNB"}
          onChange={handleChangePrice}
        />
      </Flex>
    </BaseSection>
  )
}

export default MarketSection
