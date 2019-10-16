import React from 'react';
import { ThemeProvider } from '@chakra-ui/core';
import { css, Global } from '@emotion/core';
import { BrowserRouter as Router, Route } from 'react-router-dom';

import Sidebar from './components/Sidebar';

import ServerFails from './views/ServerFails';
import SlowConnection from './views/SlowConnection';

import './App.scss';

const background = css`
  body,
  html {
    background-color: rgb(245, 245, 250);
  }
  * {
    box-sizing: border-box;
    -webkit-box-sizing: border-box;
  }
`;

const App: React.FC = () => {
  return (
    <Router>
      <ThemeProvider>
        <Global styles={background}></Global>
        <div className="Content">
          <Sidebar />
          <div className="example">
            <Route path="/slow-connection" component={SlowConnection} />
            <Route path="/" component={ServerFails} exact />
          </div>
        </div>
      </ThemeProvider>
    </Router>
  );
};

export default App;
