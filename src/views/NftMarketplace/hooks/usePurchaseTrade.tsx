import BigNumber from 'bignumber.js'
import { useSpyNFTMarketplace } from 'hooks/useContract'
import { useCallback } from 'react'
import { callWithEstimateGas } from 'utils/calls'
import getGasPrice from 'utils/getGasPrice'

export const usePurchaseTrade = (auctionId: string) => {
    const marketplaceContract = useSpyNFTMarketplace()

    const handlePurchaseTrade = useCallback(
        async(useEth: boolean, amount: BigNumber) => {
            const gasPrice = getGasPrice()
            if (useEth) {
                const tx = await callWithEstimateGas(marketplaceContract, 'purchase', [auctionId], { gasPrice},1000, amount.toString())
                const receipt = await tx.wait()
                return receipt
            }
            
            const tx = await callWithEstimateGas(marketplaceContract, 'purchaseWithToken', [auctionId], { gasPrice})
            const receipt = await tx.wait()
            return receipt
        },
        [marketplaceContract, auctionId]
    )

    return { onPurchaseTrade: handlePurchaseTrade }
}