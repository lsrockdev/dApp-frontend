import { useCallback } from 'react'
import { ethers, Contract } from 'ethers'
import { useCallWithGasPrice } from 'hooks/useCallWithGasPrice'

const useApproveCastNFT = (token: Contract, nftMintProxy: string) => {
  const { callWithGasPrice } = useCallWithGasPrice()
  const handleApprove = useCallback(async () => {
    const tx = await callWithGasPrice(token, 'approve', [nftMintProxy, ethers.constants.MaxUint256])
    const receipt = await tx.wait()
    return receipt.status
  }, [token, nftMintProxy, callWithGasPrice])

  return { onApprove: handleApprove }
}

export default useApproveCastNFT
