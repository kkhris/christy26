export function resetScrollPosition(scrollRoot) {
  if (!scrollRoot) {
    return;
  }

  scrollRoot.scrollTo({
    top: 0,
    left: 0,
    behavior: "auto",
  });

  if (typeof window !== "undefined") {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: "auto",
    });
  }
}

export function smoothScrollWithinContainer(scrollRoot, targetTop, duration = 1180) {
  if (!scrollRoot || typeof window === "undefined") {
    return;
  }

  const startTop = scrollRoot.scrollTop;
  const distance = targetTop - startTop;

  if (Math.abs(distance) < 1) {
    scrollRoot.scrollTo({ top: targetTop, left: 0, behavior: "auto" });
    return;
  }

  const travel = Math.abs(distance);
  const minDuration = Math.round(duration * 0.3);
  const maxDuration = duration;
  const normalizedTravel = Math.min(travel / 800, 1);
  const resolvedDuration = Math.round(
    minDuration + (maxDuration - minDuration) * normalizedTravel,
  );
  const easeInOutSine = (t) => -(Math.cos(Math.PI * t) - 1) / 2;
  const startTime = window.performance.now();

  const step = (currentTime) => {
    const elapsed = currentTime - startTime;
    const progress = Math.min(elapsed / resolvedDuration, 1);
    const easedProgress = easeInOutSine(progress);

    scrollRoot.scrollTop = startTop + distance * easedProgress;

    if (progress < 1) {
      window.requestAnimationFrame(step);
    }
  };

  window.requestAnimationFrame(step);
}
