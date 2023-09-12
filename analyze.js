export function scoreGroup (group, preferences) {
  let scores = [];
  for (let student of group) {
    let scoreObject ={
      student : student.name,
      withSeparated : [],
      withRequested : [],
      score : 0,
    }
    scores.push(scoreObject);
    let prefs = preferences.find((p)=>p.student==student);
    for (let s of prefs.separateFrom) {
      if (group.includes(s)) {
        scoreObject.withSeparated.push(s.name);        
      }      
    }
    for (let s of prefs.keepWith) {
      if (group.includes(s)) {
        scoreObject.withRequested.push(s.name)
      }
    }
    scoreObject.score += 10 * scoreObject.withSeparated.length;
    if (scoreObject.withRequested.length) {
      // Use log -- we value a few friends, but each 
      // additional friend yields diminishing returns
      scoreObject.score += 5 + Math.log2(scoreObject.withRequested.length);
    } else {
      scoreObject.score -= 5;
    }    
  }
  let aggregate = {
    withSeparated : 0,
    withRequested : 0,
    score : 0,
  }
  for (let s of scores) {
    aggregate.withSeparated += s.withSeparated.length;
    aggregate.withRequested += s.withRequested.length;
    aggregate.score += s.score;
  }
  return {
    aggregate,
    scores
  }
}