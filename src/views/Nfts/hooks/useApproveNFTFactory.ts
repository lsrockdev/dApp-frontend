import { useCallback } from 'react'
import { getNFTFactoryAddress } from 'utils/addressHelpers'
import getGasPrice from 'utils/getGasPrice'
import { callWithEstimateGas } from 'utils/calls'

const useApproveNFTFactory = (nftContract) => {
  const nftFactoryAddress = getNFTFactoryAddress()
  
  const handleApprove = useCallback(async () => {

    const gasPrice = getGasPrice()
    const tx = await callWithEstimateGas(nftContract, 'setApprovalForAll', [nftFactoryAddress, true], {
      gasPrice,})
    const receipt = await tx.wait()
    return receipt.status
  }, [nftContract, nftFactoryAddress])

  return { onApprove: handleApprove }
}

export default useApproveNFTFactory
