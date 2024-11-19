interface IStudent {
  schoolId: string;
  email: string;
  createdAt: Date;
  updatedAt: Date;
  studentId: string;
  surname: string;
  firstname: string;
  middlename: string | null;
  extension: string | null;
  course: string;
  yearLevel: number;
  isValidated: boolean;
}

export default IStudent;
