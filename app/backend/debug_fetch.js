
async function testFetch() {
    try {
        const res = await fetch("https://openrouter.ai/api/v1/chat/completions", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                model: "anthropic/claude-3.5-sonnet",
                messages: [{ role: "user", content: "hi" }]
            })
        });
        console.log("Status:", res.status);
        const body = await res.text();
        console.log("Body length:", body.length);
    } catch (e) {
        console.error("Fetch failed:", e.message);
        console.error(e.stack);
    }
}

testFetch();
