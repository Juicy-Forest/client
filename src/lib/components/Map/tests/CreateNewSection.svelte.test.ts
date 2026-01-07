// @ts-nocheck
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/svelte';
import userEvent from '@testing-library/user-event';
import CreateNewSection from '../CreateNewSection.svelte';

// Mock $app/state
vi.mock('$app/state', () => {
  const mockGet = vi.fn(() => 'test-garden-id');
  return {
    page: {
      url: {
        searchParams: {
          get: mockGet
        }
      }
    }
  };
});

describe('CreateNewSection', () => {
  let mockOnNewSection: ReturnType<typeof vi.fn>;
  const mockGardenData = { _id: 'test-garden-id', name: 'Test Garden' };
  const mockSectionResponse = {
    _id: 'new-section-id',
    sectionName: 'Test Section',
    plants: ['Tomato', 'Lettuce'],
    color: 'bg-rose-400'
  };

  beforeEach(() => {
    mockOnNewSection = vi.fn();
    global.fetch = vi.fn();
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  const renderComponent = (isEditMode = false) => {
    return render(CreateNewSection, {
      props: {
        gardenData: mockGardenData,
        isEditMode,
        onNewSection: mockOnNewSection
      }
    });
  };

  it('renders form inputs correctly', () => {
    renderComponent();
    
    expect(screen.getByPlaceholderText('Section name')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Plants (comma separated)')).toBeInTheDocument();
    expect(screen.getByText('Create Section')).toBeInTheDocument();
  });

  it('renders all color options', () => {
    renderComponent();
    
    // Color buttons have aria-label=" " so we query all buttons and filter
    const allButtons = screen.getAllByRole('button');
    const createButton = screen.getByText('Create Section');
    const colorButtons = allButtons.filter(btn => btn !== createButton);
    // Should have 13 color options
    expect(colorButtons.length).toBeGreaterThanOrEqual(13);
  });

  it('allows selecting a color', async () => {
    const user = userEvent.setup();
    renderComponent();

    const allButtons = screen.getAllByRole('button');
    const createButton = screen.getByText('Create Section');
    const colorButtons = allButtons.filter(btn => btn !== createButton);
    const firstColorButton = colorButtons[0];
    
    await user.click(firstColorButton);
    
    // Color should be selected (ring classes applied)
    expect(firstColorButton).toHaveClass('ring-2');
    expect(firstColorButton).toHaveClass('ring-stone-800');
  });

  it('allows entering section name', async () => {
    const user = userEvent.setup();
    renderComponent();

    const nameInput = screen.getByPlaceholderText('Section name') as HTMLInputElement;
    await user.type(nameInput, 'My Garden Section');
    
    expect(nameInput.value).toBe('My Garden Section');
  });

  it('allows entering plants', async () => {
    const user = userEvent.setup();
    renderComponent();

    const plantsInput = screen.getByPlaceholderText('Plants (comma separated)') as HTMLInputElement;
    await user.type(plantsInput, 'Tomato, Lettuce, Carrot');
    
    expect(plantsInput.value).toBe('Tomato, Lettuce, Carrot');
  });

  it('shows error when creating section without color and name', async () => {
    const user = userEvent.setup();
    renderComponent();

    const createButton = screen.getByText('Create Section');
    await user.click(createButton);
    
    await waitFor(() => {
      expect(screen.getByText('Color & Name is required.')).toBeInTheDocument();
    });
  });

  it('shows error when creating section without color', async () => {
    const user = userEvent.setup();
    renderComponent();

    const nameInput = screen.getByPlaceholderText('Section name');
    await user.type(nameInput, 'Test Section');
    
    const createButton = screen.getByText('Create Section');
    await user.click(createButton);
    
    await waitFor(() => {
      expect(screen.getByText('Color & Name is required.')).toBeInTheDocument();
    });
  });

  it('shows error when creating section without name', async () => {
    const user = userEvent.setup();
    renderComponent();

    const allButtons = screen.getAllByRole('button');
    const createButton = screen.getByText('Create Section');
    const colorButtons = allButtons.filter(btn => btn !== createButton);
    await user.click(colorButtons[0]);
    
    await user.click(createButton);
    
    await waitFor(() => {
      expect(screen.getByText('Color & Name is required.')).toBeInTheDocument();
    });
  });

  it('creates section successfully with valid data', async () => {
    const user = userEvent.setup();
    (global.fetch as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
      json: async () => mockSectionResponse
    });

    renderComponent();

    // Fill in form
    const nameInput = screen.getByPlaceholderText('Section name');
    await user.type(nameInput, 'Test Section');
    
    const plantsInput = screen.getByPlaceholderText('Plants (comma separated)');
    await user.type(plantsInput, 'Tomato, Lettuce');
    
    const allButtons = screen.getAllByRole('button');
    const createButton = screen.getByText('Create Section');
    const colorButtons = allButtons.filter(btn => btn !== createButton);
    await user.click(colorButtons[0]);

    // Submit
    await user.click(createButton);

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith('/api/section', {
        method: 'POST',
        body: JSON.stringify({
          sectionName: 'Test Section',
          plants: ['Tomato', 'Lettuce'],
          color: "bg-rose-400",
          gardenId: 'test-garden-id'
        }),
        headers: {
          'Content-Type': 'application/json'
        }
      });
    });

    await waitFor(() => {
      expect(mockOnNewSection).toHaveBeenCalledWith(mockSectionResponse);
    });
  });

  it('splits plants string correctly', async () => {
    const user = userEvent.setup();
    (global.fetch as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
      json: async () => mockSectionResponse
    });

    renderComponent();

    const nameInput = screen.getByPlaceholderText('Section name');
    await user.type(nameInput, 'Test Section');
    
    const plantsInput = screen.getByPlaceholderText('Plants (comma separated)');
    await user.type(plantsInput, 'Tomato, Lettuce, Carrot');
    
    const allButtons = screen.getAllByRole('button');
    const createButton = screen.getByText('Create Section');
    const colorButtons = allButtons.filter(btn => btn !== createButton);
    await user.click(colorButtons[0]);

    await user.click(createButton);

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith(
        expect.any(String),
        expect.objectContaining({
          body: expect.stringContaining('"plants":["Tomato","Lettuce","Carrot"]')
        })
      );
    });
  });

  it('handles API error gracefully', async () => {
    const user = userEvent.setup();
    const consoleSpy = vi.spyOn(console, 'log').mockImplementation(() => {});
    
    (global.fetch as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
      json: async () => ({ error: 'Failed to create section' })
    });

    renderComponent();

    const nameInput = screen.getByPlaceholderText('Section name');
    await user.type(nameInput, 'Test Section');
    
    const allButtons = screen.getAllByRole('button');
    const createButton = screen.getByText('Create Section');
    const colorButtons = allButtons.filter(btn => btn !== createButton);
    await user.click(colorButtons[0]);

    await user.click(createButton);

    await waitFor(() => {
      expect(consoleSpy).toHaveBeenCalledWith(
        'Error trying to create new section:',
        'Failed to create section'
      );
    });

    expect(mockOnNewSection).not.toHaveBeenCalled();
    consoleSpy.mockRestore();
  });

});
