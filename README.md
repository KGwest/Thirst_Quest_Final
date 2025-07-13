# Thirst Quest – A charity: water Mini Game  

**Author:** Kezia Grace West  
**Repo:** `thirst_quest`  
**Status:** Final Release  
**License:** Educational / Nonprofit Use Only  

---

## Overview

**Thirst Quest** is a browser-based mini game designed to support the mission of [charity: water](https://www.charitywater.org/), a nonprofit bringing clean and safe drinking water to people in developing countries.  

Created as part of a college capstone, this interactive game blends real-world impact with playful design to raise awareness about water insecurity—especially among youth audiences.

**Objective:**  
Collect clean water drops and fill your virtual bucket before time runs out.

---

## How to Play

- **Click or Tap** falling clean water drops to score points.
- **Avoid Contaminated Drops**, which reduce your water level and score.
- **Each clean drop** increases your bucket by 5%.
- Reach **100% fill (20 drops)** in under **30 seconds** to win.
- A successful run reveals a real-world water project powered by charity: water.
- Works on desktop and mobile (touch support in progress).

---

## Audio & Music

- The game features a looping background track and real-time sound effects.
- Clean and dirty drops trigger different audio cues.
- Music fades out automatically when the game ends (win or loss).
- **Most sounds are original**, composed and produced by Kezia Grace West  
  - Background Music Title: **Study More** (2017) - start.mp3 , clean.mp3 and dirty.mp3
  - **Additional sound effects** (e.g., cheering-victory.mp3, crowd "aww"-fail.mp3) are sourced from royalty-free, license-free libraries  
---

## Globe Widget – Real Impact

- Interactive 3D globe powered by `three.js` and `globe.gl`.
- Click yellow markers around the world to explore:
  - Active clean water projects
  - Project types (e.g., filtration, rain harvesting, well repair)
  - Direct donation links to [charity: water](https://www.charitywater.org/donate)

---

## Tech Stack

- **HTML** – Structure and semantics  
- **CSS** – Animations, responsive design, layout  
- **JavaScript** – Game logic, audio control, state management  
- **Three.js + Globe.gl** – Interactive 3D globe rendering  

---

## Folder Structure

thirst-quest-game/
├── index.html # Main HTML structure
├── style.css # Visual styling and animations
├── script.js # Game logic and interaction
├── globe.js # 3D globe logic and project markers
├── assets/
│ └── sounds/ # All original and license free audio files
└── README.md # Project documentation


---

## Local Setup

To play the game locally:

```bash
git clone https://github.com/KGwest/Thirst_Quest_Final.git
cd thirst-quest-game
open index.html  # or use Live Server in VSCode

Development Notes
Built during the Summer 2025 Global Career Accelerator at the University of Texas at Arlington

Focused on fusing creative storytelling, accessible gameplay, and global impact.

Designed with empathy in mind—reflecting real-world urgency while keeping play approachable.

About charity: water
charity: water is a nonprofit organization on a mission to bring clean and safe drinking water to people in developing countries.

Since 2006, they’ve funded more than 111,000 water projects serving over 15 million people.
Learn more or donate directly at charitywater.org.

Credits
Game Design & Programming: Kezia Grace West

Original Music & Sound Effects: Study More by Kezia Grace West (2017)

Partnership: charity: water + University of Texas at Arlington

Project: Summer 2025 Global Career Accelerator

Special Thanks: To the educators and technologists who make game-based learning possible

License & Use
This project is licensed for educational and nonprofit use only.
Commercial usage, redistribution, or modification for profit requires written permission.
If adapted, please credit the author and link back to charity: water.