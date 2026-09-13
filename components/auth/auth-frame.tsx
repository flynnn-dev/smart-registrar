import { Reveal } from "@/components/motion/reveal";

type AuthFrameProps = {
  children: React.ReactNode;
};

export function AuthFrame({ children }: AuthFrameProps) {
  return (
    <div className="flex flex-1 items-center justify-center bg-background px-4 py-10 pb-[max(2.5rem,env(safe-area-inset-bottom))]">
      <Reveal instant className="w-full max-w-md">
        {children}
      </Reveal>
    </div>
  );
}
