export class UserData {
  constructor(
    public displayName: string,
    public email: string,
    public uId: string,
    public creationTime: string,
    public lastSignInTime: string,
    public isNewUser?: boolean,
    public photoUrl?: string,
    public phoneNumber?: string
  ) {}
}
export class LoginUserData {
  constructor(
    public name: string,
    public rollno: string,
    public erpId: string,
    public div: string,
    public department: string,
    public year: string
  ) {}
}
