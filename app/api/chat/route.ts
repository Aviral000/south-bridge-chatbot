import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const { message, fileContext } = await request.json();
    
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      console.error("GEMINI_API_KEY is not set in environment variables");
      return NextResponse.json(
        { error: "Gemini API key not configured. Please check your .env.local file and restart the server." },
        { status: 500 }
      );
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    // Using Gemini 2.0 Flash (free tier model)
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

    // Build context about the codebase
    let systemPrompt = `You are a helpful coding assistant. You help users navigate and understand their codebase. 
You have access to a file viewer on the right side of the screen. When users ask about files, you can help them understand the code.

Available commands:
- "read <filename>" - Opens a file in the viewer

Be concise, helpful, and focus on code-related questions.`;

    if (fileContext) {
      systemPrompt += `\n\nCurrent file context:\n${fileContext}`;
    }

    const prompt = `${systemPrompt}\n\nUser: ${message}\n\nAssistant:`;

    const result = await model.generateContentStream(prompt);
    
    // Create a readable stream for the response
    const encoder = new TextEncoder();
    const stream = new ReadableStream({
      async start(controller) {
        try {
          for await (const chunk of result.stream) {
            const text = chunk.text();
            controller.enqueue(encoder.encode(`data: ${JSON.stringify({ text })}\n\n`));
          }
          controller.close();
        } catch (error) {
          controller.error(error);
        }
      },
    });

    return new Response(stream, {
      headers: {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        Connection: "keep-alive",
      },
    });
  } catch (error: any) {
    console.error("Gemini API error:", error);
    console.error("Error details:", {
      message: error.message,
      stack: error.stack,
      apiKeySet: !!process.env.GEMINI_API_KEY,
    });
    return NextResponse.json(
      { error: error.message || "Failed to get response from Gemini. Check server logs for details." },
      { status: 500 }
    );
  }
}

