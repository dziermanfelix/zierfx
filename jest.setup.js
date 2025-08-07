// Mock environment variables for testing
process.env.DATABASE_URL = 'postgresql://dziermanfelix@localhost:5432/test_db';
process.env.NODE_ENV = 'test';

// Global test setup
beforeAll(async () => {
  // Add any global setup here
});

afterAll(async () => {
  // Add any global cleanup here
});
