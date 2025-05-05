import { useIsHydrated } from "~/useIsHydrated";
import type { ReactNode } from "react";

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

const ClientOnly = ({ children, fallback = null }: Props) => {
  const isHydrated = useIsHydrated;

  return isHydrated() ? <>{children}</> : <>{fallback}</>;
};

export default ClientOnly;
