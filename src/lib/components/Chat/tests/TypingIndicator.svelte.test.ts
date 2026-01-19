import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/svelte';
import TypingIndicator from '../TypingIndicator.svelte';

describe('TypingIndicator', () => {
    it('renders nothing when no one is typing', () => {
        const { container } = render(TypingIndicator, { props: { peopleTyping: [] } });
        expect(container.querySelector('.group')).not.toBeInTheDocument();
    });

    it('shows typing user with initials', () => {
        render(TypingIndicator, { props: { peopleTyping: [{ username: 'John Doe', avatarColor: '#ff5733' }] } });

        expect(screen.getByTitle('John Doe')).toBeInTheDocument();
        expect(screen.getByText('JD')).toBeInTheDocument();
    });

    it('shows multiple typing users', () => {
        render(TypingIndicator, { 
            props: { 
                peopleTyping: [
                    { username: 'Alice', avatarColor: '#ff5733' },
                    { username: 'Bob', avatarColor: '#33ff57' }
                ] 
            } 
        });

        expect(screen.getByTitle('Alice')).toBeInTheDocument();
        expect(screen.getByTitle('Bob')).toBeInTheDocument();
    });
});
