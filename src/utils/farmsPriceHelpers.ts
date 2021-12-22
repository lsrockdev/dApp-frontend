import BigNumber from 'bignumber.js'
import { SerializedFarm } from 'state/types'
import { BIG_ONE, BIG_ZERO } from 'utils/bigNumber'

/**
 * Returns the first farm with a quote token that matches from an array of preferred quote tokens
 * @param farms Array of farms
 * @param preferredQuoteTokens Array of preferred quote tokens
 * @returns A preferred farm, if found - or the first element of the farms array
 */
export const filterFarmsByQuoteToken = (
  farms: SerializedFarm[],
  preferredQuoteTokens: string[] = ['BUSD', 'BNB'],
): SerializedFarm => {
  const preferredFarm = farms.find((farm) => {
    return preferredQuoteTokens.some((quoteToken) => {
      return farm.quoteToken.symbol === quoteToken
    })
  })
  return preferredFarm || farms[0]
}

export interface TokenInfoResponse {
  data: TokenInfo
}

/* eslint-disable camelcase */
export interface TokenInfo {
  price: string,
  price_BNB: string,
  name: string,
  symbol: string
}

export const getBNBPriceUSD = async (
  ): Promise<BigNumber> => {
    try {
      const res = await fetch(`https://api.pancakeswap.info/api/v2/tokens/0xe9e7CEA3DedcA5984780Bafc599bD69ADd087D56`)
      if (res.ok) {
        try {
          const data:TokenInfoResponse = await res.json()
          return BIG_ONE.div(new BigNumber(data.data.price_BNB));
        } catch (e) {
          return BIG_ZERO;
        }
      } else {
        const text = '{"updated_at":1638965144117,"data":{"name":"BUSD Token","symbol":"BUSD","price":"1.000027645282784405210056304362","price_BNB":"0.001724832636481625906614151425952"}}';
        const data:TokenInfoResponse = await res.json()
        const r =  BIG_ONE.div(new BigNumber(data.data.price_BNB));
        return r;
      }
    } catch (e1) {
      const text = '{"updated_at":1638965144117,"data":{"name":"BUSD Token","symbol":"BUSD","price":"1.000027645282784405210056304362","price_BNB":"0.001724832636481625906614151425952"}}';
      const data:TokenInfoResponse = JSON.parse(text)
      const r =  BIG_ONE.div(new BigNumber(data.data.price_BNB));
      return r;
    }
    return BIG_ZERO;
  }