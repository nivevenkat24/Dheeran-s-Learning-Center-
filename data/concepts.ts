
import { LessonTopic } from '../types';

// Helper lists to multiply variations

// STRICTLY DISTINCT, NON-STACKING objects for accurate counting
// We avoid "Leaves" (clump), "Trees" (forest), "Blocks" (stack), etc.
const EASY_TO_COUNT_OBJECTS = [
  "Red Apples", "Green Pears", "Yellow Lemons", "Oranges", 
  "Bananas", "Strawberries", "Eggs", "Cupcakes",
  "Toy Cars", "Tennis Balls", "Soccer Balls", "Baseballs",
  "Spoons", "Forks", "Keys", "Coins", "Buttons",
  "Shoes", "Socks", "Rubber Ducks", "Teddy Bears",
  "Pencils", "Crayons", "Cookies", "Donuts"
];

const NATURAL_COLORS = [
  "Red", "Green", "Blue", "Yellow", "Brown", "White", "Black", "Orange", "Purple", "Pink"
];

// Expanded Staple fruits (20 items)
const REAL_FRUITS = [
  "Apple", "Banana", "Orange", "Pear", "Strawberry", "Blueberry", 
  "Grape", "Watermelon", "Lemon", "Peach", "Cherry", "Pineapple", 
  "Mango", "Coconut", "Kiwi", "Plum", "Avocado", "Melon", 
  "Raspberry", "Blackberry"
];

// Expanded Recognizable vegetables (20 items)
const REAL_VEGETABLES = [
  "Carrot", "Broccoli", "Cucumber", "Tomato", "Potato", "Corn", 
  "Onion", "Pumpkin", "Peas", "Pepper", "Lettuce", "Mushroom", 
  "Bean", "Spinach", "Celery", "Radish", "Eggplant", "Cabbage", 
  "Garlic", "Sweet Potato"
];

// Expanded Farm Animals (18 items)
const ANIMALS_FARM = [
  "Cow", "Pig", "Sheep", "Horse", "Chicken", "Duck", "Goat", 
  "Rabbit", "Cat", "Dog", "Donkey", "Turkey", "Goose", "Mouse", 
  "Pony", "Llama", "Rooster", "Hen"
];

// Expanded Wild Animals (30 items)
const ANIMALS_WILD = [
  "Lion", "Elephant", "Giraffe", "Zebra", "Monkey", "Bear", 
  "Hippo", "Tiger", "Turtle", "Frog", "Butterfly", "Fish", "Bird",
  "Deer", "Fox", "Wolf", "Panda", "Koala", "Kangaroo", "Gorilla",
  "Rhino", "Penguin", "Seal", "Camel", "Owl", "Squirrel", "Dolphin", 
  "Whale", "Polar Bear", "Cheetah"
];

// Expanded Household items (50 items)
const EVERYDAY_OBJECTS = [
  "Cup", "Plate", "Bowl", "Spoon", "Fork", "Chair", "Table", "Bed", 
  "Pillow", "Blanket", "Lamp", "Book", "Car", "Ball", "Doll", 
  "Block", "Shoe", "Sock", "Shirt", "Pants", "Hat", "Coat", 
  "Brush", "Soap", "Towel", "Door", "Window", "Flower", "Tree", 
  "Sun", "Moon", "Star", "Cloud", "Leaf", "Grass", "Rock", 
  "Stick", "Key", "Phone", "Clock", "Box", "Bag", "Bottle", 
  "Pencil", "Crayon", "Paper", "Basket", "Rug", "Teddy Bear", "Drum"
];

const SHAPES = [
  "Circle", "Square", "Triangle", "Star", "Heart", "Rectangle", "Oval"
];

// Generators designed to exceed 50-100 items per category

const generateNumberConcepts = () => {
  const list: string[] = [];
  // 1-20 * 25 objects = 500 items
  for (let i = 1; i <= 20; i++) {
    EASY_TO_COUNT_OBJECTS.forEach(obj => {
      // Prompt explicitly asks for arrangement to avoid stacking
      if (i > 10) {
          list.push(`Number ${i} shown with ${i} real ${obj} arranged in a neat grid`);
      } else {
          list.push(`Number ${i} shown with ${i} real ${obj} arranged in a line`);
      }
    });
  }
  return list;
};

const generateAlphabetConcepts = () => {
  const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  // Filtered to CONCRETE NOUNS only. No abstract words.
  const mapping: Record<string, string[]> = {
    A: ["Alligator", "Ant", "Apple", "Airplane", "Arrow"],
    B: ["Baby", "Ball", "Bird", "Blocks", "Book", "Bear", "Boat", "Bus", "Banana", "Balloon"],
    C: ["Car", "Cat", "Cow", "Cup", "Cookie", "Cake", "Clock", "Chair"],
    D: ["Dog", "Doll", "Duck", "Dad", "Door", "Drum", "Donut"],
    E: ["Ear", "Egg", "Elephant", "Eye", "Eagle"],
    F: ["Farm", "Fish", "Flower", "Food", "Fork", "Frog", "Fan"],
    G: ["Garden", "Giraffe", "Grape", "Grass", "Goat", "Gate", "Guitar"],
    H: ["Hair", "Hand", "Hat", "Head", "House", "Horse", "Heart", "Helicopter"],
    I: ["Ice Cream", "Igloo", "Island", "Insect", "Ice"],
    J: ["Jacket", "Jam", "Jar", "Juice", "Jeep", "Jellyfish"],
    K: ["Kangaroo", "Key", "Kite", "King", "Koala", "Kiwi"],
    L: ["Ladybug", "Lamb", "Lion", "Leaf", "Leg", "Lamp", "Lemon"],
    M: ["Mom", "Milk", "Moon", "Mouth", "Mouse", "Monkey", "Mushroom"],
    N: ["Nest", "Nose", "Net", "Necklace", "Nut"],
    O: ["Ocean", "Orange", "Owl", "Octopus", "Onion"],
    P: ["Paint", "Park", "Pig", "Pen", "Pan", "Pizza", "Pumpkin", "Pencil", "Pillow"],
    Q: ["Queen", "Quilt", "Question"],
    R: ["Rabbit", "Rain", "Ring", "Rose", "Robot", "Rainbow", "Rocket"],
    S: ["Sandwich", "School", "Sun", "Star", "Shoe", "Spoon", "Sock", "Soap", "Snake"],
    T: ["Tiger", "Tree", "Turtle", "Table", "Truck", "Train", "Tomato", "Tent"],
    U: ["Umbrella", "Unicorn", "Uniform"],
    V: ["Vase", "Violin", "Van", "Vegetable", "Vest"],
    W: ["Water", "Whale", "Watch", "Window", "Wheel", "Wagon"],
    X: ["X-ray", "Xylophone"],
    Y: ["Yarn", "Yo-yo", "Yellow", "Yogurt", "Yak"],
    Z: ["Zebra", "Zoo", "Zipper", "Zero"],
  };
  
  const list: string[] = [];
  for (const letter of alphabet) {
    const words = mapping[letter] || [];
    words.forEach(word => {
      // The prompt structure ensures Gemini converts this to "A for Apple" format
      list.push(`Letter ${letter} shown with a real ${word}`);
      list.push(`Letter ${letter} wooden block next to a real ${word}`);
    });
  }
  return list;
};

const generateColorConcepts = () => {
  const list: string[] = [];
  // 10 colors * 50 objects = 500 items
  NATURAL_COLORS.forEach(color => {
    EVERYDAY_OBJECTS.forEach(obj => {
      list.push(`A real ${color} ${obj}`);
    });
  });
  return list;
};

const generateShapeConcepts = () => {
  const list: string[] = [];
  
  // Generic shape prompts (7 shapes * 10 colors = 70 items)
  SHAPES.forEach(shape => {
    NATURAL_COLORS.forEach(color => {
      list.push(`A ${color} ${shape} shape`);
    });
  });

  // Real world object mappings to ensure realism
  const realWorldShapes: Record<string, string[]> = {
    "Circle": ["Plate", "Coin", "Clock", "Button", "Wheel", "Cookie", "Pizza"],
    "Square": ["Window", "Box", "Book", "Frame", "Table"],
    "Triangle": ["Slice of Pizza", "Roof", "Tent", "Sandwich half"],
    "Star": ["Starfish", "Star fruit", "Decoration"],
    "Heart": ["Cookie", "Leaf", "Balloon"],
    "Rectangle": ["Door", "Phone", "Envelope", "Rug", "Flag"],
    "Oval": ["Egg", "Mirror", "Rug", "Balloon"]
  };

  SHAPES.forEach(shape => {
    const examples = realWorldShapes[shape] || [];
    examples.forEach(ex => {
        list.push(`A real ${ex} shaped like a ${shape}`);
    });
  });

  return list;
};

const generateFoodConcepts = (baseList: string[]) => {
  const list: string[] = [];
  baseList.forEach(item => {
    // SINGLE ITEMS ONLY
    list.push(`A real ${item}`);         // Apple
    list.push(`A sliced ${item}`);       // Sliced Apple
    list.push(`A whole ${item}`);        // Whole Apple
  });
  return list;
};

const generateAnimalConcepts = (baseList: string[]) => {
    const list: string[] = [];
    baseList.forEach(animal => {
        // Simplified variations, focusing on the animal name. SINGLE ITEMS ONLY.
        list.push(`A real ${animal}`);       // "Cow"
        list.push(`A baby ${animal}`);       // "Cow" (Image is baby)
        list.push(`A cute ${animal}`);       // "Cow"
    });
    return list;
}

const generateObjectConcepts = (baseList: string[]) => {
    const list: string[] = [];
    baseList.forEach(obj => {
        list.push(`A real ${obj}`);
        list.push(`A colorful ${obj}`);
        list.push(`A wooden ${obj}`);
    });
    return list;
}

// Main Data Export
export const TOPIC_DATA: Record<LessonTopic, string[]> = {
  [LessonTopic.NUMBERS]: generateNumberConcepts(),
  [LessonTopic.ALPHABET]: generateAlphabetConcepts(),
  [LessonTopic.COLORS]: generateColorConcepts(),
  [LessonTopic.FRUITS]: generateFoodConcepts(REAL_FRUITS),
  [LessonTopic.VEGETABLES]: generateFoodConcepts(REAL_VEGETABLES),
  [LessonTopic.FARM_ANIMALS]: generateAnimalConcepts(ANIMALS_FARM),
  [LessonTopic.WILD_ANIMALS]: generateAnimalConcepts(ANIMALS_WILD),
  [LessonTopic.SHAPES]: generateShapeConcepts(),
  [LessonTopic.OBJECTS]: generateObjectConcepts(EVERYDAY_OBJECTS),
};
