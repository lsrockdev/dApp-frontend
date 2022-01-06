import BigNumber from 'bignumber.js'
import getGasPrice from 'utils/getGasPrice'
import { callWithEstimateGas } from 'utils/calls/estimateGas'


export type CastedNFTData = {
  id: BigNumber,
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
          id: new BigNumber(args["id"]._hex),
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