import BigNumber from 'bignumber.js'
import getGasPrice from 'utils/getGasPrice'
import { callWithEstimateGas } from 'utils/calls/estimateGas'
import tokens from 'config/constants/tokens'
import { getSpyNFTContract } from 'utils/contractHelpers'


export type CastedNFTData = {
  id: string,
  amount: BigNumber,
  blockNum: BigNumber,
  grade: number,
  createdTime: number,
  lockedDays: number,
  quality: number
}

export const castNFT = async (nftFactory, spyAmount): Promise<CastedNFTData|null> => {

    const gasPrice = getGasPrice()
    const value = new BigNumber(spyAmount).toString()
  
    const tx = await callWithEstimateGas(nftFactory, 'mint', [[value, 0, 0, 0, 0]], {
      gasPrice,
    })
    const receipt = await tx.wait()

    if (receipt.status === 1) {
      /* eslint-disable dot-notation */
      const ev = Array.from(receipt["events"]).filter((v) =>  {
        return v["event"] === "GegoAdded"
      });

      if (ev.length > 0) {
        const args = ev[0]["args"];

        return {
          id: new BigNumber(args["id"]._hex).toJSON(),
          amount: new BigNumber(args["amount"]._hex),
          blockNum: new BigNumber(args["blockNum"]._hex),
          grade: new BigNumber(args["grade"]._hex).toNumber(),
          createdTime: new BigNumber(args["createdTime"]._hex).toNumber(),
          lockedDays: new BigNumber(args["lockedDays"]._hex).toNumber(),
          quality: new BigNumber(args["quality"]._hex).toNumber(),
        }
      }
      /* eslint-enable dot-notation */
    }
    return null;
}

export const burnNFT = async (nftFactory, tokenId) => {

  const gasPrice = getGasPrice()

  const tx = await callWithEstimateGas(nftFactory, 'burn', [tokenId], {
    gasPrice,
  })
  const receipt = await tx.wait()
  return receipt.status
}

export const stakeNFT = async (nftReward, tokenId) => {

  const gasPrice = getGasPrice()

  const tx = await callWithEstimateGas(nftReward, 'stake', [tokenId], {
    gasPrice,
  })
  const receipt = await tx.wait()
  return receipt.status
}

export const unstakeNFT = async (nftReward, tokenId) => {

  const gasPrice = getGasPrice()

  const tx = await callWithEstimateGas(nftReward, 'unstake', [tokenId], {
    gasPrice,
  })
  const receipt = await tx.wait()
  return receipt.status
}

export const harvestNFT = async (nftReward) => {

  const gasPrice = getGasPrice()

  const tx = await callWithEstimateGas(nftReward, 'harvest', [], {
    gasPrice,
  })
  const receipt = await tx.wait()
  return receipt.status
}