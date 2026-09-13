type NowServingProps = {
  number: string | null;
  label?: string;
};

export function NowServing({
  number,
  label = "Now serving",
}: NowServingProps) {
  return (
    <section className="surface-card overflow-hidden text-center">
      <div className="bg-linear-to-b from-primary/8 to-transparent px-5 py-10 sm:px-8">
        <p className="text-caption uppercase tracking-[0.18em]">{label}</p>
        <p className="mt-3 font-mono text-5xl font-semibold tracking-tight sm:text-6xl">
          {number ?? "—"}
        </p>
      </div>
    </section>
  );
}
