# Bug Fixes Plan - Flashcard App

## Issues to Fix

### 🔴 Critical (2)

| # | Issue | Current Behavior | Fix |
|---|-------|------------------|-----|
| 1 | Session state not restored | Counters restored but pool recreated | Always start fresh - remove curWord logic |
| 2 | Card restoration overwrites | curWord loaded then ignored | Remove broken restoration code |

### 🟡 Medium (4)

| # | Issue | Current Behavior | Fix |
|---|-------|------------------|-----|
| 3 | Export wrong date | Uses `new Date()` | Use actual session date |
| 4 | RTL direction default | `direction: rtl` on image container | Remove RTL styling |
| 5 | No escape key | Must click X to close modals | Add keydown listener for Escape |
| 6 | Empty word regex | `new RegExp('', 'gi')` matches all | Guard against empty word |

### 🟢 Minor (2)

| # | Issue | Current Behavior | Fix |
|---|-------|------------------|-----|
| 7 | Stats row hard to see | 30% opacity default | Increase to 50% |
| 8 | Double sessionCount++ | Incremented on restore + in next() | Only increment for new cards |

---

## Implementation Details

### Fix 1 & 2: Fresh Session on Reload

**Remove** (lines 705-707):
```javascript
const savedWord = localStorage.getItem('curWord');
cur = savedWord ? cards.find(c => c.word === savedWord) : null;
```

**Remove** all `localStorage.setItem('curWord', ...)` and `localStorage.removeItem('curWord')` calls.

**Simplify** to just:
```javascript
renderDeckMenu();
next();
```

**Files affected**: `index.html` (lines 364, 410, 613, 671, 696, 705-707)

---

### Fix 3: Export Date

**Change** (line 687):
```javascript
// Before
date: formatDateDDMMYYYY(new Date())

// After
date: formatDateDDMMYYYY(sessionData.date || new Date().toDateString())
```

---

### Fix 4: Remove RTL Direction

**Change** (lines 110, 113):
```html
<!-- Remove direction: rtl from both elements -->
```

---

### Fix 5: Escape Key Handler

**Add** after line 590:
```javascript
document.addEventListener('keydown', e => {
  if (e.key === 'Escape') {
    if (editModal.style.display === 'block') closeEditModal();
    else if (statsModal.style.display === 'block') closeStatsModal();
    else if (settingsModal.style.display === 'block') closeSettingsModal();
    else if (imageSearchModal.style.display === 'block') closeImageSearchModal();
    closeMenu();
    deckMenu.classList.remove('show');
  }
});
```

---

### Fix 6: Empty Word Guard

**Change** (line 418-419):
```javascript
// Before
const esc = (cur.word || '').replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
ex.textContent = (cur.ex || '').replace(esc ? new RegExp(esc, 'gi') : '', '___');

// After - already has guard, but add to answer reveal too
```

**Change** (line 461):
```javascript
// Before
ex.innerHTML = esc ? (cur.ex || '').replace(...) : (cur.ex || '');

// This is already correct, just verify the guard is consistent
```

---

### Fix 7: Stats Visibility

**Change** (line 20):
```css
/* Before */
.stats { ... opacity: 0.3; ... }

/* After */
.stats { ... opacity: 0.5; ... }
```

---

### Fix 8: Session Count Logic

**Change** in `next()` - only increment sessionCount when actually picking a new card:

The current logic increments before showing, which is correct for fresh picks.
But on restore, we load sessionCount from storage then call next() which increments again.

**Fix**: Since we're removing curWord restoration, this fixes itself - every `next()` call is a fresh pick.

---

## Verification Checklist

- [ ] Page reload starts completely fresh session
- [ ] Export contains correct session date
- [ ] Image area displays without RTL issues
- [ ] Escape key closes all modals
- [ ] Empty word doesn't break the UI
- [ ] Stats row is more visible (50% vs 30%)
- [ ] Session counter is accurate

---

## Files Modified

- `index.html` - All fixes in single file
- `CLAUDE.md` - Update changelog
