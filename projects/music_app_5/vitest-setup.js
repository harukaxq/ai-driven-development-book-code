import '@testing-library/jest-dom/vitest'
import { vi } from 'vitest';

vi.spyOn(window, 'alert').mockImplementation(() => {});
vi.spyOn(window.HTMLMediaElement.prototype, 'play').mockImplementation(() => Promise.resolve());
vi.spyOn(window.HTMLMediaElement.prototype, 'pause').mockImplementation(() => {});


