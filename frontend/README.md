# Macrosoft Expense Tracker — Frontend

The frontend is a hybrid mobile application built with React Native (Expo) designed to provide a seamless and premium experience for both employees and auditors managing travel expenses.

## Design System: "The Intelligent Ledger"

Our UI strategy, "The Intelligent Ledger," acts as a sophisticated digital curator, providing a high-end editorial feel that departs from traditional corporate tools.

### Core Aesthetics
* **Colors:** Focuses on a high-contrast relationship between deep amethyst (`#630ED4`) to represent AI intelligence and energetic orange (`#AB3500`) for action and momentum.
* **Typography:** Utilizes a dual-typeface system with geometrical **Manrope** for authoritative headlines and **Inter** for highly legible data and transactions.
* **Elevation & Depth:** Follows "The Layering Principle" — relying on tonal shifts (surface nesting) and diffused ambient shadows rather than pure drop shadows to create depth. Pure black shadows are forbidden; instead, diffused tints of background elements provide lift.
* **Components:** Components prioritize "Breathing Space" with asymmetrical layouts. Broad, rounded elements (`1.5rem` radius) convey approachability, while ghost-style input fields maintain a premium, uncluttered look. 1px borders are generally avoided in favor of tonal background contrasts.

## Tech Stack
* **Framework:** React Native with Expo (File-based routing).
* **Styling:** NativeWind (TailwindCSS) configured to strictly adhere to our Intelligent Ledger tokens.
* **Backend Integration:** Connects seamlessly to our custom FastAPI service and Supabase for real-time data synchronization.

## Setup Instructions

1. Install dependencies

   ```bash
   npm install
   ```

2. Configure Environment Variables
   
   Create a `.env` file in the root of the `frontend` directory:
   ```bash
   EXPO_PUBLIC_SUPABASE_URL=your_supabase_project_url
   EXPO_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   EXPO_PUBLIC_API_URL=http://localhost:8000
   ```

3. Start the app

   ```bash
   npx expo start
   ```

In the output, you'll find options to open the app in a development build, Android emulator, iOS simulator, or via Expo Go.
