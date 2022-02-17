import React, { useState, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { AddressZero } from '@ethersproject/constants'
import { Box, Flex, Skeleton, Text, useMatchBreakpoints, Button } from '@pancakeswap/uikit'
import styled from 'styled-components'
import { useTranslation } from 'contexts/Localization'
import { NFTAuction, NFTAuctionStatus } from '../../types'

const ResponsiveGrid = styled.div`
  display: grid;
  grid-gap: 1em;
  align-items: center;

  padding: 0 24px;

  grid-template-columns: 20px repeat(5, 1fr);

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
    auction: NFTAuction
    index: number
}> = ({ auction, index }) => {
    const { isXs, isSm } = useMatchBreakpoints()
    const { t } = useTranslation()
    const useEth = !auction.payToken
    const symbol = useMemo(() => {
        return useEth ? 'BNB' : auction.payToken.symbol
    }, [useEth, auction])

    const status = useMemo(() => {
        if (auction.status === 3) {
            return NFTAuctionStatus.CANCELED
        }
        if (auction.status === 2) {
            return NFTAuctionStatus.FINISHED
        }
        if (auction.status === 0) {
            return NFTAuctionStatus.CANCELED
        }
        if (auction.endAt > Math.floor(new Date().getTime() / 1000)) {
            return NFTAuctionStatus.RUNNING
        }

        if (auction.lastBidder === AddressZero) {
            return NFTAuctionStatus.FAILED
        }

        return NFTAuctionStatus.DEALED
    }, [auction])


    const statusText = useMemo(() => {
        let res = 'Not Running'
        switch (status) {
        case NFTAuctionStatus.FINISHED:
            res = t('Finished')
            break
        case NFTAuctionStatus.CANCELED:
            res = t('Canceled')
            break
        case NFTAuctionStatus.RUNNING:
            res = t('Ongoing')
            break
        case NFTAuctionStatus.DEALED:
            res = t('Dealed')
            break
        case NFTAuctionStatus.FAILED:
            res = t('Failed')
            break
        default: 
            res = t('Not Running')
            break
        }

        return res
    }, [status, t])
    return (
        <ResponsiveGrid>
            <Flex>
                <Text>{index + 1}</Text>
            </Flex>
            <Flex alignItems="center">
                <Text>#{auction.gego.id}</Text>
            </Flex>
            <Text>
                {auction.startingPrice} {symbol}
            </Text>
            <Text>
                {auction.lastPrice} {symbol}
            </Text>
            <Text>
                {statusText}
            </Text>
            <Flex alignItems="center" flexWrap="wrap">
                <Button scale="sm" as={Link} to={`/nft-marketplace/auction/${auction.auctionId}`}>
                    {t('Details')}
                </Button>
            </Flex>
        </ResponsiveGrid>
    )
  }

const SORT_FIELD = {
    name: 'name',
    timestamp: 'timestamp'
}
const MAX_ITEMS = 10
const AuctionTable:React.FC<{
    auctions: NFTAuction[]
}> = ({auctions}) => {

    const { t } = useTranslation()
    const [page, setPage] = useState(1)
    const [maxPage, setMaxPage] = useState(1)

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
            { auctions.length > 0 ? (
                <>
                    {auctions.map((auction, i) => {
                        return (
                            <React.Fragment key={auction.id}>
                              <DataRow index={i} auction={auction} />
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

export default AuctionTable;