import { Role } from 'src/constants/role.enum';

export class Payload {
    userid: string;
    username: string;
    roles: Role[];
    email?: string;
    iat?: number;
    exp?: number;
    iss?: string;
}
