import React, { lazy } from 'react'
import { Route } from 'react-router-dom'


const AuctionPage = lazy(() => import('./pages/AuctionPage/AuctionPage'))
const TradingPage = lazy(() => import('./pages/TradingPage/TradingPage'))
const BrowsePage = lazy(() => import('./pages/BrowePage/BrowsePage'))
const HistoryPage = lazy(() => import('./pages/HistoryPage/HistoryPage'))

const NFTMarketplace: React.FC = () => {
  return (
    <>
      <Route exact path="/nft-marketplace" component={BrowsePage} />
      <Route exact path="/nft-marketplace/auction" component={BrowsePage} />
      <Route exact path="/nft-marketplace/market" component={BrowsePage} />
      <Route exact path="/nft-marketplace/history" component={HistoryPage} />
      <Route exact path="/nft-marketplace/history/auction" component={HistoryPage} />
      <Route exact path="/nft-marketplace/history/market" component={HistoryPage} />
      <Route exact strict path="/nft-marketplace/auction/:id" component={AuctionPage} />
      <Route exact strict path="/nft-marketplace/market/:id" component={TradingPage} />
    </>
  )
}

export default NFTMarketplace
