export const newMatchCheck = (currentMatchNotifications, nextMatchNotifications) => (
  Object.keys(currentMatchNotifications).length !== 0 &&
  Object.keys(nextMatchNotifications).reduce((difference, gameMode) => (
    difference || (new Date(nextMatchNotifications[gameMode].latest_match.finished_at) > new Date(currentMatchNotifications[gameMode].latest_match.finished_at))
  ), false)
);

export const numNewMatches = matchNotifications => (
  Object.keys(matchNotifications).reduce((sum, gameMode) => (
    sum + matchNotifications[gameMode].new_matches.num
  ), 0)
);
