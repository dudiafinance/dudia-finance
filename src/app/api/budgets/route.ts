import { db } from "@/lib/db";
import { budgets } from "@/lib/db/schema";
import { eq, and } from "drizzle-orm";
import { auth } from "@/lib/auth/config";

export async function GET(request: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const month = parseInt(searchParams.get("month") || String(new Date().getMonth() + 1));
    const year = parseInt(searchParams.get("year") || String(new Date().getFullYear()));

    const userBudgets = await db.query.budgets.findMany({
      where: and(
        eq(budgets.userId, session.user.id),
        eq(budgets.month, month),
        eq(budgets.year, year)
      ),
      with: {
        category: true,
      },
    });

    return Response.json(userBudgets);
  } catch (error) {
    console.error("Error fetching budgets:", error);
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
    const { categoryId, month, year, amount } = body;

    const [budget] = await db.insert(budgets).values({
      userId: session.user.id,
      categoryId,
      month,
      year,
      amount: amount.toString(),
    }).returning();

    return Response.json(budget, { status: 201 });
  } catch (error) {
    console.error("Error creating budget:", error);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}