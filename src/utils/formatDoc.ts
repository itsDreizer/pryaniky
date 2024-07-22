import { IDoc } from "@/types";

export const formatDoc = (doc: IDoc, mode: "toDate" | "toString") => {
  const modifiedDoc = structuredClone(doc);
  if (mode === "toDate") {
    modifiedDoc.companySigDate = new Date(modifiedDoc.companySigDate);
    modifiedDoc.employeeSigDate = new Date(modifiedDoc.employeeSigDate);
  }

  if (mode === "toString") {
    modifiedDoc.companySigDate = (modifiedDoc.companySigDate as Date).toISOString();
    modifiedDoc.employeeSigDate = (modifiedDoc.employeeSigDate as Date).toISOString();
  }

  return modifiedDoc;
};
