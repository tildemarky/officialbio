import { useEffect, useState } from 'react';

import strings from '../../locales/en/strings';
import { styled } from '../../stitches.config';
import { supabase } from '../../utils/supabaseClient';
import Avatar from '../Avatar';
import ShareButton from './ShareButton';
import Toast from './Toast';

const CardFlex = styled('div', {
  display: 'flex',
  padding: '1rem',
  backgroundColor: '$gray1',
  borderRadius: '$button',
  boxShadow: '$low',
  marginBottom: '1rem',
});
const CardArticle = styled('article', {
  marginLeft: '0.5rem',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'space-between',
});
const Title = styled('h2', {
  margin: '0 0 0.5rem 0',
});
const Description = styled('h3', {
  margin: '0',
  fontWeight: 'normal',
  fontSize: 'medium',
  fontFamily: '$body',
  lineHeight: '1.2em',
});
const ShareSection = styled('div', {
  display: 'flex',
  alignItems: 'center',
  marginTop: '0.5rem',
});
const TempMessage = styled('span', {
  color: 'green',
  marginLeft: '0.5rem',
});

const ContactCard = ({ name, avatar }) => {
  const [status, setStatus] = useState(false);
  const [open, setOpen] = useState(false);
  const [description, setDescription] = useState('');

  useEffect(() => {
    getProfile();
  }, []);

  const getProfile = async () => {
    try {
      const user = supabase.auth.user();
      const { data, error } = await supabase
        .from('profiles')
        .select(`pubName, website, description, avatar_url`)
        .eq('id', user.id)
        .single();
      if (data) {
        setDescription(data.description);
      }
    } catch (error) {
      console.log('Error getting profile: ', error.message);
    }
  };

  const shareLink = () => {
    clear();

    navigator.clipboard.writeText(window.location.href);
    console.log(window.location.href);

    setStatus(true);
    setOpen(true);

    const timer = setTimeout(() => setStatus(false), 4000);

    function clear() {
      clearTimeout(timer);
    }
  };

  return (
    <CardFlex>
      <div>
        <Avatar url={avatar} size={120} type='square' initials={undefined} />
      </div>
      <CardArticle>
        <Title>{name}</Title>
        {description && <Description>{description}</Description>}
        <ShareSection>
          <ShareButton onClick={shareLink}>{strings.public.share}</ShareButton>
          <Toast
            open={open}
            setOpen={setOpen}
            title={strings.public.shareTitle}
            description={strings.public.shareDescription}
            close={strings.public.shareButton}
          />
        </ShareSection>
      </CardArticle>
    </CardFlex>
  );
};

export default ContactCard;
