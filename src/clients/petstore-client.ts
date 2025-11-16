import { APIRequestContext, request } from '@playwright/test';
import { API_ENDPOINTS } from '../config/api-endpoints';
import { config } from '../config/environment';
import { logger } from '../utils/logger';
import { Pet, ApiResponse } from '../utils/schema-validator';

/**
 * Petstore API Client
 * Provides reusable methods for interacting with the Petstore API
 */
export class PetStoreClient {
  private context: APIRequestContext | null = null;
  private baseURL: string;

  constructor(baseURL?: string) {
    this.baseURL = baseURL || config.baseURL;
  }

  /**
   * Initialize the API request context
   */
  async init(): Promise<void> {
    // Don't set baseURL in context, we'll use full URLs instead
    this.context = await request.newContext({
      extraHTTPHeaders: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
    });
    logger.debug('PetStoreClient initialized', { baseURL: this.baseURL });
  }

  /**
   * Dispose the API request context
   */
  async dispose(): Promise<void> {
    if (this.context) {
      await this.context.dispose();
      logger.debug('PetStoreClient disposed');
    }
  }

  /**
   * Get the request context
   */
  getContext(): APIRequestContext {
    if (!this.context) {
      throw new Error('PetStoreClient not initialized. Call init() first.');
    }
    return this.context;
  }

  // ==================== Pet Operations ====================

  /**
   * Create a new pet
   */
  async createPet(petData: Partial<Pet>): Promise<{ status: number; body: Pet }> {
    logger.debug('Creating pet', petData);
    // Remove id from petData if present - API generates it
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { id: _id, ...dataToSend } = petData;
    const url = `${this.baseURL}${API_ENDPOINTS.PET}`;
    const response = await this.getContext().post(url, {
      data: dataToSend,
    });
    let body: Pet;
    try {
      body = await response.json();
    } catch (error) {
      const text = await response.text();
      throw new Error(`Failed to parse response as JSON. Status: ${response.status()}, Body: ${text.substring(0, 200)}`);
    }
    logger.debug('Pet created', { status: response.status(), body });
    return { status: response.status(), body };
  }

  /**
   * Get pet by ID
   */
  async getPetById(id: number): Promise<{ status: number; body: Pet | ApiResponse }> {
    logger.debug('Getting pet by ID', { id });
    const url = `${this.baseURL}${API_ENDPOINTS.PET_BY_ID(id)}`;
    const response = await this.getContext().get(url);
    const body = await response.json();
    logger.debug('Pet retrieved', { status: response.status(), body });
    return { status: response.status(), body };
  }

  /**
   * Update an existing pet
   */
  async updatePet(petData: Partial<Pet>): Promise<{ status: number; body: Pet | ApiResponse }> {
    logger.debug('Updating pet', petData);
    const url = `${this.baseURL}${API_ENDPOINTS.PET}`;
    const response = await this.getContext().put(url, {
      data: petData,
    });
    const body = await response.json();
    logger.debug('Pet updated', { status: response.status(), body });
    return { status: response.status(), body };
  }

  /**
   * Delete a pet by ID
   */
  async deletePet(id: number): Promise<{ status: number; body: ApiResponse }> {
    logger.debug('Deleting pet', { id });
    const url = `${this.baseURL}${API_ENDPOINTS.PET_BY_ID(id)}`;
    const response = await this.getContext().delete(url);
    const body = await response.json();
    logger.debug('Pet deleted', { status: response.status(), body });
    return { status: response.status(), body };
  }

  /**
   * Find pets by status
   */
  async findPetsByStatus(
    status: 'available' | 'pending' | 'sold'
  ): Promise<{ status: number; body: Pet[] }> {
    logger.debug('Finding pets by status', { status });
    const url = `${this.baseURL}${API_ENDPOINTS.PET_FIND_BY_STATUS}`;
    const response = await this.getContext().get(url, {
      params: { status },
    });
    const body = await response.json();
    logger.debug('Pets found', { status: response.status(), count: body.length });
    return { status: response.status(), body };
  }

  /**
   * Find pets by tags
   */
  async findPetsByTags(tags: string[]): Promise<{ status: number; body: Pet[] }> {
    logger.debug('Finding pets by tags', { tags });
    const url = `${this.baseURL}${API_ENDPOINTS.PET_FIND_BY_TAGS}`;
    const response = await this.getContext().get(url, {
      params: { tags: tags.join(',') },
    });
    const body = await response.json();
    logger.debug('Pets found', { status: response.status(), count: body.length });
    return { status: response.status(), body };
  }

  /**
   * Update pet with form data
   */
  async updatePetWithForm(
    id: number,
    name?: string,
    status?: string
  ): Promise<{ status: number; body: ApiResponse }> {
    logger.debug('Updating pet with form', { id, name, status });
    const formData: Record<string, string> = {};
    if (name) formData.name = name;
    if (status) formData.status = status;

    const url = `${this.baseURL}${API_ENDPOINTS.PET_BY_ID(id)}`;
    const response = await this.getContext().post(url, {
      form: formData,
    });
    const body = await response.json();
    logger.debug('Pet updated with form', { status: response.status(), body });
    return { status: response.status(), body };
  }

  /**
   * Upload image for pet
   */
  async uploadPetImage(
    id: number,
    imageBuffer: Buffer,
    additionalMetadata?: string
  ): Promise<{ status: number; body: ApiResponse }> {
    logger.debug('Uploading pet image', { id, additionalMetadata });
    const url = `${this.baseURL}${API_ENDPOINTS.PET_UPLOAD_IMAGE(id)}`;
    const response = await this.getContext().post(url, {
      multipart: {
        file: {
          name: 'pet-image.jpg',
          mimeType: 'image/jpeg',
          buffer: imageBuffer,
        },
        ...(additionalMetadata && { additionalMetadata }),
      },
    });
    const body = await response.json();
    logger.debug('Pet image uploaded', { status: response.status(), body });
    return { status: response.status(), body };
  }
}
