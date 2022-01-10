import React from 'react'
import styled from 'styled-components'
import BigNumber from 'bignumber.js'
import { Flex, IconButton, useModal, CalculateIcon } from '@pancakeswap/uikit'
import RoiCalculatorModal from 'components/RoiCalculatorModal'
import { useTranslation } from 'contexts/Localization'
import { useFarmUser, useLpTokenPrice, usePriceCakeBusd } from 'state/farms/hooks'
import { getApy } from 'utils/apr'

const ApyLabelContainer = styled(Flex)`
  cursor: pointer;

  &:hover {
    opacity: 0.5;
  }
`

export interface ApyButtonProps {
  variant: 'text' | 'text-and-button'
  harvestInterval?: number
  apr?: number
  displayApr?: string
  stakedBalance?: BigNumber
}

const ApyButton: React.FC<ApyButtonProps> = ({
  variant,
  harvestInterval,
  apr,
  stakedBalance
}) => {
  const { t } = useTranslation()
  const tokenPrice = usePriceCakeBusd()
  const [onPresentApyModal] = useModal(
    <RoiCalculatorModal
      linkLabel={t('Get SPY NFT')}
      stakingTokenBalance={stakedBalance}
      stakingTokenSymbol='SPY'
      stakingTokenPrice={tokenPrice.toNumber()}
      earningTokenPrice={tokenPrice.toNumber()}
      stakingTokenDecimal={0}
      apr={apr}
      linkHref="/nfts"
    />,
  )

  const handleClickButton = (event): void => {
    event.stopPropagation()
    onPresentApyModal()
  }

  return (
    <ApyLabelContainer alignItems="center" onClick={handleClickButton}>
      {(getApy(apr, 86400 / harvestInterval, 365) * 100).toLocaleString('en-US', {maximumFractionDigits: 2})}%
      {variant === 'text-and-button' && (
        <IconButton variant="text" scale="sm" ml="4px">
          <CalculateIcon width="18px" />
        </IconButton>
      )}
    </ApyLabelContainer>
  )
}

export default ApyButton
