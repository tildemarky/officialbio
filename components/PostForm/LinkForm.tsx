import { BaseInput, StyledLabel } from './PostForm';
import { useState } from 'react';
import { styled } from '../../stitches.config';
import Button from '../Button';
import strings from '../../locales/en/strings';
import { addLinkToProfile } from './helpers';

const InputSeparator = styled('span', {
  display: 'block',
  height: '1rem',
});
const ButtonSpacer = styled('span', {
  display: 'block',
  height: '0.5rem',
});

function LinkForm({ refreshLinks, setLinkText, setLinkUrl }) {
  const [link, setLink] = useState('');
  const [text, setText] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    setLinkText(link);
    setLinkUrl(text);
    addLinkToProfile(link, text);
    refreshLinks();
  };

  return (
    <>
      <StyledLabel htmlFor='link' as='label'>
        Step One: Enter your link
      </StyledLabel>
      <BaseInput
        id='link'
        type='url'
        required
        onChange={(e) => setLink(e.target.value)}
      />
      <InputSeparator />
      <StyledLabel htmlFor='link-text' as='label'>
        Step Two: Label your link
      </StyledLabel>
      <BaseInput
        id='link-text'
        type='text'
        required
        onChange={(e) => setText(e.target.value)}
      />
      <ButtonSpacer />
      <Button
        type='submit'
        onClick={(e) => handleSubmit(e)}
        disabled={undefined}
        version={undefined}
        loading={undefined}
      >
        {strings.musings.addLink}
      </Button>
    </>
  );
}

export default LinkForm;
