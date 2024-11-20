interface ISchool {
  id: number;
  schoolId?: string | null;
  name: string;
  address: string;
  email: string;
  createdAt?: Date;
  updatedAt?: Date;
  ownerEmail: string;
}

export default ISchool;
