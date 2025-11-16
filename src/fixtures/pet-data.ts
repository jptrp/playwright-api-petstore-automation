import { Pet } from '../utils/schema-validator';

/**
 * Test data fixtures for Pet operations
 */

export const validPetData: Partial<Pet> = {
  name: 'Fluffy',
  photoUrls: ['https://example.com/fluffy.jpg'],
  status: 'available',
  category: {
    id: 1,
    name: 'Dogs',
  },
  tags: [
    { id: 1, name: 'friendly' },
    { id: 2, name: 'small' },
  ],
};

export const petDataWithoutOptionalFields: Partial<Pet> = {
  name: 'Buddy',
  photoUrls: ['https://example.com/buddy.jpg'],
};

export const updatedPetData: Partial<Pet> = {
  name: 'Fluffy Updated',
  photoUrls: ['https://example.com/fluffy-updated.jpg'],
  status: 'sold',
  category: {
    id: 2,
    name: 'Cats',
  },
  tags: [{ id: 3, name: 'updated' }],
};

export const invalidPetData = {
  // Missing required 'name' field
  photoUrls: ['https://example.com/invalid.jpg'],
  status: 'available',
};

export const petWithInvalidStatus = {
  name: 'InvalidStatusPet',
  photoUrls: ['https://example.com/pet.jpg'],
  status: 'invalid-status', // Invalid status
};

export const petStatuses = ['available', 'pending', 'sold'] as const;

export const createPetWithStatus = (status: 'available' | 'pending' | 'sold'): Partial<Pet> => ({
  name: `Pet-${status}-${Date.now()}`,
  photoUrls: [`https://example.com/${status}.jpg`],
  status,
  category: { id: 1, name: 'TestCategory' },
});

export const createPetWithId = (id: number): Partial<Pet> => ({
  id,
  name: `Pet-${id}`,
  photoUrls: [`https://example.com/pet-${id}.jpg`],
  status: 'available',
});

export const createMultiplePets = (count: number): Array<Partial<Pet>> => {
  return Array.from({ length: count }, (_, i) => ({
    name: `TestPet-${i + 1}-${Date.now()}`,
    photoUrls: [`https://example.com/pet-${i + 1}.jpg`],
    status: petStatuses[i % 3],
    category: { id: 1, name: 'TestCategory' },
  }));
};
