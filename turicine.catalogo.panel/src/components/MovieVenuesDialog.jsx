import { useEffect, useState } from "react";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import Button from "@mui/material/Button";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Checkbox from "@mui/material/Checkbox";
import Alert from "@mui/material/Alert";
import CircularProgress from "@mui/material/CircularProgress";
import Box from "@mui/material/Box";
import { listVenues, setMovieVenues } from "../api/venues.js";

export default function MovieVenuesDialog({ open, movieId, currentVenues, onClose, onSaved }) {
  const [venues, setVenues] = useState([]);
  const [selected, setSelected] = useState(new Set());
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!open) return;
    setError(null);
    setSelected(new Set((currentVenues ?? []).map((v) => v.Id)));
    const controller = new AbortController();
    setLoading(true);
    listVenues(controller.signal)
      .then((data) => setVenues(data?.value ?? []))
      .catch((err) => {
        if (err.name !== "AbortError") setError(err.message);
      })
      .finally(() => setLoading(false));
    return () => controller.abort();
  }, [open, currentVenues]);

  const toggle = (id) =>
    setSelected((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });

  const handleSave = async () => {
    setError(null);
    setSaving(true);
    try {
      await setMovieVenues(movieId, [...selected]);
      onSaved();
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>Sedes donde se emite</DialogTitle>
      <DialogContent>
        {error && <Alert severity="error" sx={{ mb: 1 }}>{error}</Alert>}
        {loading ? (
          <Box sx={{ display: "flex", justifyContent: "center", py: 4 }}>
            <CircularProgress />
          </Box>
        ) : venues.length === 0 ? (
          <Alert severity="info">No hay sedes registradas. Crea sedes en la sección Sedes.</Alert>
        ) : (
          <List>
            {venues.map((venue) => (
              <ListItem key={venue.Id} disablePadding>
                <ListItemButton onClick={() => toggle(venue.Id)} dense>
                  <ListItemIcon>
                    <Checkbox edge="start" checked={selected.has(venue.Id)} tabIndex={-1} disableRipple />
                  </ListItemIcon>
                  <ListItemText primary={venue.Name} secondary={venue.Address || undefined} />
                </ListItemButton>
              </ListItem>
            ))}
          </List>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} disabled={saving}>
          Cancelar
        </Button>
        <Button variant="contained" onClick={handleSave} disabled={saving || loading}>
          Guardar
        </Button>
      </DialogActions>
    </Dialog>
  );
}
