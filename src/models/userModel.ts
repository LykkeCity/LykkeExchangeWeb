export class UserModel {
  email: string;
  name: string;
  username: string;

  constructor(user?: Partial<UserModel>) {
    Object.assign(this, user);
  }
}
export default UserModel;
