import { redirect } from "next/navigation";

export default function WesternCategoryRedirect() {
  redirect("/shop?category=western");
}
