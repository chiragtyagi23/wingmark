const STORAGE = {
  land: 'wingsmark.land.listScrollY',
  plot: 'wingsmark.plot.listScrollY',
};

function keyForPath(pathname) {
  if (pathname === '/land') return 'land';
  if (pathname === '/plot') return 'plot';
  return null;
}

function save(which) {
  if (typeof window === 'undefined') return;
  try {
    sessionStorage.setItem(STORAGE[which], String(window.scrollY));
  } catch {
    /* private mode / quota */
  }
}

function peek(which) {
  try {
    const raw = sessionStorage.getItem(STORAGE[which]);
    if (raw == null) return null;
    const y = Number(raw);
    return Number.isFinite(y) && y >= 0 ? y : null;
  } catch {
    return null;
  }
}

function clear(which) {
  try {
    sessionStorage.removeItem(STORAGE[which]);
  } catch {
    /* ignore */
  }
}

/** Call when opening a listing card from the list page. */
export function saveLandListScroll() {
  save('land');
}

export function savePlotListScroll() {
  save('plot');
}

/** Read saved list scroll for a pathname (does not clear). */
export function peekListScrollRestore(pathname) {
  const which = keyForPath(pathname);
  return which ? peek(which) : null;
}

export function consumeListScrollRestore(pathname) {
  const which = keyForPath(pathname);
  if (!which) return null;
  const y = peek(which);
  if (y != null) clear(which);
  return y;
}

/** Back from a land listing detail — keeps scroll position in router state. */
export function navigateBackToLandList(navigate) {
  const landScrollY = peek('land');
  navigate('/land', {
    state: { restoreLandListScroll: true, landScrollY },
  });
}

/** Back from a plot listing detail. */
export function navigateBackToPlotList(navigate) {
  const plotScrollY = peek('plot');
  navigate('/plot', {
    state: { restorePlotListScroll: true, plotScrollY },
  });
}

/** Resolve scroll Y when landing on a list page (state wins, then sessionStorage). */
export function resolveListScrollRestore(pathname, locationState = {}) {
  if (pathname === '/land' && locationState?.restoreLandListScroll) {
    const fromState = locationState.landScrollY;
    if (fromState != null && Number.isFinite(Number(fromState))) {
      clear('land');
      return Number(fromState);
    }
    const y = consumeListScrollRestore('/land');
    if (y != null) return y;
  }
  if (pathname === '/plot' && locationState?.restorePlotListScroll) {
    const fromState = locationState.plotScrollY;
    if (fromState != null && Number.isFinite(Number(fromState))) {
      clear('plot');
      return Number(fromState);
    }
    const y = consumeListScrollRestore('/plot');
    if (y != null) return y;
  }
  return consumeListScrollRestore(pathname);
}
