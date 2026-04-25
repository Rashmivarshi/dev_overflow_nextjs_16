import { ValidationError } from "@/lib/http-errors";
import { AIAnswerSchema } from "@/lib/validations";
import z from "zod";
import { NextResponse } from "next/server";
import handleError from "@/lib/handlers/error";
import { groq, type GroqLanguageModelOptions } from "@ai-sdk/groq";
import { generateText } from "ai";

export async function POST(req: Request) {
  const { question, content } = await req.json();

  try {
    const validData = AIAnswerSchema.safeParse({ question, content });

    if (!validData.success) {
      throw new ValidationError(z.flattenError(validData.error).fieldErrors);
    }

    const { text } = await generateText({
      model: groq("qwen/qwen3-32b"),
      providerOptions: {
        groq: {
          reasoningFormat: "parsed",
          reasoningEffort: "default",
          parallelToolCalls: true, // Enable parallel function calling (default: true)
        } satisfies GroqLanguageModelOptions,
      },
      prompt: `Generate a markdown-formatted response to the following question: ${question}. Base it on the provided content: ${content}`,
      system:
        "You are a helpful assistant that provides informative responses in markdown format. Use appropriate markdown syntax for headings, lists, code blocks, and emphasis where necessary. For code blocks, use short-form smaller case language identifiers (e.g., 'js' for JavaScript, 'py' for Python, 'ts' for TypeScript, 'html' for HTML, 'css' for CSS, etc.).",
    });

    return NextResponse.json({ success: true, data: text }, { status: 200 });
  } catch (error) {
    return handleError(error, "api") as APIErrorResponse;
  }
}
