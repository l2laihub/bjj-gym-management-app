import { BarChart3, UserPlus, Users, ShoppingBag, Calendar, Clock, Award, BookOpen, DollarSign, Trophy, Settings } from 'lucide-react';

export const menuItems = [
  { to: "/dashboard", icon: BarChart3, text: "Dashboard", requireAdmin: false },
  { to: "/prospects", icon: UserPlus, text: "Prospects", requireAdmin: true },
  { to: "/members", icon: Users, text: "Members", requireAdmin: true },
  { to: "/inventory", icon: ShoppingBag, text: "Inventory", requireAdmin: true },
  { to: "/attendance", icon: Calendar, text: "Attendance", requireAdmin: false },
  { to: "/schedule", icon: Clock, text: "Class Schedule", requireAdmin: false },
  { to: "/promotions", icon: Award, text: "Promotions", requireAdmin: true },
  { to: "/curriculum", icon: BookOpen, text: "Curriculum", requireAdmin: false },
  { to: "/finances", icon: DollarSign, text: "Finances", requireAdmin: true },
  { to: "/tournament-records", icon: Trophy, text: "Tournament Records", requireAdmin: false },
  { to: "/settings", icon: Settings, text: "Settings", requireAdmin: true },
];