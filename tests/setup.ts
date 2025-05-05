import "@testing-library/jest-dom/vitest";
import { afterEach } from 'vitest';
import { cleanup } from '@testing-library/react';
import { setupServer } from 'msw/node';
import { handlers } from './mocks/handlers';
import { QueryCache } from "@tanstack/react-query";

const server = setupServer(...handlers);
const queryCache = new QueryCache();

beforeAll(() => server.listen());
afterEach(() => {
  server.resetHandlers();
  queryCache.clear();

  cleanup();
});
afterAll(() => server.close());