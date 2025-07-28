import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function POST(request: NextRequest) {
  try {
    const { message } = await request.json();

    if (!message || typeof message !== "string") {
      return NextResponse.json({ error: "Invalid message" }, { status: 400 });
    }

    const query = message.trim();

    // Basic search across several fields on Home model
    const homes = await prisma.home.findMany({
      where: {
        AND: [
          { isDeleted: false },
          { isActive: true },
          {
            OR: [
              { title: { contains: query, mode: "insensitive" } },
              { description: { contains: query, mode: "insensitive" } },
              { address: { contains: query, mode: "insensitive" } },
              { municipality: { contains: query, mode: "insensitive" } },
              { subRegion: { contains: query, mode: "insensitive" } },
              { region: { contains: query, mode: "insensitive" } },
              { country: { contains: query, mode: "insensitive" } },
            ],
          },
        ],
      },
      select: {
        id: true,
        title: true,
        address: true,
        price: true,
        currency: true,
      },
      take: 5,
    });

    let reply: string;
    if (homes.length === 0) {
      reply = `Sorry, I couldn't find any properties matching "${query}".`;
    } else {
      reply = `Here are ${homes.length} properties that might interest you:\n\n`;
      reply += homes
        .map(
          (h, i) =>
            `${i + 1}. ${h.title ?? "Untitled"} - ${
              h.address ?? "No address"
            } - ${h.price} ${h.currency ?? ""}`
        )
        .join("\n");
    }

    return NextResponse.json({ reply, homes });
  } catch (error) {
    console.error("/api/chat error", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
