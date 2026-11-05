import { IKImage } from "imagekitio-react";

const Image = ({ src, className, w, h, alt }) => {
  const endpoint = import.meta.env.VITE_IK_URL_ENDPOINT;
  const path = typeof src === "string" ? src : "";
  const absolute = /^https?:\/\//i.test(path);

  if (!endpoint || absolute) {
    const url = absolute
      ? path
      : endpoint
        ? `${endpoint.replace(/\/+$/, "")}/${path.replace(/^\/+/, "")}`
        : "";
    if (!url) {
      return (
        <div
          className={`bg-[#d9e6df] dark:bg-[#222D25] ${className || ""}`}
          style={{ minHeight: h || 160 }}
          role="img"
          aria-label={alt || "Article image"}
        />
      );
    }
    return (
      <img
        src={url}
        alt={alt || ""}
        width={w}
        height={h}
        loading="lazy"
        className={className}
      />
    );
  }

  return (
    <IKImage
      urlEndpoint={endpoint}
      path={path}
      className={className}
      loading="lazy"
      lqip={{ active: true, quality: 20 }}
      alt={alt}
      width={w}
      height={h}
      transformation={[
        {
          width: w,
          height: h,
        },
      ]}
    />
  );
};

export default Image;
