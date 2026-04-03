import { db } from "@/lib/db";
import { transactions, categories } from "@/lib/db/schema";
import { desc, eq, and, gte, lte } from "drizzle-orm";
import { auth } from "@/lib/auth/config";

export async function GET(request: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const type = searchParams.get("type") as "income" | "expense" | null;
    const categoryId = searchParams.get("categoryId");
    const startDate = searchParams.get("startDate");
    const endDate = searchParams.get("endDate");

    const conditions = [eq(transactions.userId, session.user.id)];

    if (type) {
      conditions.push(eq(transactions.type, type));
    }

    if (categoryId) {
      conditions.push(eq(transactions.categoryId, categoryId));
    }

    if (startDate) {
      conditions.push(gte(transactions.date, new Date(startDate)));
    }

    if (endDate) {
      conditions.push(lte(transactions.date, new Date(endDate)));
    }

    const result = await db.query.transactions.findMany({
      where: and(...conditions),
      limit,
      offset: (page - 1) * limit,
      orderBy: [desc(transactions.date)],
      with: {
        category: true,
      },
    });

    return Response.json(result);
  } catch (error) {
    console.error("Error fetching transactions:", error);
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
    const { amount, description, categoryId, date, type } = body;

    const [transaction] = await db.insert(transactions).values({
      userId: session.user.id,
      amount: amount.toString(),
      description,
      categoryId,
      date: new Date(date),
      type,
    }).returning();

    return Response.json(transaction, { status: 201 });
  } catch (error) {
    console.error("Error creating transaction:", error);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}