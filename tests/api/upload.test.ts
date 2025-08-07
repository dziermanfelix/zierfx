import { POST } from '@/app/api/upload/route';
import { createMockRequest, createMockFormData, createMockFile } from '../utils/test-helpers';

describe('/api/upload - Integration Tests', () => {
  describe('POST', () => {
    it('should handle upload request with valid data', async () => {
      // Arrange
      const artistName = 'Test Artist';
      const albumName = 'Test Album';
      const releaseDate = '2024-01-01';
      const trackName = 'Test Track';

      const formData = createMockFormData({
        artist: artistName,
        album: albumName,
        releaseDate,
        'tracks[0][name]': trackName,
        'tracks[0][file]': createMockFile('test.mp3'),
      });

      const request = createMockRequest('POST', 'http://localhost:3000/api/upload', formData);

      // Act
      const response = await POST(request);

      // Assert
      expect(response).toBeDefined();
      expect(response.status).toBe(200);

      const responseData = await response.json();
      expect(responseData).toHaveProperty('success');
      expect(responseData).toHaveProperty('albumId');
    });

    it('should handle multiple tracks in upload', async () => {
      // Arrange
      const formData = createMockFormData({
        artist: 'Test Artist',
        album: 'Test Album',
        releaseDate: '2024-01-01',
        'tracks[0][name]': 'Track 1',
        'tracks[0][file]': createMockFile('track1.mp3'),
        'tracks[1][name]': 'Track 2',
        'tracks[1][file]': createMockFile('track2.mp3'),
        'tracks[2][name]': 'Track 3',
        'tracks[2][file]': createMockFile('track3.mp3'),
      });

      const request = createMockRequest('POST', 'http://localhost:3000/api/upload', formData);

      // Act
      const response = await POST(request);

      // Assert
      expect(response).toBeDefined();
      expect(response.status).toBe(200);

      const responseData = await response.json();
      expect(responseData.success).toBe(true);
    });

    it('should handle upload with artwork', async () => {
      // Arrange
      const artwork = createMockFile('artwork.jpg', 'image/jpeg');
      const formData = createMockFormData({
        artist: 'Test Artist',
        album: 'Test Album',
        releaseDate: '2024-01-01',
        artwork,
        'tracks[0][name]': 'Test Track',
        'tracks[0][file]': createMockFile('test.mp3'),
      });

      const request = createMockRequest('POST', 'http://localhost:3000/api/upload', formData);

      // Act
      const response = await POST(request);

      // Assert
      expect(response).toBeDefined();
      expect(response.status).toBe(200);

      const responseData = await response.json();
      expect(responseData.success).toBe(true);
    });
  });
});
