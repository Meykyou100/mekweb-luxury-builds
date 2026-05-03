import agencyMark from "@/assets/agency-mark.png";
import { cn } from "@/lib/utils";

type BrandLogoProps = {
  className?: string;
  markClassName?: string;
  textClassName?: string;
  showText?: boolean;
};

export const BrandLogo = ({
  className,
  markClassName,
  textClassName,
  showText = true,
}: BrandLogoProps) => {
  return (
    <span className={cn("inline-flex min-w-0 items-center gap-2", className)}>
      <span
        className={cn(
          "grid h-10 w-10 shrink-0 place-items-center overflow-hidden rounded-xl border border-gold/30 bg-black",
          markClassName,
        )}
      >
        <img src={agencyMark} alt="" className="h-[82%] w-[82%] object-contain" />
      </span>
      {showText && (
        <span
          className={cn(
            "flex flex-col font-sans text-2xl font-black leading-none tracking-tight text-white",
            textClassName,
          )}
        >
          <span>MekWeb</span>
          <span className="mt-1 text-[0.42em] uppercase tracking-[0.34em] text-gold">Agency</span>
        </span>
      )}
    </span>
  );
};
