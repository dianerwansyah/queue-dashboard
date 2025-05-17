import { 
  LayoutDashboard, 
  ListTodo, 
  CheckCircle2 
} from "lucide-react"

export interface MenuItem {
  title: string
  icon: React.ReactNode
  link: string
  path: string // Used to match current path
}

export const menuItems: MenuItem[] = [
  {
    title: "Dashboard",
    icon: <LayoutDashboard className="h-5 w-5" />,
    link: "/dashboard",
    path: "/dashboard"
  },
  {
    title: "Queues",
    icon: <ListTodo className="h-5 w-5" />,
    link: "/queues",
    path: "/queues"
  },
  {
    title: "Claim Queue",
    icon: <CheckCircle2 className="h-5 w-5" />,
    link: "/claimQueues",
    path: "/claimQueues"
  }
]