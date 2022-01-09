import { useCallback } from 'react'
import { useCallWithGasPrice } from 'hooks/useCallWithGasPrice'
import { getGeneralNFTRewardAddress } from 'utils/addressHelpers'
import tokens from 'config/constants/tokens'
import { useERC721 } from 'hooks/useContract'

const useApproveGeneralReward = (nftContract) => {
  const { callWithGasPrice } = useCallWithGasPrice()
  const generalRewardAddress = getGeneralNFTRewardAddress()
  
  const handleApprove = useCallback(async () => {
    const tx = await callWithGasPrice(nftContract, 'setApprovalForAll', [generalRewardAddress, true])
    const receipt = await tx.wait()
    return receipt.status
  }, [callWithGasPrice, nftContract, generalRewardAddress])

  return { onApproveGeneralReward: handleApprove }
}

export default useApproveGeneralReward
