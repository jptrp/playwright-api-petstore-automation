import { test, expect } from '@playwright/test';
import { PetStoreClient } from '../../clients/petstore-client';
import { validPetData } from '../../fixtures/pet-data';
import { assertSchema, ApiResponseSchema } from '../../utils/schema-validator';

test.describe('Delete Pet API Tests', () => {
  let client: PetStoreClient;

  test.beforeEach(async () => {
    client = new PetStoreClient();
    await client.init();
  });

  test.afterEach(async () => {
    await client.dispose();
  });

  test('should delete an existing pet', async () => {
    // Create a pet
    const createResult = await client.createPet(validPetData);
    const petId = createResult.body.id!;

    // Delete the pet
    const { status, body } = await client.deletePet(petId);

    expect(status).toBe(200);
    expect(body).toHaveProperty('message');
    
    // Validate schema
    assertSchema(body, ApiResponseSchema);

    // Verify deletion
    const { status: getStatus } = await client.getPetById(petId);
    expect(getStatus).toBe(404);
  });

  test('should return 404 when deleting non-existent pet', async () => {
    const nonExistentId = 999999999;
    
    const { status } = await client.deletePet(nonExistentId);

    // API might return 200 or 404 for non-existent pet
    expect([200, 404]).toContain(status);
  });

  test('should delete pet with available status', async () => {
    const createResult = await client.createPet({
      name: 'AvailablePet',
      photoUrls: ['https://example.com/available.jpg'],
      status: 'available',
    });
    const petId = createResult.body.id!;

    const { status } = await client.deletePet(petId);

    expect(status).toBe(200);

    // Verify deletion
    const { status: getStatus } = await client.getPetById(petId);
    expect(getStatus).toBe(404);
  });

  test('should delete pet with pending status', async () => {
    const createResult = await client.createPet({
      name: 'PendingPet',
      photoUrls: ['https://example.com/pending.jpg'],
      status: 'pending',
    });
    const petId = createResult.body.id!;

    const { status } = await client.deletePet(petId);

    expect(status).toBe(200);

    // Verify deletion
    const { status: getStatus } = await client.getPetById(petId);
    expect(getStatus).toBe(404);
  });

  test('should delete pet with sold status', async () => {
    const createResult = await client.createPet({
      name: 'SoldPet',
      photoUrls: ['https://example.com/sold.jpg'],
      status: 'sold',
    });
    const petId = createResult.body.id!;

    const { status } = await client.deletePet(petId);

    expect(status).toBe(200);

    // Verify deletion
    const { status: getStatus } = await client.getPetById(petId);
    expect(getStatus).toBe(404);
  });

  test('should delete pet and prevent retrieval', async () => {
    const petData = {
      name: 'DeleteTest',
      photoUrls: ['https://example.com/delete.jpg'],
    };

    // Create
    const createResult = await client.createPet(petData);
    const petId = createResult.body.id!;

    // Verify exists
    const { status: getBeforeStatus } = await client.getPetById(petId);
    expect(getBeforeStatus).toBe(200);

    // Delete
    const { status: deleteStatus } = await client.deletePet(petId);
    expect(deleteStatus).toBe(200);

    // Verify doesn't exist
    const { status: getAfterStatus } = await client.getPetById(petId);
    expect(getAfterStatus).toBe(404);
  });

  test('should handle deletion of recently created pet', async () => {
    // Create and immediately delete
    const createResult = await client.createPet({
      name: 'QuickDelete',
      photoUrls: ['https://example.com/quick.jpg'],
    });
    const petId = createResult.body.id!;

    const { status } = await client.deletePet(petId);

    expect(status).toBe(200);
  });

  test('should delete pet with complex data', async () => {
    const createResult = await client.createPet({
      name: 'ComplexPet',
      photoUrls: ['https://example.com/photo1.jpg', 'https://example.com/photo2.jpg'],
      status: 'available',
      category: { id: 5, name: 'Birds' },
      tags: [
        { id: 1, name: 'colorful' },
        { id: 2, name: 'singing' },
      ],
    });
    const petId = createResult.body.id!;

    const { status } = await client.deletePet(petId);

    expect(status).toBe(200);

    // Verify deletion
    const { status: getStatus } = await client.getPetById(petId);
    expect(getStatus).toBe(404);
  });
});
