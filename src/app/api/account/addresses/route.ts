import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

// GET all addresses for current user
export async function GET() {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const addresses = await prisma.address.findMany({
    where: { userId: session.user.id },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json({ addresses });
}

// POST create a new address
export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const { fullName, phone, street, city, state, pincode, isDefault } = body;

    if (!fullName || !phone || !street || !city || !state || !pincode) {
      return NextResponse.json(
        { error: "All address fields are required." },
        { status: 400 }
      );
    }

    // If setting as default, clear any existing default
    if (isDefault) {
      await prisma.address.updateMany({
        where: { userId: session.user.id },
        data: { isDefault: false },
      });
    }

    const newAddress = await prisma.address.create({
      data: {
        userId: session.user.id,
        fullName,
        phone,
        street,
        city,
        state,
        pincode,
        isDefault: Boolean(isDefault),
      },
    });

    return NextResponse.json({ success: true, address: newAddress });
  } catch (err) {
    console.error("Error creating address:", err);
    return NextResponse.json(
      { error: "Failed to create address" },
      { status: 500 }
    );
  }
}
