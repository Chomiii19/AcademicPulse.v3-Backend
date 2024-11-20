interface IUser {
  id: number;
  schoolId: string | null;
  email: string;
  createdAt?: Date;
  updatedAt?: Date;
  surname: string;
  firstname: string;
  middlename?: string | null;
  extension?: string | null;
  role: number;
  phoneNumber: string;
  password: string;
  isVerified: boolean;
}

export default IUser;
