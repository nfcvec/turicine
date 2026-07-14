import { useCallback, useRef, useState } from "react";
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
import Link from "@mui/material/Link";
import Stack from "@mui/material/Stack";
import Avatar from "@mui/material/Avatar";
import Tooltip from "@mui/material/Tooltip";
import CircularProgress from "@mui/material/CircularProgress";
import Alert from "@mui/material/Alert";
import AddIcon from "@mui/icons-material/Add";
import RefreshIcon from "@mui/icons-material/Refresh";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import PlaceIcon from "@mui/icons-material/Place";
import WhatsAppIcon from "@mui/icons-material/WhatsApp";
import ImageIcon from "@mui/icons-material/Image";
import { listVenues, deleteVenue, setVenueLogo, deleteVenueLogo } from "../api/venues.js";
import { useApiResource } from "../hooks/useApiResource.js";
import { buildImageUrl } from "../utils/images.js";
import VenueFormDialog from "../components/VenueFormDialog.jsx";
import ConfirmDialog from "../components/ConfirmDialog.jsx";

export default function VenuesPage() {
  const fetcher = useCallback((signal) => listVenues(signal), []);
  const { data, loading, error, refetch } = useApiResource(fetcher);
  const venues = data?.value ?? [];

  const [editing, setEditing] = useState(undefined); // undefined=closed, null=new, obj=edit
  const [toDelete, setToDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const [actionError, setActionError] = useState(null);
  const [logoBusyId, setLogoBusyId] = useState(null);
  const logoInputRef = useRef(null);
  const logoVenueIdRef = useRef(null);

  const confirmDelete = async () => {
    setDeleting(true);
    setActionError(null);
    try {
      await deleteVenue(toDelete.Id);
      setToDelete(null);
      await refetch();
    } catch (err) {
      setActionError(err.message);
    } finally {
      setDeleting(false);
    }
  };

  const pickLogo = (venueId) => {
    logoVenueIdRef.current = venueId;
    logoInputRef.current?.click();
  };

  const onLogoFile = async (event) => {
    const file = event.target.files?.[0];
    event.target.value = "";
    const venueId = logoVenueIdRef.current;
    if (!file || !venueId) return;
    setActionError(null);
    setLogoBusyId(venueId);
    try {
      await setVenueLogo(venueId, file);
      await refetch();
    } catch (err) {
      setActionError(err.message);
    } finally {
      setLogoBusyId(null);
    }
  };

  const removeLogo = async (venueId) => {
    setActionError(null);
    setLogoBusyId(venueId);
    try {
      await deleteVenueLogo(venueId);
      await refetch();
    } catch (err) {
      setActionError(err.message);
    } finally {
      setLogoBusyId(null);
    }
  };

  return (
    <Box>
      <Stack direction="row" sx={{ mb: 2, justifyContent: "space-between", alignItems: "center" }}>
        <Typography variant="h4">Sedes</Typography>
        <Stack direction="row" spacing={1}>
          <Button startIcon={<RefreshIcon />} onClick={() => refetch()} disabled={loading}>
            Actualizar
          </Button>
          <Button variant="contained" startIcon={<AddIcon />} onClick={() => setEditing(null)}>
            Nueva sede
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
                <TableCell>Dirección</TableCell>
                <TableCell>Teléfono</TableCell>
                <TableCell>Enlaces</TableCell>
                <TableCell align="right">Acciones</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {venues.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} align="center">
                    Sin sedes registradas.
                  </TableCell>
                </TableRow>
              ) : (
                venues.map((venue) => (
                  <TableRow key={venue.Id} hover>
                    <TableCell>
                      <Stack direction="row" spacing={0.5} sx={{ alignItems: "center" }}>
                        {logoBusyId === venue.Id ? (
                          <CircularProgress size={24} />
                        ) : (
                          <Avatar
                            variant="rounded"
                            src={venue.LogoCloudflareImageId ? buildImageUrl(venue.LogoCloudflareImageId) : undefined}
                          >
                            <ImageIcon fontSize="small" />
                          </Avatar>
                        )}
                        <Tooltip title={venue.LogoCloudflareImageId ? "Reemplazar logo" : "Subir logo"}>
                          <IconButton size="small" onClick={() => pickLogo(venue.Id)} disabled={logoBusyId === venue.Id}>
                            <EditIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                        {venue.LogoCloudflareImageId && (
                          <Tooltip title="Quitar logo">
                            <IconButton size="small" color="error" onClick={() => removeLogo(venue.Id)} disabled={logoBusyId === venue.Id}>
                              <DeleteIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                        )}
                      </Stack>
                    </TableCell>
                    <TableCell>{venue.Name}</TableCell>
                    <TableCell>{venue.Address || "—"}</TableCell>
                    <TableCell>{venue.PhoneNumber || "—"}</TableCell>
                    <TableCell>
                      <Stack direction="row" spacing={1}>
                        {venue.MapsUrl && (
                          <Link href={venue.MapsUrl} target="_blank" rel="noopener">
                            <PlaceIcon fontSize="small" />
                          </Link>
                        )}
                        {venue.WhatsappNumber && (
                          <Link
                            href={`https://wa.me/${venue.WhatsappNumber.replace(/\D/g, "")}`}
                            target="_blank"
                            rel="noopener"
                          >
                            <WhatsAppIcon fontSize="small" />
                          </Link>
                        )}
                      </Stack>
                    </TableCell>
                    <TableCell align="right">
                      <IconButton size="small" onClick={() => setEditing(venue)}>
                        <EditIcon fontSize="small" />
                      </IconButton>
                      <IconButton size="small" color="error" onClick={() => setToDelete(venue)}>
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

      <input ref={logoInputRef} type="file" accept="image/*" hidden onChange={onLogoFile} />

      <VenueFormDialog
        open={editing !== undefined}
        venue={editing || undefined}
        onClose={() => setEditing(undefined)}
        onSaved={() => {
          setEditing(undefined);
          refetch();
        }}
      />

      <ConfirmDialog
        open={toDelete !== null}
        title="Eliminar sede"
        message={`Se eliminará la sede "${toDelete?.Name}" y su asignación a las películas. Esta acción no se puede deshacer.`}
        confirmLabel="Eliminar"
        busy={deleting}
        onConfirm={confirmDelete}
        onClose={() => setToDelete(null)}
      />
    </Box>
  );
}
