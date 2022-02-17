import BigNumber from 'bignumber.js'
import { useSpyNFTMarketplace } from 'hooks/useContract'
import { useCallback } from 'react'
import { callWithEstimateGas } from 'utils/calls'
import getGasPrice from 'utils/getGasPrice'

export const usePlaceBid = (auctionId: string) => {
    const marketplaceContract = useSpyNFTMarketplace()

    const handlePlaceBid = useCallback(
        async(useEth: boolean, amount: BigNumber) => {
            const gasPrice = getGasPrice()
            if (useEth) {
                const tx = await callWithEstimateGas(marketplaceContract, 'bid', [auctionId], { gasPrice},1000, amount.toString())
                const receipt = await tx.wait()
                return receipt
            }
            
            const tx = await callWithEstimateGas(marketplaceContract, 'bidWithToken', [auctionId], { gasPrice})
            const receipt = await tx.wait()
            return receipt
        },
        [marketplaceContract, auctionId]
    )

    return { onPlaceBid: handlePlaceBid }
}