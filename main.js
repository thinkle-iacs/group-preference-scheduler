import {students,preferences} from './sampleData.js';
import { Interface } from './interface.js';
const i = new Interface();
console.log('Generated me some students: ',students);
console.log('hmm')
console.log('Names: ',students.map((s)=>s.name))
console.log('Generated preferences',preferences);
console.log('whaaa')

const s = {
  alice:{ id: 1, name: "Alice",  },
  bob:{ id: 2, name: "Bob", },
  charlie:{ id: 3, name: "Charlie", },
  david: { id: 4, name: "David",  },
  eve: { id: 5, name: "Eve", },
  frank : { id: 6, name: "Frank", },
  grace : { id: 7, name: "Grace",  },
  howard : {id: 8,name:'Howard'},
  moses : {id : 9, name : 'Moses'}
}

let quickprefs = [
  { student: s.alice, keepWith: [s.bob, s.charlie,s.frank,s.moses] },
  { student: s.bob, keepWith: [s.alice, s.charlie,s.moses] },
  { student: s.charlie, keepWith: [s.alice, s.frank,s.bob, s.moses] },
  { student : s.david, keepWith : [s.frank]},
  { student : s.eve, keepWith : [s.grace,s.frank,s.moses]},
  { student : s.grace, keepWith: [s.eve,s.bob,s.frank]},
  { student : s.frank, keepWith : [s.grace, s.eve, s.david,s.bob,s.charlie,s.alice]},
  { student : s.howard, keepWith : [s.grace, s.eve]},
  { student : s.moses, keepWith : [s.alice, s.charlie, s.eve]}

];

let mutualGroups = findMutualGroups(preferences);
/* for (let g of mutualGroups) {
  i.writeText('Group of '+g.length);
  i.writeObject(g.map((s)=>s.email));
}
 */
function placeStudentsInBins (prefs, binSizes=[20,20,15,10,10,10,8,8,8,5]) {
  // Set up bins to place students in...
  let bins = [];
  for (let bs of binSizes) {
    bins.push({
      students : [],
      size : bs
    });
  }
  let overflow = [];
  // Keep track of students who have been placed
  let placedStudents = [];

  // Find mutual friends and start by placing them
  let mutualGroups = findMutualGroups(prefs);
  // For each mutual friend group, put them in an empty bin if possible
  for (let g of mutualGroups) {
    if (g.find((s)=>placedStudents.includes(s))) {      
      continue;
    }
    let bin = getEmptyBin();        
    if (bin) {      
      for (let s of g) {
        if (bin.students.length < bin.size) {
          bin.students.push(s);
          placedStudents.push(s);
        }
      }
    }
  }

  for (let p of prefs) {
    let student = p.student;
    if (placedStudents.includes(s)) {
      continue;
    }
    // Otherwise...
    let bin = findBestBin(student);
    if (bin) {
      bin.students.push(student);
    } else {
      overflow.push(student)
    }
  }

  return [...bins,{name:'OVERFLOW',students:overflow}];

  function findBestBin (student) {    
    let studentPref = prefs.find((p)=>p.student==student);
    let viableBins = bins.filter((b)=>b.size > b.students.length);
    let bestBin = null;
    let bestScore = -1;
    for (let b of viableBins) {
      let binScore = 0;
      for (let other of b.students) {
        let otherPref = prefs.find((p)=>p.student==student);
        
        if (otherPref.separateFrom.includes(student)||studentPref.separateFrom.includes(other)) {
          // skip
          console.log('Must be kept apart!',student,other);
          binScore = -100000000000000;          
        }
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
    console.log('Best of ',viableBins.length,'with space for ',student,'is ',bestScore)
    return bestBin;
  }

  function getEmptyBin () {
    for (let b of bins) {
      if (b.students.length==0) {
        return b;
      }
    }
  }

}

let groups = placeStudentsInBins(preferences);
for (let g of groups) {
  i.writeText('Made bin with :',g.length);
  i.writeObject(
    {size:g.size,
    students:g.students.map((s)=>s.email)}
  );
}
i.writeText('Prefs were:')
i.writeObject(preferences)
console.log('Got groups',mutualGroups)

function findMutualGroups (prefs) {
  let mutualGroups = [];
  for (let i=0; i<prefs.length; i++) {
    const pref = prefs[i];
    let myGroups = [];
    for (const otherStudent of pref.keepWith) {      
      let otherStudentPrefs = prefs.find((p)=>p.student==otherStudent);
      if (prefs.indexOf(otherStudentPrefs) < i) {
        // Skip this if other comes before us -- we did it already!
        continue
      }
      if (otherStudentPrefs && otherStudentPrefs.keepWith.includes(pref.student)) {
        // It's mutual! Push a pairing...
        myGroups.push([otherStudent,pref.student])
        for (let otherGroup of myGroups.slice(0,myGroups.length-1)) {
          let friendsWithAll = true;
          for (let member of otherGroup) {
            if (member != pref.student) {
              let memberPref = prefs.find((p)=>p.student==member);
              if (!(memberPref.keepWith.includes(otherStudent) && otherStudentPrefs.keepWith.includes(member))) {
                friendsWithAll = false;
              }
            }
          }
          if (friendsWithAll) {
            myGroups.push([...otherGroup,otherStudent])
          }
        }        
      }      
    }
    mutualGroups = [...mutualGroups, ...myGroups];
  }
  mutualGroups.sort((a,b)=>b.length-a.length)
  return mutualGroups
}

