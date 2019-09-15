import React from 'react';
import ServerFails from './views/ServerFails';
import { ThemeProvider } from '@chakra-ui/core';
import { Global, css } from '@emotion/core';

const background = css`
  body,
  html {
    background-color: rgb(245, 245, 250);
  }
  * {
    box-sizing: border-box;
  }
`;

const App: React.FC = () => {
  return (
    <ThemeProvider>
      <Global styles={background}></Global>

      <ServerFails />
    </ThemeProvider>
  );
};

export default App;
