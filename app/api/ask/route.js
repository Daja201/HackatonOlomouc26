import Anthropic from "@anthropic-ai/sdk"
import { temperatureDay } from "@/lib/mock/temperatureDay"
// import { json, object, string, url } from "zod";

const client = new Anthropic()

const tools = [
    {
        name: "temperature_day",
        description: 
            "Vrátí teploty po hodinách pro jedno město a jeden den, včetně maxima a minima. " +
            "Použij, když se uživatel ptá na teplotu v konkrétním městě v konkrétní den. " +
            "Nepoužívej pro jiné veličiny než teplotu ani pro víc dní najednou. " +
            "Datum převeď na formát RRRR-MM-DD podle dnešního data.",
        input_schema: {
            type: "object",
            properties: {
                city: { type: "string", description: "Název města česky, např. Ostrava." },
                date: { type: "string", description: "Den ve formátu RRRR-MM-DD." }
            },
            required: ["city", "date"]
        }
    }
]

export async function GET(request) {

    const question = new URL(request.url).searchParams.get("q") ?? "Jaká byla včera teplota v Ostravě?"

    const today = new Date().toLocaleDateString("sv-SE", { timeZone: "Europe/Prague"})

    const messages = [{ role: "user", content: question }]

    const first = await client.messages.create({
        model: "claude-haiku-5-5",
        max_tokens: 1024,
        system: `Dnes je ${today}. Odpovídáš na otázky o počasí. Čísla nikdy nevymýšlej, data získej nástrojem.`,
        tools,
        messages,
    })

    const toolUse = first.content.find((block) => block.type === "tool_use")

    if (!toolUse) {
        return Response.json({ question, stop_reason: first.stop_reason, content: first.constent })
    }

    const result = temperatureDay(toolUse.input.city, toolUse.input.date)

    messages.push({ role: "assistant", content: first.content })
    messages.push({
        role: "user",
        content: [
            {
                type: "tool_result",
                tool_use_id: toolUse.id,
                content: JSON.stringify(result)
            }
        ]
    })

    const second = await client.messages.create({
        model: "claude-haiku-5-5",
        max_tokens: 1024,
        system: `Dnes je ${today}. Odpovídáš na otázky o počasí. Čísla nikdy nevymýšlej, data získej nástrojem.`,
        tools, 
        messages
    })

    let text = ""

    for (const block of second.content) {
        if (block.type === "text") {
            text += block.text
        }
    }


    return Response.json({ 
        question,
        toolCall: toolUse.input,
        result,
        text
    })
}