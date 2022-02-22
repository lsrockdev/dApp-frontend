import React, { useMemo } from 'react'
import { Link } from 'react-router-dom'
import { Box, Flex, Skeleton, Text, useMatchBreakpoints, LinkExternal } from '@pancakeswap/uikit'
import styled from 'styled-components'
import truncateHash from 'utils/truncateHash'
import { getBscScanLink } from 'utils'
import { useTranslation } from 'contexts/Localization'
import { NFTTrade } from '../../types'

const ResponsiveGrid = styled.div`
  display: grid;
  grid-gap: 1em;
  align-items: center;

  padding: 0 24px;

  grid-template-columns: 20px repeat(5, 1fr);

  @media screen and (max-width: 900px) {
  }

  @media screen and (max-width: 800px) {
    grid-template-columns: 20px repeat(4, 1fr);
    > *:nth-child(3) {
      display: none;
    }
  }

  @media screen and (max-width: 670px) {
    grid-template-columns: 1fr 1fr;
    > *:first-child {
      display: none;
    }
    > *:nth-child(4) {
      display: none;
    }
    > *:nth-child(5) {
      display: none;
    }
  }
`
export const ClickableColumnHeader = styled(Text)`
  cursor: pointer;
`

export const TableWrapper = styled(Flex)`
  width: 100%;
  padding-top: 16px;
  flex-direction: column;
  gap: 16px;
  border-radius: ${({ theme }) => theme.radii.card};
  border: 1px solid ${({ theme }) => theme.colors.cardBorder};
`

export const Break = styled.div`
  height: 1px;
  background-color: ${({ theme }) => theme.colors.cardBorder};
  width: 100%;
`

const LinkWrapper = styled(Link)`
  text-decoration: none;
  :hover {
    cursor: pointer;
    opacity: 0.7;
  }
`

const TableLoader: React.FC = () => {
    const loadingRow = (
        <ResponsiveGrid>
            <Skeleton/>
            <Skeleton/>
            <Skeleton/>
            <Skeleton/>
            <Skeleton/>
            <Skeleton/>
        </ResponsiveGrid>
    )
    return (
      <>
        {loadingRow}
        {loadingRow}
        {loadingRow}
        {loadingRow}
        {loadingRow}
        {loadingRow}
      </>
    )
}

const DataRow: React.FC<{ 
    trade: NFTTrade
    index: number
    account?: string
}> = ({ trade, index, account }) => {
    const { isXs, isSm } = useMatchBreakpoints()
    const { t } = useTranslation()
    const useEth = !trade.payToken
    const symbol = useMemo(() => {
        return useEth ? 'BNB' : trade.payToken.symbol
    }, [useEth, trade])

    const statusText = useMemo(() => {
        let res = 'Not Running'
        switch (trade.status) {
        case 0:
            res = t('Canceled')
            break
        case 1:
            res = t('Active')
            break
        case 2:
            res = trade.seller === account.toLowerCase() ? t('Sold') : t('Purchased')
            break
        default: 
            res = t('Inactive')
            break
        }

        return res
    }, [trade, t, account])
    return (
        <LinkWrapper to={`/nft-marketplace/market/${trade.listingId}`}>
            <ResponsiveGrid>
                <Flex>
                    <Text>{index + 1}</Text>
                </Flex>
                <Flex alignItems="center">
                    <Text>#{trade.gego.id}</Text>
                </Flex>
                <Flex alignItems="center">
                    <Text>{trade.seller ? truncateHash(trade.seller) : '-'}</Text>
                </Flex>
                <Flex alignItems="center">
                    <Text>{trade.purchaser ? truncateHash(trade.purchaser) : '-'}</Text>
                </Flex>
                <Text>
                    {trade.price} {symbol}
                </Text>
                <Text>
                    {statusText}
                </Text>
            </ResponsiveGrid>
        </LinkWrapper>
    )
  }

const TradeTable:React.FC<{
    trades: NFTTrade[]
    loading: boolean
    account?: string
}> = ({trades, loading, account}) => {

    const { t } = useTranslation()

    return (
        <TableWrapper>
            <ResponsiveGrid>
                <Text color="secondary" fontSize="12px" bold>
                    #
                </Text>
                <ClickableColumnHeader
                    color="secondary"
                    fontSize="12px"
                    bold
                    textTransform="uppercase"
                >
                    {t('NFT')}
                </ClickableColumnHeader>
                <ClickableColumnHeader
                    color="secondary"
                    fontSize="12px"
                    bold
                    textTransform="uppercase"
                >
                    {t('Seller')}
                </ClickableColumnHeader>
                <ClickableColumnHeader
                    color="secondary"
                    fontSize="12px"
                    bold
                    textTransform="uppercase"
                >
                    {t('Purchaser')}
                </ClickableColumnHeader>
                <ClickableColumnHeader
                    color="secondary"
                    fontSize="12px"
                    bold
                    textTransform="uppercase"
                >
                    {t('Sale Price')}
                </ClickableColumnHeader>
                <ClickableColumnHeader
                    color="secondary"
                    fontSize="12px"
                    bold
                    textTransform="uppercase"
                >
                    {t('Status')}
                </ClickableColumnHeader>
            </ResponsiveGrid>
            <Break />
            { loading ? (
                <>
                <TableLoader />
                <Box/>
                </>
            )
            : trades && trades.length > 0 ?
            (
                <>
                    {trades.map((trade, i) => {
                        return (
                            <React.Fragment key={trade.id}>
                                { i > 0 && (
                                    <Break />
                                )}
                                <DataRow index={i} trade={trade} account={account}/>
                            </React.Fragment>
                        )
                    })}
                    <Box/>
                </>
            ) : (
                <>
                <Flex justifyContent="center" alignItems="center" height="200px">
                    <Text>No Records Found</Text>
                </Flex>
                <Box/>
                </>
            )}
        </TableWrapper>
    )
}

export default TradeTable;