import React from "react";

const ICON_MAP = {
  pdf: "pdf.png",
  doc: "docx.png",
  docx: "word.png",
  xls: "xls.png",
  xlsx: "xls.png",
  ppt: "ppt.png",
  pptx: "ppt.png",
  zip: "zip.png",
  rar: "zip.png",
  txt: "txt.png",
  jpg: "image.png",
  jpeg: "image.png",
  png: "image.png",
  mp4: "video.png",
  mp3: "audio.png",
  mp3: "audio.png",
};

const FileIcon = ({
  extension = "",
  size = 20,
  className = "",
  alt,
}) => {
  const ext = extension.toLowerCase();
  const iconFile = ICON_MAP[ext] || "file.png";

  // ✅ Correct way (Vite/modern React)
  const src = new URL(`../assets/icons/${iconFile}`, import.meta.url).href;

  return (
    <img
      src={src}
      alt={alt || `${ext || "file"} file`}
      width={size}
      height={size}
      className={className}
    //   loading="lazy"
      onError={(e) => {
        e.target.src = new URL(
          "../assets/icons/default.png",
          import.meta.url
        ).href;
      }}
    />
  );
};

export default FileIcon;