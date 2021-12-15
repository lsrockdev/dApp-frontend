import { useCallback } from 'react'
import { useWeb3React } from '@web3-react/core'
import { useAppDispatch } from 'state'
import { updateUserStakedBalance, updateUserBalance } from 'state/actions'
import { stakeFarm } from 'utils/calls'
import BigNumber from 'bignumber.js'
import { DEFAULT_TOKEN_DECIMAL, DEFAULT_GAS_LIMIT } from 'config'
import { BIG_TEN } from 'utils/bigNumber'
import { useMasterchef, useSousChef } from 'hooks/useContract'
import getGasPrice from 'utils/getGasPrice'
import { useUserReferrer } from 'state/user/hooks'

const options = {
  gasLimit: DEFAULT_GAS_LIMIT,
}

const sousStake = async (sousChefContract, amount, decimals = 18) => {
  const gasPrice = getGasPrice()
  const tx = await sousChefContract.deposit(new BigNumber(amount).times(BIG_TEN.pow(decimals)).toString(), {
    ...options,
    gasPrice,
  })
  const receipt = await tx.wait()
  return receipt.status
}

const sousStakeBnb = async (sousChefContract, amount) => {
  const gasPrice = getGasPrice()
  const tx = await sousChefContract.deposit(new BigNumber(amount).times(DEFAULT_TOKEN_DECIMAL).toString(), {
    ...options,
    gasPrice,
  })
  const receipt = await tx.wait()
  return receipt.status
}

const useStakePool = (sousId: number, isUsingBnb = false) => {
  const dispatch = useAppDispatch()
  const { account } = useWeb3React()
  const masterChefContract = useMasterchef()
  const [ userReferrer, _] = useUserReferrer()
  const sousChefContract = useSousChef(sousId)

  const handleStake = useCallback(
    async (amount: string, decimals: number) => {
      if (sousId === 0) {
        await stakeFarm(masterChefContract, 0, amount, userReferrer)
      } else if (isUsingBnb) {
        await sousStakeBnb(sousChefContract, amount)
      } else {
        await sousStake(sousChefContract, amount, decimals)
      }
      dispatch(updateUserStakedBalance(sousId, account))
      dispatch(updateUserBalance(sousId, account))
    },
    [account, dispatch, isUsingBnb, masterChefContract, sousChefContract, sousId, userReferrer],
  )

  return { onStake: handleStake }
}

export default useStakePool
