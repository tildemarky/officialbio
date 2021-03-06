import { useEffect, useState } from 'react';
import { styled } from '../../stitches.config';
import { supabase } from '../../utils/supabaseClient';
import Avatar from '../Avatar';
import strings from '../../locales/en/strings';
import Button from '../Button';
import { uploadAvatar } from './helpers';
import UploadButton from '../AccountSettings/UploadButton';
import { useRouter } from 'next/router';
import Link from 'next/link';

const Container = styled('div', {
  display: 'flex',
  flexDirection: 'column',
  '@xl': {
    flexDirection: 'row',
  },
});
const Subtitle = styled('label', {
  display: 'block',
  fontSize: '$lg',
  '&:not(:first-of-type)': {
    marginTop: '0.5rem',
  },
});
const AvatarContainer = styled('div', {
  display: 'inline-flex',
  flexDirection: 'column',
});
const AvatarBox = styled('div', {
  margin: 'auto',
});
const NonAvatarContainer = styled('div', {
  flex: 2,
  paddingTop: '0.5rem',
  '@xl': {
    paddingTop: 'initial',
    paddingLeft: '1rem',
    paddingRight: '1rem',
  },
});
const BASE_INPUT_STYLES = {
  backgroundColor: '$gray4',
  padding: '1rem',
  border: 'none',
  boxShadow: `rgba(0, 0, 0, 0.06) 0px 2px 4px 0px inset`,
  fontSize: '$base',
  fontFamily: 'system-ui',
  borderRadius: '$image',
};
const NameInput = styled('input', {
  '@supports (width: -moz-available)': {
    width: '-moz-available',
  },
  '@supports (width: -webkit-fill-available)': {
    width: '-webkit-fill-available',
  },
  ...BASE_INPUT_STYLES,
});
const TextBox = styled('textarea', {
  resize: 'none',
  height: '150px',
  '@supports (width: -moz-available)': {
    width: '-moz-available',
  },
  '@supports (width: -webkit-fill-available)': {
    width: '-webkit-fill-available',
  },
  ...BASE_INPUT_STYLES,
});
const ButtonGroup = styled('div', {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  marginTop: '0.5rem',
  '& > button': {
    order: 2,
  },
  '& > a': {
    display: 'none',
  },
  '@lg': {
    '& > a': {
      display: 'block',
    },
  },
  '@xl': {
    '& > button': {
      order: 1,
    },
  },
});
const StyledLink = styled('a', {
  display: 'inline-block',
  color: '$gray12',
  borderBottom: '2px solid $gray12',
  padding: '0 0.25rem',
  transition: '$main',
  '&:hover': {
    backgroundColor: '$gray12',
    color: '$gray1',
    borderRadius: '$button',
  },
});

const AvatarSection = ({ avatar, setAvatar }) => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const upload = (e, setAvatar) => {
    setLoading(true);
    uploadAvatar(e, setAvatar);

    if (uploadAvatar) {
      setTimeout(() => {
        setLoading(false);
        router.reload();
      }, 2000);
    }
  };
  return (
    <AvatarContainer>
      <Subtitle>{strings.account.avatar}</Subtitle>
      <AvatarBox>
        <Avatar url={avatar} size={150} initials={undefined} type={undefined} />
      </AvatarBox>
      <UploadButton onUpload={(e) => upload(e, setAvatar)} loading={loading} />
    </AvatarContainer>
  );
};

const NameSection = ({ name, setName }) => {
  return (
    <>
      <Subtitle htmlFor='name-input'>{strings.account.name}</Subtitle>
      <NameInput
        type='text'
        required
        value={name}
        onChange={(e) => setName(e.target.value)}
        id='name-input'
      />
    </>
  );
};

const Bio = ({ description, setDesc }) => {
  return (
    <>
      <Subtitle htmlFor='bio-input'>{strings.account.description}</Subtitle>
      <TextBox
        value={description}
        onChange={(e) => setDesc(e.target.value)}
        id='bio-input'
      />
    </>
  );
};

const DescriptionForm = () => {
  const [name, setName] = useState('');
  const [desc, setDesc] = useState('');
  const [avatar, setAvatar] = useState('');
  const [disableButton, setDisableButton] = useState(false);

  useEffect(() => {
    async function fetchProfile() {
      const user = supabase.auth.user();

      const { data, error } = await supabase
        .from('profiles')
        .select(`pubName, description, avatar_url`)
        .eq('id', user.id)
        .single();

      if (data) {
        setName(data.pubName);
        setDesc(data.description);
        setAvatar(data.avatar_url);
      }
    }
    fetchProfile();
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    updateProfiles();
  };

  const updateProfiles = async () => {
    setDisableButton(true);
    const user = supabase.auth.user();

    const updates = {
      id: user.id,
      pubName: name,
      description: desc,
      updated_at: new Date(),
    };

    let { error } = await supabase.from('profiles').upsert(updates, {
      returning: 'minimal', // Don't return the value after inserting
    });

    if (!error) {
      setTimeout(() => {
        setDisableButton(false);
      }, 1000);
    }
  };

  return (
    <Container>
      <AvatarSection avatar={avatar} setAvatar={setAvatar} />
      <NonAvatarContainer>
        <NameSection name={name} setName={setName} />
        <Bio description={desc} setDesc={setDesc} />

        <ButtonGroup>
          <Button
            type='button'
            onClick={(e) => handleSubmit(e)}
            disabled={disableButton}
            version={undefined}
            loading={false}
          >
            {strings.account.save}
          </Button>

          <Link href={`/user/${name}`} passHref>
            <StyledLink>Visit your live profile</StyledLink>
          </Link>
        </ButtonGroup>
      </NonAvatarContainer>
    </Container>
  );
};

export default DescriptionForm;
