// =========================
// Trading Journal App
// =========================

let trades = JSON.parse(localStorage.getItem("trades")) || [];

const totalTrades = document.getElementById("totalTrades");
const winRate = document.getElementById("winRate");
const buyRate = document.getElementById("buyRate");
const sellRate = document.getElementById("sellRate");
const avgRR = document.getElementById("avgRR");

const history = document.getElementById("history");

const newTradeBtn = document.getElementById("newTradeBtn");
const tradeForm = document.getElementById("tradeForm");

const direction = document.getElementById("direction");
const rr = document.getElementById("rr");
const result = document.getElementById("result");
const saveTrade = document.getElementById("saveTrade");

// -------------------------
// Show / Hide Form
// -------------------------

newTradeBtn.addEventListener("click", () => {
    tradeForm.classList.toggle("hidden");
});

// -------------------------
// Save Trade
// -------------------------

saveTrade.addEventListener("click", () => {

    const trade = {
        direction: direction.value,
        rr: Number(rr.value),
        result: result.value,
        date: new Date().toLocaleString()
    };

    if (trade.rr <= 0 || isNaN(trade.rr)) {
        alert("Enter a valid RR.");
        return;
    }

    trades.unshift(trade);

    localStorage.setItem("trades", JSON.stringify(trades));

    rr.value = "";

    tradeForm.classList.add("hidden");

    render();
});

// -------------------------
// Delete Trade
// -------------------------

function deleteTrade(index) {

    if (!confirm("Delete this trade?")) return;

    trades.splice(index, 1);

    localStorage.setItem("trades", JSON.stringify(trades));

    render();
}

// -------------------------
// Render
// -------------------------

function render() {

    history.innerHTML = "";

    let wins = 0;

    let buyTotal = 0;
    let buyWins = 0;

    let sellTotal = 0;
    let sellWins = 0;

    let rrTotal = 0;

    trades.forEach((trade, index) => {

        if (trade.result === "WIN") {
            wins++;
            rrTotal += trade.rr;
        }

        if (trade.direction === "BUY") {

            buyTotal++;

            if (trade.result === "WIN") {
                buyWins++;
            }

        } else {

            sellTotal++;

            if (trade.result === "WIN") {
                sellWins++;
            }

        }

        const item = document.createElement("div");

        item.className = "trade";

        item.innerHTML = `
            <strong>${trade.direction}</strong>
            |
            RR ${trade.rr}
            |
            <span class="${trade.result}">
                ${trade.result}
            </span>
            <br>
            <small>${trade.date}</small>
            <br><br>
            <button onclick="deleteTrade(${index})">
                Delete
            </button>
        `;

        history.appendChild(item);

    });

    totalTrades.textContent = trades.length;

    winRate.textContent =
        trades.length === 0
            ? "0%"
            : Math.round((wins / trades.length) * 100) + "%";

    buyRate.textContent =
        buyTotal === 0
            ? "0%"
            : Math.round((buyWins / buyTotal) * 100) + "%";

    sellRate.textContent =
        sellTotal === 0
            ? "0%"
            : Math.round((sellWins / sellTotal) * 100) + "%";

    avgRR.textContent =
        wins === 0
            ? "0"
            : (rrTotal / wins).toFixed(2);

}

render();

// -------------------------
// Register Service Worker
// -------------------------

if ("serviceWorker" in navigator) {

    window.addEventListener("load", () => {

        navigator.serviceWorker.register("service-worker.js");

    });

}
