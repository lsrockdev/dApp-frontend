import BigNumber from 'bignumber.js'
import { useSpyNFTMarketplace } from 'hooks/useContract'
import { useCallback } from 'react'
import { callWithEstimateGas } from 'utils/calls'
import getGasPrice from 'utils/getGasPrice'

export const useClaimAuction = (auctionId: string) => {
    const marketplaceContract = useSpyNFTMarketplace()

    const handleClaimAuction = useCallback(
        async() => {
            const gasPrice = getGasPrice()
            
            const tx = await callWithEstimateGas(marketplaceContract, 'collect', [auctionId], { gasPrice})
            const receipt = await tx.wait()
            return receipt
        },
        [marketplaceContract, auctionId]
    )

    return { onClaimAuction: handleClaimAuction }
}