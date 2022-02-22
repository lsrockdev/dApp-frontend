import React, { useEffect, useState } from 'react'
import { useWeb3React } from '@web3-react/core'
import { useTranslation } from 'contexts/Localization'
import { Skeleton } from '@pancakeswap/uikit'
import { getMyTrades } from '../../hooks/getTrades'
import { NFTTrade } from '../../types'
import TradeTable from './TradeTable'

const TradesSection: React.FC = () => {
    const { t } = useTranslation()
    const { account } = useWeb3React()
    const [isLoading, setIsLoading] = useState(false)
    const [trades, setTrades] = useState<NFTTrade[]>([])

    useEffect(() => {
        const fetchTrades = async () => {
            try {
                setIsLoading(true)
                const trades_ = await getMyTrades(account)
                setTrades(trades_)
                
            } finally {
                setIsLoading(false)
            }
        }
        
        if (account) {
            fetchTrades()
        } else {
            setIsLoading(false)
            setTrades([])
        }
    }, [account])

    const renderContent = () => {
        if (isLoading || !trades) {
            return (
                <Skeleton width="100%" height="300px" animation="waves"/>
            )
        }
        return (
            <TradeTable trades={trades} loading={isLoading} account={account}/>
        )
    }

    return (
        <>
        {renderContent()}
        </>
    )
}

export default TradesSection