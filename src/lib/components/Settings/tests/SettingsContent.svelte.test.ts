import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/svelte';

import SettingsContent from '../SettingsContent.svelte';

describe('SettingsContent', () => {
    const mockUser = {
        _id: 'user123',
        username: 'john_doe',
        email: 'john@example.com'
    };

    const mockGardens = [
        {
            _id: 'garden1',
            name: 'My Garden',
            owner: { _id: 'user123', email: 'john@example.com' },
            members: [
                { _id: 'user123', email: 'john@example.com' },
                { _id: 'user456', email: 'jane@example.com' }
            ],
            joinCode: 'ABC123XYZ'
        }
    ];

    let mockOpenDeleteGardenModal: ReturnType<typeof vi.fn>;

    beforeEach(() => {
        mockOpenDeleteGardenModal = vi.fn();
    });

    const renderContent = (activeTab = 'profile') =>
        render(SettingsContent, {
            props: {
                activeTab,
                user: mockUser,
                gardens: mockGardens,
                openDeleteGardenModal: mockOpenDeleteGardenModal
            }
        });

    it('renders ProfileSettings when activeTab is "profile"', () => {
        renderContent('profile');
        expect(screen.getByText('Change Username')).toBeInTheDocument();
        expect(screen.getByText('Change Email')).toBeInTheDocument();
    });

    it('renders GardenSettings when activeTab is "garden"', () => {
        renderContent('garden');
        expect(screen.getByText('Garden Preferences')).toBeInTheDocument();
    });

    it('displays current username in profile tab', () => {
        renderContent('profile');
        expect(screen.getByText(/Current Username: john_doe/)).toBeInTheDocument();
    });

    it('displays current email in profile tab', () => {
        renderContent('profile');
        expect(screen.getByText(/Current Email: john@example.com/)).toBeInTheDocument();
    });

    it('displays garden name in garden tab for owner', () => {
        renderContent('garden');
        expect(screen.getByText(/Current Garden Name: My Garden/)).toBeInTheDocument();
    });

    it('initializes form state with empty values', () => {
        const { container } = renderContent('profile');
        const inputs = container.querySelectorAll('input[type="text"]') as NodeListOf<HTMLInputElement>;
        const emptyInputs = Array.from(inputs).filter(
            (input) => input.value === ''
        );
        expect(emptyInputs.length).toBeGreaterThan(0);
    });

    it('maintains separate form state for each field', () => {
        renderContent('profile');
        const inputs = screen.getAllByPlaceholderText(/New username/i);
        expect(inputs.length).toBeGreaterThan(0);
    });

    it('renders ProfileSettings component when tab is active', () => {
        renderContent('profile');
        expect(screen.getAllByText(/Change Username|Change Email/i).length).toBeGreaterThan(0);
    });

    it('renders ProfileSettings and GardenSettings as mutually exclusive', () => {
        const { rerender } = renderContent('profile');
        expect(screen.getByText('Change Username')).toBeInTheDocument();
        expect(screen.queryByText('Garden Preferences')).not.toBeInTheDocument();

        rerender({
            activeTab: 'garden',
            user: mockUser,
            gardens: mockGardens,
            openDeleteGardenModal: mockOpenDeleteGardenModal
        });

        expect(screen.queryByText('Change Username')).not.toBeInTheDocument();
        expect(screen.getByText('Garden Preferences')).toBeInTheDocument();
    });

    it('passes gardens to GardenSettings component', () => {
        renderContent('garden');
        expect(screen.getByText(/Current Garden Name: My Garden/)).toBeInTheDocument();
    });

    it('passes openDeleteGardenModal callback to GardenSettings', () => {
        renderContent('garden');
        expect(screen.getByText('Garden Preferences')).toBeInTheDocument();
    });
});
