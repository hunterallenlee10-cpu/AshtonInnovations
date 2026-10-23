import Image from "next/image";
import type { Photo } from "@/data/photos";
import { ProjectCaption } from "./Labels";

// A real photo shown as a matted print with a unified warm grade.
export function FramedPrint({
  photo,
  sizes,
  caption = true,
  className = "",
  captionClassName = "text-muted",
  eager = false,
}: {
  photo: Photo;
  sizes: string;
  caption?: boolean;
  className?: string;
  captionClassName?: string;
  eager?: boolean;
}) {
  return (
    <figure className={className}>
      <div className="print">
        <Image
          src={photo.src}
          alt={photo.alt}
          width={photo.width}
          height={photo.height}
          sizes={sizes}
          loading={eager ? "eager" : "lazy"}
          className="h-auto w-full"
        />
      </div>
      {caption && (
        <figcaption className="mt-3">
          <ProjectCaption caption={photo.caption} className={captionClassName} />
        </figcaption>
      )}
    </figure>
  );
}
