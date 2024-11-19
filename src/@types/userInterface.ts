interface IUser {
  id: number;
  surname: string;
  firstname: string;
  middlename?: string | null;
  extension?: string | null;
  email: string;
  phoneNumber: string;
  password: string;
  isVerified: boolean;
}

export default IUser;
