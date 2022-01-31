import { useCallback } from 'react'
import { harvestNFT } from 'utils/calls'
import { useGeneralNFTReward, useOldGeneralNFTReward } from 'hooks/useContract'

const useHarvestNFT = () => {
  const nftRewardContract = useGeneralNFTReward()
  const oldNftRewardContract = useOldGeneralNFTReward()

  const hanleHarvestNFT = useCallback(async (isV2 = true) => {
    const txHash = isV2 ? await harvestNFT(nftRewardContract) : await harvestNFT(oldNftRewardContract)
    console.info(txHash)
  }, [nftRewardContract, oldNftRewardContract])

  return { onHarvest: hanleHarvestNFT }
}

export default useHarvestNFT
