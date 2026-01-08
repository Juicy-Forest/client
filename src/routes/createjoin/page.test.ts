import { describe, it, expect, vi } from 'vitest';
import { render, fireEvent } from '@testing-library/svelte';
import CreateJoinPage from './+page.svelte';

// Mock the goto function
vi.mock('$app/navigation', () => ({
  goto: vi.fn()
}));

// Mock clipboard API
Object.assign(navigator, {
  clipboard: {
    writeText: vi.fn()
  }
});

// Mock alert
global.alert = vi.fn();

describe('CreateJoin page', () => {
  const mockData = {
    userData: null,
    gardenData: [],
    sectionData: [],
    currentGarden: {},
    joinedGardens: []
  };

  it('should render without crashing', () => {
    const { container } = render(CreateJoinPage, { props: { data: mockData } });

    expect(container).toBeTruthy();
  });

  it('should show initial choose step', () => {
    const { getByText } = render(CreateJoinPage, { props: { data: mockData } });

    expect(getByText('Welcome to Your Garden')).toBeInTheDocument();
    expect(getByText('Create New Garden')).toBeInTheDocument();
    expect(getByText('Join Existing Garden')).toBeInTheDocument();
  });

  it('should navigate to create details step', async () => {
    const { getByText, findByText } = render(CreateJoinPage, { props: { data: mockData } });

    const createButton = getByText('Create New Garden');
    await fireEvent.click(createButton);

    expect(await findByText('Food Garden Details')).toBeInTheDocument();
    expect(await findByText('Create Food Garden')).toBeInTheDocument();
  });

  it('should navigate to join step', async () => {
    const { getByText, findByText } = render(CreateJoinPage, { props: { data: mockData } });

    const joinButton = getByText('Join Existing Garden');
    await fireEvent.click(joinButton);

    expect(await findByText('Join Existing Garden')).toBeInTheDocument();
    expect(await findByText('Join')).toBeInTheDocument();
  });

  it('should navigate back from create step', async () => {
    const { getByText, findByText } = render(CreateJoinPage, { props: { data: mockData } });

    // Go to create step
    const createButton = getByText('Create New Garden');
    await fireEvent.click(createButton);

    // Click back
    const backButton = getByText('Back');
    await fireEvent.click(backButton);

    expect(await findByText('Welcome to Your Garden')).toBeInTheDocument();
  });

  it('should navigate back from join step', async () => {
    const { getByText, findByText } = render(CreateJoinPage, { props: { data: mockData } });

    // Go to join step
    const joinButton = getByText('Join Existing Garden');
    await fireEvent.click(joinButton);

    // Click back
    const backButton = getByText('Back');
    await fireEvent.click(backButton);

    expect(await findByText('Welcome to Your Garden')).toBeInTheDocument();
  });

  it('should display joined gardens when available', () => {
    const dataWithGardens = {
      userData: null,
      gardenData: [],
      sectionData: [],
      currentGarden: {},
      joinedGardens: [
        { _id: '1', name: 'Test Garden', members: [{}, {}], joinCode: 'ABC123' }
      ]
    };

    const { getByText } = render(CreateJoinPage, { props: { data: dataWithGardens } });

    expect(getByText('Your Gardens')).toBeInTheDocument();
    expect(getByText('Test Garden')).toBeInTheDocument();
    expect(getByText('2 members')).toBeInTheDocument();
    expect(getByText('ABC123')).toBeInTheDocument();
  });

  it('should copy code to clipboard', async () => {
    const dataWithGardens = {
      userData: null,
      gardenData: [],
      sectionData: [],
      currentGarden: {},
      joinedGardens: [
        { _id: '1', name: 'Test Garden', members: [], joinCode: 'ABC123' }
      ]
    };

    const { getByText } = render(CreateJoinPage, { props: { data: dataWithGardens } });

    const codeElement = getByText('ABC123');
    await fireEvent.click(codeElement);

    expect(navigator.clipboard.writeText).toHaveBeenCalledWith('ABC123');
    expect(global.alert).toHaveBeenCalledWith('Code copied to clipboard!');
  });
});
