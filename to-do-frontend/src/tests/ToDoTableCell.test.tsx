import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import { ToDoTableCell } from '../Components/ToDoTableCell';
import { ToDo } from '../Models/Models';

const mockToDo: ToDo = {
    id: 1,
    text: 'Test ToDo',
    priority: 'MEDIUM',
    dueDate: null,
    done: false,
    creationDate: new Date().toISOString(),
    doneDate: null
};

const mockRefreshToDos = jest.fn();

describe('ToDoTableCell Component', () => {
    beforeEach(() => {
        render(
            <ToDoTableCell
                toDo={mockToDo}
                refreshToDos={mockRefreshToDos}
            />
        );
    });

    test('calls refreshToDos on delete button click', async () => {
        const deleteButton = screen.getByText('Delete');
        fireEvent.click(deleteButton);
        expect(mockRefreshToDos).toHaveBeenCalled();
    });
});