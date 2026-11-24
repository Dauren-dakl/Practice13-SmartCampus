import { describe, it, expect } from 'vitest';
import { renderToStaticMarkup } from 'react-dom/server';
import App from './App';

describe('Time-field accessibility regression', () => {
  const markup = () => renderToStaticMarkup(<App />);
  it('associates all three visible time labels with their inputs', () => {
    const html = markup();
    const labels = [...html.matchAll(/<label[^>]*for="([^"]+)"[^>]*>/g)];
    expect(labels).toHaveLength(3);
    for (const [, id] of labels) expect(html).toContain(`id="${id}"`);
  });
  it('connects all time inputs to their hint descriptions', () => {
    const html = markup();
    const inputs = [...html.matchAll(/<input[^>]*type="text"[^>]*>/g)].map(x => x[0]);
    expect(inputs).toHaveLength(3);
    for (const input of inputs) {
      const id = input.match(/aria-describedby="([^"]+)"/)?.[1];
      expect(id).toBeTruthy();
      expect(html).toContain(`id="${id}"`);
    }
  });
  it('starts with three unique input IDs and no invalid field announcement', () => {
    const html = markup();
    const inputs = [...html.matchAll(/<input[^>]*type="text"[^>]*>/g)].map(x => x[0]);
    const ids = inputs.map(input => input.match(/\sid="([^"]+)"/)?.[1]);
    expect(ids.every(Boolean)).toBe(true);
    expect(new Set(ids).size).toBe(3);
    expect(inputs.every(input => input.includes('aria-invalid="false"'))).toBe(true);
  });
});
