
import BigNumber from "bignumber.js";

export interface ReferralStatistics {
    today: BigNumber,
    yesterday: BigNumber
    thisweek: BigNumber,
    lastweek: BigNumber,
    thismonth: BigNumber,
    lastmonth: BigNumber,
    totalReferrals: number
    activeReferrals: number
    totalRewards: BigNumber
}