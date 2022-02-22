import React, { useEffect, useMemo, useState } from 'react'
import { format } from 'date-fns'
import { Token } from '@pancakeswap/sdk'
import { Box, Flex, Heading, LinkExternal, Skeleton, Text } from '@pancakeswap/uikit'
import { AddressZero } from '@ethersproject/constants'
import styled from 'styled-components'
import { useTranslation } from 'contexts/Localization'
import { useToken } from 'hooks/Tokens'
import useRefresh from 'hooks/useRefresh'
import truncateHash from 'utils/truncateHash'
import { getBscScanLink } from 'utils'
import { getFullDisplayBalance } from 'utils/formatBalance'
import { getAuctionBids } from '../../hooks/getAuctionBids'
import { NFTAuction, NFTAuctionBid, NFTAuctionData } from '../../types'

const Wrapper = styled.div`
    flex: 1 1 100%;
    max-width: 100%;
    width: 100%;
    padding: 16px;
`


const ResponsiveGrid = styled.div`
  display: grid;
  grid-gap: 1em;
  align-items: center;

  padding: 0 24px;

  grid-template-columns: 2fr 2fr 2fr repeat(3, 1fr);

  @media screen and (max-width: 900px) {
    grid-template-columns: 2fr 2fr 2fr repeat(2, 1fr);
    & :nth-child(4) {
      display: none;
    }
  }

  @media screen and (max-width: 800px) {
    grid-template-columns: 2fr 2fr 2fr 1fr;
    & :nth-child(6) {
      display: none;
    }
  }

  @media screen and (max-width: 670px) {
    grid-template-columns: 1fr 1fr;
    > *:nth-child(2) {
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
  border-radius: 12px;
  border: 1px solid ${({ theme }) => theme.colors.cardBorder};
`

export const Break = styled.div`
  height: 1px;
  width: 100%;
  background-color: ${({ theme }) => theme.colors.cardBorder};
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
    auction: NFTAuctionData
    bid: NFTAuctionBid
    useEth: boolean
    payToken?: Token
}> = ({ auction, bid, useEth, payToken }) => {
    const priceText = useMemo(() => {
        if (useEth) {
            return `${bid.price} BNB`
        }
        if (payToken) {
            return `${bid.price} ${payToken.symbol}`
        }
        return ''
    }, [useEth, payToken, bid])
    const profitText = useMemo(() => {
        if (useEth) {
            return `${bid.profit} BNB`
        }
        if (payToken) {
            return `${bid.profit} ${payToken.symbol}`
        }
        return ''
    }, [useEth, payToken, bid])
    const statusText = useMemo(() => {
        if (auction.lastBidder === AddressZero)
            return 'Out'

        const auctionPrice = getFullDisplayBalance(auction.lastPrice, payToken ? payToken.decimals: 18 )
        if (auction.lastBidder?.toLowerCase() === bid.bidder && auctionPrice && bid.price === parseFloat(auctionPrice)) {
            if (auction.startedAt + auction.duration > new Date().getTime() / 1000) {
                return '-'
            }
            return 'In'
        }

        return 'Out'
    }, [bid, auction, payToken])
    return (
        <ResponsiveGrid>
            <Flex alignItems="center">
                <LinkExternal href={getBscScanLink(bid.bidder, 'address')}>{truncateHash(bid.bidder)}</LinkExternal>
            </Flex>
            <Flex alignItems="center">
                <LinkExternal href={getBscScanLink(bid.txid, 'transaction')}>{truncateHash(bid.txid)}</LinkExternal>
            </Flex>
            <Flex alignItems="center">
                <Text>{format(bid.creationTime * 1000, 'MM/dd/yy h:mm a')}</Text>
            </Flex>
            <Flex alignItems="center">
                <Text>{priceText}</Text>
            </Flex>
            <Flex alignItems="center">
                <Text>{profitText}</Text>
            </Flex>
            <Flex alignItems="center">
                <Text>{statusText}</Text>
            </Flex>
        </ResponsiveGrid>
    )
}

interface BidsSectionProps {
    auction?: NFTAuctionData,
    account?: string
}

const BidsSection: React.FC<BidsSectionProps> = ({auction}) => {

    const { t } = useTranslation()

    const { slowRefresh } = useRefresh()
    const [loaded, setLoaded] = useState(false)
    const useEth = auction.payToken === AddressZero
    const payToken = useToken(useEth ? null : auction.payToken)
    const [bids, setBids] = useState<NFTAuctionBid[]>([])

    useEffect(() => {
        const loadBids = async() => {
            try {
                const bids_ = await getAuctionBids(auction.id)
                setBids(bids_)
            } finally {
                setLoaded(true)
            }
        }

        loadBids()
    }, [auction, slowRefresh])

    return (
        <Wrapper>
            <Flex flexDirection="column">
                <Heading mb="8px">
                    {t('Bid History')}
                </Heading>
                <TableWrapper>
                    <ResponsiveGrid>
                        <ClickableColumnHeader
                            color="secondary"
                            fontSize="12px"
                            bold
                            textTransform="uppercase"
                        >
                            {t('Address')}
                        </ClickableColumnHeader>
                        <ClickableColumnHeader
                            color="secondary"
                            fontSize="12px"
                            bold
                            textTransform="uppercase"
                        >
                            {t('Hash')}
                        </ClickableColumnHeader>
                        <ClickableColumnHeader
                            color="secondary"
                            fontSize="12px"
                            bold
                            textTransform="uppercase"
                        >
                            {t('Auction Time')}
                        </ClickableColumnHeader>
                        <ClickableColumnHeader
                            color="secondary"
                            fontSize="12px"
                            bold
                            textTransform="uppercase"
                        >
                            {t('Auction Bid')}
                        </ClickableColumnHeader>
                        <ClickableColumnHeader
                            color="secondary"
                            fontSize="12px"
                            bold
                            textTransform="uppercase"
                        >
                            {t('Profit')}
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
                    { loaded ? (
                        <>
                        {
                            bids && bids.length > 0 ? bids.map((bid, index) => {
                                return (
                                <React.Fragment key={bid.id}>
                                    {index > 0 && (
                                    <Break />
                                    )}
                                    <DataRow bid={bid} useEth={useEth} payToken={payToken} auction={auction}/>
                                </React.Fragment>
                                )
                            }) : (
                                <Flex flexDirection="column" justifyContent="center" alignItems="center" minHeight="200px">
                                    <Text>{t('No Records Found')}</Text>
                                </Flex>
                            )
                        }
                        <Box/>
                        </>
                    ) 
                    : 
                    (
                        <>
                        <TableLoader />
                        <Box/>
                        </>
                    )}
                </TableWrapper>
            </Flex>
        </Wrapper>
    )
}

export default BidsSection