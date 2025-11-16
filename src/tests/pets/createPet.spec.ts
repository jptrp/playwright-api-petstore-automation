import { test, expect } from '@playwright/test';
import { PetStoreClient } from '../../clients/petstore-client';
import { validPetData, petDataWithoutOptionalFields } from '../../fixtures/pet-data';
import { assertSchema, PetSchema } from '../../utils/schema-validator';

test.describe('Create Pet API Tests', () => {
  let client: PetStoreClient;

  test.beforeEach(async () => {
    client = new PetStoreClient();
    await client.init();
  });

  test.afterEach(async () => {
    await client.dispose();
  });

  test('should create a pet with all fields', async () => {
    const petData = { ...validPetData };

    const { status, body } = await client.createPet(petData);

    expect(status).toBe(200);
    expect(body).toHaveProperty('id');
    expect(body.name).toBe(petData.name);
    expect(body.status).toBe(petData.status);
    
    // Validate schema
    assertSchema(body, PetSchema);

    // Cleanup
    await client.deletePet(body.id!);
  });

  test('should create a pet with only required fields', async () => {
    const petData = { ...petDataWithoutOptionalFields };

    const { status, body } = await client.createPet(petData);

    expect(status).toBe(200);
    expect(body).toHaveProperty('id');
    expect(body.name).toBe(petData.name);
    
    // Validate schema
    assertSchema(body, PetSchema);

    // Cleanup
    await client.deletePet(body.id!);
  });

  test('should create a pet with available status', async () => {
    const petData = {
      name: 'AvailablePet',
      photoUrls: ['https://example.com/available.jpg'],
      status: 'available' as const,
    };

    const { status, body } = await client.createPet(petData);

    expect(status).toBe(200);
    expect(body.status).toBe('available');

    // Cleanup
    if (body.id) await client.deletePet(body.id);
  });

  test('should create a pet with pending status', async () => {
    const petData = {
      name: 'PendingPet',
      photoUrls: ['https://example.com/pending.jpg'],
      status: 'pending' as const,
    };

    const { status, body } = await client.createPet(petData);

    expect(status).toBe(200);
    expect(body.status).toBe('pending');

    // Cleanup
    if (body.id) await client.deletePet(body.id);
  });

  test('should create a pet with sold status', async () => {
    const petData = {
      name: 'SoldPet',
      photoUrls: ['https://example.com/sold.jpg'],
      status: 'sold' as const,
    };

    const { status, body } = await client.createPet(petData);

    expect(status).toBe(200);
    expect(body.status).toBe('sold');

    // Cleanup
    if (body.id) await client.deletePet(body.id);
  });

  test('should create a pet with category', async () => {
    const petData = {
      name: 'CategorizedPet',
      photoUrls: ['https://example.com/cat.jpg'],
      category: { id: 10, name: 'Cats' },
    };

    const { status, body } = await client.createPet(petData);

    expect(status).toBe(200);
    expect(body.id).toBeDefined();
    expect(body.category).toBeDefined();
    expect(body.category?.name).toBe('Cats');

    // Cleanup
    if (body.id) await client.deletePet(body.id);
  });

  test('should create a pet with tags', async () => {
    const petData = {
      name: 'TaggedPet',
      photoUrls: ['https://example.com/tagged.jpg'],
      tags: [
        { id: 1, name: 'tag1' },
        { id: 2, name: 'tag2' },
      ],
    };

    const { status, body } = await client.createPet(petData);

    expect(status).toBe(200);
    expect(body.tags).toBeDefined();
    expect(body.tags?.length).toBeGreaterThanOrEqual(2);

    // Cleanup
    if (body.id) await client.deletePet(body.id);
  });

  test('should create a pet with multiple photo URLs', async () => {
    const petData = {
      name: 'MultiPhotoPet',
      photoUrls: [
        'https://example.com/photo1.jpg',
        'https://example.com/photo2.jpg',
        'https://example.com/photo3.jpg',
      ],
    };

    const { status, body } = await client.createPet(petData);

    expect(status).toBe(200);
    expect(body.photoUrls.length).toBeGreaterThanOrEqual(3);

    // Cleanup
    if (body.id) await client.deletePet(body.id);
  });
});
