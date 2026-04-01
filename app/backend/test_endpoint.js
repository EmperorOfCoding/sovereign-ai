
async function testServer() {
    try {
        const res = await fetch("http://localhost:5000/api/research", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ query: "Agendamento manual de consultas" })
        });
        console.log("Status:", res.status);
        const data = await res.json();
        console.log("Data:", JSON.stringify(data, null, 2));
    } catch (e) {
        console.error("Request failed:", e.message);
    }
}

testServer();
