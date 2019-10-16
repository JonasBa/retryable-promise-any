import * as React from 'react';
import { Link } from 'react-router-dom';

import './Sidebar.scss';

const Sidebar: React.FC = () => {
  return (
    <aside className="Sidebar">
      <h3 className="Sidebar_title">Retryable-promise-any</h3>

      <h4>Examples:</h4>
      <ul>
        <li>
          <Link to="/">Struggling server</Link>
        </li>
        <li>
          <Link to="/slow-connection">Slow connection</Link>
        </li>
      </ul>
    </aside>
  );
};

export default Sidebar;
