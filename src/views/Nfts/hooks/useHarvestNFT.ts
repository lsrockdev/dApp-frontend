import { useCallback } from 'react'
import { harvestNFT } from 'utils/calls'
import { useGeneralNFTReward } from 'hooks/useContract'

const useHarvestNFT = () => {
  const nftRewardContract = useGeneralNFTReward()

  const hanleHarvestNFT = useCallback(async () => {
    const txHash = await harvestNFT(nftRewardContract)
    console.info(txHash)
  }, [nftRewardContract])

  return { onHarvest: hanleHarvestNFT }
}

export default useHarvestNFT
