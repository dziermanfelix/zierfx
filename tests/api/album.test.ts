import { PATCH, DELETE } from '@/app/api/album/[id]/route';
import { POST } from '@/app/api/upload/route';
import { createMockRequest, createMockFormData, createMockFile } from '../utils/test-helpers';

describe('/api/album/[id]', () => {
  let testAlbumId: string;
  let testTrackId: string;

  // Create a test album before running album tests
  beforeAll(async () => {
    // Create an album first using the upload API
    const formData = createMockFormData({
      artist: 'Test Artist for Updates',
      album: 'Test Album for Updates',
      releaseDate: '2024-01-01',
      'tracks[0][name]': 'Test Track',
      'tracks[0][file]': createMockFile('test.mp3'),
    });

    const request = createMockRequest('POST', 'http://localhost:3000/api/upload', formData);
    const response = await POST(request);
    const responseData = await response.json();
    testAlbumId = responseData.albumId.toString();

    // Get the actual track ID from the created album
    // We'll need to query the database to get the track ID
    const { db } = await import('@/lib/prisma');
    const album = await db.album.findUnique({
      where: { id: parseInt(testAlbumId) },
      include: { tracks: true },
    });
    testTrackId = album?.tracks[0]?.id.toString() || '1';
  });

  describe('PATCH - Update Album', () => {
    it('should update album information', async () => {
      // Arrange
      const newAlbumName = 'Updated Album';
      const newReleaseDate = '2024-02-01';

      const formData = createMockFormData({
        albumName: newAlbumName,
        releaseDate: newReleaseDate,
        [`tracks[0][id]`]: testTrackId,
        'tracks[0][name]': 'Updated Track',
        'tracks[0][number]': '1',
      });

      const request = createMockRequest('PATCH', `http://localhost:3000/api/album/${testAlbumId}`, formData);
      const context = { params: Promise.resolve({ id: testAlbumId }) };

      // Act
      const response = await PATCH(request, context);

      // Assert
      expect(response).toBeDefined();
      expect(response.status).toBe(200);

      const responseData = await response.json();
      expect(responseData).toHaveProperty('success');
      expect(responseData).toHaveProperty('album');
    });

    it('should handle track file updates', async () => {
      // Arrange
      const newTrackFile = createMockFile('new-track.mp3');

      const formData = createMockFormData({
        [`tracks[0][id]`]: testTrackId,
        'tracks[0][name]': 'Updated Track',
        'tracks[0][number]': '1',
        'tracks[0][file]': newTrackFile,
      });

      const request = createMockRequest('PATCH', `http://localhost:3000/api/album/${testAlbumId}`, formData);
      const context = { params: Promise.resolve({ id: testAlbumId }) };

      // Act
      const response = await PATCH(request, context);

      // Assert
      expect(response).toBeDefined();
      expect(response.status).toBe(200);

      const responseData = await response.json();
      expect(responseData.success).toBe(true);
    });

    it('should handle artwork updates', async () => {
      // Arrange
      const newArtwork = createMockFile('new-artwork.jpg', 'image/jpeg');

      const formData = createMockFormData({
        albumName: 'Test Album',
        artwork: newArtwork,
        [`tracks[0][id]`]: testTrackId,
        'tracks[0][name]': 'Test Track',
        'tracks[0][number]': '1',
      });

      const request = createMockRequest('PATCH', `http://localhost:3000/api/album/${testAlbumId}`, formData);
      const context = { params: Promise.resolve({ id: testAlbumId }) };

      // Act
      const response = await PATCH(request, context);

      // Assert
      expect(response).toBeDefined();
      expect(response.status).toBe(200);

      const responseData = await response.json();
      expect(responseData.success).toBe(true);
    });
  });

  describe('DELETE - Delete Album', () => {
    it('should delete album and associated data', async () => {
      // Arrange
      const request = createMockRequest('DELETE', `http://localhost:3000/api/album/${testAlbumId}`);
      const context = { params: Promise.resolve({ id: testAlbumId }) };

      // Act
      const response = await DELETE(request, context);

      // Assert
      expect(response).toBeDefined();
      expect(response.status).toBe(200);

      const responseData = await response.json();
      expect(responseData.success).toBe(true);
    });

    it('should handle deletion of non-existent album', async () => {
      // Arrange
      const albumId = '999';
      const request = createMockRequest('DELETE', `http://localhost:3000/api/album/${albumId}`);
      const context = { params: Promise.resolve({ id: albumId }) };

      // Act
      const response = await DELETE(request, context);

      // Assert
      expect(response).toBeDefined();
      expect(response.status).toBe(404);

      const responseData = await response.json();
      expect(responseData.success).toBe(false);
      expect(responseData.error).toBe('Album not found');
    });
  });
});
