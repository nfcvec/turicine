import { useCallback, useState } from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import CircularProgress from "@mui/material/CircularProgress";
import Alert from "@mui/material/Alert";
import AddIcon from "@mui/icons-material/Add";
import RefreshIcon from "@mui/icons-material/Refresh";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { listCategories, deleteCategory } from "../api/categories.js";
import { useApiResource } from "../hooks/useApiResource.js";
import CategoryFormDialog from "../components/CategoryFormDialog.jsx";
import ConfirmDialog from "../components/ConfirmDialog.jsx";

export default function CategoriesPage() {
  const fetcher = useCallback((signal) => listCategories(signal), []);
  const { data, loading, error, refetch } = useApiResource(fetcher);
  const categories = data?.value ?? [];

  const [editing, setEditing] = useState(undefined); // undefined=closed, null=new, obj=edit
  const [toDelete, setToDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const [actionError, setActionError] = useState(null);

  const confirmDelete = async () => {
    setDeleting(true);
    setActionError(null);
    try {
      await deleteCategory(toDelete.Id);
      setToDelete(null);
      await refetch();
    } catch (err) {
      setActionError(err.message);
      setToDelete(null);
    } finally {
      setDeleting(false);
    }
  };

  return (
    <Box>
      <Stack direction="row" sx={{ mb: 2, justifyContent: "space-between", alignItems: "center" }}>
        <Typography variant="h4">Categorías</Typography>
        <Stack direction="row" spacing={1}>
          <Button startIcon={<RefreshIcon />} onClick={() => refetch()} disabled={loading}>
            Actualizar
          </Button>
          <Button variant="contained" startIcon={<AddIcon />} onClick={() => setEditing(null)}>
            Nueva categoría
          </Button>
        </Stack>
      </Stack>

      {(error || actionError) && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error || actionError}
        </Alert>
      )}

      {loading ? (
        <Box sx={{ display: "flex", justifyContent: "center", py: 6 }}>
          <CircularProgress />
        </Box>
      ) : (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Nombre</TableCell>
                <TableCell align="right">Acciones</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {categories.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={2} align="center">
                    Sin categorías registradas.
                  </TableCell>
                </TableRow>
              ) : (
                categories.map((category) => (
                  <TableRow key={category.Id} hover>
                    <TableCell>{category.Name}</TableCell>
                    <TableCell align="right">
                      <IconButton size="small" onClick={() => setEditing(category)}>
                        <EditIcon fontSize="small" />
                      </IconButton>
                      <IconButton size="small" color="error" onClick={() => setToDelete(category)}>
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      <CategoryFormDialog
        open={editing !== undefined}
        category={editing || undefined}
        onClose={() => setEditing(undefined)}
        onSaved={() => {
          setEditing(undefined);
          refetch();
        }}
      />

      <ConfirmDialog
        open={toDelete !== null}
        title="Eliminar categoría"
        message={`Se eliminará la categoría "${toDelete?.Name}". Si tiene películas asociadas, la operación será rechazada.`}
        confirmLabel="Eliminar"
        busy={deleting}
        onConfirm={confirmDelete}
        onClose={() => setToDelete(null)}
      />
    </Box>
  );
}
