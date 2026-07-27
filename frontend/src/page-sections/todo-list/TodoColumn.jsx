import { useCallback, useState } from 'react';
import { Droppable } from '@hello-pangea/dnd';
import Typography from '@mui/material/Typography';
// CUSTOM COMPONENTS
import TodoCard from './TodoCard';
import TodoForm from './TodoForm';
import { Scrollbar } from '@/components/scrollbar';
// STYLED COMPONENT
import { DroppableWrapper, TodoColumnRoot } from './styles';
// CUSTOM TYPES

// ==============================================================

// ==============================================================

export default function TodoColumn({
  columnId,
  column,
  todos
}) {
  const [showForm, setForm] = useState(false);
  const SCROLLBAR_STYLES = {
    height: '100%',
    maxHeight: `calc(100% - ${columnId === 'todo' ? '124px' : '59px'})`,
    minHeight: `calc(100% - ${columnId === 'todo' ? '124px' : '59px'})`
  };
  const handleOpenForm = useCallback(() => {
    setForm(true);
  }, [setForm]);
  const handleCloseForm = useCallback(() => {
    setForm(false);
  }, [setForm]);
  return <TodoColumnRoot>
      {columnId === 'todo' ? <TodoForm title={column.name} show={showForm} handleOpen={handleOpenForm} handleClose={handleCloseForm} /> : <Typography variant="body1" fontWeight={500} p={2}>
          {column.name}
        </Typography>}

      <Scrollbar autoHide={false} sx={SCROLLBAR_STYLES}>
        <Droppable key={column.id} droppableId={column.id}>
          {provided => <DroppableWrapper ref={provided.innerRef} {...provided.droppableProps}>
              {column.todoIds.map((todoId, index) => <TodoCard key={todoId} index={index} todo={todos[todoId]} />)}

              {provided.placeholder}
            </DroppableWrapper>}
        </Droppable>
      </Scrollbar>
    </TodoColumnRoot>;
}