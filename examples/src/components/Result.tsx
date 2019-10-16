import * as React from 'react';
import { css } from 'emotion';
import { Box, Image, Flex, Badge, Text, Button } from '@chakra-ui/core';

const style = css`
  padding: 16px;
  border-radius: 4px;
  background-color: #fff;
  box-shadow: 0 5px 15px 0 rgba(37, 44, 97, 0.15), 0 2px 4px 0 rgba(93, 100, 148, 0.2);
`;

const imgStyle = css`
  width: 100%;
  min-height: 180px;
  object-fit: cover;
`;

const Result: React.FC = () => {
  return (
    <Box className={style}>
      <Image className={imgStyle} rounded="md" src="http://bit.ly/2k1H1t6" />
      <Flex align="baseline" mt={2}>
        <Badge variantColor="pink">Plus</Badge>
        <Text ml={2} textTransform="uppercase" fontSize="sm" fontWeight="bold" color="pink.800">
          Verified &bull; Cape Town
        </Text>
      </Flex>
      <Text mt={2}>$119/night</Text>
      <Button onClick={() => alert('All set, enjoy the weekend!')}>Book now!</Button>
    </Box>
  );
};

export default Result;
