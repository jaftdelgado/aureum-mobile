import { AuthApiRepository } from '../infra/external/auth/AuthApiRepository';
import { ProfileApiRepository } from '../infra/api/users/ProfileApiRepository';
import { TeamsApiRepository } from '../infra/api/teams/TeamsApiRepository';
import { AssetApiRepository } from '../infra/api/assets/AssetApiRepository';

// Use Cases - Auth
import { LoginUseCase } from '../domain/use-cases/auth/LoginUseCase';
import { RegisterUseCase } from '../domain/use-cases/auth/RegisterUseCase';
import { LogoutUseCase } from '../domain/use-cases/auth/LogoutUseCase';
import { GetSessionUseCase } from '../domain/use-cases/auth/GetSessionUseCase';
import { EnrichSessionUserUseCase } from '../domain/use-cases/auth/EnrichSessionUserUseCase';
import { CheckProfileExistsUseCase } from '../domain/use-cases/auth/CheckProfileExistsUseCase';

import { GetProfessorTeamsUseCase } from '../domain/use-cases/teams/GetProfessorTeamsUseCase';
import { GetStudentTeamsUseCase } from '../domain/use-cases/teams/GetStudentTeamsUseCase';
import { CreateTeamUseCase } from '../domain/use-cases/teams/CreateTeamUseCase';
import { JoinTeamUseCase } from '../domain/use-cases/teams/JoinTeamUseCase';

export const authRepository = new AuthApiRepository();
export const profileRepository = new ProfileApiRepository();
export const teamsRepository = new TeamsApiRepository();
export const assetRepository = new AssetApiRepository();

export const loginUseCase = new LoginUseCase(authRepository, profileRepository);
export const registerUseCase = new RegisterUseCase(authRepository, profileRepository);
export const logoutUseCase = new LogoutUseCase(authRepository);
export const getSessionUseCase = new GetSessionUseCase(authRepository, profileRepository);
export const checkProfileExistsUseCase = new CheckProfileExistsUseCase(profileRepository);

export const enrichSessionUserUseCase = new EnrichSessionUserUseCase(authRepository, profileRepository);

export const getProfessorTeamsUseCase = new GetProfessorTeamsUseCase(teamsRepository);
export const getStudentTeamsUseCase = new GetStudentTeamsUseCase(teamsRepository);
export const createTeamUseCase = new CreateTeamUseCase(teamsRepository);
export const joinTeamUseCase = new JoinTeamUseCase(teamsRepository);