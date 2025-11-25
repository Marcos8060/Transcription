import { ReactNode } from "react";
import CustomizedLayout from "@/components/customizedLayout";

interface LayoutProps {
  children: ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  return <CustomizedLayout>{children}</CustomizedLayout>;
}
