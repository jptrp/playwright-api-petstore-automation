import { test, expect } from '@playwright/test';
import { PetStoreClient } from '../../clients/petstore-client';
import { validPetData, updatedPetData } from '../../fixtures/pet-data';
import { assertSchema, PetSchema } from '../../utils/schema-validator';

test.describe('Update Pet API Tests', () => {
  let client: PetStoreClient;
  let testPetId: number;

  test.beforeEach(async () => {
    client = new PetStoreClient();
    await client.init();
    
    // Create a pet before each test
    const result = await client.createPet(validPetData);
    testPetId = result.body.id!;
  });

  test.afterEach(async () => {
    // Cleanup
    try {
      await client.deletePet(testPetId);
    } catch (error) {
      // Ignore cleanup errors
    }
    await client.dispose();
  });

  test('should update pet name', async () => {
    const updateData = {
      id: testPetId,
      name: 'UpdatedName',
      photoUrls: ['https://example.com/updated.jpg'],
    };

    const { status, body } = await client.updatePet(updateData);

    expect(status).toBe(200);
    if ('name' in body) {
      expect(body.name).toBe('UpdatedName');
    }
    
    // Verify update
    const { body: retrievedPet } = await client.getPetById(testPetId);
    if ('name' in retrievedPet) {
      expect(retrievedPet.name).toBe('UpdatedName');
    }
  });

  test('should update pet status', async () => {
    const updateData = {
      id: testPetId,
      name: validPetData.name!,
      photoUrls: validPetData.photoUrls,
      status: 'sold' as const,
    };

    const { status, body } = await client.updatePet(updateData);

    expect(status).toBe(200);
    if ('status' in body) {
      expect(body.status).toBe('sold');
    }
    
    // Verify update
    const { body: retrievedPet } = await client.getPetById(testPetId);
    if ('status' in retrievedPet) {
      expect(retrievedPet.status).toBe('sold');
    }
  });

  test('should update pet category', async () => {
    const updateData = {
      id: testPetId,
      name: validPetData.name!,
      photoUrls: validPetData.photoUrls,
      category: { id: 99, name: 'UpdatedCategory' },
    };

    const { status, body } = await client.updatePet(updateData);

    expect(status).toBe(200);
    if ('category' in body) {
      expect(body.category?.name).toBe('UpdatedCategory');
    }
  });

  test('should update pet tags', async () => {
    const updateData = {
      id: testPetId,
      name: validPetData.name!,
      photoUrls: validPetData.photoUrls,
      tags: [
        { id: 10, name: 'updated-tag-1' },
        { id: 11, name: 'updated-tag-2' },
      ],
    };

    const { status, body } = await client.updatePet(updateData);

    expect(status).toBe(200);
    if ('tags' in body) {
      expect(body.tags).toBeDefined();
      expect(body.tags?.length).toBeGreaterThanOrEqual(2);
    }
  });

  test('should update all pet fields', async () => {
    const updateData = {
      id: testPetId,
      ...updatedPetData,
    };

    const { status, body } = await client.updatePet(updateData);

    expect(status).toBe(200);
    if ('name' in body && 'status' in body) {
      expect(body.name).toBe(updatedPetData.name);
      expect(body.status).toBe(updatedPetData.status);
      
      // Validate schema
      assertSchema(body, PetSchema);
    }
  });

  test('should update pet status from available to pending', async () => {
    const updateData = {
      id: testPetId,
      name: validPetData.name!,
      photoUrls: validPetData.photoUrls,
      status: 'pending' as const,
    };

    const { status, body } = await client.updatePet(updateData);

    expect(status).toBe(200);
    if ('status' in body) {
      expect(body.status).toBe('pending');
    }
  });

  test('should update pet status from pending to sold', async () => {
    // First update to pending
    await client.updatePet({
      id: testPetId,
      name: validPetData.name!,
      photoUrls: validPetData.photoUrls,
      status: 'pending' as const,
    });

    // Then update to sold
    const updateData = {
      id: testPetId,
      name: validPetData.name!,
      photoUrls: validPetData.photoUrls,
      status: 'sold' as const,
    };

    const { status, body } = await client.updatePet(updateData);

    expect(status).toBe(200);
    if ('status' in body) {
      expect(body.status).toBe('sold');
    }
  });

  test('should update pet photo URLs', async () => {
    const updateData = {
      id: testPetId,
      name: validPetData.name!,
      photoUrls: [
        'https://example.com/new-photo-1.jpg',
        'https://example.com/new-photo-2.jpg',
      ],
    };

    const { status, body } = await client.updatePet(updateData);

    expect(status).toBe(200);
    if ('photoUrls' in body) {
      expect(body.photoUrls).toEqual(updateData.photoUrls);
    }
  });

  test('should update pet with form data', async () => {
    const { status } = await client.updatePetWithForm(
      testPetId,
      'FormUpdatedName',
      'sold'
    );

    expect(status).toBe(200);
    
    // Verify update
    const { body: retrievedPet } = await client.getPetById(testPetId);
    if ('name' in retrievedPet && 'status' in retrievedPet) {
      expect(retrievedPet.name).toBe('FormUpdatedName');
      expect(retrievedPet.status).toBe('sold');
    }
  });

  test('should update only name with form data', async () => {
    const { status } = await client.updatePetWithForm(
      testPetId,
      'OnlyNameUpdated',
      undefined
    );

    expect(status).toBe(200);
    
    // Verify update
    const { body: retrievedPet } = await client.getPetById(testPetId);
    if ('name' in retrievedPet) {
      expect(retrievedPet.name).toBe('OnlyNameUpdated');
    }
  });
});
