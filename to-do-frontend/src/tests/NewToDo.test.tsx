import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import NewToDo from '../Components/NewToDo';

const mockOnToDoCreated = jest.fn();

describe('NewToDo Component', () => {
    beforeEach(() => {
        render(<NewToDo onToDoCreated={mockOnToDoCreated} />);
    });

    test('validates empty name', async () => {
        const newToDoButton = screen.getByText('+ New To Do');
        fireEvent.click(newToDoButton);

        const nameInput = screen.getByLabelText('Name');
        fireEvent.change(nameInput, { target: { value: '' } });

        const saveButton = screen.getByText('Create to do');
        fireEvent.click(saveButton);

        expect(window.alert).toHaveBeenCalledWith('The name of the to-do cannot be blank.');
    });

    test('validates name length', async () => {
        const newToDoButton = screen.getByText('+ New To Do');
        fireEvent.click(newToDoButton);

        const nameInput = screen.getByLabelText('Name');
        fireEvent.change(nameInput, { target: { value: 'a'.repeat(121) } });

        const saveButton = screen.getByText('Create to do');
        fireEvent.click(saveButton);

        expect(window.alert).toHaveBeenCalledWith('The name of the to-do cannot exceed 120 characters.');
    });

    test('calls onToDoCreated on successful creation', async () => {
        const newToDoButton = screen.getByText('+ New To Do');
        fireEvent.click(newToDoButton);

        const nameInput = screen.getByLabelText('Name');
        fireEvent.change(nameInput, { target: { value: 'New ToDo' } });

        const saveButton = screen.getByText('Create to do');
        fireEvent.click(saveButton);

        expect(mockOnToDoCreated).toHaveBeenCalled();
    });
});