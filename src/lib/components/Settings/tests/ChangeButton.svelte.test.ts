import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/svelte';
import ChangeButton from '../ChangeButton.svelte';

describe('ChangeButton', () => {
    const renderComponent = (settingField = 'Username') =>
        render(ChangeButton, {
            props: {
                settingField
            }
        });

    it('renders button with update text', () => {
        renderComponent('Email');
        expect(screen.getByRole('button', { name: /Update Email/ })).toBeInTheDocument();
    });

    it('displays correct setting field in button text', () => {
        renderComponent('Password');
        expect(screen.getByRole('button', { name: /Update Password/ })).toBeInTheDocument();
    });

    it('button renders correctly with classes', () => {
        const { container } = renderComponent();
        const button = container.querySelector('button');
        expect(button).toHaveClass('mt-3', 'rounded-lg', 'bg-stone-300');
    });

    it('applies correct styling classes', () => {
        const { container } = renderComponent();
        const button = container.querySelector('button');
        expect(button).toHaveClass('rounded-lg', 'bg-stone-300', 'text-stone-700');
    });

    it('has hover effect styling', () => {
        const { container } = renderComponent();
        const button = container.querySelector('button');
        expect(button).toHaveClass('hover:bg-stone-400');
    });

    it('has active state styling', () => {
        const { container } = renderComponent();
        const button = container.querySelector('button');
        expect(button).toHaveClass('active:bg-stone-500');
    });

    it('has proper padding', () => {
        const { container } = renderComponent();
        const button = container.querySelector('button');
        expect(button).toHaveClass('px-4', 'py-2');
    });
});
