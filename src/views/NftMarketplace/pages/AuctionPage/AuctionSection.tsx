import React, { useCallback, useMemo, useState } from 'react'
import { useRouteMatch } from 'react-router-dom'
import { AddressZero } from '@ethersproject/constants'
import { JSBI, TokenAmount } from '@pancakeswap/sdk'
import {  Button, Flex, Heading, Text } from '@pancakeswap/uikit'
import styled from 'styled-components'
import { nftGrades } from 'config/constants/nft';
import { getNftMarketAddress, getNFTMarketplaceAddress } from 'utils/addressHelpers'
import { getFullDisplayBalance } from 'utils/formatBalance'
import { BIG_ONE } from 'utils/bigNumber'
import useTheme from 'hooks/useTheme'
import { useToken } from 'hooks/Tokens'
import useToast from 'hooks/useToast'
import { ApprovalState, useApproveCallback } from 'hooks/useApproveCallback'
import ConnectWalletButton from 'components/ConnectWalletButton'
import Dots from 'components/Loader/Dots'
import { useTranslation } from 'contexts/Localization'
import { NFTAuctionData, NFTAuctionStatus } from '../../types'
import AuctionTimer from './AuctionTimer'
import { usePlaceBid } from '../../hooks/usePlaceBid'
import { useClaimAuction } from '../../hooks/useClaimAuction'



const Wrapper = styled.div`
    flex: 1 1 100%;
    max-width: 100%;
    width: 100%;
    padding: 16px;
    ${({ theme }) => theme.mediaQueries.md} {
        max-width: 60%;
    }
`

const Group = styled(Flex)`
    min-height: 100%;
    padding: 24px;
    border-radius: 12px;
    border: 1px solid ${({ theme }) => theme.colors.cardBorder};
`

const GradeImageWrapper = styled.div`
    flex: 1 1 100%;
    max-width: 100%;
    width: 100%;

    display:flex;
    justify-content: center;
    >img {
        height: 240px;
        max-width: 100%;
        margin: auto;
    }
    ${({ theme }) => theme.mediaQueries.sm} {
        flex: 1 1 0;
        max-width: 50%;
        width: 50%;
    }
`

const RightSection = styled(Flex).attrs({flexDirection:'column'})`
    flex: 1 1 100%;
    max-width: 100%;
    width: 100%;
    align-items: center;
    ${({ theme }) => theme.mediaQueries.sm} {
        flex: 1 1 0;
        max-width: 50%;
        width: 50%;
        align-items: unset;
    }
`

const StatusText = styled(Text)<{statusColor}>`
    padding: 4px 12px;
    border-radius: 12px;
    font-size: 14px;
    ${({ statusColor }) =>
        `
        background: ${statusColor.background};
        color: ${statusColor.text};
        `
    }
`

interface AuctionSectionProps {
    auction: NFTAuctionData
    account?: string
    reloadAuction: () => void
}
const AuctionSection: React.FC<AuctionSectionProps> = ({auction, account, reloadAuction}) => {
    const { t } = useTranslation()
    const { theme } = useTheme()
    const { toastError, toastSuccess } = useToast()
    const [pendingTx, setPendingTx] = useState(false)
    const useEth = auction.payToken === AddressZero
    const payToken = useToken(useEth ? null : auction.payToken)
    const bidAmount = useMemo(() => {
        if (auction.lastBidder === AddressZero) {
            return auction.lastPrice
        }

        let increaseAmount = auction.lastPrice.dividedBy(10).decimalPlaces(0, 1)
        if (increaseAmount.eq(0)) {
            increaseAmount = BIG_ONE
        }
        return auction.lastPrice.plus(increaseAmount)
    }, [auction])
    const [approval, approveCallback] = useApproveCallback(!useEth && payToken ? new TokenAmount(payToken, JSBI.BigInt(bidAmount.toString())) : undefined, getNFTMarketplaceAddress())
    const { onPlaceBid } = usePlaceBid(auction.id)
    const { onClaimAuction } = useClaimAuction(auction.id)
    const gradeConfig = nftGrades.find((c) => c.level === auction.gego.grade)
    const lastPriceText = useMemo(() => {
        if (useEth) {
            return `${getFullDisplayBalance(auction.lastPrice)} BNB`
        }
        if (payToken) {
            return `${getFullDisplayBalance(auction.lastPrice, payToken.decimals)} ${payToken.symbol}`
        }
        return ''
    }, [useEth, payToken, auction])

    const bidAmountText = useMemo(() => {
        if (useEth) {
            return `${getFullDisplayBalance(bidAmount)} BNB`
        }
        if (payToken) {
            return `${getFullDisplayBalance(bidAmount, payToken.decimals)} ${payToken.symbol}`
        }
        return ''
    }, [useEth, payToken, bidAmount])

    const isSeller = useMemo(() => {
        return account && account.toLowerCase() === auction.seller.toLowerCase()
    }, [auction, account])

    const isWinner = useMemo(() => {
        return account && auction.lastBidder && account.toLowerCase() === auction.lastBidder.toLowerCase()
    }, [auction, account])

    const status = useMemo(() => {
        if (auction.startedAt === 0) {
            return NFTAuctionStatus.NOT_RUNNING
        }
        if (auction.isTaken) {

            if (auction.lastBidder === AddressZero) {
                return NFTAuctionStatus.CANCELED
            }
            return NFTAuctionStatus.FINISHED
        }

        if (auction.startedAt + auction.duration > Math.floor(new Date().getTime() / 1000)) {
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
        case NFTAuctionStatus.NOT_RUNNING:
            res = t('Not Running')
            break
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

    const statusColor = useMemo(() => {
        const res: {background: string, text: string} = {
            background: theme.colors.backgroundAlt,
            text: theme.colors.text
        }
        switch (status) {
        case NFTAuctionStatus.NOT_RUNNING:
            res.background = theme.colors.backgroundAlt
            break
        case NFTAuctionStatus.FINISHED:
            res.background = theme.colors.success
            res.text = 'white'
            break
        case NFTAuctionStatus.RUNNING:
            res.background = '#eeeaf4'
            break
        case NFTAuctionStatus.DEALED:
            res.background = theme.colors.success
            res.text = 'white'
            break
        case NFTAuctionStatus.FAILED:
            res.background = theme.colors.failure
            res.text = 'white'
            break
        default: 
            res.background = theme.colors.backgroundAlt
            break
        }

        return res
    }, [status, theme])

    const handleBid = useCallback(async () => {
        try {
            setPendingTx(true)
            await onPlaceBid(useEth, bidAmount)
            reloadAuction()
            toastSuccess(
            `${t('Success')}!`,
            t('You have placed a bid on #%tokenId% successfully', { tokenId: auction.gego.id })
            )
        } catch (e) {
            if (typeof e === 'object' && 'message' in e) {
                const err: any = e;
                toastError(t('Error'), err.message)
            } else {
                toastError(t('Error'), t('Please try again. Confirm the transaction and make sure you are paying enough gas!'))
            }
        } finally {
            setPendingTx(false)
        }
    }, [toastSuccess, toastError, reloadAuction, t, onPlaceBid, auction, useEth, bidAmount])

    const handleClaim = useCallback(async () => {
        try {
            setPendingTx(true)
            await onClaimAuction()
            reloadAuction()
            toastSuccess(
            `${t('Success')}!`,
            t('You have claimed successfully')
            )
        } catch (e) {
            if (typeof e === 'object' && 'message' in e) {
                const err: any = e;
                toastError(t('Error'), err.message)
            } else {
                toastError(t('Error'), t('Please try again. Confirm the transaction and make sure you are paying enough gas!'))
            }
        } finally {
            setPendingTx(false)
        }
    }, [toastSuccess, toastError, reloadAuction, t, onClaimAuction])

    const renderApprovalOrBidButton = () => {
        if (status === NFTAuctionStatus.DEALED && (isSeller || isWinner)) {
            return (
                <Button
                    scale="md" variant="primary" width="100%"
                    disabled={pendingTx}
                    onClick={handleClaim}
                >
                    {pendingTx ? (
                    <Dots>{t('Processing')}</Dots>
                    ) : t('Claim Now')}
                </Button>
            )
        }
      return useEth || approval === ApprovalState.APPROVED ? (
        <Button
          scale="md" variant="primary" width="100%"
          disabled={isSeller || pendingTx}
          onClick={handleBid}
        >
          {pendingTx ? (
            <Dots>{t('Processing')}</Dots>
          ) : t('Bid Now')}
        </Button>
      ) : (
        <Button scale="md" variant="primary" width="100%" disabled={isSeller || approval === ApprovalState.PENDING || approval === ApprovalState.UNKNOWN} onClick={approveCallback}>
        {approval === ApprovalState.PENDING ? (<Dots>{t('Approving')}</Dots>) : t('Approve')}
        </Button>
      )
    }

    return (
        <Wrapper>
            <Group flexDirection="row" flexWrap="wrap">
                <GradeImageWrapper>
                    <img src={`/images/nft/${gradeConfig.image}`} alt={gradeConfig.grade}/>
                </GradeImageWrapper>
                <RightSection>
                    <Heading mb="16px">
                        #{auction.gego.id}
                    </Heading>
                    <Flex mb="12px">
                        <StatusText statusColor={statusColor}>
                            {t('Status')}: {statusText}
                        </StatusText>
                    </Flex>
                    <AuctionTimer auction={auction}/>
                    <Text fontSize="12px" color="secondary" mt="12px">
                        { auction.lastBidder === AddressZero ? t('Start Price') : t('Last Price')}
                    </Text>
                    <Text fontSize="14px" color="primary">
                        {lastPriceText}
                    </Text>
                    <Text fontSize="12px" color="secondary" mt="12px">
                        { t('Next Bid Price')}
                    </Text>
                    <Text fontSize="14px" color="primary">
                        {bidAmountText}
                    </Text>

                    { (status === NFTAuctionStatus.RUNNING || status === NFTAuctionStatus.DEALED) && (
                        <Flex flexDirection="column" mt="12px">
                            { account ? renderApprovalOrBidButton() : (
                                <ConnectWalletButton disabled={isSeller}/>
                            )}
                        </Flex>
                    )}
                    
                </RightSection>
            </Group>
        </Wrapper>
    )
}

export default AuctionSection