import { LayoutDashboard, History, Palette, Calendar, Coins, CreditCard, TrendingUp, HelpCircle, Settings, Phone } from "lucide-react";
import { NavLink } from "react-router-dom";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { Badge } from "@/components/ui/badge";
import { LogoutButton } from "./LogoutButton";

const mainItems = [
  { title: "Home", url: "/dashboard", icon: LayoutDashboard },
  { title: "Call History", url: "/history", icon: History },
  { title: "Calendar", url: "/calendar", icon: Calendar },
  { title: "Analytics", url: "/analytics", icon: TrendingUp },
];

const configItems = [
  { title: "Assistant", url: "/customization", icon: Palette },
  { title: "Phone Setup", url: "/phone-setup", icon: Phone },
  { title: "Credits", url: "/credits", icon: Coins },
  { title: "Billing", url: "/billing", icon: CreditCard },
];

const bottomItems = [
  { title: "Help", url: "/help", icon: HelpCircle },
  { title: "Settings", url: "/settings", icon: Settings },
];

export function AppSidebar() {
  const { state } = useSidebar();
  const isCollapsed = state === "collapsed";

  const renderMenu = (items: typeof mainItems, label?: string) => (
    <SidebarGroup>
      {!isCollapsed && label && (
        <SidebarGroupLabel className="px-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1">
          {label}
        </SidebarGroupLabel>
      )}
      <SidebarGroupContent>
        <SidebarMenu className="space-y-0.5">
          {items.map((item) => (
            <SidebarMenuItem key={item.title}>
              <SidebarMenuButton asChild>
                <NavLink
                  to={item.url}
                  end={item.url === "/"}
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 ${
                      isActive
                        ? "bg-primary/10 text-primary font-medium"
                        : "text-sidebar-foreground hover:bg-sidebar-accent"
                    }`
                  }
                >
                  <item.icon className="h-5 w-5 flex-shrink-0" />
                  {!isCollapsed && <span className="flex-1 text-sm">{item.title}</span>}
                </NavLink>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );

  return (
    <Sidebar className={`${isCollapsed ? "w-16" : "w-64"} flex flex-col border-r`} collapsible="icon">
      <div className="p-6 border-b">
        <h1 className={`font-bold text-2xl bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent transition-opacity ${isCollapsed ? "opacity-0" : "opacity-100"}`}>
          Ringlify
        </h1>
        {!isCollapsed && (
          <p className="text-xs text-muted-foreground mt-1">AI Voice Receptionist</p>
        )}
      </div>
      
      <SidebarContent className="flex-1 overflow-y-auto px-3 py-4">
        {renderMenu(mainItems)}
        <div className="my-4 border-t" />
        {renderMenu(configItems, "Configure")}
        <div className="my-4 border-t" />
        {renderMenu(bottomItems)}
      </SidebarContent>
      
      <div className="border-t p-4 mt-auto">
        <LogoutButton />
      </div>
    </Sidebar>
  );
}
