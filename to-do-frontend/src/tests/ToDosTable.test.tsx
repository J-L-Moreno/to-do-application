import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import { ToDosTable } from '../Components/ToDosTable';
import { ToDo } from '../Models/Models';

const mockToDos: ToDo[] = [
    { id: 1, text: 'Test ToDo 1', priority: 'HIGH', dueDate: new Date().toISOString(), done: false, creationDate: new Date().toISOString(), doneDate: null },
    { id: 2, text: 'Test ToDo 2', priority: 'MEDIUM', dueDate: null, done: false, creationDate: new Date().toISOString(), doneDate: null }
];

const mockRefreshToDos = jest.fn();
const mockSetSortByPriorityAsc = jest.fn();
const mockSetSortByPriorityDes = jest.fn();
const mockSetSortByDueDateAsc = jest.fn();
const mockSetSortByDueDateDes = jest.fn();

describe('ToDosTable Component', () => {
    beforeEach(() => {
        render(
            <ToDosTable
                posiblePages={1}
                toDos={mockToDos}
                generalCheck={false}
                onGeneralCheckChange={jest.fn()}
                refreshToDos={mockRefreshToDos}
                setSortByPriorityAsc={mockSetSortByPriorityAsc}
                setSortByPriorityDes={mockSetSortByPriorityDes}
                setSortByDueDateAsc={mockSetSortByDueDateAsc}
                setSortByDueDateDes={mockSetSortByDueDateDes}
            />
        );
    });

    test('calls setSortByPriorityAsc on ascending priority sort button click', () => {
        const sortAscButton = screen.getAllByText('↑')[0];
        fireEvent.click(sortAscButton);
        expect(mockSetSortByPriorityAsc).toHaveBeenCalled();
    });

    test('calls setSortByPriorityDes on descending priority sort button click', () => {
        const sortDesButton = screen.getAllByText('↓')[0];
        fireEvent.click(sortDesButton);
        expect(mockSetSortByPriorityDes).toHaveBeenCalled();
    });

    test('calls setSortByDueDateAsc on ascending due date sort button click', () => {
        const sortAscButton = screen.getAllByText('↑')[1];
        fireEvent.click(sortAscButton);
        expect(mockSetSortByDueDateAsc).toHaveBeenCalled();
    });

    test('calls setSortByDueDateDes on descending due date sort button click', () => {
        const sortDesButton = screen.getAllByText('↓')[1];
        fireEvent.click(sortDesButton);
        expect(mockSetSortByDueDateDes).toHaveBeenCalled();
    });
});