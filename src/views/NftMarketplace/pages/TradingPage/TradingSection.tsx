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
import { NFTAuctionData, NFTAuctionStatus, NFTTradeData } from '../../types'
import { usePurchaseTrade } from '../../hooks/usePurchaseTrade'



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

interface TradingSectionProps {
    trade: NFTTradeData
    account?: string
    reloadTrade: () => void
}
const TradingSection: React.FC<TradingSectionProps> = ({trade, account, reloadTrade}) => {
    const { t } = useTranslation()
    const { theme } = useTheme()
    const { toastError, toastSuccess } = useToast()
    const [pendingTx, setPendingTx] = useState(false)
    const useEth = trade.payToken === AddressZero
    const payToken = useToken(useEth ? null : trade.payToken)
    const [approval, approveCallback] = useApproveCallback(!useEth && payToken ? new TokenAmount(payToken, JSBI.BigInt(trade.salePrice.toString())) : undefined, getNFTMarketplaceAddress())
    const { onPurchaseTrade } = usePurchaseTrade(trade.id)
    const gradeConfig = nftGrades.find((c) => c.level === trade.gego.grade)
    const salePriceText = useMemo(() => {
        if (useEth) {
            return `${getFullDisplayBalance(trade.salePrice)} BNB`
        }
        if (payToken) {
            return `${getFullDisplayBalance(trade.salePrice, payToken.decimals)} ${payToken.symbol}`
        }
        return ''
    }, [useEth, payToken, trade])

    const isSeller = useMemo(() => {
        return account && account.toLocaleLowerCase() === trade.seller.toLocaleLowerCase()
    }, [trade, account])

    const statusText = useMemo(() => {
        if (trade.isSold) {
            if (trade.purchaser === AddressZero) {
                return t('Canceled')
            }
            return t('Sold')
        }

        return t('Running')
    }, [trade, t])

    const statusColor = useMemo(() => {
        const res: {background: string, text: string} = {
            background: theme.colors.backgroundAlt,
            text: theme.colors.text
        }

        if (trade.isSold) {
            if (trade.purchaser !== AddressZero) {
                res.background = theme.colors.success
                res.text = 'white'
            }
        } else {
            res.background = '#eeeaf4'
        }

        return res
    }, [trade, theme])

    const handlePurchase = useCallback(async () => {
        try {
            setPendingTx(true)
            await onPurchaseTrade(useEth, trade.salePrice)
            reloadTrade()
            toastSuccess(
            `${t('Success')}!`,
            t('You have purchased the token #%tokenId% successfully', { tokenId: trade.gego.id })
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
    }, [toastSuccess, toastError, reloadTrade, t, onPurchaseTrade, trade, useEth])

    const renderApprovalOrBidButton = () => {
      return useEth || approval === ApprovalState.APPROVED ? (
        <Button
          scale="md" variant="primary" width="100%"
          disabled={isSeller || trade.isSold || pendingTx}
          onClick={handlePurchase}
        >
          {pendingTx ? (
            <Dots>{t('Processing')}</Dots>
          ) : t('Purchase')}
        </Button>
      ) : (
        <Button scale="md" variant="primary" width="100%" disabled={isSeller || trade.isSold || approval === ApprovalState.PENDING || approval === ApprovalState.UNKNOWN} onClick={approveCallback}>
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
                        #{trade.gego.id}
                    </Heading>
                    <Flex mb="12px">
                        <StatusText statusColor={statusColor}>
                            {t('Status')}: {statusText}
                        </StatusText>
                    </Flex>
                    <Text fontSize="12px" color="secondary" mt="12px">
                        { t('Sale Price') }
                    </Text>
                    <Text fontSize="14px" color="primary">
                        {salePriceText}
                    </Text>

                    <Flex flexDirection="column" mt="12px">
                        { account ? renderApprovalOrBidButton() : (
                            <ConnectWalletButton disabled={isSeller || trade.isSold}/>
                        )}
                    </Flex>
                    
                </RightSection>
            </Group>
        </Wrapper>
    )
}

export default TradingSection