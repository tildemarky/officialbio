import { useState } from 'react';

import { styled } from '../../stitches.config';
import { supabase } from '../../utils/supabaseClient';

const LoginButton = styled('button', {
  textTransform: 'capitalize',
  border: '1px solid $gray12',
  borderRadius: '$button',
  padding: '1rem',
  margin: '0.25rem 0',
  color: '$gray12',
  cursor: 'pointer',
  fontWeight: 'bold',
  fontFamily: '$body',
  fontSize: '$base',
  '&:hover': {
    backgroundColor: 'transparent',
  },
});

const ThirdPartySign = ({ id, name, brand }) => {
  const [loading, setLoading] = useState(false);

  const handleThirdPartyLogin = async (provider) => {
    try {
      setLoading(true);
      const { user, session, error } = await supabase.auth.signIn(
        {
          provider: provider,
        },
        { redirectTo: process.env.NEXT_PUBLIC_REDIRECT_PAGE }
      );
      if (error) throw error;
    } catch (error) {
      alert(error.error_description || error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <LoginButton
      onClick={() => handleThirdPartyLogin(name)}
      type='button'
      css={{
        backgroundColor: 'transparent',
        '&:hover': {
          color: brand,
          border: `1px solid ${brand}`,
        },
      }}
    >
      {name}
    </LoginButton>
  );
};

export default ThirdPartySign;
