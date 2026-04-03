import { db } from "@/lib/db";
import { categories } from "@/lib/db/schema";
import { eq, and } from "drizzle-orm";
import { auth } from "@/lib/auth/config";

export async function GET(request: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const type = searchParams.get("type") as "income" | "expense" | null;

    const conditions = [
      eq(categories.userId, session.user.id),
    ];

    if (type) {
      conditions.push(eq(categories.type, type));
    }

    const result = await db.query.categories.findMany({
      where: and(...conditions),
      orderBy: (categories, { asc }) => [asc(categories.name)],
    });

    return Response.json(result);
  } catch (error) {
    console.error("Error fetching categories:", error);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { name, icon, color, type } = body;

    const [category] = await db.insert(categories).values({
      userId: session.user.id,
      name,
      icon,
      color,
      type,
    }).returning();

    return Response.json(category, { status: 201 });
  } catch (error) {
    console.error("Error creating category:", error);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}