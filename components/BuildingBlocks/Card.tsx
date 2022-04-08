import React from 'react';

import { styled } from '../../stitches.config';

const StyledCard = styled('div', {
  minWidth: '6rem',
  minHeight: '6rem',
  backgroundColor: '$gray1',
  padding: '1rem',
  boxShadow: '$low',
  borderRadius: '$image',
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  variants: {
    type: {
      wide: {
        minWidth: '20rem',
        height: '100%',
      },
      square: {
        width: '6rem',
        height: '6rem',
      },
    },
  },
});

const Card = ({ type, children }) => {
  return <StyledCard type={type}>{children}</StyledCard>;
};

export default Card;
