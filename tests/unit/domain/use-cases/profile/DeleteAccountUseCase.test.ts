import { DeleteAccountUseCase } from '@domain/use-cases/profile/DeleteAccountUseCase';
import type { ProfileRepository } from '@domain/repositories/ProfileRepository';

describe('DeleteAccountUseCase', () => {
  let useCase: DeleteAccountUseCase;
  let mockProfileRepository: jest.Mocked<ProfileRepository>;

  beforeEach(() => {
    mockProfileRepository = {
      deleteAccount: jest.fn(),
    } as unknown as jest.Mocked<ProfileRepository>;

    useCase = new DeleteAccountUseCase(mockProfileRepository);
  });

  it('should successfully call deleteAccount with the correct userId', async () => {
    const userId = 'user-123';
    mockProfileRepository.deleteAccount.mockResolvedValue();

    await useCase.execute(userId);

    expect(mockProfileRepository.deleteAccount).toHaveBeenCalledWith(userId);
    expect(mockProfileRepository.deleteAccount).toHaveBeenCalledTimes(1);
  });

  it('should propagate error if deleteAccount fails', async () => {
    const userId = 'user-123';
    const error = new Error('Failed to delete account');
    mockProfileRepository.deleteAccount.mockRejectedValue(error);

    await expect(useCase.execute(userId)).rejects.toThrow(error);
  });
});