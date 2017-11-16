export class UserModel {
  email: string;
  name: string;
  username: string;

  constructor(json?: any) {
    Object.assign(this, json);
  }
}
export default UserModel;
