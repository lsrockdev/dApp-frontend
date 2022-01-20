import { useCallback } from 'react'
import { getGeneralNFTRewardAddress } from 'utils/addressHelpers'
import getGasPrice from 'utils/getGasPrice'
import { callWithEstimateGas } from 'utils/calls'

const useApproveGeneralReward = (nftContract) => {
  const generalRewardAddress = getGeneralNFTRewardAddress()
  
  const handleApprove = useCallback(async () => {
    const gasPrice = getGasPrice()

    const tx = await callWithEstimateGas(nftContract, 'setApprovalForAll', [generalRewardAddress, true], {
      gasPrice,})
    const receipt = await tx.wait()
    return receipt.status
  }, [nftContract, generalRewardAddress])

  return { onApproveGeneralReward: handleApprove }
}

export default useApproveGeneralReward
