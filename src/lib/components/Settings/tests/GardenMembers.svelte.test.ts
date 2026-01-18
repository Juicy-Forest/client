import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/svelte';

import GardenMembers from '../GardenMembers.svelte';

describe('GardenMembers', () => {
    let mockOnMemberRemoved: (() => void) | undefined;
    const mockOwner = { _id: 'owner123', email: 'owner@example.com' };
    const mockMembers = [
        { _id: 'member1', email: 'user1@example.com' },
        { _id: 'member2', email: 'user2@example.com' },
        { _id: 'owner123', email: 'owner@example.com' }
    ];
    const mockGardenId = 'garden123';

    beforeEach(() => {
        mockOnMemberRemoved = vi.fn() as unknown as (() => void) | undefined;
    });

    const renderComponent = (isOwner = true) =>
        render(GardenMembers, {
            props: {
                members: mockMembers,
                owner: mockOwner,
                isOwner,
                gardenId: mockGardenId,
                onMemberRemoved: mockOnMemberRemoved
            }
        });

    it('renders garden members title', () => {
        renderComponent();
        expect(screen.getByText('Garden Members')).toBeInTheDocument();
    });

    it('displays member count', () => {
        renderComponent();
        expect(screen.getByText(/Members in this garden \(3\)/)).toBeInTheDocument();
    });

    it('renders all member emails', () => {
        renderComponent();
        expect(screen.getByText('user1@example.com')).toBeInTheDocument();
        expect(screen.getByText('user2@example.com')).toBeInTheDocument();
        expect(screen.getByText('owner@example.com')).toBeInTheDocument();
    });

    it('displays "Owner" label for garden owner', () => {
        renderComponent();
        const ownerLabels = screen.getAllByText('Owner');
        expect(ownerLabels.length).toBeGreaterThan(0);
    });

    it('shows remove button for non-owner members when isOwner is true', () => {
        renderComponent(true);
        const removeButtons = screen.getAllByText(/Remove/);
        expect(removeButtons.length).toBeGreaterThanOrEqual(2);
    });

    it('hides remove buttons when isOwner is false', () => {
        renderComponent(false);
        const removeButtons = screen.queryAllByText(/Remove/);
        expect(removeButtons.length).toBe(0);
    });

    it('displays member avatars with first letter of email', () => {
        const { container } = renderComponent();
        const avatars = container.querySelectorAll('.rounded-full');
        expect(avatars.length).toBeGreaterThanOrEqual(mockMembers.length);
    });

    it('does not show remove button for owner even when isOwner is true', () => {
        renderComponent(true);
        const ownerRow = screen.getByText('owner@example.com').closest('div');
        const removeBtn = ownerRow?.querySelector('button');
        expect(removeBtn).not.toBeInTheDocument();
    });
});
