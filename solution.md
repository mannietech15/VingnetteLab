# VignetteLab: Product Requirements Document & Technical Solution

## 1. Executive Summary & Vision
**VignetteLab** is a next-generation, high-performance infinite canvas and collaborative whiteboard application. Designed to outshine existing solutions, VignetteLab provides a fluid, lag-free drawing experience with true real-time multiplayer capabilities, built on an intelligent, highly scalable architecture. 

The vision is to provide creatives, engineers, and teams a boundless spatial workspace that feels as responsive as a native app, wrapped in an exquisite, premium UI that supports seamless Light and Dark modes.

## 2. Product Requirements Document (PRD)

### 2.1 Core Features
*   **High-Fidelity Infinite Canvas:** An unbounded surface supporting ultra-smooth panning, pinch-to-zoom, and hi-DPI scaling. 
*   **Advanced Toolset:** Freehand drawing with pressure sensitivity (perfect curve smoothing), geometric shapes, text nodes, sticky notes, and advanced diagramming connectors.
*   **Intelligent Multiplayer (Real-time):** Zero-latency collaboration featuring live cursors, presence indicators, and conflict-free concurrent editing using CRDTs (Conflict-free Replicated Data Types).
*   **Time-Travel & Versioning:** A sophisticated undo/redo engine that tracks the entire history of the canvas, allowing users to scrub through a timeline of changes.
*   **Smart Export:** Export selections or the entire canvas to high-resolution PNG, SVG, or PDF formats.
*   **Theming:** A visually stunning, dynamic UI featuring beautifully curated Dark and Light modes, glassmorphism elements, and smooth micro-animations.

### 2.2 Target Audience
*   **Designers & Artists:** Requiring low-latency, smooth freehand strokes and precise shape tools.
*   **Product Teams:** Needing collaborative brainstorming, wireframing, and flow-charting capabilities.
*   **Educators & Students:** Utilizing an expansive whiteboard for remote learning and diagramming.

### 2.3 UI/UX Design Aesthetics
*   **Premium Visuals:** Curated harmonious color palettes, modern typography (e.g., Inter or Outfit), and subtle drop shadows.
*   **Fluidity:** 60FPS+ animations for tool selection, zooming, and UI transitions.
*   **Contextual Menus:** Uncluttered interface where tools appear contextually based on the user's current action or selection.
*   **Theme Engine:** Deep integration of white/dark themes with seamless transitions, ensuring optimal contrast and visual comfort in any environment.

## 3. Technical Architecture & Intelligent Backend

To achieve a "peak result," VignetteLab utilizes a hybrid architecture, combining the edge-speed of Next.js, the real-time prowess of Supabase, and the highly structured data querying of GraphQL, all containerized via Docker and scaled on AWS.

### 3.1 Technology Stack
*   **Frontend Framework:** Next.js (React) with TypeScript.
*   **Styling:** Vanilla CSS / CSS Modules with a robust design token system (avoiding utility bloat for fine-grained aesthetic control).
*   **State Management & Real-time:** 
    *   `Zustand` for local transient state.
    *   `Yjs` (CRDT) for intelligent, mathematically verifiable conflict-free multiplayer synchronization.
*   **Data Fetching:** GraphQL (Apollo Client) for structured asset and metadata querying.
*   **Backend & Database:** 
    *   **Supabase:** Handling Authentication, Row Level Security (RLS), and WebSockets for real-time Yjs updates via Supabase Realtime channels.
    *   **PostgreSQL:** The core relational database (managed by Supabase) storing canvas metadata, user profiles, and organization data.
*   **Cloud Infrastructure (AWS):** 
    *   **AWS S3 & CloudFront:** For storing and delivering exported assets, images, and user-uploaded media at edge locations.
    *   **AWS ECS/Fargate (Docker):** Hosting a custom Node.js/GraphQL server container for heavy-lifting tasks (e.g., complex SVG parsing, PDF generation, or custom business logic not suited for Edge functions).

### 3.2 The "Intelligent" Core (How it outshines competitors)
1.  **Rendering Engine Engine:** Instead of standard DOM manipulation, the canvas will utilize a specialized WebGL or HTML5 Canvas 2D rendering pipeline. Strokes are algorithmically smoothed using quadratic bezier curves and Douglas-Peucker simplification, ensuring beautiful lines with zero lag.
2.  **CRDT Integration:** By utilizing CRDTs (like Y.js) over Supabase Realtime, the application ensures that concurrent edits by hundreds of users never conflict. The state deterministically converges without needing a central locking server.
3.  **Unified Input Handling:** A custom pointer-event layer that unifies mouse, touch, and stylus inputs, mapping them to a single deterministic state machine for panning, zooming, and drawing.

### 3.3 Data Flow Architecture
1.  **Local Mutation:** User draws a stroke. The frontend immediately renders it locally (Optimistic UI update).
2.  **CRDT Update:** The stroke is encoded as a Yjs update and broadcasted via Supabase Realtime channels.
3.  **Persistence:** Periodically (e.g., every 5 seconds or on idle), the entire CRDT document state is compacted and saved to the PostgreSQL database as a binary blob, ensuring persistent storage.
4.  **Metadata Querying:** When a user loads their dashboard, Next.js fetches their workspaces and project metadata via the GraphQL API, ensuring type-safe, minimal payload transfers.

## 4. Implementation Phases

*   **Phase 1: Canvas Foundation.** Implementing the infinite pan/zoom engine, fundamental drawing tools, quadratic curve smoothing, and local state management.
*   **Phase 2: Theming & Premium UI.** Building the glassmorphic UI shell, integrating light/dark mode design tokens, and applying micro-animations.
*   **Phase 3: Multiplayer & Backend.** Setting up Supabase, integrating Yjs for real-time cursors and collaborative drawing, and establishing the PostgreSQL schema.
*   **Phase 4: GraphQL & AWS Integration.** Deploying the custom GraphQL server via Docker to AWS ECS, and configuring S3 for media uploads and exports.
*   **Phase 5: Polish & Optimization.** Memory leak profiling, rendering optimizations (culling off-screen elements), and accessibility improvements.
