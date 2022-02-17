import React, { useMemo } from 'react'
import { Link } from 'react-router-dom'
import { Box, Flex, Skeleton, Text, useMatchBreakpoints, Button } from '@pancakeswap/uikit'
import styled from 'styled-components'
import { useTranslation } from 'contexts/Localization'
import { NFTTrade } from '../../types'

const ResponsiveGrid = styled.div`
  display: grid;
  grid-gap: 1em;
  align-items: center;

  padding: 0 24px;

  grid-template-columns: 20px repeat(4, 1fr);

  @media screen and (max-width: 900px) {
    grid-template-columns: 20px repeat(4, 1fr);
    & :nth-child(4) {
      display: none;
    }
  }

  @media screen and (max-width: 800px) {
    grid-template-columns: 20px repeat(3, 1fr);
    & :nth-child(6) {
      display: none;
    }
  }

  @media screen and (max-width: 670px) {
    grid-template-columns: 1fr 1fr;
    > *:first-child {
      display: none;
    }
    > *:nth-child(3) {
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
  background-color: ${({ theme }) => theme.card.background};
  border-radius: ${({ theme }) => theme.radii.card};
  border: 1px solid ${({ theme }) => theme.colors.cardBorder};
`

export const Break = styled.div`
  height: 1px;
  background-color: ${({ theme }) => theme.colors.cardBorder};
  width: 100%;
`

const TableLoader: React.FC = () => {
    const loadingRow = (
        <ResponsiveGrid>
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
      </>
    )
}

const DataRow: React.FC<{ 
    trade: NFTTrade
    index: number
}> = ({ trade, index }) => {
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
            res = t('Running')
            break
        case 2:
            res = t('Finished')
            break
        default: 
            res = t('Not Running')
            break
        }

        return res
    }, [trade, t])
    return (
        <ResponsiveGrid>
            <Flex>
                <Text>{index + 1}</Text>
            </Flex>
            <Flex alignItems="center">
                <Text>#{trade.gego.id}</Text>
            </Flex>
            <Text>
                {trade.price} {symbol}
            </Text>
            <Text>
                {statusText}
            </Text>
            <Flex alignItems="center" flexWrap="wrap">
                <Button scale="sm" as={Link} to={`/nft-marketplace/market/${trade.listingId}`}>
                    {t('Details')}
                </Button>
            </Flex>
        </ResponsiveGrid>
    )
  }

const TradeTable:React.FC<{
    trades: NFTTrade[]
}> = ({trades}) => {

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
                    {t('Start Price')}
                </ClickableColumnHeader>
                <ClickableColumnHeader
                    color="secondary"
                    fontSize="12px"
                    bold
                    textTransform="uppercase"
                >
                    {t('Lasted Price')}
                </ClickableColumnHeader>
                <ClickableColumnHeader
                    color="secondary"
                    fontSize="12px"
                    bold
                    textTransform="uppercase"
                >
                    {t('Status')}
                </ClickableColumnHeader>
                <ClickableColumnHeader
                    color="secondary"
                    fontSize="12px"
                    bold
                    textTransform="uppercase"
                >
                    {t('Action')}
                </ClickableColumnHeader>
            </ResponsiveGrid>
            <Break />
            { trades.length > 0 ? (
                <>
                    {trades.map((trade, i) => {
                        return (
                            <React.Fragment key={trade.id}>
                              <DataRow index={i} trade={trade} />
                              <Break />
                            </React.Fragment>
                        )
                    })}
                    <Box/>
                </>
            ) : (
                <>
                <TableLoader />
                <Box/>
                </>
            )}
        </TableWrapper>
    )
}

export default TradeTable;