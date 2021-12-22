import React from 'react'
import styled from 'styled-components'
import PageSection from 'components/PageSection'
import { PageMeta } from 'components/Layout/Page'
import Hero from './components/Hero'

const StyledHeroSection = styled(PageSection)`
  padding-top: 16px;

  ${({ theme }) => theme.mediaQueries.md} {
    padding-top: 48px;
  }
`

const Referral: React.FC = () => {

  return (
    <>
      <PageMeta />
      <StyledHeroSection
        index={2}
      >
        <Hero />
      </StyledHeroSection>

    </>
  )
}

export default Referral