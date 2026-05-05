export function BentoLabel({ children }: { children: React.ReactNode }) {
  return (
    <p className="border-bento-ink mb-3 inline-block border-b-2 text-center text-xs font-bold uppercase tracking-[0.15em]">
      {children}
    </p>
  );
}
