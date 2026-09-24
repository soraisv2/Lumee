export function SectionLabel({ index, label }: { index: string; label: string }) {
  return (
    <p className="eyebrow flex items-center gap-3">
      <span aria-hidden className="size-1.5 rounded-full bg-lumen" />
      <span>
        ({index}) — {label}
      </span>
    </p>
  );
}
