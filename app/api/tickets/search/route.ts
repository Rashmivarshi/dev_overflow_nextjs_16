import tickets from "@/app/database";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const searchparams = request.nextUrl.searchParams;
  const query = searchparams.get("query");
  if (!query)
    return NextResponse.json(new Error("Ticket not found"), { status: 404 });
  const filteredTicket = tickets.filter((ticket) =>
    ticket.name?.toUpperCase().includes(query.toUpperCase()),
  );
  return NextResponse.json(filteredTicket);
}
