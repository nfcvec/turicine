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
import Avatar from "@mui/material/Avatar";
import CircularProgress from "@mui/material/CircularProgress";
import Alert from "@mui/material/Alert";
import AddIcon from "@mui/icons-material/Add";
import RefreshIcon from "@mui/icons-material/Refresh";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import ImageIcon from "@mui/icons-material/Image";
import { listSponsors, deleteSponsor } from "../api/sponsors.js";
import { useApiResource } from "../hooks/useApiResource.js";
import { buildImageUrl } from "../utils/images.js";
import SponsorFormDialog from "../components/SponsorFormDialog.jsx";
import ConfirmDialog from "../components/ConfirmDialog.jsx";

export default function SponsorsPage() {
  const fetcher = useCallback((signal) => listSponsors(signal), []);
  const { data, loading, error, refetch } = useApiResource(fetcher);
  const sponsors = data?.value ?? [];

  const [editing, setEditing] = useState(undefined); // undefined=closed, null=new, obj=edit
  const [toDelete, setToDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const [actionError, setActionError] = useState(null);

  const confirmDelete = async () => {
    setDeleting(true);
    setActionError(null);
    try {
      await deleteSponsor(toDelete.Id);
      setToDelete(null);
      await refetch();
    } catch (err) {
      setActionError(err.message);
    } finally {
      setDeleting(false);
    }
  };

  return (
    <Box>
      <Stack direction="row" sx={{ mb: 2, justifyContent: "space-between", alignItems: "center" }}>
        <Typography variant="h4">Auspiciantes</Typography>
        <Stack direction="row" spacing={1}>
          <Button startIcon={<RefreshIcon />} onClick={() => refetch()} disabled={loading}>
            Actualizar
          </Button>
          <Button variant="contained" startIcon={<AddIcon />} onClick={() => setEditing(null)}>
            Nuevo auspiciante
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
                <TableCell>Logo</TableCell>
                <TableCell>Nombre</TableCell>
                <TableCell align="right">Acciones</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {sponsors.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={3} align="center">
                    Sin auspiciantes registrados.
                  </TableCell>
                </TableRow>
              ) : (
                sponsors.map((sponsor) => (
                  <TableRow key={sponsor.Id} hover>
                    <TableCell>
                      <Avatar
                        variant="rounded"
                        src={sponsor.LogoCloudflareImageId ? buildImageUrl(sponsor.LogoCloudflareImageId) : undefined}
                        sx={{ bgcolor: "#fff" }}
                      >
                        <ImageIcon fontSize="small" />
                      </Avatar>
                    </TableCell>
                    <TableCell>{sponsor.Name}</TableCell>
                    <TableCell align="right">
                      <IconButton size="small" onClick={() => setEditing(sponsor)}>
                        <EditIcon fontSize="small" />
                      </IconButton>
                      <IconButton size="small" color="error" onClick={() => setToDelete(sponsor)}>
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

      <SponsorFormDialog
        open={editing !== undefined}
        sponsor={editing || undefined}
        onClose={() => setEditing(undefined)}
        onSaved={() => {
          setEditing(undefined);
          refetch();
        }}
      />

      <ConfirmDialog
        open={toDelete !== null}
        title="Eliminar auspiciante"
        message={`Se eliminará "${toDelete?.Name}" y su logo. Esta acción no se puede deshacer.`}
        confirmLabel="Eliminar"
        busy={deleting}
        onConfirm={confirmDelete}
        onClose={() => setToDelete(null)}
      />
    </Box>
  );
}
