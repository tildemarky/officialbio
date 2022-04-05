import React, { useState } from 'react';

import { styled } from '../../stitches.config';

const DropBucket = styled('div', {
  backgroundColor: '$gray10',
  width: '100%',
  flex: 1,
});

const DropTarget = ({ itemDropped, children }) => {
  const [isOver, setIsOver] = useState(false);

  const dragOver = (e) => {
    e.preventDefault();
  };
  const dragDrop = (e) => {
    const droppedItem = e.dataTransfer.getData('drag-item');
    if (droppedItem) {
      itemDropped(droppedItem);
    }
    setIsOver(false);
  };
  const dragEnter = (e) => {
    setIsOver(true);
  };
  const dragExit = () => setIsOver(false);

  return (
    <DropBucket
      onDragOver={dragOver}
      onDrop={dragDrop}
      onDragEnter={dragEnter}
      onDragLeave={dragExit}
    >
      {children}
    </DropBucket>
  );
};

export default DropTarget;
