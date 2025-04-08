
import { PenSquare, BookOpen, MessageSquare, Github } from "lucide-react";
import { 
  Sidebar, 
  SidebarContent, 
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarGroup,
  SidebarGroupLabel,
} from "@/components/ui/sidebar";

export const AdminSidebar = () => {
  return (
    <Sidebar>
      <SidebarContent className="pt-16">
        <SidebarGroup>
          <SidebarGroupLabel>Admin Dashboard</SidebarGroupLabel>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton asChild tooltip="Contact Submissions">
                <a href="/contact-submissions">
                  <MessageSquare />
                  <span>Contact Form</span>
                </a>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton asChild tooltip="Manage Projects">
                <a href="/secret-project-add">
                  <PenSquare />
                  <span>Projects</span>
                </a>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton asChild tooltip="Manage Blog Posts">
                <a href="/secret-blog-add">
                  <BookOpen />
                  <span>Blog Posts</span>
                </a>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton asChild tooltip="GitHub Settings">
                <a href="/github-settings">
                  <Github />
                  <span>GitHub Settings</span>
                </a>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
};

export default AdminSidebar;
