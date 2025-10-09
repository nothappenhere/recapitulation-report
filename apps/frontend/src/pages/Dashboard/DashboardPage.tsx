import { AppSidebar } from "@/components/sidebar/app-sidebar";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { UserProvider } from "@/hooks/use-user-context";
import { slugToTitle } from "@rzkyakbr/libs";
import { Link, Outlet, useLocation } from "react-router";

export default function DashboardPage() {
  const location = useLocation();
  const allPaths = location.pathname.split("/").filter(Boolean);
  const paths = allPaths[0] === "dashboard" ? allPaths.slice(1) : allPaths;

  return (
    <UserProvider>
      <SidebarProvider>
        <AppSidebar />

        <SidebarInset>
          <header className="flex h-16 shrink-0 items-center gap-2 border-b">
            <div className="flex items-center gap-2 px-3 print:hidden">
              <SidebarTrigger />
              <Separator orientation="vertical" className="mr-2 h-4" />
              <Breadcrumb>
                <BreadcrumbList>
                  {/* Always show Dashboard */}
                  <BreadcrumbItem>
                    <BreadcrumbLink asChild>
                      <Link to="/dashboard">Dashboard</Link>
                    </BreadcrumbLink>
                  </BreadcrumbItem>
                  {/* Render path segments as breadcrumb */}
                  {paths.map((segment, index) => {
                    const isLast = index === paths.length - 1;
                    const pathTo = paths.slice(0, index + 1).join("/");
                    return (
                      <div key={segment} className="flex items-center gap-2">
                        <BreadcrumbSeparator className="hidden md:block mt-0.5" />
                        <BreadcrumbItem>
                          {isLast ? (
                            <BreadcrumbPage>
                              {location.pathname.includes("edit") ||
                              location.pathname.includes("print")
                                ? segment
                                : slugToTitle(segment)}
                            </BreadcrumbPage>
                          ) : (
                            <BreadcrumbLink asChild>
                              <Link to={pathTo}>{slugToTitle(segment)}</Link>
                            </BreadcrumbLink>
                          )}
                        </BreadcrumbItem>
                      </div>
                    );
                  })}
                </BreadcrumbList>
              </Breadcrumb>
            </div>
          </header>

          <div className="p-5 print:p-0">
            <Outlet />
          </div>
        </SidebarInset>
      </SidebarProvider>
    </UserProvider>
  );
}
