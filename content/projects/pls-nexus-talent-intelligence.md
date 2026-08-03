## Research

Before writing any code, the project locked down three things: what "done" means for the MVP, the data model, and the API surface — deliberately deferring refresh tokens, history search, rate limiting, and background job queues to a later version rather than letting scope creep mid-build.

## Architecture

Core entities: `User` (1—N) `Resume` (1—N) `AnalysisReport`. Reports are modeled one-to-many against a resume, not one-to-one, on the reasoning that a user may want to re-run analysis on the same resume later — a decision made deliberately at the planning stage because reversing it after the repository layer is already written is a rewrite, not a tweak.

Two architectural rules were set from day one and carried through the build:
- **Pydantic v2 schemas kept separate from SQLAlchemy models.** Mixing the two is called out directly as the most common FastAPI anti-pattern that makes a codebase unreviewable later.
- **Async all the way down.** A single route left as `def` instead of `async def` while calling a blocking DB driver would silently block the event loop under load — so the pattern was decided before the first route was written, not discovered under load later.

## Implementation

Resume text is extracted with `pypdf` on upload and persisted to the database rather than only held in memory, so analysis can be re-run without asking the user to re-upload the same file and without wasting a Gemini API call. AI analysis itself calls Google's Gemini API through the `google-genai` SDK — chosen explicitly over the older, now-deprecated `google-generativeai` package.

## Lessons

The project's own planning doc puts it directly: recruiters rarely read planning documents, but they judge the artifacts of having done the planning — a clean folder structure, a README that shows the schema was thought through before coding started, and a commit history where the first commit is "chore: project scaffold + planning docs" rather than a single 2,000-line dump. That's the standard this build is being held to, one atomic, revertable commit per step.
