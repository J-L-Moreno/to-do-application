import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import EditToDo from '../Components/EditToDo';
import { ToDo } from '../Models/Models';
import dayjs from 'dayjs';

const mockToDo: ToDo = {
    id: 1,
    text: 'Test ToDo',
    priority: 'MEDIUM',
    dueDate: dayjs().toISOString(),
    done: false,
    creationDate: dayjs().subtract(1, 'day').toISOString(),
    doneDate: null
};

const mockOnToDoEdited = jest.fn();

beforeAll(() => {
    window.alert = jest.fn();
});

describe('EditToDo Component', () => {
    beforeEach(() => {
        render(<EditToDo toDo={mockToDo} onToDoEdited={mockOnToDoEdited} />);
    });

    test('validates empty name', async () => {
        const editButton = screen.getByText('Edit');
        fireEvent.click(editButton);

        const nameInput = screen.getByLabelText('Name');
        fireEvent.change(nameInput, { target: { value: '' } });

        const saveButton = screen.getByText('Edit to do');
        fireEvent.click(saveButton);

        expect(window.alert).toHaveBeenCalledWith('The name of the to-do cannot be blank.');
    });

    test('validates name length', async () => {
        const editButton = screen.getByText('Edit');
        fireEvent.click(editButton);

        const nameInput = screen.getByLabelText('Name');
        fireEvent.change(nameInput, { target: { value: 'a'.repeat(121) } });

        const saveButton = screen.getByText('Edit to do');
        fireEvent.click(saveButton);

        expect(window.alert).toHaveBeenCalledWith('The name of the to-do cannot exceed 120 characters.');
    });

    test('calls onToDoEdited on successful edit', async () => {
        const editButton = screen.getByText('Edit');
        fireEvent.click(editButton);

        const nameInput = screen.getByLabelText('Name');
        fireEvent.change(nameInput, { target: { value: 'Updated ToDo' } });

        const saveButton = screen.getByText('Edit to do');
        fireEvent.click(saveButton);

        expect(mockOnToDoEdited).toHaveBeenCalled();
    });
});