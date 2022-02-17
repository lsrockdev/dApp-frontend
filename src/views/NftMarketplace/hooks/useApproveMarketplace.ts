import { useCallback } from 'react'
import { getGeneralNFTRewardAddress, getNFTMarketplaceAddress, getOldGeneralNFTRewardAddress } from 'utils/addressHelpers'
import getGasPrice from 'utils/getGasPrice'
import { callWithEstimateGas } from 'utils/calls'

const useApproveMarketplace = (nftContract) => {
  const nftMarketplaceAddress = getNFTMarketplaceAddress()
  
  const handleApprove = useCallback(async () => {
    const gasPrice = getGasPrice()

    const tx = await callWithEstimateGas(nftContract, 'setApprovalForAll', [nftMarketplaceAddress, true], {
      gasPrice,})
    const receipt = await tx.wait()
    return receipt.status
  }, [nftContract, nftMarketplaceAddress])

  return { onApproveNFTMarketplace: handleApprove }
}

export default useApproveMarketplace
