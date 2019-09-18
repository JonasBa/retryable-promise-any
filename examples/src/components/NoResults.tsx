import * as React from 'react';

import Frown from 'react-feather/dist/icons/frown';
import './NoResults.scss';

const NoResults: React.FC = () => {
  return (
    <div className="NoResults">
      <Frown size={56} />
      <p>Couldn't find any results...</p>
    </div>
  );
};

export default NoResults;
