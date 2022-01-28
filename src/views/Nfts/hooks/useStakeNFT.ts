import { useCallback } from 'react'
import { stakeNFT } from 'utils/calls'
import { useGeneralNFTReward, useOldGeneralNFTReward } from 'hooks/useContract'

const useStakeNFT = () => {
  const nftRewardContract = useGeneralNFTReward()
  const oldNftRewardContract = useOldGeneralNFTReward()

  const handleStakeNFT = useCallback(async (tokenId: string, isV2 = true) => {
    const txHash = isV2 ? await stakeNFT(nftRewardContract, tokenId) : await stakeNFT(oldNftRewardContract, tokenId)
    console.info(txHash)
  }, [nftRewardContract, oldNftRewardContract])

  return { onStakeNFT: handleStakeNFT }
}

export default useStakeNFT
