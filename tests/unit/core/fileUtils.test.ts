import { blobToBase64 } from '@core/utils/fileUtils';

describe('Core Utils: fileUtils', () => {
  describe('blobToBase64', () => {
    const originalFileReader = global.FileReader;

    afterEach(() => {
      global.FileReader = originalFileReader;
    });

    it('should resolve with base64 string on successful read', async () => {
      const mockResult = 'data:image/png;base64,dummy-data';
      const mockBlob = new Blob(['test content']);

      const mockFileReader = {
        readAsDataURL: jest.fn(),
        result: '',
        onload: null as any,
        onerror: null as any,
      };

      mockFileReader.readAsDataURL.mockImplementation(() => {
        mockFileReader.result = mockResult;
        if (mockFileReader.onload) mockFileReader.onload();
      });

      global.FileReader = jest.fn(() => mockFileReader) as any;

      const result = await blobToBase64(mockBlob);

      expect(global.FileReader).toHaveBeenCalled();
      expect(mockFileReader.readAsDataURL).toHaveBeenCalledWith(mockBlob);
      expect(result).toBe(mockResult);
    });

    it('should reject promise on read error', async () => {
      const mockBlob = new Blob(['test']);
      
      const mockFileReader = {
        readAsDataURL: jest.fn(),
        onload: null,
        onerror: null as any,
      };

      mockFileReader.readAsDataURL.mockImplementation(() => {
        if (mockFileReader.onerror) mockFileReader.onerror(new Error('File read failed'));
      });

      global.FileReader = jest.fn(() => mockFileReader) as any;

      await expect(blobToBase64(mockBlob)).rejects.toThrow();
    });
  });
});