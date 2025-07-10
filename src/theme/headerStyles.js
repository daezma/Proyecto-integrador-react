import { styled, alpha, keyframes } from "@mui/material/styles";
import { InputBase } from "@mui/material";

const headerStyles = {
  toolbar: {
    justifyContent: "space-between",
  },
  desktopMenu: {
    display: "flex",
    gap: 2,
  },
  drawerBox: {
    width: 250,
  },
  bounce: keyframes`
    0% { transform: scale(1); }
    30% { transform: scale(1.2); }
    50% { transform: scale(0.9); }
    70% { transform: scale(1.05); }
    100% { transform: scale(1); }
  `,
  pulse: keyframes`
    0% { transform: scale(1); }
    50% { transform: scale(1.3); }
    100% { transform: scale(1); }
  `,
};

export const Search = styled("div")(({ theme }) => ({
  position: "relative",
  borderRadius: theme.shape.borderRadius,
  backgroundColor: alpha(theme.palette.common.white, 0.15),
  "&:hover": {
    backgroundColor: alpha(theme.palette.common.white, 0.25),
  },
  marginLeft: theme.spacing(2),
  marginRight: theme.spacing(2),
  width: "100%",
  maxWidth: 300,
}));

export const SearchIconWrapper = styled("div")(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: "100%",
  position: "absolute",
  pointerEvents: "none",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
}));

export const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: "inherit",
  width: "100%",
  "& .MuiInputBase-input": {
    padding: theme.spacing(1, 1, 1, 0),
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    transition: theme.transitions.create("width"),
  },
}));

export default headerStyles;
