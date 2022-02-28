import React, { useMemo } from 'react'
import { Box, Button, Flex, InjectedModalProps, LinkExternal, Message, Skeleton, Text, Link } from '@pancakeswap/uikit'
import { useWeb3React } from '@web3-react/core'
import useTokenBalance, { FetchStatus, useGetBnbBalance } from 'hooks/useTokenBalance'
import useAuth from 'hooks/useAuth'
import { useTranslation } from 'contexts/Localization'
import { getBscScanLink } from 'utils'
import { getFullDisplayBalance, formatBigNumber, getBalanceAmount } from 'utils/formatBalance'
import { BIG_ZERO } from 'utils/bigNumber'
import tokens from 'config/constants/tokens'
import { getLpTokenPrice, useFarms, usePollFarmsWithUserData, usePriceCakeBusd } from 'state/farms/hooks'
import { useNFTPoolUserData, usePollNFTPublicData } from 'state/nft/hooks'
import { BASE_URL } from 'config'
import CopyAddress from './CopyAddress'
 
interface WalletInfoProps {
  hasLowBnbBalance: boolean
  onDismiss: InjectedModalProps['onDismiss']
}

const WalletInfo: React.FC<WalletInfoProps> = ({ hasLowBnbBalance, onDismiss }) => {
  const { t } = useTranslation()
  const { account } = useWeb3React()
  const { balance, fetchStatus } = useGetBnbBalance()
  const { balance: spyBalance, fetchStatus: spyFetchStatus } = useTokenBalance(tokens.spy.address)
  const { logout } = useAuth()
  const cakePriceUsd = usePriceCakeBusd()

  const { data: farmsLP, userDataLoaded: farmsDataLoaded } = useFarms()
  const {balance: NFTBalance, earning: NFTEarning, userDataLoaded: NFTDataLoaded} = useNFTPoolUserData()

  usePollFarmsWithUserData()
  usePollNFTPublicData()

  const handleLogout = () => {
    onDismiss()
    logout()
  }

  const lockedBalance = useMemo(() => {
    if (!farmsDataLoaded || !NFTDataLoaded) {
      return BIG_ZERO
    }

    return farmsLP.reduce((accum, farm) => {
      if (!farm.userData || !farm.quoteTokenPriceBusd) {
        return accum
      }
      return accum.plus(getBalanceAmount(farm.userData.stakedBalance).times(getLpTokenPrice(farm)));
    }, BIG_ZERO).plus(NFTBalance.multipliedBy(cakePriceUsd))
  }, [farmsLP, farmsDataLoaded, NFTBalance, NFTDataLoaded, cakePriceUsd])

  const earnings = useMemo(() => {
    if (!farmsDataLoaded || !NFTDataLoaded) {
      return BIG_ZERO
    }

    return farmsLP.reduce((accum, farm) => {
      return farm.userData ? accum.plus(farm.userData.earnings) : BIG_ZERO;
    }, BIG_ZERO).plus(NFTEarning)
  }, [farmsLP, farmsDataLoaded, NFTEarning, NFTDataLoaded])
  

  return (
    <>
      <Text color="secondary" fontSize="12px" textTransform="uppercase" fontWeight="bold" mb="8px">
        {t('Your Address')}
      </Text>
      <CopyAddress account={account} mb="24px" />
      {hasLowBnbBalance && (
        <Message variant="warning" mb="24px">
          <Box>
            <Text fontWeight="bold">{t('BNB Balance Low')}</Text>
            <Text as="p">{t('You need BNB for transaction fees.')}</Text>
          </Box>
        </Message>
      )}
      <Flex alignItems="center" justifyContent="space-between">
        <Text color="textSubtle">{t('BNB Balance')}</Text>
        {fetchStatus !== FetchStatus.SUCCESS ? (
          <Skeleton height="22px" width="60px" />
        ) : (
          <Text>{formatBigNumber(balance, 6)}</Text>
        )}
      </Flex>
      <Flex alignItems="center" justifyContent="space-between">
        <Text color="textSubtle">{t('SPY Balance')}</Text>
        {spyFetchStatus !== FetchStatus.SUCCESS ? (
          <Skeleton height="22px" width="60px" />
        ) : (
          <Text>{getFullDisplayBalance(spyBalance, 0, 0)} SPY</Text>
        )}
      </Flex>
      <Flex alignItems="center" justifyContent="space-between">
        <Text color="textSubtle">{t('Locked Balance')}</Text>
        {!farmsDataLoaded || !NFTDataLoaded  ? (
          <Skeleton height="22px" width="60px" />
        ) : (
          <Text>${getFullDisplayBalance(lockedBalance, 0, 2)}</Text>
        )}
      </Flex>
      <Flex alignItems="center" justifyContent="space-between" mb="24px">
        <Text color="textSubtle">{t('SPY to Harvest')}</Text>
        {!farmsDataLoaded || !NFTDataLoaded  ? (
          <Skeleton height="22px" width="60px" />
        ) : (
          <Text>{getFullDisplayBalance(earnings, 0, 0)} SPY</Text>
        )}
      </Flex>
      <Flex alignItems="center" justifyContent="end" mb="24px">
        <LinkExternal href={getBscScanLink(account, 'address')}>{t('View on BscScan')}</LinkExternal>
      </Flex>
      <Button variant="secondary" width="100%" onClick={handleLogout}>
        {t('Disconnect Wallet')}
      </Button>
    </>
  )
}

export default WalletInfo
