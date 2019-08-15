import * as React from 'react';
import { css } from 'emotion';
import { Box, Image, Flex, Badge, Text } from '@chakra-ui/core';

const style = css`
  padding: 16px;
  border-radius: 4px;
  background-color: #fff;
  box-shadow: 0 5px 15px 0 rgba(37, 44, 97, 0.15), 0 2px 4px 0 rgba(93, 100, 148, 0.2);
`;

interface ResultHit {}

const Result: React.FC = () => {
  return (
    <Box className={style}>
      <Image rounded="md" src="http://bit.ly/2k1H1t6" />
      <Flex align="baseline" mt={2}>
        <Badge variantColor="pink">Plus</Badge>
        <Text ml={2} textTransform="uppercase" fontSize="sm" fontWeight="bold" color="pink.800">
          Verified &bull; Cape Town
        </Text>
      </Flex>
      <Text mt={2} fontSize="xl" fontWeight="semibold" lineHeight="short">
        Modern, Chic Penthouse with Mountain, City & Sea Views
      </Text>
      <Text mt={2}>$119/night</Text>
      <Flex mt={2} align="center">
        <Box color="orange.400" />
        <Text ml={1} fontSize="sm">
          <b>4.84</b> (190)
        </Text>
      </Flex>
    </Box>
  );
};

export default Result;
