import * as React from 'react';

import AlertTriangle from 'react-feather/dist/icons/alert-triangle';
import './Error.scss';

const Error: React.FC<{ message: string }> = ({ message }) => {
  return (
    <div className="Error">
      <AlertTriangle size={56} />
      <p>{message}</p>
    </div>
  );
};

export default Error;
