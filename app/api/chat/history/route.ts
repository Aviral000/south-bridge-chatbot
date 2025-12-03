import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";

const HISTORY_FILE = path.join(process.cwd(), "data", "chatHistory.json");

// GET - Load chat history
export async function GET() {
  try {
    if (!fs.existsSync(HISTORY_FILE)) {
      return NextResponse.json({ messages: [], lastUpdated: null });
    }

    const fileData = fs.readFileSync(HISTORY_FILE, "utf-8");
    const history = JSON.parse(fileData);
    return NextResponse.json(history);
  } catch (error: any) {
    console.error("Error loading chat history:", error);
    return NextResponse.json(
      { error: "Failed to load chat history" },
      { status: 500 }
    );
  }
}

// POST - Save chat history
export async function POST(request: NextRequest) {
  try {
    const { messages } = await request.json();

    const historyData = {
      messages,
      lastUpdated: new Date().toISOString(),
    };

    // Ensure data directory exists
    const dataDir = path.dirname(HISTORY_FILE);
    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir, { recursive: true });
    }

    // Write to file
    fs.writeFileSync(HISTORY_FILE, JSON.stringify(historyData, null, 2), "utf-8");

    return NextResponse.json({ success: true, message: "History saved" });
  } catch (error: any) {
    console.error("Error saving chat history:", error);
    return NextResponse.json(
      { error: "Failed to save chat history" },
      { status: 500 }
    );
  }
}

// DELETE - Clear chat history
export async function DELETE() {
  try {
    if (fs.existsSync(HISTORY_FILE)) {
      fs.writeFileSync(
        HISTORY_FILE,
        JSON.stringify({ messages: [], lastUpdated: null }, null, 2),
        "utf-8"
      );
    }
    return NextResponse.json({ success: true, message: "History cleared" });
  } catch (error: any) {
    console.error("Error clearing chat history:", error);
    return NextResponse.json(
      { error: "Failed to clear chat history" },
      { status: 500 }
    );
  }
}

