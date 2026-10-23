import { redirect } from "next/navigation";

export default function EthnicCategoryRedirect() {
  redirect("/shop?category=ethnic");
}
