import Anthropic from "@anthropic-ai/sdk"
import { object, string, url } from "zod";

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

    const message = await client.messages.create({
        model: "claude-haiku-5-5",
        max_tokens: 1024,
        system: `Dnes je ${today}. Odpovídáš na otázky o počasí. Čísla nikdy nevymýšlej, data získej nástrojem.`,
        tools,
        messages: [{ role: "user", content: question }],
    })

    return Response.json({ 
        question,
        today,
        stop_reason: message.stop_reason,
        content: message.content
    })
}