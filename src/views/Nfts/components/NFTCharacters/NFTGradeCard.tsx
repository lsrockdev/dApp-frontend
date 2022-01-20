import React, { useState } from 'react'
import styled from 'styled-components'
import { Flex, Heading, Text } from '@pancakeswap/uikit';
import { NFTGradeConfig } from 'config/constants/nft/types'

const cardWrapper = styled.div`
`;

interface NFTGradeCardProps {
  grade: NFTGradeConfig
}

const NFTGradeCard: React.FC<NFTGradeCardProps> = ({ grade }) => {

  return (
    <Flex flexDirection="column" padding="12px">
      <img src={`/images/nft/${grade.image}`} alt={grade.grade}/>
      <Text bold color="primary" textAlign="center">{grade.grade.toString()}</Text>
      <Text textAlign="center"> {grade.qualityMin} - {grade.qualityMax}</Text>
    </Flex>
  )
}

export default NFTGradeCard
