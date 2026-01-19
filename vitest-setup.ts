import '@testing-library/jest-dom';

// Mock Element.prototype.animate for Svelte transitions (jsdom doesn't support Web Animations API)
Element.prototype.animate = function () {
    return {
        onfinish: null,
        cancel: () => {},
        finish: () => {},
        play: () => {},
        pause: () => {},
        reverse: () => {},
        addEventListener: () => {},
        removeEventListener: () => {},
        dispatchEvent: () => true,
        currentTime: 0,
        playbackRate: 1,
        playState: 'finished',
        finished: Promise.resolve(),
        pending: false,
        ready: Promise.resolve(),
        effect: null,
        id: '',
        timeline: null,
        startTime: null,
        oncancel: null,
        onremove: null,
        persist: () => {},
        commitStyles: () => {},
        updatePlaybackRate: () => {},
        replaceState: () => {},
    } as unknown as Animation;
};