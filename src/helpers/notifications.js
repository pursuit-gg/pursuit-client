export const newMatchCheck = (currentMatchNotifications, nextMatchNotifications) => (
  Object.keys(currentMatchNotifications).length !== 0 &&
  Object.keys(nextMatchNotifications).reduce((difference, mode) => {
    if (!currentMatchNotifications[mode]) {
      if (nextMatchNotifications[mode].latest_match.finished_at) {
        return true;
      }
      return difference;
    }
    return difference || (new Date(nextMatchNotifications[mode].latest_match.finished_at) > new Date(currentMatchNotifications[mode].latest_match.finished_at));
  }, false)
);

export const numNewMatches = matchNotifications => (
  Object.keys(matchNotifications).reduce((sum, mode) => (
    sum + matchNotifications[mode].new_matches.num
  ), 0)
);
