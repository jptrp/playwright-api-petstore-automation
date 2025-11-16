import { test, expect } from '@playwright/test';
import { PetStoreClient } from '../../clients/petstore-client';
import { validPetData } from '../../fixtures/pet-data';
import { assertSchema, PetSchema, ApiResponseSchema } from '../../utils/schema-validator';

test.describe('Get Pet API Tests', () => {
  let client: PetStoreClient;
  let testPetId: number;

  test.beforeAll(async () => {
    // Create a pet for testing
    client = new PetStoreClient();
    await client.init();
    
    const result = await client.createPet(validPetData);
    testPetId = result.body.id!;
  });

  test.afterAll(async () => {
    // Cleanup
    try {
      await client.deletePet(testPetId);
    } catch (error) {
      // Ignore cleanup errors
    }
    await client.dispose();
  });

  test.beforeEach(async () => {
    if (!client.getContext) {
      client = new PetStoreClient();
      await client.init();
    }
  });

  test('should get an existing pet by ID', async () => {
    const { status, body } = await client.getPetById(testPetId);

    expect(status).toBe(200);
    expect(body).toHaveProperty('id', testPetId);
    expect(body).toHaveProperty('name');
    
    // Validate schema
    assertSchema(body, PetSchema);
  });

  test('should return 404 for non-existent pet', async () => {
    const nonExistentId = 999999999;
    const { status, body } = await client.getPetById(nonExistentId);

    expect(status).toBe(404);
    expect(body).toHaveProperty('type');
    expect(body).toHaveProperty('message');
    
    // Validate error response schema
    assertSchema(body, ApiResponseSchema);
  });

  test('should get pet with all fields populated', async () => {
    const { status, body } = await client.getPetById(testPetId);

    expect(status).toBe(200);
    expect(body).toHaveProperty('id');
    expect(body).toHaveProperty('name');
    expect(body).toHaveProperty('photoUrls');
    if ('photoUrls' in body) {
      expect(Array.isArray(body.photoUrls)).toBe(true);
    }
  });

  test('should retrieve correct pet data after creation', async () => {
    const petData = {
      name: 'VerificationPet',
      photoUrls: ['https://example.com/verify.jpg'],
      status: 'available' as const,
    };

    // Create pet
    const createResult = await client.createPet(petData);
    const uniqueId = createResult.body.id!;

    // Retrieve and verify
    const { status, body } = await client.getPetById(uniqueId);

    expect(status).toBe(200);
    if ('name' in body && 'status' in body) {
      expect(body.name).toBe(petData.name);
      expect(body.status).toBe(petData.status);
    }

    // Cleanup
    await client.deletePet(uniqueId);
  });

  test('should handle boundary ID value (1)', async () => {
    const { status } = await client.getPetById(1);
    
    // Either pet exists (200) or not found (404) - both are valid responses
    expect([200, 404]).toContain(status);
  });

  test('should handle large ID value', async () => {
    const largeId = 2147483647; // Max 32-bit integer
    const { status } = await client.getPetById(largeId);
    
    // Should return 404 or valid pet
    expect([200, 404]).toContain(status);
  });

  test('should return pet with correct data types', async () => {
    const { status, body } = await client.getPetById(testPetId);

    expect(status).toBe(200);
    if ('id' in body && 'name' in body && 'photoUrls' in body) {
      expect(typeof body.id).toBe('number');
      expect(typeof body.name).toBe('string');
      expect(Array.isArray(body.photoUrls)).toBe(true);
    }
  });
});
