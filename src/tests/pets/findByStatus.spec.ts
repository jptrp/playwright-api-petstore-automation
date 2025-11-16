import { test, expect } from '@playwright/test';
import { PetStoreClient } from '../../clients/petstore-client';
import { createPetWithStatus, petStatuses } from '../../fixtures/pet-data';
import { assertSchema, PetArraySchema } from '../../utils/schema-validator';

test.describe('Find Pets by Status API Tests', () => {
  let client: PetStoreClient;
  const createdPetIds: number[] = [];

  test.beforeAll(async () => {
    client = new PetStoreClient();
    await client.init();

    // Create test pets with different statuses
    for (const status of petStatuses) {
      const result = await client.createPet(createPetWithStatus(status));
      createdPetIds.push(result.body.id!);
    }
  });

  test.afterAll(async () => {
    // Cleanup all created pets
    for (const petId of createdPetIds) {
      try {
        await client.deletePet(petId);
      } catch (error) {
        // Ignore cleanup errors
      }
    }
    await client.dispose();
  });

  test('should find pets with available status', async () => {
    const { status, body } = await client.findPetsByStatus('available');

    expect(status).toBe(200);
    expect(Array.isArray(body)).toBe(true);
    expect(body.length).toBeGreaterThan(0);
    
    // Validate all returned pets have available status
    body.forEach((pet) => {
      expect(pet.status).toBe('available');
    });
    
    // Validate schema
    assertSchema(body, PetArraySchema);
  });

  test('should find pets with pending status', async () => {
    const { status, body } = await client.findPetsByStatus('pending');

    expect(status).toBe(200);
    expect(Array.isArray(body)).toBe(true);
    
    // Validate all returned pets have pending status
    body.forEach((pet) => {
      expect(pet.status).toBe('pending');
    });
    
    // Validate schema
    assertSchema(body, PetArraySchema);
  });

  test('should find pets with sold status', async () => {
    const { status, body } = await client.findPetsByStatus('sold');

    expect(status).toBe(200);
    expect(Array.isArray(body)).toBe(true);
    
    // Validate all returned pets have sold status
    body.forEach((pet) => {
      expect(pet.status).toBe('sold');
    });
    
    // Validate schema
    assertSchema(body, PetArraySchema);
  });

  test('should return different results for different statuses', async () => {
    const { body: availablePets } = await client.findPetsByStatus('available');
    const { body: pendingPets } = await client.findPetsByStatus('pending');
    const { body: soldPets } = await client.findPetsByStatus('sold');

    // Results should be arrays
    expect(Array.isArray(availablePets)).toBe(true);
    expect(Array.isArray(pendingPets)).toBe(true);
    expect(Array.isArray(soldPets)).toBe(true);

    // Each array should contain pets with only the requested status
    availablePets.forEach((pet) => expect(pet.status).toBe('available'));
    pendingPets.forEach((pet) => expect(pet.status).toBe('pending'));
    soldPets.forEach((pet) => expect(pet.status).toBe('sold'));
  });

  test('should include created pet in status search', async () => {
    // Create a unique pet
    const createResult = await client.createPet({
      name: `StatusTest-${Date.now()}`,
      photoUrls: ['https://example.com/status-test.jpg'],
      status: 'available',
    });
    const uniquePetId = createResult.body.id!;

    // Search for available pets
    const { status, body } = await client.findPetsByStatus('available');

    expect(status).toBe(200);
    
    // Find our specific pet
    const foundPet = body.find((pet) => pet.id === uniquePetId);
    expect(foundPet).toBeDefined();

    // Cleanup
    await client.deletePet(uniquePetId);
  });

  test('should return pets with valid structure', async () => {
    const { status, body } = await client.findPetsByStatus('available');

    expect(status).toBe(200);
    expect(body.length).toBeGreaterThan(0);

    // Check first pet has required fields
    const firstPet = body[0];
    expect(firstPet).toHaveProperty('id');
    expect(firstPet).toHaveProperty('name');
    expect(firstPet).toHaveProperty('photoUrls');
    expect(Array.isArray(firstPet.photoUrls)).toBe(true);
  });

  test('should filter pets correctly after status update', async () => {
    // Create pet with available status
    const createResult = await client.createPet({
      name: 'StatusChangeTest',
      photoUrls: ['https://example.com/change.jpg'],
      status: 'available',
    });
    const petId = createResult.body.id!;

    // Verify it appears in available list
    const { body: availablePets } = await client.findPetsByStatus('available');
    let found = availablePets.find((pet) => pet.id === petId);
    expect(found).toBeDefined();

    // Update to sold
    await client.updatePet({
      id: petId,
      name: 'StatusChangeTest',
      photoUrls: ['https://example.com/change.jpg'],
      status: 'sold',
    });

    // Verify it appears in sold list
    const { body: soldPets } = await client.findPetsByStatus('sold');
    found = soldPets.find((pet) => pet.id === petId);
    expect(found).toBeDefined();
    expect(found?.status).toBe('sold');

    // Cleanup
    await client.deletePet(petId);
  });
});
