import { AuthRepository } from "../../repositories/AuthRepository";
import { ProfileRepository } from "../../repositories/ProfileRepository";
import { LoggedInUser } from "../../entities/LoggedInUser";

export class EnrichSessionUserUseCase {
  constructor(
    private authRepository: AuthRepository,
    private profileRepository: ProfileRepository
  ) {}

  async execute(authUser?: any): Promise<LoggedInUser | null> {
    let baseUser = authUser;
    let isProfileComplete = false;
    
    if (!baseUser) {
      const session = await this.authRepository.getSession();
      baseUser = session;
    }

    if (!baseUser) return null;

    const user: LoggedInUser = {
      id: baseUser.id,
      email: baseUser.email || '',
      role: 'student',
      fullName: '',
      username: '',
      avatarUrl: '',
      createdAt: '',
    };
    
    const profile = await this.profileRepository.getProfile(user.id);

    if (profile) {
      user.fullName = profile.fullName;
      user.username = profile.username;
      user.role = profile.role;
      user.avatarUrl = profile.avatarUrl;
      user.createdAt = profile.createdAt?.toDateString() || '';
      user.avatarUrl = profile.avatarUrl;
      isProfileComplete = true;
    } 

    return user;
  }
}