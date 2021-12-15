import BigNumber from 'bignumber.js'
import { DEFAULT_GAS_LIMIT, DEFAULT_TOKEN_DECIMAL } from 'config'
import getGasPrice from 'utils/getGasPrice'
import { AddressZero } from '@ethersproject/constants'
import { getReferralAddress } from 'utils/addressHelpers'
import {callWithEstimateGas} from './estimateGas'

const options = {
  gasLimit: DEFAULT_GAS_LIMIT,
}

export const stakeFarm = async (masterChefContract, pid, amount, userRefferer) => {
  const gasPrice = getGasPrice()
  const value = new BigNumber(amount).times(DEFAULT_TOKEN_DECIMAL).toString()

  let referrer = userRefferer
  if (!userRefferer || !userRefferer.startsWith('0x')) {
    referrer = AddressZero
  }

  const tx = await callWithEstimateGas(masterChefContract, 'deposit', [pid, value, referrer], {
    gasPrice,
  })
  const receipt = await tx.wait()
  return receipt.status
}

export const unstakeFarm = async (masterChefContract, pid, amount) => {
  const gasPrice = getGasPrice()
  const value = new BigNumber(amount).times(DEFAULT_TOKEN_DECIMAL).toString()

  const tx = await callWithEstimateGas(masterChefContract, 'withdraw', [pid, value], {
    gasPrice,
  })
  const receipt = await tx.wait()
  return receipt.status
}

export const harvestFarm = async (masterChefContract, pid) => {
  const gasPrice = getGasPrice()

  const tx = await callWithEstimateGas(masterChefContract, 'deposit', [pid, 0, AddressZero], {
    gasPrice,
  })
  const receipt = await tx.wait()
  return receipt.status
}
