import React from 'react';
import ServerFails from './views/ServerFails';
import SlowConnection from './views/SlowConnection';

import { ThemeProvider } from '@chakra-ui/core';
import { css, Global } from '@emotion/core';

import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';

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
    <Router>
      <ThemeProvider>
        <Global styles={background}></Global>
        <Route path="/server-fail/" component={ServerFails} />
        <Route path="/slow-connection/" component={SlowConnection} />
      </ThemeProvider>
    </Router>
  );
};

export default App;
