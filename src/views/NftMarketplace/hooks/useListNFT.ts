import { useCallback } from 'react'
import { callWithEstimateGas, stakeNFT } from 'utils/calls'
import { AddressZero } from '@ethersproject/constants'
import { useGeneralNFTReward, useOldGeneralNFTReward, useSpyNFTMarketplace } from 'hooks/useContract'
import getGasPrice from 'utils/getGasPrice'
import tokens from 'config/constants/tokens'
import BigNumber from 'bignumber.js'

export const useListNFTMarket = () => {
    const marketplaceContract = useSpyNFTMarketplace()

    const handleListMarket = useCallback(async (useToken: boolean, tokenId: string, price: string) => {
        const params = [
            tokens.spynft.address,
            tokenId,
            useToken ? tokens.spy.address : AddressZero,
            price
        ]
        const gasPrice = getGasPrice()
        const tx = await callWithEstimateGas(
            marketplaceContract,
            'listMarket', 
            params, 
            { gasPrice }
        )
        const receipt = await tx.wait()
        if (receipt.status === 1) {
            /* eslint-disable dot-notation */
            const ev = Array.from(receipt["events"]).filter((v) =>  {
                return v["event"] === "MarketListed"
            });
      
            if (ev.length > 0) {
                const args = ev[0]["args"];
                return new BigNumber(args["id"]._hex).toJSON()
            }
            /* eslint-enable dot-notation */
        }
        return null
    }, [marketplaceContract])

  return { onListMarket: handleListMarket }
}

export const useListNFTAuction = () => {
    const marketplaceContract = useSpyNFTMarketplace()

    const handleListAuction = useCallback(async (useToken: boolean, tokenId: string, price,duration) => {
        const params = [
            useToken ? tokens.spy.address : AddressZero,
            tokens.spynft.address,
            tokenId,
            price,
            duration
        ]
        const gasPrice = getGasPrice()
        const tx = await callWithEstimateGas(
            marketplaceContract,
            'list', 
            params, 
            { gasPrice }
        )
        const receipt = await tx.wait()
        if (receipt.status === 1) {
            /* eslint-disable dot-notation */
            const ev = Array.from(receipt["events"]).filter((v) =>  {
                return v["event"] === "AuctionListed"
            });
      
            if (ev.length > 0) {
                const args = ev[0]["args"];
                return new BigNumber(args["id"]._hex).toJSON()
            }
            /* eslint-enable dot-notation */
        }
        return null
    }, [marketplaceContract])

  return { onListAuction: handleListAuction }
}
