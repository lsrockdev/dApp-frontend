import React from 'react'
import styled from 'styled-components'
import { Flex, Heading } from '@pancakeswap/uikit'
import { useTranslation } from 'contexts/Localization'
import { nftGrades } from 'config/constants/nft'
import NFTGradeCard from './NFTGradeCard'

const Wrapper = styled.div`
    flex: 1 1 0;
    max-width: 100%;
    width: 100%;
    padding: 16px;
    ${({ theme }) => theme.mediaQueries.md} {
        max-width: 50%;
    }
`

const Group = styled(Flex)`
    padding: 12px;
    border-radius: 12px;
    border: 1px solid ${({ theme }) => theme.colors.cardBorder};
`

const Grades = styled(Flex)`

    & > * {
        max-width: 50%;
        flex: 1 1 50%;
        width: 50%;
    }

    ${({ theme }) => theme.mediaQueries.sm} {
        & > * {
            max-width: 50%;
            flex: 1 1 50%;
            width: 50%;
            min-width: 50%;
        }
    }

    ${({ theme }) => theme.mediaQueries.md} {
        & > * {
            max-width: 33%;
            flex: 1 1 33%;
            width: 33%;
            min-width: 33%;
        }
    }
`


const NFTCharacters: React.FC = () => {
    const { t } = useTranslation()
    return (
        <>
            <Wrapper>
                <Group flexDirection="column">
                    <Heading padding="12px 0px 12px 14px">{t('All NFTs Characters')}</Heading>
                    <Grades flexWrap="wrap">
                        {
                            nftGrades.map((grade) => (
                                <NFTGradeCard grade={grade} key={grade.level} />
                            ))
                        }
                    </Grades>
                </Group>
                
            </Wrapper>
        
        </>
    )
}

export default NFTCharacters