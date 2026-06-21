# TerraStreak 🌿

**TerraStreak** is a static web application that gamifies personal carbon footprint tracking. It pairs a daily carbon ledger with an interactive, expressive **talking Sunflower companion** that sways, breathes, and reacts to your ecological choices in real-time.

---

## 🚀 Key Features

* **Daily Carbon Ledger:** Track carbon-consuming activities (like driving or hot laundry washes) and carbon-replenishing offsets (like walking, cycling, or plant-based meals).
* **Sunflower Companion (Expressive SVG):** Features child-like eyes, reactive eyebrows, blush markers, and sleep eyelids. The plant sways, wilts when your budget is exceeded, and glows when you stay green.
* **3-Stage Growth Loop:** The plant grows based on your Daily Quest Streak:
  * 🌱 **Stage 1 (Sprout):** Streak of 0–2 days.
  * 🌿 **Stage 2 (Bud):** Streak of 3–5 days.
  * 🌻 **Stage 3 (Bloom):** Streak of 6+ days (unlocks accessories!).
* **Boutique Accessory Shop:** Purchase 20 unique, custom-designed SVG accessories (Tiny Top Hat, DJ Headphones, Cowboy Hat, Detective Monocle, Witch Hat, and more) using Green Coins earned from quests.
* **3-Level Eco Quizzes:** Test your environmental knowledge in Easy, Medium, or Hard quizzes (10 questions each) to earn up to 85 Green Coins daily.
* **GreenGrid Scheduler:** Schedule household chores during clean energy grid windows.
* **Digital Tracker:** Track server-side emissions from video streaming, social media usage, and AI queries.
* **Streak Protection ("I Slipped Today"):** Protects your daily streak from resetting to zero by admitting slips honestly.

---

## 🛠️ Technology Stack

* **Front-End:** Vanilla HTML5, Modern CSS3 (Custom properties, cyber-glass styling, flex/grid layouts), Vanilla ES6 JavaScript.
* **Audio Synthesis:** Web Audio API sound generator (pop, victory chimes, lofi background synth noise).
* **Data Layer:** LocalStorage state serialization with strict whitelisting to prevent prototype pollution.
* **QA Test Suite:** In-browser automated unit testing (`tests.js`).

---

## 💻 Local Setup & Development

To preview and run the application locally:

1. **Clone or download** this repository.
2. Open your terminal in the project directory and start a local HTTP server:
   ```bash
   python -m http.server 3000
   ```
3. Open your browser and navigate to:
   👉 **[http://127.0.0.1:3000](http://127.0.0.1:3000)**

---

## 🧪 Testing

The codebase includes an automated unit test suite (`tests.js`) that validates carbon math, digital tracker multipliers, streak protections, boutique price bounds, and quiz payout multipliers.

To run the assertions:
* Open the local site in your browser and click on the **Run Tests** console command, or check the developer tools console log.
* Alternatively, run the headless Edge automated test runner:
  ```powershell
  python scratch/run_edge.py
  ```
