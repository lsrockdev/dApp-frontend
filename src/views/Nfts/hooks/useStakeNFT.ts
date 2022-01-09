import { useCallback } from 'react'
import { stakeNFT } from 'utils/calls'
import { useGeneralNFTReward } from 'hooks/useContract'

const useStakeNFT = () => {
  const nftRewardContract = useGeneralNFTReward()

  const handleStakeNFT = useCallback(async (tokenId: string) => {
    const txHash = await stakeNFT(nftRewardContract, tokenId)
    console.info(txHash)
  }, [nftRewardContract])

  return { onStakeNFT: handleStakeNFT }
}

export default useStakeNFT
