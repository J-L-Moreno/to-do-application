import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import { SearchControlls } from '../Components/SearchControlls';

const mockOnNewText = jest.fn();
const mockOnNewPriority = jest.fn();
const mockOnNewState = jest.fn();
const mockOnSearch = jest.fn();

describe('SearchControlls Component', () => {
    beforeEach(() => {
        render(
            <SearchControlls
                text=""
                onNewText={mockOnNewText}
                priority={-1}
                onNewPriority={mockOnNewPriority}
                state={-1}
                onNewState={mockOnNewState}
                onSearch={mockOnSearch}
            />
        );
    });

    test('calls onNewText on text change', () => {
        const nameInput = screen.getByLabelText('Name');
        fireEvent.change(nameInput, { target: { value: 'Test' } });

        expect(mockOnNewText).toHaveBeenCalledWith(expect.any(Object));
    });

    test('calls onNewPriority on priority change', () => {
        const prioritySelect = screen.getByLabelText('Priority');
        fireEvent.change(prioritySelect, { target: { value: 2 } });

        expect(mockOnNewPriority).toHaveBeenCalledWith(expect.any(Object));
    });

    test('calls onNewState on state change', () => {
        const stateSelect = screen.getByLabelText('State');
        fireEvent.change(stateSelect, { target: { value: 1 } });

        expect(mockOnNewState).toHaveBeenCalledWith(expect.any(Object));
    });

    test('calls onSearch on search button click', () => {
        const searchButton = screen.getByText('Search');
        fireEvent.click(searchButton);

        expect(mockOnSearch).toHaveBeenCalled();
    });
});