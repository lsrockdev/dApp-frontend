import { useCallback } from 'react'
import { unstakeNFT } from 'utils/calls'
import { useOldGeneralNFTReward, useGeneralNFTReward } from 'hooks/useContract'

const useUnstakeNFT = () => {
  const nftRewardContract = useGeneralNFTReward()
  const oldNftRewardContract = useOldGeneralNFTReward()

  const handleUnstakeNFT = useCallback(async (tokenId: string, isV2 = true) => {
    const txHash = isV2 ? await unstakeNFT(nftRewardContract, tokenId) : await unstakeNFT(oldNftRewardContract, tokenId)
    console.info(txHash)
  }, [nftRewardContract, oldNftRewardContract])

  return { onUnstakeNFT: handleUnstakeNFT }
}

export default useUnstakeNFT
