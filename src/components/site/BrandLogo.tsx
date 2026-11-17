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
    <span className={cn("inline-flex min-w-0 items-center gap-3", className)}>
      <span
        className={cn(
          "grid h-10 w-10 shrink-0 place-items-center overflow-hidden rounded-none",
          markClassName,
        )}
      >
        <img src={agencyMark} alt="" className="h-full w-full object-contain" />
      </span>
      {showText && (
        <span
          className={cn(
            "flex flex-col font-sans text-2xl font-semibold leading-none tracking-tight text-white",
            textClassName,
          )}
        >
          <span>MekWeb</span>
          <span className="mt-1 text-[0.42em] uppercase tracking-[0.38em] text-gold">
            Agency
          </span>
        </span>
      )}
    </span>
  );
};
