Hello @Shanti31,

The frontend features for the Patient Session are ready, but we need backend endpoints to handle the form submissions (`handleSubmit` functions).

1. **Patient Notes (`PatientNotesCard.tsx`)**
   - We need an endpoint to save a patient's free-text note.
   - Example payload: `{ content: "comment je me sens aujourd'hui" }`

2. **Session Completion & Feedback (`SessionRunner.tsx` & `PostSessionFeedback.tsx`)**
   - We need an endpoint to save the session results at the end of a session.
   - Should handle saving:
     - `painRating` (1-10)
     - `difficulty` (easy, medium, hard)
     - `fatigue` (low, moderate, high)
     - `comment` (optional string)
     - `skippedExercises` (array with `exerciseId` and `reason`)
     - `exerciseResults` (array with `exerciseId`, `status`, `prePainRating`)

Could you please implement these endpoints on the backend? Thanks!
