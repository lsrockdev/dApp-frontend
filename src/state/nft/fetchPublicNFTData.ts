import BigNumber from 'bignumber.js'
import erc20 from 'config/abi/erc20.json'
import tokens from 'config/constants/tokens'
import multicall from 'utils/multicall'
import { getNFTMintroxyAddress } from 'utils/addressHelpers'
import { BIG_TEN, BIG_ZERO } from 'utils/bigNumber'

type PublicNFTData = {
    tokenAmountTotal: SerializedBigNumber
    nftCastAllowance: SerializedBigNumber
}

export const fetchPublicNFTData = async(account: string): Promise<PublicNFTData> =>  {

    const token = tokens.spy;

    const calls = [
        // Balance of SPY token
        {
          address: token.address,
          name: 'balanceOf',
          params: [account],
        },
        // Balance of SPY token
        {
            address: token.address,
            name: 'allowance',
            params: [account, getNFTMintroxyAddress()],
        },
        // Token decimals
        {
          address: token.address,
          name: 'decimals',
        },
    ];

    const [tokenBalance, nftCastAllowance, spyDecimals] =
    await multicall(erc20, calls)

    const tokenAmountTotal = new BigNumber(tokenBalance).div(BIG_TEN.pow(spyDecimals))
    const nftCastAllowanceTotal = new BigNumber(nftCastAllowance).div(BIG_TEN.pow(spyDecimals))


    return {
        tokenAmountTotal: tokenAmountTotal.toJSON(),
        nftCastAllowance: nftCastAllowanceTotal.toJSON()
    };
}