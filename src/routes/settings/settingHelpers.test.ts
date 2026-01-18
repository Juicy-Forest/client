import { describe, it, expect, vi, beforeEach } from 'vitest';
import { createFieldEnhancer } from './settingHelpers';

describe('settingHelpers', () => {
    describe('createFieldEnhancer', () => {
        let formState: Record<string, { value: string; error: string; success: string }>;
        let clearAllMessages: () => void;
        let onSuccess: (data: any) => void;

        beforeEach(() => {
            formState = {
                username: { value: 'john_doe', error: '', success: '' },
                email: { value: 'john@example.com', error: '', success: '' }
            };
            clearAllMessages = vi.fn();
            onSuccess = vi.fn();
        });

        it('returns a function', () => {
            const enhancer = createFieldEnhancer({
                fieldName: 'username',
                formState,
                clearAllMessages,
                shouldReload: false,
                onSuccess
            });
            expect(typeof enhancer).toBe('function');
        });

        it('clears all messages before submission', () => {
            const config = {
                fieldName: 'username',
                formState,
                clearAllMessages,
                shouldReload: false,
                onSuccess
            };
            const enhancer = createFieldEnhancer(config);
            const handler = enhancer();

            expect(clearAllMessages).toHaveBeenCalled();
        });

        it('handles success result and updates field state', async () => {
            const config = {
                fieldName: 'username',
                formState,
                clearAllMessages,
                shouldReload: false,
                onSuccess
            };
            const enhancer = createFieldEnhancer(config);
            const updateFn = vi.fn();
            const handler = enhancer();

            const result = {
                type: 'success',
                data: { message: 'Username changed successfully!', newUsername: 'jane_doe' }
            };

            await handler({ update: updateFn, result });

            expect(formState.username.success).toBe('Username changed successfully!');
            expect(formState.username.value).toBe('');
            expect(onSuccess).toHaveBeenCalledWith(result.data);
        });

        it('handles failure result and sets error message', async () => {
            const config = {
                fieldName: 'username',
                formState,
                clearAllMessages,
                shouldReload: false,
                onSuccess
            };
            const enhancer = createFieldEnhancer(config);
            const updateFn = vi.fn();
            const handler = enhancer();

            const result = {
                type: 'failure',
                data: { error: 'Username is already taken' }
            };

            await handler({ update: updateFn, result });

            expect(formState.username.error).toBe('Username is already taken');
            expect(onSuccess).not.toHaveBeenCalled();
        });

        it('calls update function', async () => {
            const config = {
                fieldName: 'username',
                formState,
                clearAllMessages,
                shouldReload: false,
                onSuccess
            };
            const enhancer = createFieldEnhancer(config);
            const updateFn = vi.fn();
            const handler = enhancer();

            const result = {
                type: 'success',
                data: { message: 'Success!' }
            };

            await handler({ update: updateFn, result });

            expect(updateFn).toHaveBeenCalled();
        });

        it('handles missing field data gracefully', async () => {
            const config = {
                fieldName: 'nonexistent',
                formState,
                clearAllMessages,
                shouldReload: false,
                onSuccess
            };
            const enhancer = createFieldEnhancer(config);
            const updateFn = vi.fn();
            const handler = enhancer();

            const result = {
                type: 'success',
                data: { message: 'Success!' }
            };

            expect(() => handler({ update: updateFn, result })).not.toThrow();
        });

        it('calls onSuccess callback when provided', async () => {
            const mockOnSuccess = vi.fn();
            const config = {
                fieldName: 'username',
                formState,
                clearAllMessages,
                shouldReload: false,
                onSuccess: mockOnSuccess
            };
            const enhancer = createFieldEnhancer(config);
            const updateFn = vi.fn();
            const handler = enhancer();

            const result = {
                type: 'success',
                data: { message: 'Success!', newData: 'value' }
            };

            await handler({ update: updateFn, result });

            expect(mockOnSuccess).toHaveBeenCalledWith(result.data);
        });

        it('does not call onSuccess on failure', async () => {
            const mockOnSuccess = vi.fn();
            const config = {
                fieldName: 'username',
                formState,
                clearAllMessages,
                shouldReload: false,
                onSuccess: mockOnSuccess
            };
            const enhancer = createFieldEnhancer(config);
            const updateFn = vi.fn();
            const handler = enhancer();

            const result = {
                type: 'failure',
                data: { error: 'Error!' }
            };

            await handler({ update: updateFn, result });

            expect(mockOnSuccess).not.toHaveBeenCalled();
        });
    });
});
