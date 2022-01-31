import BigNumber from 'bignumber.js'
import tokens from 'config/constants/tokens'
import { getOldSpyNFTRewardContract, getSpyNFTContract, getSpyNFTRewardContract } from 'utils/contractHelpers';

export const fetchNFTBalance = async (account: string): Promise<SerializedBigNumber[]> => {

    const nftAddress = tokens.spynft.address;

    const nftContract = getSpyNFTContract(nftAddress);

    const tokenIds = await nftContract.tokensOfOwner(account)

    return tokenIds.map((tokenId) => new BigNumber(tokenId._hex).toJSON())
}

export const fetchOldStakedNFTs = async (account: string): Promise<SerializedBigNumber[]> => {
    const contract = getOldSpyNFTRewardContract();
    const tokenIds = await contract.getPlayerIds(account)
    return tokenIds.map((tokenId) => new BigNumber(tokenId._hex).toJSON())
}

export const fetchStakedNFTs = async (account: string): Promise<SerializedBigNumber[]> => {
    const contract = getSpyNFTRewardContract();
    const tokenIds = await contract.getPlayerIds(account)
    return tokenIds.map((tokenId) => new BigNumber(tokenId._hex).toJSON())
}