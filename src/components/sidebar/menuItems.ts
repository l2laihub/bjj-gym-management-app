import { BarChart3, UserPlus, Users, ShoppingBag, Calendar, Clock, Award, BookOpen, DollarSign, Trophy, Settings } from 'lucide-react';

export const menuItems = [
  { to: "/app/dashboard", icon: BarChart3, text: "Dashboard", requireAdmin: false },
  { to: "/app/prospects", icon: UserPlus, text: "Prospects", requireAdmin: true },
  { to: "/app/members", icon: Users, text: "Members", requireAdmin: true },
  { to: "/app/inventory", icon: ShoppingBag, text: "Inventory", requireAdmin: true },
  { to: "/app/attendance", icon: Calendar, text: "Attendance", requireAdmin: false },
  { to: "/app/schedule", icon: Clock, text: "Class Schedule", requireAdmin: false },
  { to: "/app/promotions", icon: Award, text: "Promotions", requireAdmin: true },
  { to: "/app/curriculum", icon: BookOpen, text: "Curriculum", requireAdmin: false },
  { to: "/app/finances", icon: DollarSign, text: "Finances", requireAdmin: true },
  { to: "/app/tournament-records", icon: Trophy, text: "Tournament Records", requireAdmin: false },
  { to: "/app/settings", icon: Settings, text: "Settings", requireAdmin: true },
];