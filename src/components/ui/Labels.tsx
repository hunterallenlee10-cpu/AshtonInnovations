// Honesty labels. AI renders and real Ashton work are always captioned
// differently and never share a gallery.

export function RenderLabel({ className = "" }: { className?: string }) {
  return <span className={`annot ${className}`}>Illustrative render</span>;
}

export function ProjectCaption({
  caption,
  className = "",
}: {
  caption: string;
  className?: string;
}) {
  return (
    <span className={`annot ${className}`}>
      Ashton project <span aria-hidden="true">/</span> {caption}
    </span>
  );
}
