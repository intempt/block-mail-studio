
export interface UploadedImage {
  id: string;
  url: string;
  name: string;
  size: number;
  type: string;
  uploadedAt: Date;
}

export class ImageUploadService {
  private static images: UploadedImage[] = [];

  static async uploadImage(file: File): Promise<UploadedImage> {
    return new Promise((resolve, reject) => {
      if (!file.type.startsWith('image/')) {
        reject(new Error('File must be an image'));
        return;
      }

      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        reject(new Error('Image must be smaller than 5MB'));
        return;
      }

      const reader = new FileReader();
      reader.onload = (e) => {
        const uploadedImage: UploadedImage = {
          id: `img_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
          url: e.target?.result as string,
          name: file.name,
          size: file.size,
          type: file.type,
          uploadedAt: new Date()
        };

        this.images.push(uploadedImage);
        resolve(uploadedImage);
      };

      reader.onerror = () => {
        reject(new Error('Failed to read image file'));
      };

      reader.readAsDataURL(file);
    });
  }

  static getUploadedImages(): UploadedImage[] {
    return [...this.images];
  }

  static deleteImage(id: string): boolean {
    const index = this.images.findIndex(img => img.id === id);
    if (index !== -1) {
      this.images.splice(index, 1);
      return true;
    }
    return false;
  }

  static getImageById(id: string): UploadedImage | null {
    return this.images.find(img => img.id === id) || null;
  }

  static clearAllImages(): void {
    this.images = [];
  }
}
