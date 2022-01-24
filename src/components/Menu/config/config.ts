import { MenuItemsType, DropdownMenuItemType } from '@pancakeswap/uikit'
import { ContextApi } from 'contexts/Localization/types'
import { nftsBaseUrl } from 'views/Nft/market/constants'

export type ConfigMenuItemsType = MenuItemsType & { hideSubNav?: boolean }

const config: (t: ContextApi['t']) => ConfigMenuItemsType[] = (t) => [
  // {
  //   label: t('Home'),
  //   href: 'https://spy-token.io/',
  //   icon: '',
  //   items: [],
  // },
  // {
  //   label: t('Tokenomy'),
  //   href: '/tokenomy',
  //   icon: '',
  //   items: [],
  // },
  {
    label: t('Trade'),
    href: '/swap',
    icon: 'Trade',
    items: [
      {
        label: t('Exchange'),
        href: '/swap',
      },
      {
        label: t('Liquidity'),
        href: '/liquidity',
      },
    ],
  },
  // {
  //   label: t('Exchange'),
  //   icon: 'Trade',
  //   href: '/swap',
  //   showItemsOnMobile: false,
  //   items: [],
  // },
  // {
  //   label: t('Liquidity'),
  //   href: '/liquidity',
  //   icon: 'Pool',
  //   items: [],
  // },
  {
    label: t('Earn'),
    href: '/Farms',
    icon: 'Earn',
    items: [
      {
        label: t('Farms'),
        href: '/farms',
      },
      // {
      //   label: t('Pools'),
      //   href: '/pools',
      // },
    ],
  },
  // {
  //   label: t('Referral'),
  //   href: '/referral',
  //   icon: 'Ticket',
  //   items: [],
  // },
  {
    label: t('Referral'),
    href: '/referral',
    icon: 'Ticket',
    items: [
      {
        label: t('Referral'),
        href: '/referral',
      },
  //     {
  //       label: t('Audit'),
  //       href: '',
  //     },
  //     {
  //       label: t('Whitepaper'),
  //       href: '',
  //     },
  //     {
  //       label: t('Roadmap'),
  //       href: '',
  //     },
  //     {
  //       label: t('Founder'),
  //       href: '',
  //     },
  //     {
  //       label: t('Partner'),
  //       href: '',
  //     },
    ],
  },
  {
    label: t('NFTs'),
    href: '/nfts',
    icon: 'Nft',
    items: [
    ],
  },
  // {
  //   label: t('Join Telegram'),
  //   href: '',
  //   icon: '',
  //   items: [
  //     {
  //       label: t('Indonesian Group'),
  //       href: '',
  //     },
  //     {
  //       label: t('Global Group'),
  //       href: '',
  //     },
  //     {
  //       label: t('Tokie Indonesia'),
  //       href: '',
  //     },
  //   ],
  // },
  // {
  //   label: t('Win'),
  //   href: '/prediction',
  //   icon: 'Trophy',
  //   items: [
  //     {
  //       label: t('Prediction (BETA)'),
  //       href: '/prediction',
  //     },
  //     {
  //       label: t('Lottery'),
  //       href: '/lottery',
  //     },
  //   ],
  // },
  // {
  //   label: t('NFT'),
  //   href: `${nftsBaseUrl}`,
  //   icon: 'Nft',
  //   items: [
  //     {
  //       label: t('Overview'),
  //       href: `${nftsBaseUrl}`,
  //     },
  //     {
  //       label: t('Collections'),
  //       href: `${nftsBaseUrl}/collections`,
  //     },
  //   ],
  // },
  // {
  //   label: '',
  //   href: '/info',
  //   icon: 'More',
  //   hideSubNav: true,
  //   items: [
  //     {
  //       label: t('Info'),
  //       href: '/info',
  //     },
  //     {
  //       label: t('IFO'),
  //       href: '/ifo',
  //     },
  //     {
  //       label: t('Voting'),
  //       href: '/voting',
  //     },
  //     {
  //       type: DropdownMenuItemType.DIVIDER,
  //     },
  //     {
  //       label: t('Leaderboard'),
  //       href: '/teams',
  //     },
  //     {
  //       type: DropdownMenuItemType.DIVIDER,
  //     },
  //     {
  //       label: t('Blog'),
  //       href: 'https://medium.com/pancakeswap',
  //       type: DropdownMenuItemType.EXTERNAL_LINK,
  //     },
  //     {
  //       label: t('Docs'),
  //       href: 'https://docs.pancakeswap.finance',
  //       type: DropdownMenuItemType.EXTERNAL_LINK,
  //     },
  //   ],
  // },
]

export default config
