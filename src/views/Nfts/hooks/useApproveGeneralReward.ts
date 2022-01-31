import { useCallback } from 'react'
import { getGeneralNFTRewardAddress, getOldGeneralNFTRewardAddress } from 'utils/addressHelpers'
import getGasPrice from 'utils/getGasPrice'
import { callWithEstimateGas } from 'utils/calls'

const useApproveGeneralReward = (nftContract) => {
  const generalRewardAddress = getGeneralNFTRewardAddress()
  const oldGeneralRewardAddress = getOldGeneralNFTRewardAddress()
  
  const handleApprove = useCallback(async (isV2 = true) => {
    const gasPrice = getGasPrice()

    const tx = await callWithEstimateGas(nftContract, 'setApprovalForAll', [isV2 ?generalRewardAddress : oldGeneralRewardAddress, true], {
      gasPrice,})
    const receipt = await tx.wait()
    return receipt.status
  }, [nftContract, generalRewardAddress, oldGeneralRewardAddress])

  return { onApproveGeneralReward: handleApprove }
}

export default useApproveGeneralReward
