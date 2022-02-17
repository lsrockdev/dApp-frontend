import { useCallback } from 'react'
import { callWithEstimateGas, stakeNFT } from 'utils/calls'
import { AddressZero } from '@ethersproject/constants'
import { useGeneralNFTReward, useOldGeneralNFTReward, useSpyNFTMarketplace } from 'hooks/useContract'
import getGasPrice from 'utils/getGasPrice'
import tokens from 'config/constants/tokens'

export const useCancelNFTAuction = () => {
    const marketplaceContract = useSpyNFTMarketplace()

    const handleCancelAuction = useCallback(async (id: string) => {
        const params = [
            id
        ]
        const gasPrice = getGasPrice()
        const tx = await callWithEstimateGas(
            marketplaceContract,
            'cancelAuction', 
            params, 
            { gasPrice }
        )
        const receipt = await tx.wait()
        return receipt.transactionHash
    }, [marketplaceContract])

  return { onCancelNFTAuction: handleCancelAuction }
}

export const useCancelNFTMarket = () => {
    const marketplaceContract = useSpyNFTMarketplace()

    const handleCancelMarket = useCallback(async (id: string) => {
        const params = [
            id
        ]
        const gasPrice = getGasPrice()
        const tx = await callWithEstimateGas(
            marketplaceContract,
            'cancelMarket', 
            params, 
            { gasPrice }
        )
        const receipt = await tx.wait()
        return receipt.transactionHash
    }, [marketplaceContract])

  return { onCancelNFTMarket: handleCancelMarket }
}
