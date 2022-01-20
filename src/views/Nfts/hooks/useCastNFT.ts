import { useCallback } from 'react'
import { castNFT } from 'utils/calls'
import { useNFTFactory } from 'hooks/useContract'
import { DeserializedNFTGego } from 'state/types'
import { getFixRate } from 'utils/nftHelpers'

const useCastNFT = () => {
  const nftFactory = useNFTFactory()

  const handleCastNFT = useCallback(async (amount: string) : Promise<DeserializedNFTGego> => {
    const castedNFT = await castNFT(nftFactory, amount)
    return {
      ...castedNFT,
      staked: false,
      efficiency: getFixRate(castedNFT.grade, castedNFT.quality)
    }
  }, [nftFactory])

  return { onCastNFT: handleCastNFT }
}

export default useCastNFT
