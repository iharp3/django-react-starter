import { createContext, useState } from "react";
import PropTypes from 'prop-types';

export const BoundsContext = createContext();

export const BoundsProvider = ({ children }) => {
  const [drawnShapeBounds, setDrawnShapeBounds] = useState(null);

  return (
    <BoundsContext.Provider value={{ drawnShapeBounds, setDrawnShapeBounds }}>
      {children}
    </BoundsContext.Provider>
  );
};

BoundsProvider.propTypes = {
  children: PropTypes.any, 
};