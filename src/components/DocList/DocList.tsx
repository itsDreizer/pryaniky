import React, { useMemo } from "react";
import { IDoc, IDocKeys } from "@/types";
import { GridColDef } from "@mui/x-data-grid";
import { useAppDispatch } from "@/redux/hooks";
import { createDoc, deleteDoc, updateDoc } from "@/redux/reducers/userDocsSlice";
import CrudTable from "../CrudTable/CrudTable";
import { formatDoc } from "@/utils/formatDoc";
import "./DocList.scss";

interface IDocListProps {
  docs: IDoc[] | null;
}

const DocList: React.FC<IDocListProps> = (props) => {
  const { docs } = props;
  const dispatch = useAppDispatch();

  const formattedDocs = useMemo(() => {
    return (
      docs?.map((doc) => {
        return formatDoc(doc, "toDate");
      }) || docs
    );
  }, [docs]);

  const columns: GridColDef[] = [
    { field: "id", headerName: "ID", width: 90, type: "string" },
    { field: "documentName", headerName: "documentName", width: 150, editable: true },
    { field: "documentStatus", headerName: "documentStatus", width: 150, editable: true },
    { field: "documentType", headerName: "documentType", width: 150, editable: true },
    { field: "companySignatureName", headerName: "companySignatureName", width: 150, editable: true },
    { field: "companySigDate", headerName: "companySigDate", width: 150, editable: true, type: "date" },
    { field: "employeeNumber", headerName: "employeeNumber", width: 150, editable: true },
    { field: "employeeSigDate", headerName: "employeeSigDate", width: 150, editable: true, type: "date" },
    { field: "employeeSignatureName", headerName: "employeeSignatureName", width: 150, editable: true },
  ];

  const initialRowState = {
    [IDocKeys.companySigDate]: new Date(),
    [IDocKeys.employeeSigDate]: new Date(),
    [IDocKeys.documentName]: "Текст",
    [IDocKeys.documentStatus]: "Текст",
    [IDocKeys.employeeNumber]: 123,
    [IDocKeys.companySignatureName]: "Текст",
    [IDocKeys.documentType]: "Текст",
    [IDocKeys.employeeSignatureName]: "Текст",
  };

  const createHandler = async (doc: IDoc) => {
    const modifiedDoc = formatDoc(doc, "toDate");

    const response = await dispatch(createDoc(modifiedDoc));

    if (!response.payload) return;

    if ("error" in response.payload) {
      return { error: response.payload.error, row: response.payload.doc };
    } else {
      return { row: response.payload };
    }
  };

  const deleteHandler = async (doc: IDoc) => {
    const modifiedDoc = formatDoc(doc, "toString");

    const response = await dispatch(deleteDoc(modifiedDoc));

    if (!response.payload) return;

    if ("error" in response.payload) {
      return { error: response.payload.error, row: doc };
    }
  };

  const updateHandler = async (doc: IDoc) => {
    const modifiedDoc = formatDoc(doc, "toString");

    const response = await dispatch(updateDoc(modifiedDoc));

    if (!response.payload) return;

    if ("error" in response.payload) {
      const error = Array.isArray(response.payload.error) ? response.payload.error[0] : response.payload.error;

      return { error, row: doc };
    }
  };

  if (docs && formattedDocs) {
    return (
      <div className="doc-list-wrapper">
        <CrudTable
          initialRowState={initialRowState}
          updateHandler={updateHandler}
          createHandler={createHandler}
          deleteHandler={deleteHandler}
          columns={columns}
          initialRows={formattedDocs}
        />
      </div>
    );
  }
};

export default DocList;
