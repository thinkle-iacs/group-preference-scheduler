let firstsByGender = {
  m: [
    "Mohammed",
    "Bob",
    "Jamie",
    "George",
    "Ray",
    "Caden",
    "Aidan",
    "Zaden",
    "Sam",
    "Isaac",
    "Moses",
    "Shawn",
    "Fred",
    "Percy",
    "Neville",
    "Cooper",
    "Paco",
    "Mateo",
    "Cameron",
    "Eli",
    "Liam",
    "Jackson",
    "Noah",
    "William",
    "James",
    "Benjamin",
    "Lucas",
    "Henry",
    "Alexander",
    "Ethan",
    "Michael",
    "Daniel",
    "Matthew",
    "Joseph",
    "David",
    "Andrew",
    "Nicholas",
    "John",
    "Samuel",
  ],
  f: [
    "Alondra",
    "Marisol",
    "Luzdivina",
    "Shantelle",
    "Grace",
    "Lila",
    "Clara",
    "Ashley",
    "Samantha",
    "Alyssa",
    "Sophie",
    "Melissa",
    "Sarah",
    "Sara",
    "Frederica",
    "Paquita",
    "Flannery",
    "Emma",
    "Olivia",
    "Ava",
    "Charlotte",
    "Mia",
    "Emily",
    "Harper",
    "Evelyn",
    "Abigail",
    "Amelia",
    "Elizabeth",
    "Lily",
    "Chloe",
    "Ella",
    "Madison",
    "Grace",
    "Sophia",
    "Layla",
    "Zoe",
    "Nora",
    "Scarlett",
  ],
  nb: [
    "Teri",
    "Ryan",
    "Perry",
    "Taylor",
    "Hilary",
    "Sam",
    "Chase",
    "Pat",
    "Cloud",
    "Moon",
    "River",
    "Skyler",
    "Jordan",
    "Sage",
    "Phoenix",
    "Harley",
    "Bailey",
    "Dakota",
    "Reese",
    "Riley",
    "Avery",
    "Casey",
    "Taylor",
    "Jordan",
    "Alex",
    "Morgan",
    "Rory",
    "Dylan",
    "Charlie",
    "Quinn",
    "Peyton",
    "Cameron",
    "Finley",
    "Parker",
    "Avery",
    "Drew",
    "Blake",
  ],
};

let lasts = [
  "Kim",
  "Sok",
  "Ou",
  "Ngor",
  "Diop",
  "Sow",
  "Toure",
  "Jalloh",
  "Smith",
  "Johnson",
  "Williams",
  "Brown",
  "Silva",
  "Pereira",
  "Santos",
  "Oliveira",
  "Rodriguez",
  "Lopez",
  "Garcia",
  "Hernandez",
  "Chan",
  "Heng",
  "Mao",
  "Khun",
  "Keita",
  "Drame",
  "Kamara",
  "Balde",
  "Turner",
  "Wilson",
  "Jones",
  "Davis",
  "Costa",
  "Pereira",
  "Goncalves",
  "Santos",
  "Ramirez",
  "Torres",
  "Fernandez",
  "Gonzalez",
  "Smith",
  "Gbagbo",
  "Rodriguez",
  "Lopez",
  "Lengsavat",
  "Bui",
  "Ng",
  "Wright",
  "Perry",
  "Ryan",
  "Hartman",
  "Badajoz",
  "Chu",
  "Panagiatopolis",
  "Jones",
  "Ryan",
  "Anderson",
  "Cooper",
  "Goldstein",
  "Masterson",
];
let YOGs = [2030, 2029];
let advisors = [
  "Hinkle",
  "Orpen",
  "Uyaguari",
  "Lane",
  "Murry",
  "Pereyra",
  "Bresnahan",
  "Angelone",
  "Shmoogie",
  "Pisco",
  "Angelone",
  "Carter",
  "Flerp",
  "Shnorg",
  "Kimmel",
];

let genders = [
  "m",
  "f",
  "m",
  "f",
  "m",
  "f",
  "m",
  "f",
  "m",
  "f",
  "m",
  "f",
  "m",
  "f",
  "m",
  "f",
  "m",
  "f",
  "m",
  "f",
  "nb",
];

/**
* @type {
*    email : string;
*    id : number;
*    name : string;
*    yog : number;
* 
*    gender : 'm'|'f'|'nb';
* }[];
**/
export let students = [];

export let preferences = [];

function populateStudents(n = 200) {
  for (let i = 0; i < n; i++) {
    let last = lasts[i % lasts.length];
    let yog = YOGs[i % YOGs.length];
    let adv = advisors[i % advisors.length];
    let gender = genders[i % genders.length];
    let firsts = firstsByGender[gender];
    let first = firsts[i % firsts.length];
    let student = {
      email: `${first}.${last}@example.com`,
      id: i,
      name: `${first} ${last}`,
      yog,
      adv,
      gender,
    };
    students.push(student);
  }
}

export function getStudentsByGender(students) {
  let genderGroups = {};
  for (let s of students) {
    if (!genderGroups[s.gender]) {
      genderGroups[s.gender] = [s];
    } else {
      genderGroups[s.gender].push(s);
    }
  }
  return genderGroups;
}

function getRandomMember(lst, excluding) {
  lst = lst.filter((i) => excluding.indexOf(i) == -1);
  if (lst.length == 0) {
    console.log("Trouble with ", lst, excluding);
    throw new Error("getRandomMember for empty list");
  } else {
    let i = Math.floor(Math.random() * lst.length);
    return lst[i];
  }
}

function populatePreferences(keep = 6, separate = 2) {
  let byGender = getStudentsByGender(students);
  for (let gender in byGender) {
    let studentList = byGender[gender];
    for (let s of studentList) {
      let preference = {
        student: s,
        keepWith: [],
        separateFrom: [],
      };
      for (let i = 0; i < keep; i++) {
        preference.keepWith.push(
          getRandomMember(studentList, [s,...preference.keepWith])
        );
      }
      for (let i = 0; i < separate; i++) {
        preference.separateFrom.push(
          getRandomMember(studentList, [
            s,
            ...preference.keepWith,
            ...preference.separateFrom,
          ])
        );
      }
      preferences.push(preference);
    }
  }
}

populateStudents(200);
populatePreferences();