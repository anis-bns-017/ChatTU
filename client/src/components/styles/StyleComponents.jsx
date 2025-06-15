import { styled } from "@mui/material";
import { Link as LinkComponent } from "react-router-dom";
import { grayColor } from "../constants/color";

export const VisuallyHiddenInput = styled("input")({
  border: "0",
  clip: "rect(0 0 0 0)",
  height: 1,
  margin: -1,
  overflow: "hidden",
  padding: 0,
  position: "absolute",
  whitespace: "nowrap",
  width: 1,
});

export const Link = styled(LinkComponent)({
  textDecoration: "none",
  color: "black",
  padding: "1rem",
  "&:hover": {
    backgroundColor: "rgba(0, 0, 0, 0.1)",
  },
});

export const InputBox = styled("input")`
  width: 100%;
  height: 100%;
  border: none;
  padding: 0 3rem;
  outline: none;
  border-radius: 1.5rem;
  background-color: ${grayColor};
`;

export const SearchField = styled("input")`
  width: 20vmax;
  padding: 0.75rem 2.5rem 0.75rem 1rem;
  border: none;
  border-radius: 2rem;
  background-color: ${grayColor};
  font-size: 1rem;
  outline: none;
  transition: box-shadow 0.2s;
  box-shadow: 0 1px 2px rgba(0,0,0,0.04);

  &::placeholder {
    color: #888;
    opacity: 1;
  }

  &:focus {
    box-shadow: 0 0 0 2px #1976d2;
    background-color: #fff;
  }
`

export const CurveButton = styled("button")`
  border: none;
  border-radius: 2rem;
  background-color: #1976d2;
  color: #fff;
  padding: 0.75rem 2rem;
  font-size: 1rem;
  cursor: pointer;
  transition: background 0.2s, box-shadow 0.2s;
  box-shadow: 0 1px 2px rgba(0,0,0,0.04);

  &:hover {
    background-color: #1565c0;
    box-shadow: 0 2px 8px rgba(25, 118, 210, 0.15);
  }

  &:active {
    background-color: #115293;
  }

  &:focus {
    outline: none;
    box-shadow: 0 0 0 2px #1976d2;
  }
`;