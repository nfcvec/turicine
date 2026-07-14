import { Link as RouterLink, useLocation } from "react-router-dom";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Drawer from "@mui/material/Drawer";
import Box from "@mui/material/Box";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Button from "@mui/material/Button";
import DashboardIcon from "@mui/icons-material/Dashboard";
import MovieIcon from "@mui/icons-material/Movie";
import PlaceIcon from "@mui/icons-material/Place";
import CategoryIcon from "@mui/icons-material/Category";
import ContactMailIcon from "@mui/icons-material/ContactMail";
import HandshakeIcon from "@mui/icons-material/Handshake";
import LogoutIcon from "@mui/icons-material/Logout";
import { getUsername, logout } from "../auth/keycloak.js";

const DRAWER_WIDTH = 240;

const NAV_ITEMS = [
  { label: "Inicio", to: "/", icon: <DashboardIcon /> },
  { label: "Películas", to: "/movies", icon: <MovieIcon /> },
  { label: "Sedes", to: "/venues", icon: <PlaceIcon /> },
  { label: "Categorías", to: "/categories", icon: <CategoryIcon /> },
  { label: "Contactos", to: "/leads", icon: <ContactMailIcon /> },
  { label: "Auspiciantes", to: "/sponsors", icon: <HandshakeIcon /> },
];

export default function AppShell({ children }) {
  const location = useLocation();

  return (
    <Box sx={{ display: "flex" }}>
      <AppBar
        position="fixed"
        sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}
      >
        <Toolbar>
          <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1 }}>
            Turicine Catálogo · Panel
          </Typography>
          <Typography variant="body2" sx={{ mr: 2, opacity: 0.9 }}>
            {getUsername()}
          </Typography>
          <Button color="inherit" startIcon={<LogoutIcon />} onClick={() => logout()}>
            Salir
          </Button>
        </Toolbar>
      </AppBar>

      <Drawer
        variant="permanent"
        sx={{
          width: DRAWER_WIDTH,
          flexShrink: 0,
          [`& .MuiDrawer-paper`]: { width: DRAWER_WIDTH, boxSizing: "border-box" },
        }}
      >
        <Toolbar />
        <Box sx={{ overflow: "auto" }}>
          <List>
            {NAV_ITEMS.map((item) => (
              <ListItem key={item.to} disablePadding>
                <ListItemButton
                  component={RouterLink}
                  to={item.to}
                  selected={location.pathname === item.to}
                >
                  <ListItemIcon>{item.icon}</ListItemIcon>
                  <ListItemText primary={item.label} />
                </ListItemButton>
              </ListItem>
            ))}
          </List>
        </Box>
      </Drawer>

      <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
        <Toolbar />
        {children}
      </Box>
    </Box>
  );
}
