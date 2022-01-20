import { useCallback } from 'react'
import { burnNFT } from 'utils/calls'
import { useNFTFactory } from 'hooks/useContract'

const useDecomposeNFT = () => {
  const nftFactory = useNFTFactory()

  const handleDecomposeNFT = useCallback(async (tokenId: string) => {
    const txHash = await burnNFT(nftFactory, tokenId)
    console.info(txHash)
  }, [nftFactory])

  return { onDecomposeNFT: handleDecomposeNFT }
}

export default useDecomposeNFT
