# QuizGen

I’m building a 4-hour hackathon MVP:
– Frontend: Next.js (App router), TypeScript, Tailwind CSS, Shadcn UI
– Purpose: Minimal UI for uploading a PDF, presenting a 5-question MCQ quiz, showing per-question feedback, and a "Dive Deeper" dialog linked to quiz questions.
Please scaffold:
1. A clean Next.js project using `create-next-app` with Tailwind and TypeScript.
2. Shadcn UI integration via `npx shadcn-ui init`, plus a few components: Button, Card, Dialog, Input and whichever you want, use npx shadcn@latest add <component_name> for adding components.
3. Layouts/pages:
   • `/` upload page with a drag/drop or file input.
   • `/quiz` page with question cards, radio inputs, submit button.
   • Feedback after answer: immediate correct/incorrect state, explanation text.
   • After quiz: summary view with “Dive Deeper” buttons for each question.
   • A modal dialog (using Shadcn’s Dialog) that pops up deeper explanation content.
4. Utility `cn()` helper for class merging.
5. Minimal state management (React state or context) to track quiz state and selected answers.
6. Simple styling using Shadcn UI components and Tailwind classes for mobile-first layout.
7. Placeholder logic for receiving quiz JSON from backend, rendering question list, feedback, dive‑deeper content.

Use Shadcn UI components consistently for UI elements and include accessibility attributes. Organize component files under `components/ui` for shadcn and other UI under `components/`.

Output code-ready boilerplate: `app/layout.tsx`, `app/page.tsx`, relevant component files, utility files, and shadcn config `components.json`.


Yes, it's possible—especially leveraging AI code tools and tightly narrowing the scope. In 4 focused hours, you can:

Upload PDF

Generate 5 MCQs

Run quiz

Show dynamic feedback

Provide a “Dive Deeper” dialog

Let me know if you'd like prompts for GPT-based MCQ/feedback generation or UI flow diagrams tailored to this timeline!
