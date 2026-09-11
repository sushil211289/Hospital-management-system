import Image from "next/image";
import { HOSPITAL_NAME } from "@/lib/hospital";
import { cn } from "@/lib/utils";

export const HOSPITAL_LOGO_SRC = "/kmc-logo.jpg";

export function BrandLogo({
  className,
  size = 48,
  priority = false,
}: {
  className?: string;
  size?: number;
  priority?: boolean;
}) {
  return (
    <Image
      src={HOSPITAL_LOGO_SRC}
      alt={`${HOSPITAL_NAME} logo`}
      width={size}
      height={size}
      priority={priority}
      className={cn("rounded-md bg-white object-contain", className)}
    />
  );
}
