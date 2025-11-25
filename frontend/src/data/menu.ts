import { 
  LayoutDashboard,
  FileAudio,
  FileText,
  Brain,
  BarChart3
} from "lucide-react";
import { IconType } from "react-icons";

export type MenuItem = {
  children?: MenuItem[]; 
  label: string;
  path: string;
  icon?: IconType;        
  roles?: string[];        
};

const sidebarMenu: MenuItem[] = [
  {
    label: "Dashboard",
    path: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    label: "Video Management",
    path: "/dashboard/interviews",
    icon: FileAudio,
    children: [
      {
        label: "All Videos",
        path: "/dashboard/interviews",
        icon: FileText,
      },
      {
        label: "Analytics",
        path: "/dashboard",
        icon: BarChart3,
      },
      {
        label: "AI Insights",
        path: "/dashboard/insights",
        icon: Brain,
      },
    ],
  },
];

export default sidebarMenu;
