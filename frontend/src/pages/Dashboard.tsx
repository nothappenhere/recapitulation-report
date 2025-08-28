import { AppSidebar } from "@/components/app-sidebar";
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
import { UserProvider } from "@/hooks/UserContext";
import { slugToTitle } from "@/lib/stringFormatter";
import { capitalizeFirstLetter } from "@/lib/utils";
import { Link, Outlet, useLocation } from "react-router";

export function DashboardPage() {
  const location = useLocation();
  const firstPath = location.pathname.split("/").filter(Boolean).shift();
  const lastPath = location.pathname.split("/").filter(Boolean).pop();

  return (
    <UserProvider>
      <SidebarProvider>
        <AppSidebar />

        <SidebarInset>
          <header className="flex h-16 shrink-0 items-center gap-2 border-b">
            <div className="flex items-center gap-2 px-3">
              <SidebarTrigger />
              <Separator orientation="vertical" className="mr-2 h-4" />
              <Breadcrumb>
                <BreadcrumbList>
                  <BreadcrumbItem className="hidden md:block">
                    <BreadcrumbLink asChild>
                      <Link to={`/${firstPath}`}>Dashboard</Link>
                    </BreadcrumbLink>
                  </BreadcrumbItem>

                  {!location.pathname.endsWith("dashboard") && (
                    <>
                      <BreadcrumbSeparator className="hidden md:block" />
                      <BreadcrumbItem>
                        <BreadcrumbPage>{slugToTitle(lastPath)}</BreadcrumbPage>
                      </BreadcrumbItem>
                    </>
                  )}
                </BreadcrumbList>
              </Breadcrumb>
            </div>
          </header>

          <div className="p-5">
            <Outlet />
          </div>
        </SidebarInset>
      </SidebarProvider>
    </UserProvider>
  );
}
