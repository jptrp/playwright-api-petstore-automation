import { test, expect } from '@playwright/test';

test.describe('Petstore API - Pet endpoints', () => {
  test('GET /pet/{petId} - should retrieve pet by ID', async ({ request }) => {
    const response = await request.get('/pet/1');
    expect(response.ok()).toBeTruthy();
    expect(response.status()).toBe(200);
    
    const pet = await response.json();
    expect(pet).toHaveProperty('id');
    expect(pet).toHaveProperty('name');
  });

  test('GET /pet/findByStatus - should find pets by status', async ({ request }) => {
    const response = await request.get('/pet/findByStatus?status=available');
    expect(response.ok()).toBeTruthy();
    expect(response.status()).toBe(200);
    
    const pets = await response.json();
    expect(Array.isArray(pets)).toBeTruthy();
  });
});
