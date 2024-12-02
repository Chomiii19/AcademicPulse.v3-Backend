type IStudent = {
  id?: number;
  studentId: string;
  schoolId: string;
  surname: string;
  firstname: string;
  middlename?: string | null;
  extension?: string | null;
  course: string;
  yearLevel: number;
  isValidated?: boolean;
  inSchool?: boolean;
  email?: string | null;
  createdAt?: Date;
  updatedAt?: Date;
};

export default IStudent;
