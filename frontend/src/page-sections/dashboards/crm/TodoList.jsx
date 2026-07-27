import { useCallback, useState } from 'react';
// MUI
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Checkbox from '@mui/material/Checkbox';
import MenuItem from '@mui/material/MenuItem';
import LinearProgress from '@mui/material/LinearProgress';
import Typography from '@mui/material/Typography';
import { styled } from '@mui/material/styles';
// CUSTOM COMPONENTS
import { MoreButton } from '@/components/more-button';
import { FlexBox } from '@/components/flexbox';

// STYLED COMPONENT
const TodoItem = styled('div', {
  shouldForwardProp: prop => prop !== 'active'
})(({
  theme,
  active
}) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  paddingInline: '1rem',
  ...(active && {
    backgroundColor: theme.palette.action.selected,
    '& .title': {
      color: theme.palette.primary.main
    }
  })
}));
export default function TodoList() {
  const [todos, setTodos] = useState([{
    id: 1,
    title: 'Design a poster for a company',
    complete: true
  }, {
    id: 2,
    title: 'Analyze Data',
    complete: false
  }, {
    id: 3,
    title: 'YouTube campaign',
    complete: false
  }, {
    id: 4,
    title: 'Assign employee',
    complete: false
  }]);
  const handleCompleteTodo = useCallback(id => () => {
    setTodos(state => state.map(item => item.id === id ? {
      ...item,
      complete: !item.complete
    } : item));
  }, [setTodos]);
  const handleDeleteTodo = useCallback(id => {
    setTodos(state => state.filter(item => item.id !== id));
  }, [setTodos]);
  const totalCompletedTodo = todos.filter(item => item.complete).length;
  const percentageValue = Math.round(totalCompletedTodo * 100 / todos.length);
  return <Card>
      <Typography variant="h6" sx={{
      p: 3
    }}>
        To-do list
      </Typography>

      <FlexBox px={3} alignItems="center" gap={1}>
        <Typography variant="body2" fontWeight={500} color="primary.main">
          {percentageValue}%
        </Typography>

        <LinearProgress color="primary" variant="determinate" value={percentageValue} sx={{
        height: 8
      }} />
      </FlexBox>

      <Stack spacing={1} py={2}>
        {todos.map(({
        id,
        title,
        complete
      }) => <TodoItem key={id} active={complete}>
            <FlexBox alignItems="center">
              <Checkbox onChange={handleCompleteTodo(id)} checked={complete} />
              <Typography variant="body2" fontWeight={500} className="title" color="grey.500">
                {title}
              </Typography>
            </FlexBox>

            <MoreButton size="medium" renderOptions={handleClose => <MenuItem onClick={() => {
          handleClose();
          handleDeleteTodo(id);
        }}>
                  Delete
                </MenuItem>} />
          </TodoItem>)}
      </Stack>
    </Card>;
}