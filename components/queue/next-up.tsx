type NextUpProps = {
  numbers: string[];
};

export function NextUp({ numbers }: NextUpProps) {
  return (
    <section className="surface-card px-5 py-5">
      <p className="text-caption uppercase tracking-[0.16em]">Next</p>
      {numbers.length === 0 ? (
        <p className="mt-3 text-sm text-muted-foreground">
          No one else is waiting.
        </p>
      ) : (
        <ol className="mt-3 flex flex-wrap gap-3">
          {numbers.map((number) => (
            <li
              key={number}
              className="rounded-lg bg-muted px-3 py-2 font-mono text-lg font-semibold tracking-tight"
            >
              {number}
            </li>
          ))}
        </ol>
      )}
    </section>
  );
}
