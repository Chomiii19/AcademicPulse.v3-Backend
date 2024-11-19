interface IUser {
  id: number;
  surname: string;
  firstname: string;
  middlename?: string;
  extension?: string;
  email: string;
  phoneNumber: string;
  password: string;
  isVerified: boolean;
}

export default IUser;
