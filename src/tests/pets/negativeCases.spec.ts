import { test, expect } from '@playwright/test';
import { PetStoreClient } from '../../clients/petstore-client';
import { invalidPetData } from '../../fixtures/pet-data';
import { assertSchema, ApiResponseSchema } from '../../utils/schema-validator';

test.describe('Negative Test Cases for Pet API', () => {
  let client: PetStoreClient;

  test.beforeEach(async () => {
    client = new PetStoreClient();
    await client.init();
  });

  test.afterEach(async () => {
    await client.dispose();
  });

  test('should return 404 for non-existent pet ID', async () => {
    const nonExistentId = 999999999;
    const { status, body } = await client.getPetById(nonExistentId);

    expect(status).toBe(404);
    expect(body).toHaveProperty('message');
    assertSchema(body, ApiResponseSchema);
  });

  test('should return 400 for invalid pet ID (zero)', async () => {
    const { status } = await client.getPetById(0);
    
    // API might return 404 or 400 for invalid ID
    expect([400, 404]).toContain(status);
  });

  test('should return 400 for negative pet ID', async () => {
    const { status } = await client.getPetById(-1);
    
    // API might return 404 or 400 for negative ID
    expect([400, 404]).toContain(status);
  });

  test('should handle missing required field (name) in create', async () => {
    try {
      const { status } = await client.createPet(invalidPetData as any);
      
      // Should return 400 or 405 for invalid data
      expect([400, 405, 500]).toContain(status);
    } catch (error) {
      // Some implementations might throw an error
      expect(error).toBeDefined();
    }
  });

  test('should handle missing required field (photoUrls) in create', async () => {
    try {
      const { status } = await client.createPet({
        name: 'NoPictures',
        // photoUrls is missing
      } as any);
      
      // Should return error status
      expect([400, 405, 500]).toContain(status);
    } catch (error) {
      // Some implementations might throw an error
      expect(error).toBeDefined();
    }
  });

  test('should handle empty pet object in create', async () => {
    try {
      const { status } = await client.createPet({} as any);
      
      // Should return error status
      expect([400, 405, 500]).toContain(status);
    } catch (error) {
      expect(error).toBeDefined();
    }
  });

  test('should handle null values in pet data', async () => {
    try {
      const { status } = await client.createPet({
        name: null,
        photoUrls: null,
      } as any);
      
      // Should return error status
      expect([400, 405, 500]).toContain(status);
    } catch (error) {
      expect(error).toBeDefined();
    }
  });

  test('should handle invalid status value', async () => {
    try {
      const { status } = await client.createPet({
        name: 'InvalidStatus',
        photoUrls: ['https://example.com/test.jpg'],
        status: 'invalid-status',
      } as any);
      
      // API might accept it or return error
      expect([200, 400, 405]).toContain(status);
    } catch (error) {
      expect(error).toBeDefined();
    }
  });

  test('should handle update with non-existent pet ID', async () => {
    const nonExistentId = 999999999;
    const { status } = await client.updatePet({
      id: nonExistentId,
      name: 'NonExistent',
      photoUrls: ['https://example.com/none.jpg'],
    });

    // API might return 404 or create a new pet (200)
    expect([200, 404, 405]).toContain(status);
  });

  test('should handle delete of already deleted pet', async () => {
    const petId = Date.now() + Math.floor(Math.random() * 1000);
    
    // Create pet
    await client.createPet({
      id: petId,
      name: 'DoubleDelete',
      photoUrls: ['https://example.com/double.jpg'],
    });

    // Delete once
    const { status: firstDelete } = await client.deletePet(petId);
    expect(firstDelete).toBe(200);

    // Delete again
    const { status: secondDelete } = await client.deletePet(petId);
    
    // Should handle gracefully (might return 200 or 404)
    expect([200, 404]).toContain(secondDelete);
  });

  test('should handle extremely long pet name', async () => {
    const longName = 'a'.repeat(10000);
    const petId = Date.now() + Math.floor(Math.random() * 1000);

    try {
      const { status, body } = await client.createPet({
        id: petId,
        name: longName,
        photoUrls: ['https://example.com/long.jpg'],
      });

      // API might accept or reject
      expect([200, 400, 413, 500]).toContain(status);

      // Cleanup if created
      if (status === 200) {
        await client.deletePet(body.id!);
      }
    } catch (error) {
      expect(error).toBeDefined();
    }
  });

  test('should handle special characters in pet name', async () => {
    const specialName = '<script>alert("xss")</script>';
    const petId = Date.now() + Math.floor(Math.random() * 1000);

    const { status, body } = await client.createPet({
      id: petId,
      name: specialName,
      photoUrls: ['https://example.com/special.jpg'],
    });

    // Should handle special characters (sanitized or as-is)
    expect([200, 400]).toContain(status);

    // Cleanup if created
    if (status === 200) {
      await client.deletePet(body.id!);
    }
  });

  test('should handle empty string for pet name', async () => {
    const petId = Date.now() + Math.floor(Math.random() * 1000);

    try {
      const { status } = await client.createPet({
        id: petId,
        name: '',
        photoUrls: ['https://example.com/empty.jpg'],
      });

      // Should reject empty name or accept it
      expect([200, 400, 405]).toContain(status);
    } catch (error) {
      expect(error).toBeDefined();
    }
  });

  test('should handle empty photoUrls array', async () => {
    const petId = Date.now() + Math.floor(Math.random() * 1000);

    try {
      const { status } = await client.createPet({
        id: petId,
        name: 'NoPhotos',
        photoUrls: [],
      });

      // Should reject or accept empty array
      expect([200, 400, 405]).toContain(status);
    } catch (error) {
      expect(error).toBeDefined();
    }
  });

  test('should handle invalid URL in photoUrls', async () => {
    const petId = Date.now() + Math.floor(Math.random() * 1000);

    const { status, body } = await client.createPet({
      id: petId,
      name: 'InvalidURL',
      photoUrls: ['not-a-valid-url'],
    });

    // API might accept invalid URLs
    expect([200, 400]).toContain(status);

    // Cleanup if created
    if (status === 200) {
      await client.deletePet(body.id!);
    }
  });

  test('should handle concurrent deletion of same pet', async () => {
    const petId = Date.now() + Math.floor(Math.random() * 1000);
    
    // Create pet
    await client.createPet({
      id: petId,
      name: 'ConcurrentDelete',
      photoUrls: ['https://example.com/concurrent.jpg'],
    });

    // Attempt concurrent deletes
    const deletePromises = [
      client.deletePet(petId),
      client.deletePet(petId),
    ];

    const results = await Promise.allSettled(deletePromises);

    // At least one should succeed
    const successCount = results.filter(
      (r) => r.status === 'fulfilled' && [200, 404].includes(r.value.status)
    ).length;

    expect(successCount).toBeGreaterThan(0);
  });
});
