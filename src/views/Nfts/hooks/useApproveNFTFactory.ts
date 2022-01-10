import { useCallback } from 'react'
import { useCallWithGasPrice } from 'hooks/useCallWithGasPrice'
import { getNFTFactoryAddress } from 'utils/addressHelpers'
import tokens from 'config/constants/tokens'
import { useERC721 } from 'hooks/useContract'

const useApproveNFTFactory = (nftContract) => {
  const { callWithGasPrice } = useCallWithGasPrice()
  const nftFactoryAddress = getNFTFactoryAddress()
  
  const handleApprove = useCallback(async () => {
    const tx = await callWithGasPrice(nftContract, 'setApprovalForAll', [nftFactoryAddress, true])
    const receipt = await tx.wait()
    return receipt.status
  }, [callWithGasPrice, nftContract, nftFactoryAddress])

  return { onApprove: handleApprove }
}

export default useApproveNFTFactory
