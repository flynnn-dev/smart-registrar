export const NAV_ICON_NAMES = [
  "dashboard",
  "requestNew",
  "requests",
  "appointments",
  "notifications",
  "profile",
  "queue",
  "students",
  "documents",
  "reports",
  "transactions",
  "settings",
] as const;

export type NavIconName = (typeof NAV_ICON_NAMES)[number];

export type NavItem = {
  href: string;
  label: string;
  icon: NavIconName;
};

export function matchNavItem(
  pathname: string,
  items: NavItem[]
): NavItem | undefined {
  return items
    .filter((item) =>
      item.href === "/"
        ? pathname === "/"
        : pathname === item.href || pathname.startsWith(`${item.href}/`)
    )
    .sort((a, b) => b.href.length - a.href.length)[0];
}

export function titleForPath(
  pathname: string,
  items: NavItem[],
  fallback: string
): string {
  return matchNavItem(pathname, items)?.label ?? fallback;
}

export const landingLinks = [
  { href: "/#process", label: "Process" },
  { href: "/#services", label: "Services" },
  { href: "/#why", label: "Why" },
] as const;

export const studentNavigation: NavItem[] = [
  { href: "/student/dashboard", label: "Dashboard", icon: "dashboard" },
  { href: "/student/requests/new", label: "New Request", icon: "requestNew" },
  { href: "/student/requests", label: "My Requests", icon: "requests" },
  { href: "/student/appointments", label: "Appointments", icon: "appointments" },
  { href: "/student/queue", label: "Queue", icon: "queue" },
  { href: "/student/notifications", label: "Notifications", icon: "notifications" },
  { href: "/student/profile", label: "Profile", icon: "profile" },
];

export const studentTabNavigation: NavItem[] = [
  { href: "/student/dashboard", label: "Home", icon: "dashboard" },
  { href: "/student/requests", label: "Requests", icon: "requests" },
  { href: "/student/requests/new", label: "New", icon: "requestNew" },
  { href: "/student/queue", label: "Queue", icon: "queue" },
  { href: "/student/appointments", label: "Appts", icon: "appointments" },
];

export const registrarNavigation: NavItem[] = [
  { href: "/registrar/dashboard", label: "Dashboard", icon: "dashboard" },
  { href: "/registrar/requests", label: "Requests", icon: "requests" },
  { href: "/registrar/queue", label: "Queue", icon: "queue" },
  { href: "/registrar/appointments", label: "Appointments", icon: "appointments" },
  { href: "/registrar/students", label: "Students", icon: "students" },
  { href: "/registrar/documents", label: "Documents", icon: "documents" },
  { href: "/registrar/reports", label: "Reports", icon: "reports" },
  { href: "/registrar/transactions", label: "Transactions", icon: "transactions" },
  { href: "/registrar/settings", label: "Settings", icon: "settings" },
];
