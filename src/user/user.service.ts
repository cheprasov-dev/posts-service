import { Injectable } from '@nestjs/common';

import { UserAuthData } from '../auth/jwt.strategy';

@Injectable()
export class UserService {
  isGroupMember(user: UserAuthData, groupId: number) {
    return user.userGroups.includes(groupId);
  }
}
