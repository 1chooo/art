export function BentoLabel({ children }: { children: React.ReactNode }) {
  return (
    <p className="mb-3 inline-block border-b-2 border-current text-center text-xs font-bold uppercase tracking-[0.15em]">
      {children}
    </p>
  );
}
