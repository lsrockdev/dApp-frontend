import BigNumber from "bignumber.js";
import { GRAPH_API_REFERRAL } from 'config/constants/endpoints';
import request, { gql } from "graphql-request"
import { BIG_ZERO } from 'utils/bigNumber';
import { ReferralStatistics } from '../types';


interface ReferralResponse {
    amount: string
    user: string
    active: boolean
}

interface SimpleRewardResponse {
    amount: string
}

interface StatisticResponse {
    referrals: ReferralResponse[]
    today: SimpleRewardResponse[]
    yesterday: SimpleRewardResponse[]
    thisweek: SimpleRewardResponse[]
    lastweek: SimpleRewardResponse[]
    thismonth: SimpleRewardResponse[]
    lastmonth: SimpleRewardResponse[]
}

export const getReferralStatistics = async(address: string) : Promise<ReferralStatistics|undefined> => {
    
    const currentTs = Math.floor(new Date().getTime() / 1000);
    const startOfToday = Math.floor(currentTs / 86400) * 86400;
    const endOfToday = startOfToday + 86400;
    const startOfYesterday = startOfToday - 86400;
    const endOfYesterday = startOfYesterday + 86400;
    const startOfThisWeek = startOfToday - 86400 * 6;
    const endOfThisWeek = startOfThisWeek + 86400 * 7;
    const startOfLastWeek = startOfThisWeek - 86400 * 7;
    const endOfLastWeek = startOfThisWeek;
    const startOfThisMonth = startOfToday - 86400 * 29;
    const endOfThisMonth = startOfThisMonth + 86400 * 30;
    const startOfLastMonth = startOfThisMonth - 86400 * 30;
    const endOfLastMonth = startOfThisMonth;
    const query = `
        query get_statistics {
            referrals: referrals(where:{referrer:"${address}"}) {
                active
                amount
                user
            },
            today:referralRewards(where:{referrer:"${address}", timestamp_gte: ${startOfToday}, timestamp_lt:${endOfToday}}) {
                amount
            },
            yesterday:referralRewards(where:{referrer:"${address}", timestamp_gte: ${startOfYesterday}, timestamp_lt:${endOfYesterday}}) {
                amount
            },
            thisweek:referralRewards(where:{referrer:"${address}", timestamp_gte: ${startOfThisWeek}, timestamp_lt:${endOfThisWeek}}) {
                amount
            },
            lastweek:referralRewards(where:{referrer:"${address}", timestamp_gte: ${startOfLastWeek}, timestamp_lt:${endOfLastWeek}}) {
                amount
            },
            thismonth:referralRewards(where:{referrer:"${address}", timestamp_gte: ${startOfThisMonth}, timestamp_lt:${endOfThisMonth}}) {
                amount
            },
            lastmonth:referralRewards(where:{referrer:"${address}", timestamp_gte: ${startOfLastMonth}, timestamp_lt:${endOfLastMonth}}) {
                amount
            }
        }
    `

    try {
        const data = await request<StatisticResponse>(GRAPH_API_REFERRAL, query)
        // let [today, yesterday, thisweek, lastweek, thismonth, lastmonth, totalRewards] 
            // = [BIG_ZERO, BIG_ZERO, BIG_ZERO, BIG_ZERO, BIG_ZERO, BIG_ZERO, , BIG_ZERO]
        const totalReferrals = data.referrals.length
        const activeReferrals = data.referrals.filter((a) => a.active).length

        
        const today = data.today.reduce((accum, referral) => accum.plus(new BigNumber(referral.amount)), BIG_ZERO)
        const yesterday = data.yesterday.reduce((accum, referral) => accum.plus(new BigNumber(referral.amount)), BIG_ZERO)
        const thisweek = data.thisweek.reduce((accum, referral) => accum.plus(new BigNumber(referral.amount)), BIG_ZERO)
        const lastweek = data.lastweek.reduce((accum, referral) => accum.plus(new BigNumber(referral.amount)), BIG_ZERO)
        const thismonth = data.thismonth.reduce((accum, referral) => accum.plus(new BigNumber(referral.amount)), BIG_ZERO)
        const lastmonth = data.lastmonth.reduce((accum, referral) => accum.plus(new BigNumber(referral.amount)), BIG_ZERO)

        const totalRewards = data.referrals.reduce((accum, referral) => accum.plus(new BigNumber(referral.amount)), BIG_ZERO)

        return {
            today,
            yesterday,
            thisweek,
            lastweek,
            thismonth,
            lastmonth,
            totalRewards,
            totalReferrals,
            activeReferrals,
        }
    } catch (error) {
        console.error('Failed to fetch auction data', error)
        return undefined;
    }
}