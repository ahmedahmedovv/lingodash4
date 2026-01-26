# Word List Management Feature

## Overview

A dedicated Words modal for managing flashcards with edit, delete, and stats functionality. Replaces the separate Stats modal.

## Access

- New list icon in top bar, left of settings gear
- Icon: three horizontal lines (hamburger-style list icon)
- Same styling as settings gear (24x24, opacity 0.7, hover 1)

## Modal Layout

```
┌─────────────────────────────────────────┐
│  Words                            [✕]   │
├─────────────────────────────────────────┤
│  Total: 3  Due: 1  New: 1  Learning: 0  │
│                                         │
│  Sort: [Due date ▼]  [Asc ▼]           │
│  Next scheduled review date for word.   │
│                                         │
│  ┌─────────────────────────────────┐   │
│  │ hello          New    [✎] [🗑]  │   │
│  │ goodbye        Review [✎] [🗑]  │   │
│  │ thanks         Due    [✎] [🗑]  │   │
│  └─────────────────────────────────┘   │
└─────────────────────────────────────────┘
```

## Features

### Stats Summary
- Shows at top of modal: Total, Due, New, Learning, Review counts
- Updates each time modal opens
- Replaces the separate Stats modal

### Sorting
- Options: due, difficulty, stability, lapses, reps, last_review, state, alpha
- Sort hint shown below dropdowns explains current sort criteria
- Sort preference persists only while modal is open

### Edit Action
- Opens existing Edit modal pre-filled with card data
- After save, returns to Words modal with refreshed list
- Reuses `openEditModal()` function

### Delete Action
- Confirm dialog: `confirm("Delete 'word'?")`
- On confirm: remove from cards array, save(), refresh list
- On cancel: no action

### Empty State
- Display: "No cards yet. Add one with the + button."

## Styling

### Word Row
```css
.words-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 0;
  border-bottom: 1px solid #334155;
}
```

### Action Buttons
- Size: 20x20 icon buttons
- Default: #64748b (gray)
- Edit hover: #60a5fa (blue)
- Delete hover: #dc2626 (red)

### Reused Styles
- `.modal`, `.modal-inner`, `.modal-header`
- `.word-state` badge
- `.sort-row` and select elements

## Implementation Notes

- Single HTML file constraint maintained
- No new dependencies
- Reuses existing modal and edit infrastructure
