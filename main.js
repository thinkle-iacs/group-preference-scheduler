import { students, preferences, getStudentsByGender } from "./sampleData.js";
import { Interface } from "./interface.js";
import { makeNetworkChart } from "./networkDiagram.js";
import { scoreGroup } from "./analyze.js";

const i = new Interface();
console.log("Generated me some students: ", students);
console.log("hmm");
console.log(
  "Names: ",
  students.map((s) => s.name)
);
console.log("Generated preferences", preferences);
console.log("whaaa");

const s = {
  alice: { id: 1, name: "Alice", email: "Alice@" },
  bob: { id: 2, name: "Bob", email: "Bob@" },
  charlie: { id: 3, name: "Charlie", email: "Charlie@" },
  david: { id: 4, name: "David", email: "David@" },
  eve: { id: 5, name: "Eve", email: "eve@" },
  frank: { id: 6, name: "Frank", email: "frnak@" },
  grace: { id: 7, name: "Grace", email: "Grace@" },
  howard: { id: 8, name: "Howard", email: "Howard@" },
  moses: { id: 9, name: "Moses", email: "Moses@" },
};

let quickprefs = [
  {
    student: s.alice,
    keepWith: [s.bob, s.charlie, s.frank, s.moses],
    separateFrom: [],
  },
  {
    student: s.bob,
    keepWith: [s.alice, s.charlie, s.moses],
    separateFrom: [s.eve],
  },
  {
    student: s.charlie,
    keepWith: [s.alice, s.frank, s.bob, s.moses],
    separateFrom: [],
  },
  { student: s.david, keepWith: [s.frank], separateFrom: [s.moses] },
  {
    student: s.eve,
    keepWith: [s.grace, s.frank, s.moses],
    separateFrom: [s.howard, s.alice],
  },
  { student: s.grace, keepWith: [s.eve, s.bob, s.frank], separateFrom: [] },
  {
    student: s.frank,
    keepWith: [s.grace, s.eve, s.david, s.bob, s.charlie, s.alice],
    separateFrom: [],
  },
  { student: s.howard, keepWith: [s.grace, s.eve], separateFrom: [s.charlie] },
  { student: s.moses, keepWith: [s.alice, s.charlie, s.eve], separateFrom: [] },
];

let mutualGroups = findMutualGroups(preferences);
/* for (let g of mutualGroups) {
  i.writeText('Group of '+g.length);
  i.writeObject(g.map((s)=>s.email));
}
 */
function placeStudentsInBins(
  prefs,
  binSizes = [20, 20, 15, 10, 10, 10, 8, 8, 8, 5]
) {
  // Set up bins to place students in...
  let bins = [];
  for (let bs of binSizes) {
    bins.push({
      students: [],
      size: bs,
    });
  }
  let overflow = [];
  // Keep track of students who have been placed
  let placedStudents = [];

  // Find mutual friends and start by placing them
  let mutualGroups = findMutualGroups(prefs);
  // For each mutual friend group, put them in an empty bin if possible
  for (let g of mutualGroups) {
    if (g.some((s) => placedStudents.includes(s))) {
      console.log("Ignore group", g, "already contains placed student");
      continue;
    }
    let bin = getEmptyBin();
    if (bin) {
      for (let s of g) {
        if (bin.students.length < bin.size) {
          console.log("Place", s.email);
          bin.students.push(s);
          placedStudents.push(s);
        }
      }
    }
  }
  console.log("After group stage we have placed...", placedStudents.length);
  var prefsToPlace = prefs.filter((p) => !placedStudents.includes(p.student));
  do {
    // Now let's sort by the least-happy people with viable bins...    
    prefsToPlace.sort(
      (a,b)=>{     
        let viableA = findViableBins(a.student);
        let viableB = findViableBins(b.student);
        a.nviable = viableA.length;
        b.nviable = viableB.length;
        let result = viableA.length - viableB.length;
        if (result) {          
          return result;
        } else {
          let scoreA = findBestBin(a.student).score;
          let scoreB = findBestBin(b.student).score;
          a.bestScore = scoreA;
          b.bestScore = scoreB;
          return scoreA - scoreB;
        }
      }
    );
    console.log('Sorted prefs:',prefsToPlace);
    debugger;
    let toPlace = prefsToPlace.pop();
    let bin = findBestBin(toPlace.student).bin;
    if (bin) {
      bin.students.push(toPlace.student);
    } else {
      overflow.push(toPlace.student);
    }
  } while (prefsToPlace && prefsToPlace.length)


  /* for (let p of prefs) {
    let student = p.student;
    if (placedStudents.includes(student)) {
      continue;
    } else {
      // Otherwise...
      let bin = findBestBin(student).bin;
      if (bin) {
        bin.students.push(student);
      } else {
        overflow.push(student);
      }
    }
  } */

  return [...bins, { name: "OVERFLOW", students: overflow }];

  function findViableBins(student) {
    let studentPref = prefs.find((p) => p.student == student);
    let viableBins = bins.filter((b) => b.size > b.students.length);
    viableBins = viableBins.filter((b) => {
      for (let s of b.students) {
        if (studentPref.separateFrom.includes(s)) {
          return false;
        }
        let otherPref = prefs.find((p) => p.student == s);
        if (otherPref.separateFrom.includes(student)) {
          return false;
        }
      }
      return true;
    });
    return viableBins;
  }

  function findBestBin(student) {
    let studentPref = prefs.find((p) => p.student == student);
    let viableBins = findViableBins(student);
    let bestBin = null;
    let bestScore = -1;
    for (let b of viableBins) {
      let binScore = 0;
      for (let other of b.students) {
        let otherPref = prefs.find((p) => p.student == student);
        if (studentPref.keepWith.includes(other)) {
          //console.log('Should stay with =>',student,other)
          binScore += 4;
        }
        if (otherPref.keepWith.includes(student)) {
          //console.log("Should stay with <=", student, other);
          binScore += 3;
        }
      }
      if (binScore > bestScore) {
        bestBin = b;
        bestScore = binScore;
      }
    }    
    return {bin:bestBin,score:bestScore};
  }

  function getEmptyBin() {
    for (let b of bins) {
      if (b.students.length == 0) {
        return b;
      }
    }
  }
}

function getRandomItem(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

let byGender = getStudentsByGender(students);
console.log("byGender=", byGender);
const possibleCabinSizes = [15, 25, 20, 25, 20];
for (let gender in byGender) {
  i.writeText("*** GENDER = " + gender);
  let students = byGender[gender];
  // Generate our "cabins" to sort kids into
  let cabins = [];
  let totalInCabins = 0;
  while (totalInCabins < students.length) {
    let next = getRandomItem(possibleCabinSizes);
    totalInCabins += next;
    cabins.push(next);
  }
  let prefs = preferences.filter((p) => students.includes(p.student));

  let groups = placeStudentsInBins(prefs, cabins);
  console.log("Made groups", groups, "with prefs", prefs);
  for (let g of groups) {
    i.writeText(`Made bin with ${g.students.length} of target ${g.size}`);
    let svg = makeNetworkChart(g, preferences);
    console.log("Made SVG:", svg);
    i.append(svg);
    i.writeText("Group score:");
    let { aggregate, scores } = scoreGroup(g.students, prefs);
    i.writeObject(aggregate);
    i.writeText("Sad people scores:");
    i.writeObject(scores.filter((s) => s.score < 0));

    i.writeText("Group is:");
    i.writeObject({ size: g.size, students: g.students.map((s) => s.email) });
  }
  i.writeText("*** !!! ~~~ END ~~~ !!! ***");
}

function findMutualGroups(prefs) {
  let mutualGroups = [];
  for (let i = 0; i < prefs.length; i++) {
    const pref = prefs[i];
    let myGroups = [];
    for (const otherStudent of pref.keepWith) {
      let otherStudentPrefs = prefs.find((p) => p.student == otherStudent);
      if (prefs.indexOf(otherStudentPrefs) < i) {
        // Skip this if other comes before us -- we did it already!
        continue;
      }
      if (
        otherStudentPrefs &&
        otherStudentPrefs.keepWith.includes(pref.student)
      ) {
        // It's mutual! Push a pairing...
        myGroups.push([otherStudent, pref.student]);
        for (let otherGroup of myGroups.slice(0, myGroups.length - 1)) {
          let friendsWithAll = true;
          for (let member of otherGroup) {
            if (member != pref.student) {
              let memberPref = prefs.find((p) => p.student == member);
              if (
                !(
                  memberPref.keepWith.includes(otherStudent) &&
                  otherStudentPrefs.keepWith.includes(member)
                )
              ) {
                friendsWithAll = false;
              }
            }
          }
          if (friendsWithAll) {
            myGroups.push([...otherGroup, otherStudent]);
          }
        }
      }
    }
    mutualGroups = [...mutualGroups, ...myGroups];
  }
  mutualGroups.sort((a, b) => b.length - a.length);
  return mutualGroups;
}
