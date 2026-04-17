import { redirect } from "next/navigation";

// /lms/dashboard ist Alias von /lms.
export default function DashboardPage() {
  redirect("/lms");
}
