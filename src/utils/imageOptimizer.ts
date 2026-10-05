/**
 * Client-side Automatic Image Optimizer
 * Resizes large images and converts them to compressed WebP data URLs.
 */
export async function optimizeImage(
  fileOrUrl: File | string,
  maxWidth = 1600,
  maxHeight = 1600,
  quality = 0.85
): Promise<{ dataUrl: string; originalSize: number; optimizedSize: number }> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';

    img.onload = () => {
      let { width, height } = img;

      // Calculate aspect ratio scale
      if (width > maxWidth || height > maxHeight) {
        if (width / height > maxWidth / maxHeight) {
          height = Math.round((height * maxWidth) / width);
          width = maxWidth;
        } else {
          width = Math.round((width * maxHeight) / height);
          height = maxHeight;
        }
      }

      const canvas = document.createElement('canvas');
      canvas.width = width;
      canvas.height = height;

      const ctx = canvas.getContext('2d');
      if (!ctx) {
        reject(new Error('Canvas context not available'));
        return;
      }

      // Smooth resizing
      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = 'high';
      ctx.drawImage(img, 0, 0, width, height);

      // Convert to WebP
      const dataUrl = canvas.toDataURL('image/webp', quality);
      const optimizedSize = Math.round((dataUrl.length * 3) / 4); // Approximate bytes
      const originalSize = typeof fileOrUrl === 'string' ? dataUrl.length : fileOrUrl.size;

      resolve({
        dataUrl,
        originalSize,
        optimizedSize
      });
    };

    img.onerror = (err) => reject(new Error('Failed to load image: ' + err));

    if (typeof fileOrUrl === 'string') {
      img.src = fileOrUrl;
    } else {
      const reader = new FileReader();
      reader.onload = (e) => {
        img.src = e.target?.result as string;
      };
      reader.onerror = reject;
      reader.readAsDataURL(fileOrUrl);
    }
  });
}

