import { useCallback } from 'react'
import { ethers, Contract } from 'ethers'
import { useCallWithGasPrice } from 'hooks/useCallWithGasPrice'
import getGasPrice from 'utils/getGasPrice'
import { callWithEstimateGas } from 'utils/calls'

const useApproveCastNFT = (token: Contract, nftMintProxy: string) => {
  const handleApprove = useCallback(async () => {

    const gasPrice = getGasPrice()

    const tx = await callWithEstimateGas(token, 'approve', [nftMintProxy, ethers.constants.MaxUint256], {
      gasPrice,})
    const receipt = await tx.wait()
    return receipt.status
  }, [token, nftMintProxy])

  return { onApprove: handleApprove }
}

export default useApproveCastNFT
