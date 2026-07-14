import { useCallback, useMemo, useState } from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import Chip from "@mui/material/Chip";
import CircularProgress from "@mui/material/CircularProgress";
import Alert from "@mui/material/Alert";
import RefreshIcon from "@mui/icons-material/Refresh";
import DownloadIcon from "@mui/icons-material/Download";
import FiberNewIcon from "@mui/icons-material/FiberNew";
import { listLeads, markDownloaded } from "../api/leads.js";
import { exportLeadsToExcel } from "../lib/exportLeads.js";
import { useApiResource } from "../hooks/useApiResource.js";

function formatDate(value) {
  if (!value) return "—";
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? "—" : date.toLocaleString("es-EC");
}

export default function LeadsPage() {
  const fetcher = useCallback((signal) => listLeads(signal), []);
  const { data, loading, error, refetch } = useApiResource(fetcher);
  const leads = useMemo(() => data?.value ?? [], [data]);
  const newLeads = useMemo(() => leads.filter((lead) => !lead.IsDownloaded), [leads]);

  const [busy, setBusy] = useState(false);
  const [actionError, setActionError] = useState(null);

  const download = async (rows, label) => {
    if (rows.length === 0) return;
    setActionError(null);
    setBusy(true);
    try {
      // Generate the workbook client-side, then mark the exported rows so the
      // next "new" view excludes them. No limit on how many times you export.
      exportLeadsToExcel(rows, label);
      await markDownloaded(rows.map((lead) => lead.Id));
      await refetch();
    } catch (err) {
      setActionError(err.message);
    } finally {
      setBusy(false);
    }
  };

  return (
    <Box>
      <Stack direction="row" sx={{ mb: 2, justifyContent: "space-between", alignItems: "center" }}>
        <Typography variant="h4">Contactos</Typography>
        <Stack direction="row" spacing={1}>
          <Button startIcon={<RefreshIcon />} onClick={() => refetch()} disabled={loading || busy}>
            Actualizar
          </Button>
          <Button
            variant="outlined"
            startIcon={<FiberNewIcon />}
            onClick={() => download(newLeads, "nuevos")}
            disabled={busy || newLeads.length === 0}
          >
            Descargar nuevos ({newLeads.length})
          </Button>
          <Button
            variant="contained"
            startIcon={<DownloadIcon />}
            onClick={() => download(leads, "todos")}
            disabled={busy || leads.length === 0}
          >
            Descargar todos ({leads.length})
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
                <TableCell>Estado</TableCell>
                <TableCell>Nombre</TableCell>
                <TableCell>Correo</TableCell>
                <TableCell>Tema</TableCell>
                <TableCell>Mensaje</TableCell>
                <TableCell>Recibido</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {leads.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} align="center">
                    Sin contactos registrados.
                  </TableCell>
                </TableRow>
              ) : (
                leads.map((lead) => (
                  <TableRow key={lead.Id} hover>
                    <TableCell>
                      {lead.IsDownloaded ? (
                        <Chip size="small" label="Descargado" variant="outlined" />
                      ) : (
                        <Chip size="small" label="Nuevo" color="primary" />
                      )}
                    </TableCell>
                    <TableCell>{lead.FullName}</TableCell>
                    <TableCell>{lead.Email}</TableCell>
                    <TableCell>{lead.Topic || "—"}</TableCell>
                    <TableCell sx={{ maxWidth: 360, whiteSpace: "pre-wrap" }}>{lead.Message || "—"}</TableCell>
                    <TableCell>{formatDate(lead.CreatedAtUtc)}</TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Box>
  );
}
