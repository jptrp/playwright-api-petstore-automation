/**
 * API endpoint constants for Petstore API
 */
export const API_ENDPOINTS = {
  // Pet endpoints
  PET: '/pet',
  PET_BY_ID: (id: number) => `/pet/${id}`,
  PET_FIND_BY_STATUS: '/pet/findByStatus',
  PET_FIND_BY_TAGS: '/pet/findByTags',
  PET_UPLOAD_IMAGE: (id: number) => `/pet/${id}/uploadImage`,

  // Store endpoints
  STORE_INVENTORY: '/store/inventory',
  STORE_ORDER: '/store/order',
  STORE_ORDER_BY_ID: (id: number) => `/store/order/${id}`,

  // User endpoints
  USER: '/user',
  USER_BY_USERNAME: (username: string) => `/user/${username}`,
  USER_LOGIN: '/user/login',
  USER_LOGOUT: '/user/logout',
  USER_CREATE_WITH_LIST: '/user/createWithList',
} as const;
