// Benchmark Questions - Organized by Grade Level with Sections
// Each grade has subjects, each subject has sections (Section 1, 2, 3, etc.)

const BENCHMARK_QUESTIONS = {
    // KINDERGARTEN
    'K': {
        'Math': {
            'Section 1: Basic Counting (Q1-5)': [
                { q: 'What is 2 + 2?', options: ['3', '4', '5', '6'], correct: 1 },
                { q: 'How many fingers do you have?', options: ['8', '9', '10', '11'], correct: 2 },
                { q: 'What comes after 5?', options: ['4', '5', '6', '7'], correct: 2 },
                { q: 'What is 1 + 1?', options: ['1', '2', '3', '4'], correct: 1 },
                { q: 'How many legs does a dog have?', options: ['2', '3', '4', '5'], correct: 2 }
            ],
            'Section 2: Number Recognition (Q6-10)': [
                { q: 'What is 3 + 1?', options: ['2', '3', '4', '5'], correct: 2 },
                { q: 'What comes before 3?', options: ['1', '2', '4', '5'], correct: 1 },
                { q: 'How many wheels does a bicycle have?', options: ['1', '2', '3', '4'], correct: 1 },
                { q: 'What is 2 + 1?', options: ['1', '2', '3', '4'], correct: 2 },
                { q: 'How many eyes do you have?', options: ['1', '2', '3', '4'], correct: 1 }
            ]
        },
        'English': {
            'Section 1: Alphabet & Sounds (Q1-5)': [
                { q: 'Which is a vowel?', options: ['b', 'c', 'a', 'd'], correct: 2 },
                { q: 'What sound does a dog make?', options: ['meow', 'woof', 'moo', 'quack'], correct: 1 },
                { q: 'Which word rhymes with "cat"?', options: ['dog', 'bat', 'fish', 'bird'], correct: 1 },
                { q: 'What is the first letter of the alphabet?', options: ['B', 'A', 'C', 'D'], correct: 1 },
                { q: 'Which is a color?', options: ['run', 'blue', 'jump', 'sit'], correct: 1 }
            ],
            'Section 2: Words & Rhymes (Q6-10)': [
                { q: 'What sound does a cow make?', options: ['woof', 'moo', 'quack', 'roar'], correct: 1 },
                { q: 'Which word rhymes with "sun"?', options: ['moon', 'fun', 'star', 'day'], correct: 1 },
                { q: 'What is the last letter of the alphabet?', options: ['X', 'Y', 'Z', 'W'], correct: 2 },
                { q: 'Which is a fruit?', options: ['carrot', 'apple', 'lettuce', 'potato'], correct: 1 },
                { q: 'What sound does a cat make?', options: ['woof', 'meow', 'moo', 'quack'], correct: 1 }
            ]
        },
        'Science': {
            'Section 1: Living Things (Q1-5)': [
                { q: 'What do plants need to grow?', options: ['water', 'sand', 'rocks', 'plastic'], correct: 0 },
                { q: 'Which animal is a mammal?', options: ['fish', 'bird', 'dog', 'frog'], correct: 2 },
                { q: 'What is the opposite of hot?', options: ['warm', 'cold', 'cool', 'freezing'], correct: 1 },
                { q: 'How many seasons are there?', options: ['2', '3', '4', '5'], correct: 2 },
                { q: 'What do we breathe?', options: ['water', 'air', 'soil', 'sand'], correct: 1 }
            ],
            'Section 2: Nature & Environment (Q6-10)': [
                { q: 'Which is a vegetable?', options: ['apple', 'carrot', 'banana', 'orange'], correct: 1 },
                { q: 'What is the sun?', options: ['a planet', 'a star', 'a moon', 'a comet'], correct: 1 },
                { q: 'Which animal lays eggs?', options: ['dog', 'cat', 'chicken', 'cow'], correct: 2 },
                { q: 'What do fish live in?', options: ['trees', 'water', 'soil', 'air'], correct: 1 },
                { q: 'Which is a body of water?', options: ['mountain', 'ocean', 'forest', 'desert'], correct: 1 }
            ]
        },
        'Abacus': {
            'Section 1: Basic Addition (Q1-5)': [
                { q: 'What is 1 + 2?', options: ['2', '3', '4', '5'], correct: 1 },
                { q: 'What is 3 + 2?', options: ['4', '5', '6', '7'], correct: 1 },
                { q: 'What is 4 + 1?', options: ['4', '5', '6', '7'], correct: 1 },
                { q: 'What is 2 + 3?', options: ['4', '5', '6', '7'], correct: 1 },
                { q: 'What is 5 - 1?', options: ['3', '4', '5', '6'], correct: 1 }
            ],
            'Section 2: Subtraction & Mixed (Q6-10)': [
                { q: 'What is 3 - 1?', options: ['1', '2', '3', '4'], correct: 1 },
                { q: 'What is 4 - 2?', options: ['1', '2', '3', '4'], correct: 1 },
                { q: 'What is 5 + 1?', options: ['5', '6', '7', '8'], correct: 1 },
                { q: 'What is 6 - 2?', options: ['3', '4', '5', '6'], correct: 1 },
                { q: 'What is 2 + 2 + 1?', options: ['4', '5', '6', '7'], correct: 1 }
            ]
        }
    }
};

// GRADES 1-5
BENCHMARK_QUESTIONS['1'] = {
    'Math': {
        'Section 1: Basic Operations (Q1-5)': [
            { q: 'What is 5 + 7?', options: ['10', '11', '12', '13'], correct: 2 },
            { q: 'What is 15 - 8?', options: ['5', '6', '7', '8'], correct: 2 },
            { q: 'What is 3 × 4?', options: ['10', '11', '12', '13'], correct: 2 },
            { q: 'What is 20 ÷ 5?', options: ['3', '4', '5', '6'], correct: 1 },
            { q: 'What is 25 + 15?', options: ['35', '40', '45', '50'], correct: 1 }
        ],
        'Section 2: Intermediate Calculations (Q6-10)': [
            { q: 'What is 50 - 23?', options: ['25', '26', '27', '28'], correct: 2 },
            { q: 'What is 6 × 7?', options: ['40', '41', '42', '43'], correct: 2 },
            { q: 'What is 100 ÷ 10?', options: ['8', '9', '10', '11'], correct: 2 },
            { q: 'What is 12 + 18?', options: ['28', '29', '30', '31'], correct: 2 },
            { q: 'What is 45 - 17?', options: ['26', '27', '28', '29'], correct: 2 }
        ]
    },
    'English': {
        'Section 1: Grammar Basics (Q1-5)': [
            { q: 'Which word is a verb?', options: ['happy', 'run', 'blue', 'table'], correct: 1 },
            { q: 'What is the plural of "cat"?', options: ['cates', 'cats', 'catz', 'cat'], correct: 1 },
            { q: 'Which sentence is correct?', options: ['He go to school', 'He goes to school', 'He going to school', 'He gone to school'], correct: 1 },
            { q: 'What is the past tense of "eat"?', options: ['eated', 'ate', 'eating', 'eats'], correct: 1 },
            { q: 'Which word is an adjective?', options: ['run', 'beautiful', 'jump', 'walk'], correct: 1 }
        ],
        'Section 2: Advanced Grammar (Q6-10)': [
            { q: 'What is the plural of "child"?', options: ['childs', 'childes', 'children', 'childrens'], correct: 2 },
            { q: 'Which is a noun?', options: ['quickly', 'happy', 'book', 'run'], correct: 2 },
            { q: 'What is the opposite of "big"?', options: ['large', 'small', 'huge', 'giant'], correct: 1 },
            { q: 'Which word rhymes with "light"?', options: ['left', 'night', 'day', 'dark'], correct: 1 },
            { q: 'What is the past tense of "go"?', options: ['goed', 'went', 'going', 'goes'], correct: 1 }
        ]
    },
    'Science': {
        'Section 1: Matter & Life (Q1-5)': [
            { q: 'What are the three states of matter?', options: ['hot, cold, warm', 'solid, liquid, gas', 'big, small, medium', 'hard, soft, rough'], correct: 1 },
            { q: 'Which planet is closest to the sun?', options: ['Venus', 'Mercury', 'Earth', 'Mars'], correct: 1 },
            { q: 'What is the process by which plants make food?', options: ['respiration', 'photosynthesis', 'digestion', 'fermentation'], correct: 1 },
            { q: 'How many bones does an adult human have?', options: ['186', '206', '226', '246'], correct: 1 },
            { q: 'What is the largest organ in the human body?', options: ['heart', 'brain', 'skin', 'liver'], correct: 2 }
        ],
        'Section 2: Energy & Environment (Q6-10)': [
            { q: 'Which gas do plants absorb?', options: ['oxygen', 'nitrogen', 'carbon dioxide', 'hydrogen'], correct: 2 },
            { q: 'What is the speed of light?', options: ['300,000 km/s', '150,000 km/s', '450,000 km/s', '600,000 km/s'], correct: 0 },
            { q: 'Which is a renewable energy source?', options: ['coal', 'oil', 'solar', 'natural gas'], correct: 2 },
            { q: 'What is the chemical formula for water?', options: ['H2O', 'CO2', 'O2', 'N2'], correct: 0 },
            { q: 'How many chambers does a human heart have?', options: ['2', '3', '4', '5'], correct: 2 }
        ]
    },
    'Abacus': {
        'Section 1: Multi-digit Operations (Q1-5)': [
            { q: 'What is 23 + 17?', options: ['38', '39', '40', '41'], correct: 2 },
            { q: 'What is 45 - 18?', options: ['25', '26', '27', '28'], correct: 2 },
            { q: 'What is 12 × 5?', options: ['55', '60', '65', '70'], correct: 1 },
            { q: 'What is 72 ÷ 8?', options: ['8', '9', '10', '11'], correct: 1 },
            { q: 'What is 34 + 26?', options: ['58', '59', '60', '61'], correct: 2 }
        ],
        'Section 2: Complex Calculations (Q6-10)': [
            { q: 'What is 100 - 37?', options: ['61', '62', '63', '64'], correct: 2 },
            { q: 'What is 15 × 4?', options: ['55', '60', '65', '70'], correct: 1 },
            { q: 'What is 96 ÷ 12?', options: ['6', '7', '8', '9'], correct: 2 },
            { q: 'What is 50 + 50?', options: ['99', '100', '101', '102'], correct: 1 },
            { q: 'What is 200 - 75?', options: ['120', '125', '130', '135'], correct: 1 }
        ]
    }
};

// Copy Grade 1 structure to Grades 2-5 (same subjects, same sections)
for (let grade = 2; grade <= 5; grade++) {
    BENCHMARK_QUESTIONS[grade.toString()] = JSON.parse(JSON.stringify(BENCHMARK_QUESTIONS['1']));
}

// GRADE 6
BENCHMARK_QUESTIONS['6'] = {
    'Math': {
        'Section 1: Arithmetic & Percentages (Q1-5)': [
            { q: 'What is 45 + 67?', options: ['110', '111', '112', '113'], correct: 2 },
            { q: 'What is 150 - 85?', options: ['60', '65', '70', '75'], correct: 1 },
            { q: 'What is 23 × 6?', options: ['135', '136', '137', '138'], correct: 2 },
            { q: 'What is 144 ÷ 12?', options: ['10', '11', '12', '13'], correct: 2 },
            { q: 'What is 25% of 80?', options: ['15', '20', '25', '30'], correct: 1 }
        ],
        'Section 2: Geometry & Exponents (Q6-10)': [
            { q: 'What is the area of a square with side 5?', options: ['20', '25', '30', '35'], correct: 1 },
            { q: 'What is 2³?', options: ['6', '8', '10', '12'], correct: 1 },
            { q: 'What is the perimeter of a rectangle 4×6?', options: ['18', '20', '22', '24'], correct: 2 },
            { q: 'What is 3/4 + 1/4?', options: ['1/2', '3/4', '1', '5/4'], correct: 2 },
            { q: 'What is 0.5 × 20?', options: ['8', '9', '10', '11'], correct: 2 }
        ]
    },
    'English': {
        'Section 1: Literary Devices (Q1-5)': [
            { q: 'What is a metaphor?', options: ['a comparison using like/as', 'a direct comparison', 'a repeated sound', 'a question'], correct: 1 },
            { q: 'Which is a compound sentence?', options: ['The cat sat.', 'The cat sat and the dog ran.', 'The cat sat on the mat.', 'The cat, which was black, sat.'], correct: 1 },
            { q: 'What is the subject of "The dog barked loudly"?', options: ['dog', 'barked', 'loudly', 'the'], correct: 0 },
            { q: 'Which word is an adverb?', options: ['happy', 'quickly', 'blue', 'run'], correct: 1 },
            { q: 'What is the past participle of "write"?', options: ['wrote', 'writing', 'written', 'writes'], correct: 2 }
        ],
        'Section 2: Sentence Structure (Q6-10)': [
            { q: 'Which is a complex sentence?', options: ['I like cats.', 'I like cats and dogs.', 'I like cats because they are cute.', 'I like cats very much.'], correct: 2 },
            { q: 'What is an antonym?', options: ['a word with same meaning', 'a word with opposite meaning', 'a word that sounds same', 'a word that rhymes'], correct: 1 },
            { q: 'Which is a simile?', options: ['The world is a stage', 'As brave as a lion', 'The sun smiled', 'Time flies'], correct: 1 },
            { q: 'What is the predicate of "She runs fast"?', options: ['She', 'runs', 'runs fast', 'fast'], correct: 2 },
            { q: 'Which word is a preposition?', options: ['quickly', 'beautiful', 'under', 'run'], correct: 2 }
        ]
    },
    'Science': {
        'Section 1: Earth & Space (Q1-5)': [
            { q: 'What is the process of water changing to vapor?', options: ['condensation', 'evaporation', 'precipitation', 'sublimation'], correct: 1 },
            { q: 'Which is a non-renewable resource?', options: ['solar', 'wind', 'coal', 'hydro'], correct: 2 },
            { q: 'What is the SI unit of force?', options: ['Joule', 'Newton', 'Watt', 'Pascal'], correct: 1 },
            { q: 'How many chromosomes do humans have?', options: ['23', '46', '48', '50'], correct: 1 },
            { q: 'What is the process by which organisms adapt?', options: ['mutation', 'evolution', 'adaptation', 'natural selection'], correct: 3 }
        ],
        'Section 2: Biology & Chemistry (Q6-10)': [
            { q: 'Which is a vertebrate?', options: ['spider', 'insect', 'fish', 'worm'], correct: 2 },
            { q: 'What is the pH of neutral water?', options: ['5', '6', '7', '8'], correct: 2 },
            { q: 'Which planet has the most moons?', options: ['Saturn', 'Jupiter', 'Uranus', 'Neptune'], correct: 1 },
            { q: 'What is the basic unit of life?', options: ['atom', 'molecule', 'cell', 'tissue'], correct: 2 },
            { q: 'Which is a fossil fuel?', options: ['uranium', 'oil', 'solar', 'wind'], correct: 1 }
        ]
    },
    'General Knowledge': {
        'Section 1: Geography & History (Q1-5)': [
            { q: 'What is the capital of France?', options: ['Lyon', 'Paris', 'Marseille', 'Nice'], correct: 1 },
            { q: 'Which is the largest continent?', options: ['Africa', 'Europe', 'Asia', 'North America'], correct: 2 },
            { q: 'Who wrote "Romeo and Juliet"?', options: ['Jane Austen', 'William Shakespeare', 'Charles Dickens', 'Mark Twain'], correct: 1 },
            { q: 'What is the smallest country in the world?', options: ['Monaco', 'Vatican City', 'Liechtenstein', 'San Marino'], correct: 1 },
            { q: 'How many continents are there?', options: ['5', '6', '7', '8'], correct: 2 }
        ],
        'Section 2: World Facts (Q6-10)': [
            { q: 'What is the capital of Japan?', options: ['Osaka', 'Tokyo', 'Kyoto', 'Hiroshima'], correct: 1 },
            { q: 'Which is the longest river in the world?', options: ['Amazon', 'Nile', 'Yangtze', 'Mississippi'], correct: 1 },
            { q: 'What year did World War II end?', options: ['1943', '1944', '1945', '1946'], correct: 2 },
            { q: 'How many sides does a hexagon have?', options: ['5', '6', '7', '8'], correct: 1 },
            { q: 'What is the capital of India?', options: ['Mumbai', 'New Delhi', 'Bangalore', 'Kolkata'], correct: 1 }
        ]
    },
    'Spanish': {
        'Section 1: Basic Vocabulary (Q1-5)': [
            { q: 'What does "hola" mean?', options: ['goodbye', 'hello', 'thank you', 'please'], correct: 1 },
            { q: 'What does "gracias" mean?', options: ['hello', 'goodbye', 'thank you', 'please'], correct: 2 },
            { q: 'What does "adiós" mean?', options: ['hello', 'goodbye', 'thank you', 'please'], correct: 1 },
            { q: 'What does "por favor" mean?', options: ['hello', 'goodbye', 'thank you', 'please'], correct: 3 },
            { q: 'What does "sí" mean?', options: ['no', 'yes', 'maybe', 'perhaps'], correct: 1 }
        ],
        'Section 2: Nouns & Adjectives (Q6-10)': [
            { q: 'What does "no" mean?', options: ['yes', 'no', 'maybe', 'perhaps'], correct: 1 },
            { q: 'What does "agua" mean?', options: ['fire', 'water', 'earth', 'air'], correct: 1 },
            { q: 'What does "fuego" mean?', options: ['fire', 'water', 'earth', 'air'], correct: 0 },
            { q: 'What does "gato" mean?', options: ['dog', 'cat', 'bird', 'fish'], correct: 1 },
            { q: 'What does "perro" mean?', options: ['dog', 'cat', 'bird', 'fish'], correct: 0 }
        ]
    }
};

// GRADES 7-8
BENCHMARK_QUESTIONS['7'] = {
    'Math': {
        'Section 1: Algebra & Geometry (Q1-5)': [
            { q: 'What is the value of x in 2x + 5 = 13?', options: ['2', '3', '4', '5'], correct: 2 },
            { q: 'What is the area of a triangle with base 6 and height 4?', options: ['10', '12', '14', '16'], correct: 1 },
            { q: 'What is 15% of 200?', options: ['20', '25', '30', '35'], correct: 2 },
            { q: 'What is the circumference of a circle with radius 5?', options: ['10π', '15π', '20π', '25π'], correct: 2 },
            { q: 'What is √144?', options: ['10', '11', '12', '13'], correct: 2 }
        ],
        'Section 2: Advanced Calculations (Q6-10)': [
            { q: 'What is 2⁴?', options: ['8', '16', '32', '64'], correct: 1 },
            { q: 'What is the slope of the line y = 2x + 3?', options: ['1', '2', '3', '4'], correct: 1 },
            { q: 'What is the mean of 5, 10, 15, 20?', options: ['10', '12.5', '15', '17.5'], correct: 1 },
            { q: 'What is 3/4 × 8/9?', options: ['1/3', '2/3', '1', '4/3'], correct: 1 },
            { q: 'What is the volume of a cube with side 3?', options: ['9', '18', '27', '36'], correct: 2 }
        ]
    },
    'English': {
        'Section 1: Literary Analysis (Q1-5)': [
            { q: 'What is the theme of a story?', options: ['the plot', 'the main idea', 'the setting', 'the characters'], correct: 1 },
            { q: 'Which is an example of alliteration?', options: ['The cat sat', 'Peter Piper picked', 'The dog ran', 'She is happy'], correct: 1 },
            { q: 'What is a protagonist?', options: ['the villain', 'the main character', 'the narrator', 'the setting'], correct: 1 },
            { q: 'Which is a type of figurative language?', options: ['literal', 'metaphor', 'factual', 'real'], correct: 1 },
            { q: 'What is the climax of a story?', options: ['the beginning', 'the turning point', 'the end', 'the middle'], correct: 1 }
        ],
        'Section 2: Grammar & Composition (Q6-10)': [
            { q: 'Which is a noun phrase?', options: ['run quickly', 'very happy', 'the blue car', 'jumped high'], correct: 2 },
            { q: 'What is an oxymoron?', options: ['a comparison', 'a contradiction', 'a repetition', 'a question'], correct: 1 },
            { q: 'Which is a dependent clause?', options: ['The cat sat', 'Because the cat sat', 'The cat is sitting', 'The cat will sit'], correct: 1 },
            { q: 'What is the tone of a text?', options: ['the plot', 'the author\'s attitude', 'the setting', 'the characters'], correct: 1 },
            { q: 'Which is a transition word?', options: ['cat', 'happy', 'however', 'run'], correct: 2 }
        ]
    },
    'Biology': {
        'Section 1: Cell Biology (Q1-5)': [
            { q: 'What is the powerhouse of the cell?', options: ['nucleus', 'mitochondria', 'ribosome', 'chloroplast'], correct: 1 },
            { q: 'What is the process of cell division?', options: ['photosynthesis', 'respiration', 'mitosis', 'fermentation'], correct: 2 },
            { q: 'Which is a prokaryote?', options: ['plant', 'animal', 'bacteria', 'fungus'], correct: 2 },
            { q: 'What is the basic unit of heredity?', options: ['chromosome', 'gene', 'DNA', 'protein'], correct: 1 },
            { q: 'How many chambers does a fish heart have?', options: ['2', '3', '4', '5'], correct: 0 }
        ],
        'Section 2: Genetics & Physiology (Q6-10)': [
            { q: 'What is the function of the ribosome?', options: ['energy production', 'protein synthesis', 'DNA storage', 'waste removal'], correct: 1 },
            { q: 'Which is a type of blood cell?', options: ['neuron', 'red blood cell', 'muscle cell', 'nerve cell'], correct: 1 },
            { q: 'What is photosynthesis?', options: ['breaking down food', 'making food from sunlight', 'moving around', 'reproducing'], correct: 1 },
            { q: 'How many pairs of chromosomes do humans have?', options: ['20', '23', '26', '30'], correct: 1 },
            { q: 'What is the function of the kidney?', options: ['pumping blood', 'filtering waste', 'digesting food', 'breathing'], correct: 1 }
        ]
    },
    'Chemistry': {
        'Section 1: Atomic Structure (Q1-5)': [
            { q: 'What is the atomic number of Carbon?', options: ['4', '6', '8', '12'], correct: 1 },
            { q: 'What is the chemical formula for salt?', options: ['NaCl', 'KCl', 'CaCl2', 'MgCl2'], correct: 0 },
            { q: 'What is the pH of an acid?', options: ['above 7', 'below 7', 'equal to 7', 'above 14'], correct: 1 },
            { q: 'What is an isotope?', options: ['same element, different neutrons', 'different elements', 'same atoms', 'different molecules'], correct: 0 },
            { q: 'What is the valence of Oxygen?', options: ['1', '2', '3', '4'], correct: 1 }
        ],
        'Section 2: Bonding & Reactions (Q6-10)': [
            { q: 'What is a covalent bond?', options: ['transfer of electrons', 'sharing of electrons', 'ionic attraction', 'metallic bonding'], correct: 1 },
            { q: 'What is the molar mass of H2O?', options: ['16', '18', '20', '22'], correct: 1 },
            { q: 'What is oxidation?', options: ['loss of electrons', 'gain of electrons', 'loss of protons', 'gain of protons'], correct: 0 },
            { q: 'What is a polymer?', options: ['single molecule', 'chain of molecules', 'gas', 'liquid'], correct: 1 },
            { q: 'What is the noble gas with atomic number 2?', options: ['Neon', 'Helium', 'Argon', 'Krypton'], correct: 1 }
        ]
    },
    'Physics': {
        'Section 1: Motion & Forces (Q1-5)': [
            { q: 'What is the SI unit of velocity?', options: ['m/s', 'km/h', 'mph', 'ft/s'], correct: 0 },
            { q: 'What is Newton\'s first law?', options: ['F=ma', 'objects in motion stay in motion', 'action-reaction', 'energy conservation'], correct: 1 },
            { q: 'What is the speed of light?', options: ['300,000 km/s', '150,000 km/s', '450,000 km/s', '600,000 km/s'], correct: 0 },
            { q: 'What is the SI unit of energy?', options: ['Watt', 'Joule', 'Newton', 'Pascal'], correct: 1 },
            { q: 'What is the acceleration due to gravity?', options: ['8.8 m/s²', '9.8 m/s²', '10.8 m/s²', '11.8 m/s²'], correct: 1 }
        ],
        'Section 2: Energy & Work (Q6-10)': [
            { q: 'What is the formula for kinetic energy?', options: ['mgh', '1/2 mv²', 'Fd', 'ma'], correct: 1 },
            { q: 'What is the SI unit of power?', options: ['Joule', 'Newton', 'Watt', 'Pascal'], correct: 2 },
            { q: 'What is the law of conservation of energy?', options: ['energy is created', 'energy is destroyed', 'energy is conserved', 'energy changes form'], correct: 2 },
            { q: 'What is the SI unit of pressure?', options: ['Newton', 'Joule', 'Pascal', 'Watt'], correct: 2 },
            { q: 'What is the formula for work?', options: ['mgh', 'Fd', '1/2 mv²', 'ma'], correct: 1 }
        ]
    },
    'General Knowledge': {
        'Section 1: Geography & Culture (Q1-5)': [
            { q: 'What is the capital of Germany?', options: ['Munich', 'Berlin', 'Hamburg', 'Cologne'], correct: 1 },
            { q: 'Who was the first President of the USA?', options: ['Thomas Jefferson', 'George Washington', 'John Adams', 'James Madison'], correct: 1 },
            { q: 'What is the largest ocean?', options: ['Atlantic', 'Indian', 'Arctic', 'Pacific'], correct: 3 },
            { q: 'How many countries are in the UN?', options: ['150', '185', '193', '210'], correct: 2 },
            { q: 'What is the capital of Brazil?', options: ['Rio de Janeiro', 'São Paulo', 'Brasília', 'Salvador'], correct: 2 }
        ],
        'Section 2: History & Arts (Q6-10)': [
            { q: 'Who painted the Mona Lisa?', options: ['Michelangelo', 'Leonardo da Vinci', 'Raphael', 'Donatello'], correct: 1 },
            { q: 'What is the highest mountain in the world?', options: ['K2', 'Kangchenjunga', 'Mount Everest', 'Lhotse'], correct: 2 },
            { q: 'What year did the Titanic sink?', options: ['1910', '1911', '1912', '1913'], correct: 2 },
            { q: 'How many strings does a violin have?', options: ['3', '4', '5', '6'], correct: 1 },
            { q: 'What is the capital of Australia?', options: ['Sydney', 'Melbourne', 'Canberra', 'Brisbane'], correct: 2 }
        ]
    },
    'Spanish': {
        'Section 1: Vocabulary (Q1-5)': [
            { q: 'What does "libro" mean?', options: ['pen', 'book', 'paper', 'desk'], correct: 1 },
            { q: 'What does "mesa" mean?', options: ['chair', 'table', 'door', 'window'], correct: 1 },
            { q: 'What does "estudiante" mean?', options: ['teacher', 'student', 'parent', 'principal'], correct: 1 },
            { q: 'What does "escuela" mean?', options: ['classroom', 'school', 'library', 'office'], correct: 1 },
            { q: 'What does "profesor" mean?', options: ['student', 'teacher', 'parent', 'principal'], correct: 1 }
        ],
        'Section 2: Adjectives & Verbs (Q6-10)': [
            { q: 'What does "rojo" mean?', options: ['blue', 'red', 'green', 'yellow'], correct: 1 },
            { q: 'What does "grande" mean?', options: ['small', 'big', 'medium', 'tiny'], correct: 1 },
            { q: 'What does "pequeño" mean?', options: ['big', 'small', 'medium', 'large'], correct: 1 },
            { q: 'What does "hermano" mean?', options: ['sister', 'brother', 'cousin', 'friend'], correct: 1 },
            { q: 'What does "hermana" mean?', options: ['brother', 'sister', 'cousin', 'friend'], correct: 1 }
        ]
    },
    'Python': {
        'Section 1: Basics (Q1-5)': [
            { q: 'What is the output of print(2 + 3)?', options: ['23', '5', '2+3', 'error'], correct: 1 },
            { q: 'What is the correct way to create a list?', options: ['list = (1, 2, 3)', 'list = [1, 2, 3]', 'list = {1, 2, 3}', 'list = 1, 2, 3'], correct: 1 },
            { q: 'What is the output of len("hello")?', options: ['4', '5', '6', 'error'], correct: 1 },
            { q: 'What is the correct way to create a dictionary?', options: ['dict = [1, 2, 3]', 'dict = {"a": 1}', 'dict = (1, 2, 3)', 'dict = 1, 2, 3'], correct: 1 },
            { q: 'What is the output of 10 % 3?', options: ['1', '2', '3', '4'], correct: 1 }
        ],
        'Section 2: Functions & Modules (Q6-10)': [
            { q: 'What is the correct way to define a function?', options: ['function myFunc():', 'def myFunc():', 'func myFunc():', 'define myFunc():'], correct: 1 },
            { q: 'What is the output of "hello".upper()?', options: ['hello', 'HELLO', 'Hello', 'hELLO'], correct: 1 },
            { q: 'What is the correct way to import a module?', options: ['include math', 'import math', 'use math', 'load math'], correct: 1 },
            { q: 'What is the output of [1, 2, 3][1]?', options: ['1', '2', '3', 'error'], correct: 1 },
            { q: 'What is the correct way to create a loop?', options: ['loop i in range(5):', 'for i in range(5):', 'while i in range(5):', 'do i in range(5):'], correct: 1 }
        ]
    },
    'JavaScript': {
        'Section 1: Basics (Q1-5)': [
            { q: 'What is the output of console.log(2 + "3")?', options: ['5', '"23"', '23', 'error'], correct: 2 },
            { q: 'What is the correct way to create an array?', options: ['array = (1, 2, 3)', 'array = [1, 2, 3]', 'array = {1, 2, 3}', 'array = 1, 2, 3'], correct: 1 },
            { q: 'What is the output of "hello".length?', options: ['4', '5', '6', 'error'], correct: 1 },
            { q: 'What is the correct way to create an object?', options: ['obj = [1, 2, 3]', 'obj = {a: 1}', 'obj = (1, 2, 3)', 'obj = 1, 2, 3'], correct: 1 },
            { q: 'What is the output of 10 % 3?', options: ['1', '2', '3', '4'], correct: 0 }
        ],
        'Section 2: Functions & DOM (Q6-10)': [
            { q: 'What is the correct way to define a function?', options: ['function myFunc() {}', 'def myFunc() {}', 'func myFunc() {}', 'define myFunc() {}'], correct: 0 },
            { q: 'What is the output of "hello".toUpperCase()?', options: ['hello', 'HELLO', 'Hello', 'hELLO'], correct: 1 },
            { q: 'What is the correct way to select an element?', options: ['document.select("id")', 'document.getElementById("id")', 'document.get("id")', 'document.find("id")'], correct: 1 },
            { q: 'What is the output of [1, 2, 3][1]?', options: ['1', '2', '3', 'error'], correct: 1 },
            { q: 'What is the correct way to create a loop?', options: ['loop (i = 0; i < 5; i++)', 'for (i = 0; i < 5; i++)', 'while (i = 0; i < 5; i++)', 'do (i = 0; i < 5; i++)'], correct: 1 }
        ]
    },
    'Finance': {
        'Section 1: Basics (Q1-5)': [
            { q: 'What is compound interest?', options: ['interest on principal only', 'interest on principal and interest', 'interest on interest only', 'no interest'], correct: 1 },
            { q: 'What is a stock?', options: ['a bond', 'ownership in a company', 'a loan', 'currency'], correct: 1 },
            { q: 'What is inflation?', options: ['decrease in prices', 'increase in prices', 'stable prices', 'no prices'], correct: 1 },
            { q: 'What is a budget?', options: ['a loan', 'a plan for spending money', 'a bank account', 'an investment'], correct: 1 },
            { q: 'What is a credit score?', options: ['a bank account number', 'a measure of creditworthiness', 'a loan amount', 'an investment return'], correct: 1 }
        ],
        'Section 2: Investments (Q6-10)': [
            { q: 'What is a dividend?', options: ['a loan payment', 'a share of company profits', 'a tax', 'an expense'], correct: 1 },
            { q: 'What is an asset?', options: ['a debt', 'something of value', 'an expense', 'a liability'], correct: 1 },
            { q: 'What is a liability?', options: ['an asset', 'a debt or obligation', 'an income', 'a profit'], correct: 1 },
            { q: 'What is ROI?', options: ['Return on Investment', 'Rate of Interest', 'Risk of Investment', 'Return on Income'], correct: 0 },
            { q: 'What is a mutual fund?', options: ['a bank account', 'a pool of investments', 'a loan', 'a stock'], correct: 1 }
        ]
    }
};

// Grade 8 = Grade 7 (same subjects and sections)
BENCHMARK_QUESTIONS['8'] = JSON.parse(JSON.stringify(BENCHMARK_QUESTIONS['7']));
