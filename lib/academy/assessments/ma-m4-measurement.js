/**
 * ASSESSMENTS · MATHEMATICS · MONTH 4 · MODULE 2 · MEASUREMENT
 *
 * ═════════════════════════════════════════════════════════════════════════
 * SERVER ONLY. Never import this from anything under src/.
 * ═════════════════════════════════════════════════════════════════════════
 *
 * Three questions here are carrying the module.
 *
 * The 2 m² question, because converting a squared unit with the plain length
 * factor is something nearly everybody does once, and the distractor 200 is
 * exactly what that produces.
 *
 * The triangle question, because it offers the doubled answer AND the
 * slant-height answer as separate options. A candidate who forgets the half
 * picks one, and a candidate who does not know what perpendicular means picks
 * the other, and the two are different gaps needing different feedback.
 *
 * The cyclist question, because using minutes with a rate given per hour is
 * named in the examiners' reports every year, and the wrong answer it produces
 * describes a bicycle travelling at 0.4 km/h, which is the check that should
 * have caught it.
 */

export const ASSESSMENTS = {
  /* ═══════════════════════════════════════════════════════════════════ */
  "ma-l53-units": {
    lessonId: "ma-l53-units",
    passMark: 70,
    questions: [
      {
        id: "maq53-1",
        type: "mcq",
        difficulty: 2,
        atomId: "a-ma-ms-direction",
        prompt: "Convert 450 g to kilograms.",
        options: [
          { id: "a", text: "450,000 kg" },
          { id: "b", text: "0.45 kg" },
          { id: "c", text: "4.5 kg" },
          { id: "d", text: "45 kg" },
        ],
        correct: "b",
        explanation:
          "A kilogram is bigger than a gram, so there are fewer of them and the number must go down: 450 ÷ 1,000 = 0.45 kg. Sense check: 0.45 is smaller than 450.",
        whyWrong: {
          a: "This multiplies when it should divide. 450,000 kg is 450 tonnes, which is the mass of a small ship rather than a bag of sugar.",
          c: "Out by a factor of a hundred. There are 1,000 grams in a kilogram, not 100.",
          d: "Out by a factor of ten, which is a slip in the number of zeros rather than in the direction.",
        },
      },
      {
        id: "maq53-2",
        type: "scenario",
        difficulty: 4,
        atomId: "a-ma-ms-squared-units",
        prompt: "How many square centimetres are there in 2 m²?",
        options: [
          { id: "a", text: "200 cm²" },
          { id: "b", text: "20,000 cm²" },
          { id: "c", text: "2,000 cm²" },
          { id: "d", text: "400 cm²" },
        ],
        correct: "b",
        explanation:
          "One square metre is a square 100 cm on each side, so it holds 100 × 100 = 10,000 cm². Two of them is 20,000 cm². The factor is applied once for each dimension, because the square extends in two directions.",
        whyWrong: {
          a: "This uses the length factor of 100 once. A square metre is not a hundred square centimetres, it is ten thousand, and drawing the square makes that visible.",
          c: "This looks like the factor applied once and then a zero added. The squared unit needs the factor twice.",
          d: "This squares the 2 rather than the conversion factor. The 2 is a quantity of square metres, not a length.",
        },
      },
      {
        id: "maq53-3",
        type: "mcq",
        difficulty: 3,
        atomId: "a-ma-ms-metric",
        prompt: "Which of these is NOT equal to the others?",
        options: [
          { id: "a", text: "1 litre" },
          { id: "b", text: "1,000 ml" },
          { id: "c", text: "1,000 cm³" },
          { id: "d", text: "1,000 litres" },
        ],
        correct: "d",
        explanation:
          "A litre is 1,000 ml and also 1,000 cm³, so the first three are the same quantity. 1,000 litres is a thousand times larger, and it is called a kilolitre or a cubic metre.",
        whyWrong: {
          a: "A litre is the reference quantity here, equal to both of the next two.",
          b: "Milli means a thousandth, so 1,000 ml is one litre.",
          c: "A cube 10 cm on each side holds 1,000 cm³, and that volume is exactly one litre. It is worth remembering.",
        },
      },
      {
        id: "maq53-4",
        type: "scenario",
        difficulty: 3,
        atomId: "a-ma-ms-instruments",
        prompt:
          "A scale is labelled 0, 50 and 100, with five equal divisions between each pair of labels. What is one division worth?",
        options: [
          { id: "a", text: "1" },
          { id: "b", text: "10" },
          { id: "c", text: "5" },
          { id: "d", text: "50" },
        ],
        correct: "b",
        explanation:
          "The gap between labels is 50 and it is split into 5 divisions, so each division is 50 ÷ 5 = 10. Working out the value of one division before reading anything is the whole method.",
        whyWrong: {
          a: "Assuming the divisions are ones is the error this question exists to catch. Count them and divide the labelled gap.",
          c: "This reads the NUMBER of divisions as their value. Five divisions share a gap of 50.",
          d: "That is the whole gap between two labels, not one division within it.",
        },
      },
      {
        id: "maq53-5",
        type: "mcq",
        difficulty: 3,
        atomId: "a-ma-ms-compound-units",
        prompt:
          "A block of metal has a mass of 240 g and a volume of 30 cm³. What is its density?",
        options: [
          { id: "a", text: "8 g/cm³" },
          { id: "b", text: "7,200 g/cm³" },
          { id: "c", text: "0.125 g/cm³" },
          { id: "d", text: "270 g/cm³" },
        ],
        correct: "a",
        explanation:
          "Read the unit as the formula: g/cm³ is grams ÷ cubic centimetres, so 240 ÷ 30 = 8 g/cm³. The quantity named first goes on top, every time.",
        whyWrong: {
          b: "This multiplies. The slash in the unit is a division, which is what makes the unit worth writing down before you calculate.",
          c: "This divides the volume by the mass, giving cm³ per gram. That is a real quantity and it is not the one the unit describes.",
          d: "This adds the two numbers, combining a mass with a volume, which produces nothing meaningful.",
        },
      },
    ],
  },

  /* ═══════════════════════════════════════════════════════════════════ */
  "ma-l54-time": {
    lessonId: "ma-l54-time",
    passMark: 70,
    questions: [
      {
        id: "maq54-1",
        type: "mcq",
        difficulty: 2,
        atomId: "a-ma-ms-time-not-decimal",
        prompt: "How many minutes are there in 2.75 hours?",
        options: [
          { id: "a", text: "275 minutes" },
          { id: "b", text: "165 minutes" },
          { id: "c", text: "2 hours 75 minutes" },
          { id: "d", text: "155 minutes" },
        ],
        correct: "b",
        explanation:
          "The 0.75 is three quarters OF AN HOUR, so it is 45 minutes. Two hours is 120 minutes, and 120 + 45 = 165. Time does not carry in tens, which is why the decimal cannot be read straight off.",
        whyWrong: {
          a: "This treats the decimal as though hours were made of a hundred minutes. They are made of sixty.",
          c: "75 minutes is more than an hour, so this is not a finished answer. It is 3 hours 15 minutes, which is not 2.75 hours either.",
          d: "This looks like 0.75 read as 35 minutes, or an arithmetic slip in the addition.",
        },
      },
      {
        id: "maq54-2",
        type: "scenario",
        difficulty: 3,
        atomId: "a-ma-ms-elapsed",
        prompt: "How long is it from 09:45 to 14:20?",
        options: [
          { id: "a", text: "4 hours 75 minutes" },
          { id: "b", text: "4 hours 35 minutes" },
          { id: "c", text: "5 hours 25 minutes" },
          { id: "d", text: "4 hours 85 minutes" },
        ],
        correct: "b",
        explanation:
          "Count up: 09:45 to 10:00 is 15 minutes, 10:00 to 14:00 is 4 hours, and 14:00 to 14:20 is 20 minutes. Total 4 hours 35 minutes. Counting up needs no borrowing at 60.",
        whyWrong: {
          a: "This subtracts in columns and borrows 100 instead of 60. 75 minutes is more than an hour, so the answer is not in a finished form either way.",
          c: "This rounds up to 5 hours and then subtracts, which double counts part of the interval.",
          d: "Another borrow of 100 rather than 60, and again more than 60 minutes are left over.",
        },
      },
      {
        id: "maq54-3",
        type: "mcq",
        difficulty: 2,
        atomId: "a-ma-ms-24-hour",
        prompt: "What is 18:30 on the 12 hour clock?",
        options: [
          { id: "a", text: "8:30 pm" },
          { id: "b", text: "6:30 pm" },
          { id: "c", text: "6:30 am" },
          { id: "d", text: "8:30 am" },
        ],
        correct: "b",
        explanation:
          "Subtract 12 from an afternoon or evening hour: 18 − 12 = 6, so 18:30 is half past six in the evening.",
        whyWrong: {
          a: "This subtracts 10 instead of 12. The two clocks differ by twelve hours, not ten.",
          c: "6:30 am is 06:30 on the 24 hour clock. Anything from 13:00 onwards is afternoon or later.",
          d: "Both errors at once: the wrong subtraction and the wrong half of the day.",
        },
      },
      {
        id: "maq54-4",
        type: "scenario",
        difficulty: 4,
        atomId: "a-ma-ms-time-in-calculations",
        prompt:
          "A cyclist covers 18 km in 45 minutes. What is the average speed in km/h?",
        options: [
          { id: "a", text: "0.4 km/h" },
          { id: "b", text: "24 km/h" },
          { id: "c", text: "810 km/h" },
          { id: "d", text: "13.5 km/h" },
        ],
        correct: "b",
        explanation:
          "The unit km/h needs the time in hours, so convert first: 45 minutes is 45/60 = 0.75 hours. Then 18 ÷ 0.75 = 24 km/h, which is a plausible cycling speed.",
        whyWrong: {
          a: "This divides 18 by 45, using minutes with a rate given per hour. Nobody cycles at 0.4 km/h, which is the sense check that should have caught it.",
          c: "This multiplies instead of dividing. Speed is a distance per hour, and per is a division.",
          d: "This multiplies 18 by 0.75 rather than dividing. Fewer than sixty minutes means the hourly rate must be MORE than the distance covered.",
        },
      },
      {
        id: "maq54-5",
        type: "scenario",
        difficulty: 4,
        atomId: "a-ma-ms-timetables",
        prompt:
          "On a bus timetable, Bus A shows a dash at Maryland while Buses B and C show times. A passenger needs Maryland. What does the dash mean?",
        options: [
          { id: "a", text: "Bus A arrives but the time is unknown" },
          { id: "b", text: "Bus A does not stop at Maryland at all, so the passenger must take Bus B or C" },
          { id: "c", text: "Bus A arrives at the same time as Bus B" },
          { id: "d", text: "Maryland is closed when Bus A passes" },
        ],
        correct: "b",
        explanation:
          "A dash means that service does not serve that stop. The first bus to Maryland is therefore Bus B, not Bus A, and missing this is one of the two commonest timetable errors.",
        whyWrong: {
          a: "A timetable does not print unknown times. The dash is a statement that the stop is not served.",
          c: "Nothing on the timetable would say that, and each column is a separate journey.",
          d: "Timetables describe services rather than premises. The dash is about the bus's route.",
        },
      },
    ],
  },

  /* ═══════════════════════════════════════════════════════════════════ */
  "ma-l55-perimeter": {
    lessonId: "ma-l55-perimeter",
    passMark: 70,
    questions: [
      {
        id: "maq55-1",
        type: "mcq",
        difficulty: 2,
        atomId: "a-ma-ms-perimeter",
        prompt: "A rectangle is 7 cm by 4 cm. What is its perimeter?",
        options: [
          { id: "a", text: "28 cm" },
          { id: "b", text: "22 cm" },
          { id: "c", text: "11 cm" },
          { id: "d", text: "28 cm²" },
        ],
        correct: "b",
        explanation:
          "Add the four sides: 7 + 4 + 7 + 4 = 22 cm, or 2 × (7 + 4). Perimeter is a distance, so the unit is plain centimetres.",
        whyWrong: {
          a: "That is the AREA in value, found by multiplying. Perimeter adds the sides rather than multiplying them.",
          c: "This adds one length and one width. A rectangle has two of each.",
          d: "This is the area, and with the area's unit. A perimeter is never in squared units, because only lengths were added.",
        },
      },
      {
        id: "maq55-2",
        type: "scenario",
        difficulty: 4,
        atomId: "a-ma-ms-missing-sides",
        prompt:
          "An L-shape is made by cutting a 4 by 3 corner out of a 10 by 6 rectangle. What is its perimeter?",
        options: [
          { id: "a", text: "23 units" },
          { id: "b", text: "32 units" },
          { id: "c", text: "42 units" },
          { id: "d", text: "20 units" },
        ],
        correct: "b",
        explanation:
          "Cutting a rectangular corner out does not change the perimeter, because the two new edges are exactly as long as the two pieces they replaced. So it is 2 × (10 + 6) = 32. Working out the missing sides gives the same total.",
        whyWrong: {
          a: "This adds only the labelled sides and misses the two unlabelled ones. Count the sides of the shape and make sure you have a number for each.",
          c: "That is the AREA of the L-shape, 60 − 18. The question asked for the distance round the outside.",
          d: "This looks like the perimeter of the cut-out piece, 2 × (4 + 6), rather than of the L-shape.",
        },
      },
      {
        id: "maq55-3",
        type: "scenario",
        difficulty: 3,
        atomId: "a-ma-ms-perimeter-vs-area",
        prompt:
          "Three rectangles all have a perimeter of 20 cm: 9 by 1, 7 by 3 and 5 by 5. What does this show?",
        options: [
          { id: "a", text: "That all three have the same area" },
          {
            id: "b",
            text: "That perimeter does not determine area, and for a fixed perimeter the squarest rectangle has the largest area",
          },
          { id: "c", text: "That area is always half the perimeter" },
          { id: "d", text: "That only one of the three is a real rectangle" },
        ],
        correct: "b",
        explanation:
          "The areas are 9, 21 and 25 cm², so the same distance round gives very different spaces inside. It is also why a farmer fencing a field with a fixed length of wire makes it as square as possible.",
        whyWrong: {
          a: "The areas range from 9 to 25 cm², which is the whole point of the comparison.",
          c: "For the 5 by 5 the area is 25 and half the perimeter is 10. There is no such relationship.",
          d: "All three are perfectly ordinary rectangles. Being long and thin does not stop a shape being one.",
        },
      },
      {
        id: "maq55-4",
        type: "scenario",
        difficulty: 4,
        atomId: "a-ma-ms-perimeter-backwards",
        prompt:
          "A rectangle has a perimeter of 30 cm and a length of 9 cm. What is its width?",
        options: [
          { id: "a", text: "21 cm" },
          { id: "b", text: "6 cm" },
          { id: "c", text: "10.5 cm" },
          { id: "d", text: "3.33 cm" },
        ],
        correct: "b",
        explanation:
          "Half the perimeter is one length plus one width: 30 ÷ 2 = 15, then 15 − 9 = 6 cm. Check: 2 × (9 + 6) = 30.",
        whyWrong: {
          a: "This subtracts one length from the whole perimeter. There are TWO lengths of 9 cm in the perimeter, which halving first deals with automatically.",
          c: "This subtracts 9 from 30 and then halves. Halving must come first, because the 30 contains two of each side.",
          d: "This divides the perimeter by 9, which answers no question that was asked.",
        },
      },
      {
        id: "maq55-5",
        type: "mcq",
        difficulty: 3,
        atomId: "a-ma-ms-circles-preview",
        prompt:
          "Measuring round several circular objects and dividing by the distance across each one, you always get about 3.14. What does that tell you?",
        options: [
          { id: "a", text: "That the measurements were not accurate enough" },
          {
            id: "b",
            text: "That the ratio of the way round to the way across is the same for every circle, and that ratio is pi",
          },
          { id: "c", text: "That every circle has a circumference of 3.14" },
          { id: "d", text: "That the objects all happened to be the same size" },
        ],
        correct: "b",
        explanation:
          "Whatever the size, round divided by across gives the same number, about 3.142. That number is pi, which you met in Month 1 as a decimal that never ends. It is a genuinely surprising thing to be true of every circle there has ever been.",
        whyWrong: {
          a: "Getting the same answer from different objects is evidence that the measurements were good, not that they were poor.",
          c: "3.14 is the RATIO, not a length. The circumference depends on the size of the circle.",
          d: "They were different sizes, which is exactly what makes the constant ratio interesting.",
        },
      },
    ],
  },

  /* ═══════════════════════════════════════════════════════════════════ */
  "ma-l56-area": {
    lessonId: "ma-l56-area",
    passMark: 70,
    questions: [
      {
        id: "maq56-1",
        type: "mcq",
        difficulty: 2,
        atomId: "a-ma-ms-area-meaning",
        prompt: "Why is the area of a 5 cm by 3 cm rectangle written as 15 cm² rather than 15 cm?",
        options: [
          { id: "a", text: "Because 15 is a large number" },
          {
            id: "b",
            text: "Because two lengths in centimetres were multiplied, so the unit is cm × cm, and the answer counts squares one centimetre across",
          },
          { id: "c", text: "Because the shape has two dimensions labelled" },
          { id: "d", text: "Because all areas are written with a 2" },
        ],
        correct: "b",
        explanation:
          "The rectangle holds 15 squares of one centimetre each. The index counts how many lengths were multiplied together, which is why it is a check on the method as well as a unit.",
        whyWrong: {
          a: "The size of the number has nothing to do with the unit. An area of 2 cm² is still in cm².",
          c: "Close, and it is the multiplication that produces the index rather than the number of labels on the diagram. A perimeter also uses both dimensions and is in plain cm.",
          d: "True as a rule and it does not say why. Knowing the reason means the index becomes a check: three lengths multiplied gives cm³.",
        },
      },
      {
        id: "maq56-2",
        type: "scenario",
        difficulty: 4,
        atomId: "a-ma-ms-triangle",
        prompt:
          "A triangle has a base of 14 cm, a perpendicular height of 9 cm and a slanting side of 11 cm. What is its area?",
        options: [
          { id: "a", text: "126 cm²" },
          { id: "b", text: "63 cm²" },
          { id: "c", text: "77 cm²" },
          { id: "d", text: "34 cm" },
        ],
        correct: "b",
        explanation:
          "Half of 14 × 9 is half of 126, which is 63 cm². The 11 cm slant is not used, because the formula needs the height measured at right angles to the base.",
        whyWrong: {
          a: "The half has been forgotten, so this is the area of the whole rectangle boxing the triangle in. An answer exactly twice the right one is almost always this error.",
          c: "This uses the 11 cm slant as the height. The slant is longer than the perpendicular height, which is why the answer comes out a little too big, and the diagram offers it deliberately.",
          d: "That adds the three measurements, giving a perimeter-shaped answer in the wrong unit for an area.",
        },
      },
      {
        id: "maq56-3",
        type: "scenario",
        difficulty: 3,
        atomId: "a-ma-ms-parallelogram",
        prompt:
          "Why does the area of a parallelogram have no half in it, when a triangle's does?",
        options: [
          { id: "a", text: "Because a parallelogram has four sides and a triangle has three" },
          {
            id: "b",
            text: "Because cutting the triangle off one end of a parallelogram and sliding it to the other makes a whole rectangle, while a triangle is only half of its surrounding rectangle",
          },
          { id: "c", text: "Because parallelograms are always larger" },
          { id: "d", text: "There is a half; the formula is usually written wrongly" },
        ],
        correct: "b",
        explanation:
          "A parallelogram is a rectangle rearranged, so nothing was added or thrown away and its area is base × perpendicular height. A triangle really is half of the rectangle that boxes it in. The two pictures settle which formula has the half.",
        whyWrong: {
          a: "The number of sides is not what decides it. A trapezium also has four sides and its formula does contain a half.",
          c: "Size is irrelevant, and a parallelogram can be smaller than a triangle.",
          d: "The formula is base × perpendicular height with no half, and the cut-and-slide picture shows why.",
        },
      },
      {
        id: "maq56-4",
        type: "mcq",
        difficulty: 4,
        atomId: "a-ma-ms-trapezium",
        prompt:
          "A trapezium has parallel sides of 10 cm and 6 cm and a perpendicular height of 4 cm. What is its area?",
        options: [
          { id: "a", text: "64 cm²" },
          { id: "b", text: "32 cm²" },
          { id: "c", text: "240 cm²" },
          { id: "d", text: "40 cm²" },
        ],
        correct: "b",
        explanation:
          "Average the parallel sides: (10 + 6) ÷ 2 = 8, then multiply by the height: 8 × 4 = 32 cm². The answer must sit between 6 × 4 = 24 and 10 × 4 = 40, and it does.",
        whyWrong: {
          a: "The half has been forgotten, giving exactly double. Halving is what turns two different widths into one average width.",
          c: "This multiplies the parallel sides together. They are added and then halved, because the formula is averaging them.",
          d: "This uses only the longer parallel side, which gives a rectangle larger than the trapezium. It is also the upper limit the sense check provides.",
        },
      },
      {
        id: "maq56-5",
        type: "scenario",
        difficulty: 4,
        atomId: "a-ma-ms-compound-area",
        prompt:
          "A room 6 m by 5 m has a square pillar 1 m by 1 m in one corner. How much carpet is needed, and what happens to the skirting board needed round the walls?",
        options: [
          { id: "a", text: "30 m² of carpet, and the skirting is unchanged" },
          { id: "b", text: "29 m² of carpet, and the skirting round the walls is unchanged at 22 m" },
          { id: "c", text: "29 m² of carpet, and 2 m less skirting" },
          { id: "d", text: "31 m² of carpet, and 22 m of skirting" },
        ],
        correct: "b",
        explanation:
          "Carpet is an area: 30 − 1 = 29 m². The skirting runs round the walls of the room, 2 × (6 + 5) = 22 m, and a pillar standing in the corner does not shorten the walls. Area and perimeter answer different questions about the same room.",
        whyWrong: {
          a: "The pillar takes up floor, so the carpet needed is less than the full 30 m². The skirting part is right.",
          c: "The skirting follows the walls, which the pillar does not change. Its own sides would need separate edging if the question asked for that.",
          d: "The pillar reduces the carpet rather than increasing it, since the floor under it is not carpeted.",
        },
      },
    ],
  },
};

export default ASSESSMENTS;
