import React, { useState } from 'react';

import {
    DndContext, DragOverlay, KeyboardSensor, PointerSensor, useSensor, useSensors
} from '@dnd-kit/core';
import {
    arrayMove, rectSortingStrategy, SortableContext, sortableKeyboardCoordinates
} from '@dnd-kit/sortable';

import Card from './Card';
import { Draggable } from './Draggable';
import { Droppable } from './Droppable';
import List from './List';
import { Sortable } from './Sortable';

const ListOfDraggables = [
  { id: '1', name: 'Test string 1', type: 'social' },
  { id: '2', name: 'Description box goes here', type: 'description' },
  { id: '3', name: 'Avi', type: 'avatar' },
  { id: '4', name: 'Test string 1', type: 'social' },
  { id: '5', name: 'Description box goes here', type: 'description' },
  { id: '6', name: 'Avi', type: 'avatar' },
  { id: '7', name: 'Test string 1', type: 'social' },
  { id: '8', name: 'Description box goes here', type: 'description' },
  { id: '9', name: 'Avi', type: 'avatar' },
  { id: '10', name: 'Test string 1', type: 'social' },
  { id: '11', name: 'Description box goes here', type: 'description' },
  { id: '12', name: 'Avi', type: 'avatar' },
];
const SortItem = ({ id, name, type }) => {
  return (
    <Sortable id={id} name={name} type={type}>
      {name}
    </Sortable>
  );
};
const DragItem = ({ id, name, disabled, type }) => {
  return (
    <Draggable id={id} name={name} disabled={disabled} type={type}>
      {name}
    </Draggable>
  );
};

function BuildingBlocks() {
  const [activeId, setActiveId] = useState(null);
  const [activeName, setActiveName] = useState('');
  const [dropped, setDropped] = useState([]);
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  return (
    <DndContext
      sensors={sensors}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <List>
        {ListOfDraggables.map((item) => (
          <DragItem
            key={item.id}
            id={item.id}
            name={item.name}
            disabled={dropped.some((el) => el.id === item.id)}
            type={item.type}
          />
        ))}
      </List>

      <Droppable id={'B'}>
        <SortableContext
          strategy={rectSortingStrategy}
          items={dropped.length < 1 ? dropped : dropped.map((item) => item.id)}
        >
          {dropped.length >= 1 &&
            dropped.map((item) => (
              <SortItem
                key={item.id}
                id={item.id}
                name={item.name}
                type={item.type + '-sort'}
              />
            ))}
        </SortableContext>
      </Droppable>

      <DragOverlay>
        {activeId && (
          <Card id={activeId} dragging={true}>
            {activeName}
          </Card>
        )}
      </DragOverlay>
    </DndContext>
  );

  function handleDragStart(event) {
    setActiveName(event.active.data.current.name);
    setActiveId(event.active.id);
  }
  function handleDragEnd(event) {
    const { active, over } = event;
    if (active.id !== over.id) {
      if (dropped.length < 1) {
        setDropped(ListOfDraggables.filter((item) => item.id === active.id));
      } else if (!dropped.find((el) => el.id === active.id)) {
        // Checking if it already exists and if it doesn't then add the item
        const newItem = ListOfDraggables.filter(
          (item) => item.id === active.id
        );
        setDropped([...dropped, newItem[0]]);
      }
      console.log('being sorted');
      setDropped((items) => {
        const activeIndex = items.findIndex(({ id }) => id === active.id);
        const overIndex = items.findIndex(({ id }) => id === over.id);

        return arrayMove(items, activeIndex, overIndex);
      });
    }
    setActiveId(null);
  }
}

export default BuildingBlocks;
