import AddIcon from "@mui/icons-material/Add";
import CancelIcon from "@mui/icons-material/Close";
import DeleteIcon from "@mui/icons-material/DeleteOutlined";
import EditIcon from "@mui/icons-material/Edit";
import SaveIcon from "@mui/icons-material/Save";
import Button from "@mui/material/Button";
import {
  DataGrid,
  GridActionsCellItem,
  GridColDef,
  GridEventListener,
  GridRowEditStopReasons,
  GridRowId,
  GridRowModes,
  GridRowModesModel,
  GridRowsProp,
  GridSlots,
  GridToolbarContainer,
  GridValidRowModel,
} from "@mui/x-data-grid";
import { randomId } from "@mui/x-data-grid-generator";
import React, { useState } from "react";

import "./CrudTable.scss";

interface EditToolbarProps {
  initialRowState?: Object;
  setRows: (newRows: (oldRows: GridRowsProp) => GridRowsProp) => void;
  setRowModesModel: (newModel: (oldModel: GridRowModesModel) => GridRowModesModel) => void;
}

type HandlerResponse = Promise<{ error?: string; row: any } | void>;

interface ICrudTableProps {
  deleteHandler?: (row: any) => HandlerResponse;
  createHandler?: (row: any) => HandlerResponse;
  updateHandler?: (row: any) => HandlerResponse;
  initialRowState?: {
    [key: string]: any;
  };
  initialRows: GridValidRowModel[];
  columns: GridColDef[];
}

function EditToolbar(props: EditToolbarProps) {
  const { setRows, setRowModesModel, initialRowState } = props;

  const handleClick = () => {
    const id = randomId();

    setRows((oldRows) => [...oldRows, Object.assign({ id, isNew: true }, initialRowState)]);

    setRowModesModel((oldModel) => ({
      ...oldModel,
      [id]: { mode: GridRowModes.Edit, fieldToFocus: "name" },
    }));
  };

  return (
    <GridToolbarContainer>
      <Button color="primary" startIcon={<AddIcon />} onClick={handleClick}>
        Добавить запись
      </Button>
    </GridToolbarContainer>
  );
}

const CrudTable: React.FC<ICrudTableProps> = (props) => {
  const { initialRows, columns, initialRowState, createHandler, updateHandler, deleteHandler } = props;
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [rows, setRows] = useState(initialRows);
  const [rowModesModel, setRowModesModel] = useState<GridRowModesModel>({});

  const handleRowEditStop: GridEventListener<"rowEditStop"> = (params, event) => {
    if (params.reason === GridRowEditStopReasons.rowFocusOut) {
      event.defaultMuiPrevented = true;
    }
  };

  const handleEditClick = (id: GridRowId) => () => {
    setRowModesModel({ ...rowModesModel, [id]: { mode: GridRowModes.Edit } });
  };

  const handleSaveClick = (id: GridRowId) => () => {
    setRowModesModel({ ...rowModesModel, [id]: { mode: GridRowModes.View } });
  };

  const handleDeleteClick = (id: GridRowId) => async () => {
    setRows(rows.filter((row) => row.id !== id));

    if (!deleteHandler) return;

    const response = await deleteHandler(rows.filter((row) => row.id === id)[0]);

    if (!response) return;

    if (response.error) {
      setRows([...rows]);

      setErrorMessage(response.error);

      setTimeout(() => {
        setErrorMessage("");
      }, 5000);
    }
  };

  const handleCancelClick = (id: GridRowId) => () => {
    setRowModesModel({
      ...rowModesModel,
      [id]: { mode: GridRowModes.View, ignoreModifications: true },
    });

    const editedRow = rows.find((row) => row.id === id);
    if (editedRow!.isNew) {
      setRows(rows.filter((row) => row.id !== id));
    }
  };

  const processRowUpdate = (newRow: GridValidRowModel) => {
    const updatedRow = { ...newRow, isNew: false };
    setRows(rows.map((row) => (row.id === newRow.id ? updatedRow : row)));

    const rowWithoutIsNew = structuredClone(newRow);
    delete rowWithoutIsNew.isNew;

    const isDocExists = !newRow.isNew;

    if (isDocExists && updateHandler) {
      setTimeout(async () => {
        const response = await updateHandler(rowWithoutIsNew);

        if (!response) return;

        if (response.error) {
          setErrorMessage(response.error);

          setRows([...rows]);

          setTimeout(() => {
            setErrorMessage("");
          }, 5000);
        }
      }, 0);
    }

    if (!isDocExists && createHandler) {
      setTimeout(async () => {
        const response = await createHandler(rowWithoutIsNew);

        if (!response) return;

        if (response.error) {
          setErrorMessage(response.error);

          setRows(rows.filter((row) => row.id !== response.row.id));

          setTimeout(() => {
            setErrorMessage("");
          }, 5000);
        }
      }, 0);
    }

    return updatedRow;
  };

  const handleRowModesModelChange = (newRowModesModel: GridRowModesModel) => {
    setRowModesModel(newRowModesModel);
  };

  return (
    <>
      <DataGrid
        hideFooter
        rows={rows}
        columns={[
          ...columns,
          {
            field: "actions",
            type: "actions",
            headerName: "Действия",
            width: 100,
            cellClassName: "actions",
            getActions: ({ id }) => {
              const isInEditMode = rowModesModel[id]?.mode === GridRowModes.Edit;

              if (isInEditMode) {
                return [
                  <GridActionsCellItem
                    icon={<SaveIcon />}
                    label="Save"
                    sx={{
                      color: "primary.main",
                    }}
                    onClick={handleSaveClick(id)}
                  />,
                  <GridActionsCellItem
                    icon={<CancelIcon />}
                    label="Cancel"
                    className="textPrimary"
                    onClick={handleCancelClick(id)}
                    color="inherit"
                  />,
                ];
              }

              return [
                <GridActionsCellItem
                  icon={<EditIcon />}
                  label="Edit"
                  className="textPrimary"
                  onClick={handleEditClick(id)}
                  color="inherit"
                />,
                <GridActionsCellItem
                  icon={<DeleteIcon />}
                  label="Delete"
                  onClick={handleDeleteClick(id)}
                  color="inherit"
                />,
              ];
            },
          },
        ]}
        editMode="row"
        rowModesModel={rowModesModel}
        onRowModesModelChange={handleRowModesModelChange}
        onRowEditStop={handleRowEditStop}
        processRowUpdate={processRowUpdate}
        onProcessRowUpdateError={(error) => {
          console.log(error);
        }}
        slots={{
          toolbar: EditToolbar as GridSlots["toolbar"],
        }}
        slotProps={{
          toolbar: { setRows, setRowModesModel, initialRowState },
        }}
      />
      {errorMessage && <div className="table-error">{errorMessage}</div>}
    </>
  );
};

export default CrudTable;
