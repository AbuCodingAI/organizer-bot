// Advanced Benchmark Questions for Grades 9-12 and College
// These grades reuse Grade 7-8 structure with additional subjects

// Grades 9-12 use Grade 7 as base, then add more subjects
for (let grade = 9; grade <= 12; grade++) {
    BENCHMARK_QUESTIONS[grade.toString()] = JSON.parse(JSON.stringify(BENCHMARK_QUESTIONS['7']));
}

// COLLEGE
BENCHMARK_QUESTIONS['C'] = {
    'Calculus': {
        'Section 1: Limits & Derivatives (Q1-5)': [
            { q: 'What is the derivative of x²?', options: ['x', '2x', '2', 'x²'], correct: 1 },
            { q: 'What is the limit of 1/x as x approaches infinity?', options: ['1', '0', 'infinity', 'undefined'], correct: 1 },
            { q: 'What is the integral of 2x?', options: ['x²', 'x² + C', '2', '2x + C'], correct: 1 },
            { q: 'What is the derivative of sin(x)?', options: ['cos(x)', '-cos(x)', 'sin(x)', 'tan(x)'], correct: 0 },
            { q: 'What is the second derivative of x³?', options: ['3x²', '6x', '3x', '9x²'], correct: 1 }
        ],
        'Section 2: Integration & Applications (Q6-10)': [
            { q: 'What is the integral of cos(x)?', options: ['sin(x) + C', '-sin(x) + C', 'cos(x) + C', 'tan(x) + C'], correct: 0 },
            { q: 'What is the derivative of e^x?', options: ['e^x', 'x*e^x', '1', 'e'], correct: 0 },
            { q: 'What is the limit of (x² - 1)/(x - 1) as x approaches 1?', options: ['0', '1', '2', 'undefined'], correct: 2 },
            { q: 'What is the derivative of ln(x)?', options: ['1/x', 'x', '1', 'ln(x)'], correct: 0 },
            { q: 'What is the integral of 1/x?', options: ['ln(x) + C', 'x + C', '1 + C', 'x²/2 + C'], correct: 0 }
        ]
    },
    'Statistics': {
        'Section 1: Probability & Distributions (Q1-5)': [
            { q: 'What is the mean of a normal distribution?', options: ['0', 'μ', '1', 'σ'], correct: 1 },
            { q: 'What is the standard deviation symbol?', options: ['μ', 'σ', 'π', 'λ'], correct: 1 },
            { q: 'What is the probability of rolling a 6 on a fair die?', options: ['1/6', '1/2', '1/3', '1/4'], correct: 0 },
            { q: 'What is the mode?', options: ['average', 'middle value', 'most frequent value', 'range'], correct: 2 },
            { q: 'What is the median of 1, 2, 3, 4, 5?', options: ['2', '3', '4', '2.5'], correct: 1 }
        ],
        'Section 2: Hypothesis Testing (Q6-10)': [
            { q: 'What is a p-value?', options: ['probability of error', 'probability of hypothesis', 'test statistic', 'confidence level'], correct: 0 },
            { q: 'What is a Type I error?', options: ['false positive', 'false negative', 'correct rejection', 'correct acceptance'], correct: 0 },
            { q: 'What is the z-score formula?', options: ['(x - μ)/σ', '(x + μ)/σ', 'x/σ', 'μ/σ'], correct: 0 },
            { q: 'What is a 95% confidence interval?', options: ['±1.96σ', '±2σ', '±3σ', '±1σ'], correct: 0 },
            { q: 'What is the correlation coefficient range?', options: ['-1 to 1', '0 to 1', '-∞ to ∞', '0 to 100'], correct: 0 }
        ]
    },
    'Data Structures': {
        'Section 1: Fundamentals (Q1-5)': [
            { q: 'What is the time complexity of binary search?', options: ['O(n)', 'O(log n)', 'O(n²)', 'O(1)'], correct: 1 },
            { q: 'What is a hash table?', options: ['array', 'linked list', 'key-value store', 'tree'], correct: 2 },
            { q: 'What is a stack?', options: ['FIFO', 'LIFO', 'random access', 'sorted'], correct: 1 },
            { q: 'What is a queue?', options: ['FIFO', 'LIFO', 'random access', 'sorted'], correct: 0 },
            { q: 'What is a linked list?', options: ['array', 'nodes with pointers', 'tree', 'graph'], correct: 1 }
        ],
        'Section 2: Advanced Structures (Q6-10)': [
            { q: 'What is a binary search tree?', options: ['balanced tree', 'sorted tree', 'left < parent < right', 'all of above'], correct: 3 },
            { q: 'What is a graph?', options: ['nodes and edges', 'tree structure', 'linear structure', 'circular structure'], correct: 0 },
            { q: 'What is a heap?', options: ['complete binary tree', 'sorted array', 'linked list', 'hash table'], correct: 0 },
            { q: 'What is a trie?', options: ['tree for strings', 'tree for numbers', 'tree for graphs', 'tree for sorting'], correct: 0 },
            { q: 'What is dynamic programming?', options: ['optimization technique', 'sorting algorithm', 'search algorithm', 'graph algorithm'], correct: 0 }
        ]
    },
    'Machine Learning': {
        'Section 1: Fundamentals (Q1-5)': [
            { q: 'What is supervised learning?', options: ['labeled data', 'unlabeled data', 'reinforcement', 'unsupervised'], correct: 0 },
            { q: 'What is a neural network?', options: ['brain model', 'computer network', 'biological network', 'social network'], correct: 0 },
            { q: 'What is overfitting?', options: ['too simple', 'too complex', 'just right', 'underfitting'], correct: 1 },
            { q: 'What is a loss function?', options: ['error measure', 'accuracy measure', 'precision measure', 'recall measure'], correct: 0 },
            { q: 'What is gradient descent?', options: ['optimization algorithm', 'sorting algorithm', 'search algorithm', 'clustering algorithm'], correct: 0 }
        ],
        'Section 2: Advanced Topics (Q6-10)': [
            { q: 'What is backpropagation?', options: ['training algorithm', 'testing algorithm', 'validation algorithm', 'prediction algorithm'], correct: 0 },
            { q: 'What is a convolutional neural network?', options: ['image processing', 'text processing', 'audio processing', 'video processing'], correct: 0 },
            { q: 'What is a recurrent neural network?', options: ['sequence processing', 'image processing', 'classification', 'regression'], correct: 0 },
            { q: 'What is transfer learning?', options: ['reuse model', 'train from scratch', 'ensemble method', 'cross validation'], correct: 0 },
            { q: 'What is a generative adversarial network?', options: ['two networks competing', 'one network', 'three networks', 'four networks'], correct: 0 }
        ]
    },
    'Organic Chemistry': {
        'Section 1: Structures & Reactions (Q1-5)': [
            { q: 'What is the hybridization of carbon in methane?', options: ['sp', 'sp²', 'sp³', 'sp³d'], correct: 2 },
            { q: 'What is the IUPAC name for CH₄?', options: ['methane', 'ethane', 'propane', 'butane'], correct: 0 },
            { q: 'What is an alkene?', options: ['single bond', 'double bond', 'triple bond', 'aromatic'], correct: 1 },
            { q: 'What is a functional group?', options: ['atom', 'group of atoms', 'molecule', 'element'], correct: 1 },
            { q: 'What is the general formula for alkanes?', options: ['CₙH₂ₙ', 'CₙH₂ₙ₊₂', 'CₙH₂ₙ₋₂', 'CₙHₙ'], correct: 1 }
        ],
        'Section 2: Mechanisms & Synthesis (Q6-10)': [
            { q: 'What is an SN2 reaction?', options: ['substitution', 'elimination', 'addition', 'rearrangement'], correct: 0 },
            { q: 'What is a carbocation?', options: ['negative carbon', 'positive carbon', 'neutral carbon', 'radical carbon'], correct: 1 },
            { q: 'What is Markovnikov\'s rule?', options: ['H adds to more substituted carbon', 'H adds to less substituted carbon', 'Br adds first', 'OH adds first'], correct: 0 },
            { q: 'What is an elimination reaction?', options: ['loss of atoms', 'gain of atoms', 'rearrangement', 'substitution'], correct: 0 },
            { q: 'What is a nucleophile?', options: ['electron donor', 'electron acceptor', 'radical', 'catalyst'], correct: 0 }
        ]
    },
    'Quantum Physics': {
        'Section 1: Quantum Mechanics (Q1-5)': [
            { q: 'What is Planck\'s constant?', options: ['6.626 × 10⁻³⁴ J·s', '3 × 10⁸ m/s', '9.8 m/s²', '1.6 × 10⁻¹⁹ C'], correct: 0 },
            { q: 'What is the Heisenberg Uncertainty Principle?', options: ['position and momentum', 'energy and time', 'both', 'neither'], correct: 2 },
            { q: 'What is a photon?', options: ['particle of light', 'wave of light', 'both', 'neither'], correct: 2 },
            { q: 'What is the Schrödinger equation?', options: ['wave function', 'energy equation', 'momentum equation', 'force equation'], correct: 0 },
            { q: 'What is quantum entanglement?', options: ['particles connected', 'particles separated', 'wave interference', 'particle decay'], correct: 0 }
        ],
        'Section 2: Atomic Structure (Q6-10)': [
            { q: 'What is an orbital?', options: ['electron path', 'probability region', 'energy level', 'shell'], correct: 1 },
            { q: 'What is the Pauli Exclusion Principle?', options: ['no two electrons same state', 'electrons repel', 'electrons attract', 'electrons orbit'], correct: 0 },
            { q: 'What is spin?', options: ['rotation', 'intrinsic property', 'orbital motion', 'energy'], correct: 1 },
            { q: 'What is the principal quantum number?', options: ['n', 'l', 'm', 's'], correct: 0 },
            { q: 'What is an electron shell?', options: ['orbital', 'energy level', 'subshell', 'nucleus'], correct: 1 }
        ]
    },
    'Philosophy': {
        'Section 1: Epistemology (Q1-5)': [
            { q: 'What is epistemology?', options: ['study of knowledge', 'study of being', 'study of values', 'study of logic'], correct: 0 },
            { q: 'What is the Gettier problem?', options: ['justified true belief', 'false belief', 'unjustified belief', 'no belief'], correct: 0 },
            { q: 'What is empiricism?', options: ['knowledge from experience', 'knowledge from reason', 'knowledge from intuition', 'knowledge from authority'], correct: 0 },
            { q: 'What is rationalism?', options: ['knowledge from reason', 'knowledge from experience', 'knowledge from intuition', 'knowledge from authority'], correct: 0 },
            { q: 'What is skepticism?', options: ['doubt knowledge', 'accept knowledge', 'reject knowledge', 'ignore knowledge'], correct: 0 }
        ],
        'Section 2: Ethics (Q6-10)': [
            { q: 'What is utilitarianism?', options: ['maximize happiness', 'follow rules', 'virtue ethics', 'deontology'], correct: 0 },
            { q: 'What is deontology?', options: ['maximize happiness', 'follow rules', 'virtue ethics', 'consequentialism'], correct: 1 },
            { q: 'What is virtue ethics?', options: ['maximize happiness', 'follow rules', 'develop virtues', 'consequences'], correct: 2 },
            { q: 'What is Kant\'s categorical imperative?', options: ['universal law', 'happiness', 'virtue', 'consequences'], correct: 0 },
            { q: 'What is the golden rule?', options: ['treat others as you wish', 'maximize happiness', 'follow rules', 'develop virtues'], correct: 0 }
        ]
    },
    'Literature': {
        'Section 1: Literary Theory (Q1-5)': [
            { q: 'What is formalism?', options: ['form and structure', 'author\'s life', 'historical context', 'reader response'], correct: 0 },
            { q: 'What is New Historicism?', options: ['form and structure', 'author\'s life', 'historical context', 'reader response'], correct: 2 },
            { q: 'What is deconstruction?', options: ['form and structure', 'author\'s life', 'meaning is unstable', 'reader response'], correct: 2 },
            { q: 'What is Marxist criticism?', options: ['form and structure', 'class and power', 'historical context', 'reader response'], correct: 1 },
            { q: 'What is feminist criticism?', options: ['form and structure', 'gender and power', 'historical context', 'reader response'], correct: 1 }
        ],
        'Section 2: Postmodern Theory (Q6-10)': [
            { q: 'What is postmodernism?', options: ['rejection of grand narratives', 'acceptance of grand narratives', 'modernism', 'realism'], correct: 0 },
            { q: 'What is intertextuality?', options: ['text references', 'author\'s life', 'historical context', 'reader response'], correct: 0 },
            { q: 'What is the death of the author?', options: ['author is dead', 'reader creates meaning', 'text is independent', 'all of above'], correct: 3 },
            { q: 'What is hyperreality?', options: ['more real than real', 'simulation', 'virtual reality', 'all of above'], correct: 3 },
            { q: 'What is pastiche?', options: ['imitation', 'parody', 'homage', 'all of above'], correct: 3 }
        ]
    },
    'Linguistics': {
        'Section 1: Language Structure (Q1-5)': [
            { q: 'What is phonology?', options: ['sound system', 'word formation', 'sentence structure', 'meaning'], correct: 0 },
            { q: 'What is morphology?', options: ['sound system', 'word formation', 'sentence structure', 'meaning'], correct: 1 },
            { q: 'What is syntax?', options: ['sound system', 'word formation', 'sentence structure', 'meaning'], correct: 2 },
            { q: 'What is semantics?', options: ['sound system', 'word formation', 'sentence structure', 'meaning'], correct: 3 },
            { q: 'What is pragmatics?', options: ['sound system', 'context of use', 'sentence structure', 'word formation'], correct: 1 }
        ],
        'Section 2: Language Acquisition (Q6-10)': [
            { q: 'What is the critical period hypothesis?', options: ['age for language learning', 'vocabulary size', 'grammar rules', 'pronunciation'], correct: 0 },
            { q: 'What is universal grammar?', options: ['all languages same', 'innate language ability', 'learned language', 'cultural language'], correct: 1 },
            { q: 'What is code-switching?', options: ['changing languages', 'changing dialects', 'changing registers', 'all of above'], correct: 3 },
            { q: 'What is linguistic relativity?', options: ['language affects thought', 'thought affects language', 'independent', 'no relationship'], correct: 0 },
            { q: 'What is a pidgin?', options: ['simplified language', 'native language', 'formal language', 'technical language'], correct: 0 }
        ]
    }
};
