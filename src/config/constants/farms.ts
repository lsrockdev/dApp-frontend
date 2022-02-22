import { serializeTokens } from './tokens'
import { SerializedFarmConfig } from './types'

const serializedTokens = serializeTokens()

const farms: SerializedFarmConfig[] = [
  /**
   * These 3 farms (PID 0, 1, 3) should always be at the top of the file.
   */
   {
    pid: 0,
    lpSymbol: 'SPY-BUSD',
    lpAddresses: {
      97: '0xe9412a9809FadBbaCd8D1bd024E6280f05Bd2437',
      56: '0x0e587eaeFC234965ef5b2219983E7Df06b42dAE3',
    },
    token: serializedTokens.spy,
    quoteToken: serializedTokens.busd,
  },
  {
    pid: 1,
    lpSymbol: 'SPY-BNB LP',
    lpAddresses: {
      97: '0xe890519b297700BB69a62F18AaA50cAc201A300C',
      56: '0xfcB07994C68d986D4d534709314A021e56bBBFf0',
    },
    token: serializedTokens.spy,
    quoteToken: serializedTokens.wbnb,
  },
  {
    pid: 3,
    lpSymbol: 'BUSD-BNB LP',
    lpAddresses: {
      97: '0xCe243775e7ec6Dac5702F60a597Ce06344fC60F0',
      56: '0x58F876857a02D6762E0101bb5C46A8c1ED44Dc16',
    },
    token: serializedTokens.busd,
    quoteToken: serializedTokens.wbnb,
  },
  {
    pid: 4,
    lpSymbol: 'SPY-USDC LP',
    lpAddresses: {
      97: '0x1aec329c825fA6dE8be4f0CB5410C0D4650dACE9',
      56: '0x58F876857a02D6762E0101bb5C46A8c1ED44Dc16',
    },
    token: serializedTokens.spy,
    quoteToken: serializedTokens.usdc,
  },
  {
    pid: null,
    lpSymbol: 'USDC-BNB LP',
    lpAddresses: {
      97: '0x6255381c390d833114ba5121df4D8Ac1Ce8B868A',
      56: '0x58F876857a02D6762E0101bb5C46A8c1ED44Dc16',
    },
    token: serializedTokens.usdc,
    quoteToken: serializedTokens.wbnb,
  },

]

export default farms