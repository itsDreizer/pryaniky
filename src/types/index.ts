export interface IResponseData<T> {
  data: T | null;
  error_code: number;
  error_text: string;
}

export interface IDoc {
  companySigDate: string | Date;
  companySignatureName: string;
  documentName: string;
  documentStatus: string;
  documentType: string;
  employeeNumber: number;
  employeeSigDate: string | Date;
  employeeSignatureName: string;
  id: string;
}

export enum IDocKeys {
  companySigDate = "companySigDate",
  companySignatureName = "companySignatureName",
  documentName = "documentName",
  documentStatus = "documentStatus",
  documentType = "documentType",
  employeeNumber = "employeeNumber",
  employeeSigDate = "employeeSigDate",
  employeeSignatureName = "employeeSignatureName",
  id = "id",
}
