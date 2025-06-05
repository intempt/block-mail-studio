
export interface ServiceResult<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  details?: any;
}

export const createServiceResult = <T>(
  success: boolean,
  data?: T,
  error?: string,
  details?: any
): ServiceResult<T> => ({
  success,
  data,
  error,
  details
});

export const handleServiceError = (error: any, context: string): ServiceResult => {
  console.error(`Service error in ${context}:`, error);
  
  return createServiceResult(
    false,
    undefined,
    error?.message || `An error occurred in ${context}`,
    error
  );
};

export const handleServiceSuccess = <T>(data: T, message?: string): ServiceResult<T> => {
  return createServiceResult(true, data, message);
};
