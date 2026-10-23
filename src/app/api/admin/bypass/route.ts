import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { action, pin, email, role } = body;

    const cookieStore = await cookies();

    // 1. PIN or Dev Bypass
    if (action === "bypass" || action === "pin") {
      const correctPin = process.env.ADMIN_DEV_PIN || "1234";
      if (pin === correctPin || pin === "deeta" || pin === "vivek") {
        cookieStore.set("deeta_admin_bypass", "true", {
          path: "/",
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          maxAge: 60 * 60 * 24 * 7, // 7 days
          sameSite: "lax",
        });

        return NextResponse.json({
          success: true,
          message: "Admin bypass access granted for 7 days",
        });
      } else {
        return NextResponse.json(
          { success: false, error: "Invalid Admin PIN. Try default: 1234 or vivek" },
          { status: 401 }
        );
      }
    }

    // 2. Clear bypass
    if (action === "logout") {
      cookieStore.delete("deeta_admin_bypass");
      return NextResponse.json({
        success: true,
        message: "Admin bypass removed",
      });
    }

    // 3. Instant role switcher (promote/demote user in DB for testing)
    if (action === "set-role" && email) {
      const updatedUser = await prisma.user.update({
        where: { email: email.toLowerCase().trim() },
        data: { role: role === "ADMIN" ? "ADMIN" : "CUSTOMER" },
      });

      return NextResponse.json({
        success: true,
        user: {
          email: updatedUser.email,
          role: updatedUser.role,
        },
      });
    }

    return NextResponse.json({ error: "Invalid action" }, { status: 400 });
  } catch (error: any) {
    console.error("Admin bypass error:", error);
    return NextResponse.json(
      { error: error?.message || "Failed to process admin access" },
      { status: 500 }
    );
  }
}
