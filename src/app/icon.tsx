import { ImageResponse } from "next/og";

export const size = { width: 512, height: 512 };
export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "#03030a",
      }}
    >
      <div
        style={{
          width: 344,
          height: 344,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          borderRadius: 112,
          border: "10px solid #8b5cff",
          background: "#080816",
          boxShadow: "0 0 90px rgba(139,92,255,.28)",
          transform: "rotate(45deg)",
        }}
      >
        <div
          style={{
            width: 118,
            height: 118,
            borderRadius: 35,
            border: "14px solid #00e5ff",
          }}
        />
      </div>
    </div>,
    size,
  );
}
