import { useCallback } from 'react'
import { unstakeNFT } from 'utils/calls'
import { useGeneralNFTReward } from 'hooks/useContract'

const useUnstakeNFT = () => {
  const nftRewardContract = useGeneralNFTReward()

  const handleUnstakeNFT = useCallback(async (tokenId: string) => {
    const txHash = await unstakeNFT(nftRewardContract, tokenId)
    console.info(txHash)
  }, [nftRewardContract])

  return { onUnstakeNFT: handleUnstakeNFT }
}

export default useUnstakeNFT
