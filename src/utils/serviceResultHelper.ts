
import { ServiceResult } from './serviceErrorHandler';

export const extractServiceData = <T>(result: ServiceResult<T>, fallback: T): T => {
  return result.success && result.data !== undefined ? result.data : fallback;
};

export const isServiceSuccess = <T>(result: ServiceResult<T>): result is ServiceResult<T> & { success: true; data: T } => {
  return result.success && result.data !== undefined;
};
