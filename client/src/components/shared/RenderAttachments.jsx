import React from "react";
import PropTypes from "prop-types";
import { transformImage } from "../../lib/features";
import { FileOpen as FileOpenIcon } from "@mui/icons-material";

// === Styles ===
const previewContainerStyle = {
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  background: "rgba(245,245,250,0.95)",
  borderRadius: 16,
  boxShadow: "0 2px 12px rgba(0,0,0,0.08)",
  padding: 16,
  maxWidth: 320,
  margin: "auto",
};

const imageWrapperStyle = {
  position: "relative",
  width: 250,
  height: 250,
  borderRadius: 12,
  overflow: "hidden",
  boxShadow: "0 1px 6px rgba(0,0,0,0.10)",
  background: "#fff",
  marginBottom: 8,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
};

// === Main Component ===
const RenderAttachments = ({ type, url }) => {
  console.log("RenderAttachments called with:", { type, url });
  const safeType = (type || "").trim().toLowerCase();

  console.log("RenderAttachments received:", { type: safeType, url });

  switch (safeType) {
    case "image":
      return (
        <div style={previewContainerStyle}>
          <div style={imageWrapperStyle}>
            <img
              src={transformImage(url, 500)}
              alt="Attachment"
              width="100%"
              height="100%"
              loading="lazy"
              style={{
                objectFit: "cover",
                width: "100%",
                height: "100%",
                borderRadius: 12,
                transition: "transform 0.2s",
                cursor: "pointer",
              }}
              onClick={() => window.open(url, "_blank")}
            />
          </div>
          <span style={{ fontSize: 13, color: "#888" }}>
            Click to view full size
          </span>
        </div>
      );

    case "video":
      return (
        <div style={previewContainerStyle}>
          <div style={imageWrapperStyle}>
            <video
              src={url}
              preload="none"
              controls
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
                borderRadius: 12,
                background: "#222",
              }}
            />
          </div>
        </div>
      );

    case "audio":
      return (
        <div style={previewContainerStyle}>
          <div style={{ width: "100%" }}>
            <audio src={url} controls style={{ width: "100%" }} />
          </div>
        </div>
      );

    default:
      return (
        <div style={previewContainerStyle}>
          <div style={imageWrapperStyle}>
            <FileOpenIcon fontSize="large" style={{ color: "#888" }} />
          </div>
          <span style={{ fontSize: 13, color: "#888" }}>
            Unsupported file
          </span>
        </div>
      );
  }
};

// === PropTypes ===
RenderAttachments.propTypes = {
  type: PropTypes.string.isRequired,
  url: PropTypes.string.isRequired,
};

export default RenderAttachments;
