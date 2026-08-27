import { CATEGORY_IDS, type Category } from './categories';
import { eraOfDay, type EraId } from './eras';

export interface Project {
  day: number;
  title: string;
  /** Verbatim from the challenge log. Day 200 is this site, so its url is empty. */
  url: string;
  categories: Category[];
  description: string;
  technologies: string[];
  /**
   * The stack is inferred from each build, not read from its source.
   * Always false — the UI renders "STACK · INFERRED" so nothing is claimed as verified.
   */
  stackVerified: false;
  era: EraId;
  featured: boolean;
  /** The log contains two deliberate repeats. Both are kept; neither is silently merged. */
  duplicateOf?: number;
  note?: string;
}

const TECH = {
  W: ['Next.js', 'React', 'TypeScript', 'Tailwind CSS'],
  C: ['React', 'TypeScript', 'Canvas 2D'],
  G: ['React', 'Three.js', 'WebGL', 'GLSL'],
  M: ['React', 'TypeScript', 'Framer Motion', 'Tailwind CSS'],
  D: ['Next.js', 'React', 'TypeScript', 'Tailwind CSS', 'Charting'],
  S: ['Next.js', 'React', 'TypeScript', 'Canvas 2D', 'Tailwind CSS'],
} as const;

type TechKey = keyof typeof TECH;

/** [day, title, url, categories, description, techKey, featured?] */
type Row = [number, string, string, string, string, TechKey, 1?];

const ROWS: Row[] = [
  // ── ERA 01 · THE BEGINNING ────────────────────────────────────────────────
  [1, 'Ryze AI', 'https://ryze-ai-cyan.vercel.app/', 'ai product', 'The first build. An AI product landing page, shipped on the night the challenge started.', 'W', 1],
  [2, 'Careerwill', 'https://careerwill-six.vercel.app/', 'product', 'An education platform front-end — the second attempt at a full marketing surface.', 'W'],
  [3, 'IE Fund', 'https://iefund.in/', 'real-world product', 'A live domain shipped on day three, before the habit had even formed.', 'W'],
  [4, 'GigFlow', 'https://gig-flow-nine-jade.vercel.app/', 'product', 'A marketplace concept for freelance work — listings, profiles and hiring flow.', 'W'],
  [5, 'Job Portal', 'https://job-portal-one-pi.vercel.app/', 'product', 'Search, filter and apply. The first build with real list state behind it.', 'W'],
  [6, 'Lead Management Module', 'https://v0-lead-management-module-two.vercel.app/', 'product dashboard', 'A CRM slice: pipeline stages, lead records and status transitions.', 'D'],
  [7, 'Focus On Flow', 'https://focusonflow.vercel.app/', 'productivity product', 'A focus timer built around uninterrupted blocks rather than task lists.', 'W'],
  [8, 'Audio Equalizer', 'https://audio-equalizer.vercel.app/', 'creative-code experiment', 'Live frequency analysis drawn to canvas — the first build that reacted to sound.', 'C'],
  [9, 'Nexus 3D', 'https://nexus3d-rho.vercel.app/', '3d creative-code', 'First contact with WebGL. A 3D scene, a camera, and far too much bloom.', 'G'],
  [10, 'Orbita', 'https://orbita-iota.vercel.app/', '3d creative-code', 'Orbiting geometry in a dark room. Ten days in, motion became the point.', 'G'],
  [11, 'Apple Vision', 'https://apple-vision-three.vercel.app/', 'design 3d', 'A product page study — spatial depth, scroll-linked scenes, restrained typography.', 'G'],
  [12, 'Pesofts', 'https://pesofts-xi.vercel.app/', 'product', 'An exam-software marketing site. Practice at making dense information feel calm.', 'W'],
  [13, 'Nike Air', 'https://nike-air-three.vercel.app/', 'design 3d', 'A product showcase built around one rotating object and a lot of empty space.', 'G'],
  [14, 'iTask', 'https://itask-sigma.vercel.app/', 'productivity utility', 'Tasks, lists and persistence. Small, but the first thing worth using twice.', 'W'],
  [15, 'Pac Maze', 'https://pac-maze-puce.vercel.app/', 'game', 'Grid movement, collision and a chase loop. The first game of the challenge.', 'C'],
  [16, 'Chessform', 'https://chessform.vercel.app/', 'game', 'A chess board with legal-move logic — the hardest rule set attempted so far.', 'C'],
  [17, 'Snakes & Ladders', 'https://snakes-ladders-five.vercel.app/', 'game', 'Turn order, dice, and board traversal animated square by square.', 'C'],
  [18, 'Ludo Arena', 'https://ludo-arena.vercel.app/', 'game', 'Four players, home paths and capture rules. Board games as a state-machine drill.', 'C'],
  [19, 'Portfolio', 'https://shobhit-portfolio-two.vercel.app/', 'portfolio design', 'The portfolio built mid-challenge — the first time the work needed a frame around it.', 'M', 1],
  [20, 'The Veil', 'https://the-veil-neon.vercel.app/', 'experiment creative-code', 'Closing the first era with atmosphere instead of features. Light, fog and reveal.', 'G'],

  // ── ERA 02 · THE PLAYGROUND ───────────────────────────────────────────────
  [21, 'Flux', 'https://flux-eight-gamma.vercel.app/', 'creative-code experiment', 'Continuous motion as the entire interface. No fixed layout, only flow.', 'C'],
  [22, 'Lume', 'https://lume-zeta-sage.vercel.app/', 'creative-code design', 'A study in light as a layout tool — glow defines hierarchy instead of boxes.', 'M'],
  [23, 'Day Zero', 'https://dayzero-theta.vercel.app/', 'product experiment', 'A starting-over interface. Built on the theme the whole challenge kept returning to.', 'M'],
  [24, 'Brief', 'https://brief-ashy.vercel.app/', 'product design', 'A creative brief tool — structure imposed on the messiest part of any project.', 'W'],
  [25, 'Timeline', 'https://timeline-omega-khaki.vercel.app/', 'experiment design', 'Time as a scrollable spatial object. A first sketch of what this archive became.', 'M'],
  [26, 'Dear Future Me', 'https://dear-future-me-pi.vercel.app/', 'experiment product', 'Write a message and lock it away. Interface design applied to delayed gratification.', 'M'],
  [27, 'Commitment', 'https://commitment-pied.vercel.app/', 'experiment productivity', 'A build about the exact thing being tested every night: showing up again tomorrow.', 'M'],
  [28, 'Startup.exe', 'https://startup-exe.vercel.app/', 'experiment startup', 'A startup, presented as a program you run. Desktop metaphor, business logic.', 'M'],
  [29, 'Reflect', 'https://reflect-umber.vercel.app/', 'productivity experiment', 'A daily reflection surface, deliberately slow and deliberately quiet.', 'M'],
  [30, 'Regret Heatmap', 'https://regret-heatmap.vercel.app/', 'experiment dashboard', 'Data visualisation pointed at something unmeasurable. Half tool, half provocation.', 'D'],
  [31, 'Your Day Timeline', 'https://your-day-timeline.vercel.app/', 'productivity dashboard', 'Twenty-four hours rendered as one continuous band you can fill in.', 'D'],
  [32, 'Continuum', 'https://continuum-sigma-seven.vercel.app/', 'experiment creative-code', 'An interface with no discrete pages — only positions along a single continuum.', 'M'],
  [33, 'Clarity', 'https://clarity-gamma-eight.vercel.app/', 'productivity design', 'Subtraction as a feature. What is left when every optional element is removed.', 'M'],
  [34, 'Onboarding Flow Simulator', 'https://onboardingflow-simulator.vercel.app/', 'simulation design', 'Step through onboarding patterns and watch where users would fall out.', 'W'],
  [35, 'Morning Routine Builder', 'https://morning-routine-builder.vercel.app/', 'productivity utility', 'Compose a morning from blocks and see the time budget it actually costs.', 'W'],
  [36, 'Ye / No', 'https://ye-no.vercel.app/', 'experiment', 'A whole interface reduced to one binary decision, taken seriously.', 'M'],
  [37, 'Gradient Motion Lab', 'https://gradient-motion-lab.vercel.app/', 'creative-code design', 'A laboratory for animated gradients — mesh, noise, and slow drift.', 'G'],
  [38, 'Loading Screen Collection', 'https://loading-screen-collection.vercel.app/', 'creative-code design', 'A set of loaders treated as a design discipline rather than a stopgap.', 'M'],
  [39, 'Cursor Interactive', 'https://cursor-interactive.vercel.app/', 'creative-code design', 'The pointer as a first-class UI element. Magnetism, lag and state.', 'M'],
  [40, 'Typography Scale Visualizer', 'https://typography-scale-visualizer.vercel.app/', 'design dev-tool', 'Adjust a type scale and watch every step re-render in place.', 'W'],
  [41, 'Magnetic Studio', 'https://magnetic-studio.vercel.app/', 'creative-code design', 'Elements that pull toward the cursor — attraction physics applied to layout.', 'M'],
  [42, 'Liquid Typography', 'https://liquid-typography.vercel.app/', 'creative-code design', 'Type that flows, distorts and reforms. Letterforms rendered as a fluid.', 'G'],
  [43, 'Obsidian', 'https://obsidian-a-spatial-archive.vercel.app/', 'experiment 3d', 'A spatial archive — information placed in a room rather than listed on a page.', 'G', 1],
  [44, 'Anticipatory UI', 'https://anticipatory-ui-the-predictive-hove.vercel.app/', 'experiment design', 'An interface that responds before the click, predicting intent from hover paths.', 'M'],
  [45, 'The Website That Ends', 'https://the-website-that-ends.vercel.app/', 'experiment', 'A site with a finite amount of itself. Scroll far enough and it is over.', 'M', 1],
  [46, 'Aletheia', 'https://aletheia-the-architecture-of-curios.vercel.app/', 'experiment design', 'The architecture of curiosity — an interface that rewards looking, not clicking.', 'G', 1],
  [47, 'Sentience Geometry', 'https://sentience-geometry.vercel.app/', 'experiment 3d', 'Geometry that appears to notice you. Shader work aimed at a feeling.', 'G', 1],
  [48, 'Hesitation Flow', 'https://hesitation-flow.vercel.app/', 'experiment design', 'A UI built around the pause before a decision instead of the decision itself.', 'M'],
  [49, 'Locus', 'https://locus-semantic-spatial-translator.vercel.app/', 'experiment ai', 'A semantic-to-spatial translator: meaning arranged as position.', 'G'],
  [50, 'Aethel', 'https://aethel-the-living-ecosystem.vercel.app/', 'experiment simulation', 'A living ecosystem in a browser tab. Day fifty, and the page grows on its own.', 'G', 1],

  // ── ERA 03 · MOTION & PHYSICS ─────────────────────────────────────────────
  [51, 'Gravity Painter', 'https://gravity-painter-zeta.vercel.app/', 'creative-code simulation', 'Paint with particles that fall. The brush has mass and the canvas has gravity.', 'C'],
  [52, 'Orbital Balance', 'https://orbital-balance.vercel.app/', 'simulation game', 'Keep a system of orbits stable. Two-body intuition, punished immediately.', 'C'],
  [53, 'Procedural Island Explorer', 'https://procedural-island-explorer.vercel.app/', '3d simulation', 'An island generated from noise, then handed over to be walked around.', 'G', 1],
  [54, 'Creature Evolution', 'https://creature-evolution.vercel.app/', 'simulation experiment', 'Generations of creatures mutating toward a fitness goal, in real time.', 'C'],
  [55, '3D Reflex Tunnel', 'https://3d-reflex-tunnel.vercel.app/', '3d game', 'Fly a tunnel that narrows faster than reaction time comfortably allows.', 'G'],
  [56, 'Meteor Defense', 'https://meteor-defense.vercel.app/', 'game simulation', 'Intercept falling bodies. Trajectory prediction as the core mechanic.', 'C'],
  [57, 'Light Runner', 'https://light-runner.vercel.app/', 'game 3d', 'A runner made of light trails, where the trail itself becomes the obstacle.', 'C'],
  [58, 'Balance Tower', 'https://balance-tower.vercel.app/', 'game simulation', 'Stack until physics disagrees. Centre of mass as the only real rule.', 'C'],
  [59, 'Curiosity Score', 'https://curiosity-score.vercel.app/', 'experiment', 'The page measures how much of it you bothered to explore, then tells you.', 'M'],
  [60, 'Chaos Button', 'https://chaos-button-three.vercel.app/', 'experiment game', 'One button. Escalating consequences. A study in escalation as interaction design.', 'M'],

  // ── ERA 04 · THE GAME LAB ─────────────────────────────────────────────────
  [61, 'Tap Burst', 'https://tap-burst.vercel.app/', 'game', 'Tap at the peak of the burst. One input, one window, one score.', 'C'],
  [62, 'Glow Hit', 'https://glow-hit.vercel.app/', 'game', 'Strike the target while it is lit. Timing tuned to a few frames.', 'C'],
  [63, 'Drift Ball', 'https://drift-ball.vercel.app/', 'game', 'Momentum you steer but never stop. Control through anticipation.', 'C'],
  [64, 'Orbit Jumper', 'https://orbit-jumper.vercel.app/', 'game', 'Release from one orbit and catch the next. Everything is angular velocity.', 'C'],
  [65, 'Blink Dodge', 'https://blink-dodge.vercel.app/', 'game', 'Obstacles visible only between blinks. Memory doing the work of sight.', 'C'],
  [66, 'Blink Dodge II', 'https://blink-dodge-1ebc.vercel.app/', 'game', 'The same idea, rebuilt the next day with tighter timing and a harsher curve.', 'C'],
  [67, 'Closing Gate', 'https://closing-gate.vercel.app/', 'game', 'The gap shrinks while you approach it. Commit early or not at all.', 'C'],
  [68, 'Glass Breaker', 'https://glass-breaker-nu.vercel.app/', 'game', 'Fracture propagation as a scoring system. Hit where the cracks already are.', 'C'],
  [69, 'Micro Gap Runner', 'https://micro-gap-runner.vercel.app/', 'game', 'Gaps measured in pixels at speeds measured in milliseconds.', 'C'],
  [70, 'Perfect Frame Jump', 'https://perfect-frame-jump.vercel.app/', 'game', 'There is exactly one correct frame. Everything else is a loss.', 'C'],
  [71, 'Frog Jump', 'https://frog-jump-the-minimum-energy-path.vercel.app/', 'game simulation', 'Find the minimum-energy path across the pond. A cost function you can feel.', 'C'],
  [72, 'Multi Lane Chaos', 'https://multi-lane-chaos.vercel.app/', 'game', 'Several lanes, each with its own rhythm, all demanding attention at once.', 'C'],
  [73, 'Heat Zones', 'https://heat-zones.vercel.app/', 'game', 'The floor remembers where you stood and turns against you for it.', 'C'],
  [74, 'Last Moment Jump', 'https://last-moment-jump.vercel.app/', 'game', 'Waiting is rewarded until the instant it is fatal.', 'C'],
  [75, 'Uncertain Jump Cost', 'https://uncertain-jump-cost.vercel.app/', 'game simulation', 'Every jump costs an amount you only learn after committing to it.', 'C'],
  [76, 'Laser Path Optimizer', 'https://laser-path-optimizer.vercel.app/', 'game simulation', 'Route a beam through a room. Part puzzle, part optimisation problem.', 'C'],
  [77, 'Neon Jumper', 'https://neon-jumper.vercel.app/', 'game', 'Vertical ascent under neon, with platforms that do not wait.', 'C'],
  [78, 'Laser Floor', 'https://laser-floor.vercel.app/', 'game', 'Sweeping beams turn the whole floor into a timing puzzle.', 'C'],
  [79, 'Enemy Bounce', 'https://enemy-bounce.vercel.app/', 'game', 'The enemies are the platforms. Closing the game lab on one clean inversion.', 'C'],

  // ── ERA 05 · SYSTEM THINKING ──────────────────────────────────────────────
  [80, 'Stock Trading System', 'https://stock-trading-system-nine.vercel.app/', 'system-design finance simulation', 'Order matching, an order book and live fills — an exchange rendered as a visualiser.', 'S', 1],
  [81, 'CineLock', 'https://cinelock-system-design-movie-bookin.vercel.app/', 'system-design product', 'Seat locking, holds and expiry: the concurrency problem behind every booking site.', 'S'],
  [82, 'Distributed Checkout Simulator', 'https://distributed-checkout-simulator.vercel.app/', 'system-design simulation', 'Watch a checkout survive partial failure, retries and inventory contention.', 'S'],
  [83, 'Daily Essentials Tracker', 'https://daily-essentials-tracker-plum.vercel.app/', 'utility productivity', 'The household running total, tracked without a spreadsheet.', 'W'],
  [84, 'EMI Planner', 'https://emi-planner-opal.vercel.app/', 'finance utility', 'Amortisation made visible — see what each extra payment actually removes.', 'D'],
  [85, 'Food Delivery System Simulator', 'https://food-delivery-system-simulator.vercel.app/', 'system-design simulation', 'Dispatch, batching and courier assignment, animated as a running system.', 'S'],
  [86, 'EventFlow', 'https://eventflow-iota-amber.vercel.app/', 'system-design product', 'Event-driven architecture you can step through, producer to consumer.', 'S'],
  [87, 'Glassmorphism Showcase', 'https://glassmorphism-showcase.vercel.app/', 'design creative-code', 'A material study — blur, refraction and depth pushed to their useful limit.', 'M'],
  [88, 'Life Admin Dashboard', 'https://life-admin-dashboard-iota.vercel.app/', 'dashboard productivity', 'Every recurring obligation of an adult life on one screen.', 'D'],
  [89, 'Goal Progress Dashboard', 'https://goal-progress-dashboard.vercel.app/', 'dashboard productivity', 'Long-horizon goals broken into measurable progress bands.', 'D'],
  [90, 'LinkForge', 'https://linkforge-visual-url-system.vercel.app/', 'dev-tool utility', 'A visual URL system — build, inspect and compare links as structures.', 'W'],
  [91, 'Personal Analytics Dashboard', 'https://personal-analytics-dashboard-six.vercel.app/', 'dashboard', 'Self-tracking data given the same rigour as a product metrics page.', 'D'],
  [92, 'Real-Time Chat System', 'https://real-time-chat-system-visualizer.vercel.app/', 'system-design simulation', 'Presence, fan-out and delivery guarantees drawn as a live topology.', 'S', 1],
  [93, 'Search Engine System', 'https://search-engine-system-drab.vercel.app/', 'system-design simulation', 'Crawl, index, rank — the whole pipeline, visible and stepping in real time.', 'S', 1],
  [94, 'SplitFlow', 'https://splitflow-expense-splitter.vercel.app/', 'finance utility', 'Group expenses reduced to the minimum number of settling transfers.', 'W'],
  [95, 'StreamFlow', 'https://streamflow-video-system-visualizer.vercel.app/', 'system-design simulation', 'Adaptive bitrate, chunking and CDN edges shown as a video pipeline.', 'S'],
  [96, 'Subly', 'https://subly-smart-subscription-manager.vercel.app/', 'utility finance', 'Every subscription, its renewal date, and the annual number nobody wants to see.', 'W'],
  [97, 'Vault', 'https://vault-secure-password-manager.vercel.app/', 'utility product', 'A password manager interface — a study in trust, disclosure and locked state.', 'W'],
  [98, 'Velocity', 'https://velocity-real-time-ride-system-simu.vercel.app/', 'system-design simulation', 'Ride matching in real time: supply, demand, surge and dispatch on one map.', 'S'],
  [99, 'VisionCanvas', 'https://visioncanvas-psi.vercel.app/', 'creative-code product', 'An infinite canvas for thinking — pan, place, connect, zoom out.', 'C'],
  [100, 'Veyl', 'https://www.veyl.co/', 'real-world product', 'The hundredth build, and the first on its own domain. Halfway, and no longer practice.', 'W', 1],
  [101, 'Voyager', 'https://voyager-travel-planner-dashboard.vercel.app/', 'travel dashboard', 'Itineraries, budgets and legs of a trip planned in one dashboard.', 'D'],
  [102, 'Weekly Reset', 'https://weekly-reset-dashboard.vercel.app/', 'dashboard productivity', 'A Sunday ritual turned into software: close the week, open the next.', 'D'],
  [103, 'NetSync', 'https://netsync-multiplayer-architecture-si.vercel.app/', 'system-design simulation', 'Multiplayer netcode made visible — lag, prediction, reconciliation, rollback.', 'S', 1],

  // ── ERA 06 · LIFE OS ──────────────────────────────────────────────────────
  [104, 'Smart Grocery List', 'https://smart-grocery-list-kappa.vercel.app/', 'utility productivity', 'A list that groups by aisle and remembers what always gets forgotten.', 'W'],
  [105, 'Meal Planner', 'https://meal-planner-gamma-ashy.vercel.app/', 'utility health', 'A week of meals planned, with the shopping list falling out of it.', 'W'],
  [106, 'Document Reminder Vault', 'https://document-reminder-vault.vercel.app/', 'utility', 'Every document that expires, and a warning before it does.', 'W'],
  [107, 'Account Tracker Vault', 'https://account-tracker-vault.vercel.app/', 'utility finance', 'A register of accounts, where they live and what they cost.', 'W'],
  [108, 'Oasis', 'https://oasis-bookmark-organizer.vercel.app/', 'utility productivity', 'Bookmarks organised spatially instead of alphabetically.', 'W'],
  [109, 'Freelancer Income OS', 'https://freelancer-income-os.vercel.app/', 'finance dashboard', 'Irregular income, made legible — invoices, runway and the months in between.', 'D'],
  [110, 'Renewal Hub', 'https://renewal-subscription-hub.vercel.app/', 'utility finance', 'One calendar for every renewal, so none of them arrive as a surprise.', 'W'],
  [111, 'Student Career CRM', 'https://student-career-crm.vercel.app/', 'product dashboard', 'Applications, contacts and stages — a CRM aimed at a first job hunt.', 'D'],
  [112, 'Browser History Visualizer', 'https://browser-history-visualizer.vercel.app/', 'dashboard dev-tool', 'Browsing sessions drawn as a branching graph rather than a flat list.', 'S'],
  [113, 'Undo Stack Notes', 'https://undo-stack-notes.vercel.app/', 'utility experiment', 'A notes app where the undo history is the primary interface.', 'W'],
  [114, 'Relationship Mapper', 'https://relationship-mapper-liard.vercel.app/', 'utility experiment', 'A personal graph — who knows whom, and when you last spoke.', 'S'],
  [115, 'Smart Route Planner', 'https://smart-route-planner-two.vercel.app/', 'travel utility', 'Multi-stop routing where the ordering of stops is the actual problem.', 'S'],

  // ── ERA 07 · THE PUZZLE LAB ───────────────────────────────────────────────
  [116, 'Color Switch Grid', 'https://color-switch-grid.vercel.app/', 'game', 'A grid whose colours rewrite the rules as you play on it.', 'C'],
  [117, 'Last Safe Tile', 'https://last-safe-tile.vercel.app/', 'game', 'The board shrinks toward a single survivable square.', 'C'],
  [118, 'Heat Tiles', 'https://heat-tiles.vercel.app/', 'game', 'Every tile you touch heats up and eventually refuses you.', 'C'],
  [119, 'Hidden Bomb Countdown', 'https://hidden-bomb-countdown.vercel.app/', 'game', 'A timer you cannot see, on a square you have not found yet.', 'C'],
  [120, 'Tap or Die', 'https://tap-or-die-five.vercel.app/', 'game', 'Inaction is the only losing move, and the interval keeps shortening.', 'C'],
  [121, 'Mini Sudoku Rush', 'https://mini-sudoku-rush.vercel.app/', 'game', 'Constraint solving under a clock that does not care how elegant you are.', 'C'],
  [122, 'Binary Grid', 'https://binary-grid-weld.vercel.app/', 'game', 'Two states, one rule set, and a surprising amount of deduction.', 'C'],
  [123, 'Invisible Mines', 'https://invisible-mines.vercel.app/', 'game', 'Minesweeper with the numbers removed. Inference from consequence alone.', 'C'],
  [124, 'One Mistake', 'https://one-mistake.vercel.app/', 'game', 'A full run with exactly one allowance for being wrong.', 'C'],
  [125, 'Odd One Out', 'https://odd-one-out-rouge.vercel.app/', 'game', 'Perceptual difference shrinking round by round until it is nearly nothing.', 'C'],
  [126, 'Truth or Trap', 'https://truth-or-trap-grid.vercel.app/', 'game', 'Half the board is lying to you and it never says which half.', 'C'],
  [127, 'Hidden Path Numbers', 'https://hidden-path-numbers.vercel.app/', 'game', 'A route exists. The numbers are the only evidence of where.', 'C'],
  [128, 'Mirror Clue Grid', 'https://mirror-clue-grid.vercel.app/', 'game', 'Clues reflected across the board — solve one side, read the other.', 'C'],
  [129, 'Tap Before Fade', 'https://tap-before-fade.vercel.app/', 'game', 'Targets dissolve on a timer you learn only by losing to it.', 'C'],
  [130, 'Expanding Danger Zone', 'https://expanding-danger-zone.vercel.app/', 'game', 'Safe area contracts continuously. Every plan has a shelf life.', 'C'],
  [131, 'Collapse After Click', 'https://collapse-after-click.vercel.app/', 'game', 'Every move destroys the ground you made it from.', 'C'],
  [132, 'Limited Moves', 'https://limited-moves-puzzle.vercel.app/', 'game', 'A fixed budget of actions, and a solution that needs all of them.', 'C'],
  [133, 'Almost Win Trap', 'https://almost-win-trap.vercel.app/', 'game experiment', 'Designed so the obvious winning line is the losing one.', 'C'],
  [134, 'Rotara', 'https://rotara-grid-rotation-puzzle.vercel.app/', 'game', 'Rotate sections of the grid to align a solution that keeps moving.', 'C'],
  [135, "You Can't Stop Moving", 'https://you-can-t-stop-moving.vercel.app/', 'game', 'No idle state. Standing still is an input with consequences.', 'C'],
  [136, 'The Grid Rotates', 'https://the-grid-rotates.vercel.app/', 'game', 'The board turns underneath a plan you made for its previous orientation.', 'C'],
  [137, 'Release At Perfect Moment', 'https://release-at-perfect-moment.vercel.app/', 'game', 'Holding is easy. Letting go at the right instant is the entire game.', 'C'],
  [138, 'Your Score Is Your Enemy', 'https://your-score-is-your-enemy.vercel.app/', 'game experiment', 'Every point you earn makes the next point harder to survive.', 'C'],
  [139, 'Chorum', 'https://chorum-landing-new.vercel.app/', 'real-world product', 'A product landing page built mid-puzzle-era — and returned to again on day 195.', 'W'],
  [140, 'The Exit Moves Away', 'https://the-exit-moves-away.vercel.app/', 'game', 'The goal retreats at your speed. Chasing it directly cannot work.', 'C'],
  [141, 'The Liar', 'https://the-liar.vercel.app/', 'game experiment', 'The interface reports its own state incorrectly, on purpose, consistently.', 'C'],
  [142, 'Pattern Hunter', 'https://pattern-hunter-three.vercel.app/', 'game', 'Find the rule before the sequence runs out of examples.', 'C'],
  [143, 'Undo', 'https://undo-ashy.vercel.app/', 'game experiment', 'A game where reversing a move is the mechanic, not the escape hatch.', 'C'],
  [144, 'Freeze', 'https://freeze-theta.vercel.app/', 'game', 'Stop time briefly, then live inside the arrangement you froze.', 'C'],
  [145, 'The Fold', 'https://the-fold-two.vercel.app/', 'game', 'The board folds over itself and two distant squares become neighbours.', 'C'],
  [146, 'Second Guess', 'https://second-guess-mocha.vercel.app/', 'game experiment', 'You may change your answer once. That option is the trap.', 'C'],
  [147, 'Aging', 'https://aging-kappa.vercel.app/', 'game experiment', 'Every ten seconds changes what the player is able to do.', 'C', 1],
  [148, 'Stolen Seconds', 'https://stolen-seconds.vercel.app/', 'game', 'The clock loses time whenever you are not paying attention to it.', 'C'],
  [149, 'Countdown Collector', 'https://countdown-collector-rho.vercel.app/', 'game', 'Collect timers to buy the seconds needed to collect more timers.', 'C'],
  [150, 'Too Many Yous', 'https://too-many-yous.vercel.app/', 'game experiment', 'Day one hundred and fifty: every past run replays alongside the current one.', 'C'],
  [151, 'Crowded', 'https://crowded-alpha.vercel.app/', 'game', 'Space is the resource. It runs out faster than anything else.', 'C'],
  [152, 'The Queue', 'https://the-queue-one.vercel.app/', 'game simulation', 'Queueing theory as a playable frustration. Order in, order out, backlog forever.', 'C'],
  [153, 'Upside Down', 'https://upside-down-peach.vercel.app/', 'game', 'Inverted controls held long enough that the inversion becomes normal.', 'C'],

  // ── ERA 08 · THE OPERATING SYSTEM ERA ─────────────────────────────────────
  [154, 'HomeCare OS', 'https://homecare-os.vercel.app/', 'product utility', 'The house as a managed system — maintenance, schedules and service records.', 'D'],
  [155, 'FreshKeep', 'https://freshkeep-sooty.vercel.app/', 'product utility health', 'Track what is in the fridge and what is about to stop being food.', 'W'],
  [156, 'HomeVault', 'https://homevault-lilac.vercel.app/', 'product utility', 'An inventory of everything owned, with warranties and paperwork attached.', 'D'],
  [157, 'PocketCheck', 'https://pocketcheck-eight.vercel.app/', 'finance product', 'Day-to-day spending checked against what is actually left.', 'D'],
  [158, 'DecisionOS', 'https://decisionos-eight.vercel.app/', 'product productivity', 'Structured decision making — options, weights, and a record of why.', 'D'],
  [159, 'LearningOS', 'https://learning-os-rho.vercel.app/', 'product productivity', 'A curriculum you assemble yourself, with progress that survives the week.', 'D'],
  [160, 'BuildFlow', 'https://buildflow-bice.vercel.app/', 'product dev-tool', 'Ship pipelines and build state rendered as a product surface.', 'D'],
  [161, 'FreelanceOS', 'https://freelanceos-xi.vercel.app/', 'product finance', 'Clients, scope, invoices and capacity in a single operating picture.', 'D'],
  [162, 'CareerFlow', 'https://careerflow-ten-iota.vercel.app/', 'product productivity', 'A career tracked deliberately: roles, skills, gaps and the next move.', 'D'],
  [163, 'Portfolio Pulse', 'https://portfolio-pulse-khaki.vercel.app/', 'finance dashboard', 'Holdings, allocation and drift, shown without the usual noise.', 'D'],
  [164, 'GiftFlow', 'https://giftflow-three.vercel.app/', 'product utility', 'Occasions, budgets and ideas, tracked before the week they are needed.', 'W'],
  [165, 'EventFlow OS', 'https://eventflown.vercel.app/', 'product dashboard', 'Running an event as an operation — timeline, vendors, guests, dependencies.', 'D'],
  [166, 'VoyageOS', 'https://voyageos-mu.vercel.app/', 'travel product', 'Long-trip planning: routes, documents, budgets and everything booked so far.', 'D'],
  [167, 'Celer', 'https://celer.in/', 'real-world product', 'A live product on its own domain, built during the OS era.', 'W', 1],
  [168, 'StartupOS', 'https://startupos-sigma.vercel.app/', 'startup product', 'The whole company as one system: idea, traction, runway, roadmap.', 'D', 1],
  [169, 'SystemForge', 'https://systemforge-nine.vercel.app/', 'system-design dev-tool', 'Compose architectures from primitives and watch the trade-offs move.', 'S', 1],
  [170, 'BusinessPulse', 'https://businesspulse-lemon.vercel.app/', 'dashboard product', 'Operating metrics for a small business, on one honest screen.', 'D'],
  [171, 'AlgoVerse', 'https://algoverse-inky.vercel.app/', 'dev-tool product', 'Algorithms animated step by step, with the state visible at every frame.', 'S'],
  [172, 'DevLab OS', 'https://devlab-os.vercel.app/', 'dev-tool product', 'A workbench of developer utilities collected into one coherent environment.', 'D', 1],
  [173, 'APIVerse', 'https://apiverse-gold.vercel.app/', 'dev-tool', 'Design, inspect and exercise API surfaces without leaving the page.', 'D'],
  [174, 'GitVerse', 'https://gitverse-nu.vercel.app/', 'dev-tool', 'Branching, merging and history drawn as the graph it actually is.', 'S'],
  [175, 'SQL Adventure', 'https://sql-adventure-eight.vercel.app/', 'dev-tool game', 'Learn SQL by playing it — queries as moves, results as consequences.', 'D', 1],
  [176, 'RevisionOS', 'https://revisionos-gamma.vercel.app/', 'productivity product', 'Spaced repetition wrapped in something that does not look like flashcards.', 'D'],
  [177, 'SkillForge', 'https://skillforge-murex-tau.vercel.app/', 'product productivity', 'Skills broken into levels, evidence and the next deliberate practice block.', 'D'],
  [178, 'InterviewOS', 'https://interviewos-rouge.vercel.app/', 'product dev-tool', 'Interview preparation run as a pipeline instead of a panic.', 'D'],
  [179, 'SalaryOS', 'https://salaryos-eta.vercel.app/', 'finance product', 'Compensation modelled properly — components, taxes and what actually lands.', 'D'],
  [180, 'ExpenseIQ', 'https://expenseiq-bice.vercel.app/', 'finance dashboard', 'Spending categorised and questioned, with the trend lines that matter.', 'D'],
  [181, 'MediFlow OS', 'https://mediflow-os-sigma.vercel.app/', 'health product', 'Prescriptions, appointments and history in one clinical-feeling surface.', 'D'],
  [182, 'ConnectOS', 'https://connectos-gamma.vercel.app/', 'product productivity', 'Relationship management for people who are not a sales team.', 'D'],
  [183, 'FamilyHealth OS', 'https://familyhealth-os-silk.vercel.app/', 'health product', 'A household health record — several people, one timeline.', 'D'],
  [184, 'HomeCare OS II', 'https://homecare-os-1.vercel.app/', 'product utility', 'A second pass at day 154, rebuilt thirty days later with what had been learned.', 'D'],
  [185, 'ReviewFlow OS', 'https://reviewflow-os.vercel.app/', 'product dev-tool', 'Review cycles, feedback and sign-off tracked as a real workflow.', 'D'],
  [186, 'ComponentOS', 'https://componentos.vercel.app/', 'dev-tool design', 'A component library treated as a product, not a folder.', 'D'],
  [187, 'FeedbackOS', 'https://feedbackos-neon.vercel.app/', 'product', 'Collect, triage and close the loop on user feedback in one place.', 'D'],
  [188, 'InvestorOS', 'https://investoros-pearl.vercel.app/', 'finance startup', 'The fundraising process as a pipeline: targets, stages, updates, follow-ups.', 'D', 1],
  [189, 'PackPilot OS', 'https://packpilot-os.vercel.app/', 'travel product', 'Packing as logistics — trips, constraints, lists that build themselves.', 'D', 1],

  // ── ERA 09 · THE GAME STUDIO ──────────────────────────────────────────────
  [190, 'Neon Drift', 'https://neon-drift-ten-cyan.vercel.app/', 'game 3d', 'A drift racer under neon. Four days of building actual finished games begins here.', 'G', 1],
  [191, 'Tiny Knight', 'https://tiny-knight.vercel.app/', 'game', 'A small knight, a real combat loop, and rooms that mean something.', 'C', 1],
  [192, 'Bomb Room', 'https://bomb-room.vercel.app/', 'game', 'One room, several bombs, and a very short window to be elsewhere.', 'C', 1],
  [193, 'Gravity Shift', 'https://gravity-shift-phi.vercel.app/', 'game simulation', 'Flip gravity to solve rooms that only have one orientation-correct answer.', 'C', 1],

  // ── ERA 10 · THE REAL WORLD ───────────────────────────────────────────────
  [194, 'Pinpoint Connect', 'https://www.pinpointconnect.app/', 'real-world product', 'A production application on its own domain.', 'W', 1],
  [195, 'Chorum', 'https://chorum-landing-new.vercel.app/', 'real-world product', 'Returned to on day 195 — the same landing, revisited with six months of practice.', 'W', 1],
  [196, 'Veyl', 'https://www.veyl.co/', 'real-world product', 'The day-100 build, revisited at day 196 as part of the real-world stretch.', 'W', 1],
  [197, 'Desi Marketplace', 'https://www.desi-marketplace.com/', 'real-world product', 'A live marketplace on a production domain.', 'W', 1],
  [198, 'PrimeMentor', 'https://primementor.com.au/', 'real-world product', 'A live mentoring platform, shipped to a production domain.', 'W', 1],
  [199, 'Floww', 'https://floww-landing.vercel.app/', 'real-world product', 'The last build before the archive. One more landing, done properly.', 'W', 1],
  [200, 'The Archive', '', 'real-world portfolio experiment', 'This site. Two hundred days of building, collected into the thing you are reading now.', 'G', 1],
];

const DUPLICATES: Record<number, { of: number; note: string }> = {
  195: { of: 139, note: 'Same build as Day 139 — kept in the log, kept in the archive.' },
  196: { of: 100, note: 'Same build as Day 100 — kept in the log, kept in the archive.' },
};

const EXTRA_NOTES: Record<number, string> = {
  1: 'Everything started here.',
  100: 'Revisited on Day 196.',
  139: 'Revisited on Day 195.',
  200: 'Day 200 is not an entry in the archive. Day 200 is the archive.',
};

function parseCategories(raw: string, day: number): Category[] {
  const parsed = raw.split(' ').filter(Boolean) as Category[];
  for (const c of parsed) {
    if (!CATEGORY_IDS.includes(c)) {
      throw new Error(`Unknown category "${c}" on day ${day}`);
    }
  }
  return parsed;
}

export const PROJECTS: Project[] = ROWS.map(
  ([day, title, url, cats, description, techKey, featured]) => {
    const dup = DUPLICATES[day];
    return {
      day,
      title,
      url,
      categories: parseCategories(cats, day),
      description,
      technologies: [...TECH[techKey]],
      stackVerified: false as const,
      era: eraOfDay(day).id,
      featured: featured === 1,
      ...(dup ? { duplicateOf: dup.of } : {}),
      ...(EXTRA_NOTES[day] ?? dup?.note ? { note: EXTRA_NOTES[day] ?? dup!.note } : {}),
    };
  },
);

export const TOTAL_DAYS = 200;

if (PROJECTS.length !== TOTAL_DAYS) {
  throw new Error(`Archive integrity: expected ${TOTAL_DAYS} projects, found ${PROJECTS.length}`);
}
