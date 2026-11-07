export function temperatureDay(city, date) {
    const hourly = [3.1, 2.8, 2.5, 2.2, 2.0, 1.9, 2.1, 2.9, 4.0, 5.2, 6.1, 6.8, 7.2, 7.4, 7.1, 6.5, 5.6, 4.8, 4.2, 3.9, 3.6, 3.4, 3.2, 3.0,]

    return {
        ok: true,
        data: {
            hourly,
            max: Math.max(...hourly),
            min: Math.min(...hourly)
        },
        meta: {
            tool: "temperature_day",
            params: { city, date },
            source: "vymyšlená data (mock)"
        }
    }
}