const MAX_QUESTIONS = 5;
const TIME_LIMIT = 10;
const POINTS_PER_QUESTION = 10;
const COUNTRY_DATA = {
  A: [
    "Afghanistan",
    "Afrique du Sud",
    "Albanie",
    "Algérie",
    "Allemagne",
    "Andorre",
    "Angola",
    "Antigua-et-Barbuda",
    "Arabie Saoudite",
    "Argentine",
    "Arménie",
    "Australie",
    "Autriche",
    "Azerbaïdjan",
    "Aux Fidji",
  ],
  B: [
    "Brésil",
    "Belgique",
    "Bangladesh",
    "Bolivie",
    "Bénin",
    "Bulgarie",
    "Burkina Faso",
    "Botswana",
    "Bahamas",
    "Bahreïn",
    "Barbade",
    "Biélorussie",
    "Birmanie",
    "Bosnie-Herzégovine",
    "Bhoutan",
    "Burundi",
  ],
  C: [
    "Canada",
    "Chine",
    "Colombie",
    "Cambodge",
    "Cameroun",
    "Chili",
    "Chypre",
    "Comores",
    "Congo",
    "Corée du Nord",
    "Corée du Sud",
    "Costa Rica",
    "Côte d'Ivoire",
    "Croatie",
    "Cuba",
    "Cap-Vert",
    "Centrafricaine",
  ],
  D: ["Danemark", "Djibouti", "Dominique"],
  E: [
    "Égypte",
    "Espagne",
    "Éthiopie",
    "Équateur",
    "Érythrée",
    "Estonie",
    "Émirats Arabes Unis",
  ],
  F: ["France", "Finlande", "Fidji"],
  G: [
    "Gabon",
    "Grèce",
    "Géorgie",
    "Ghana",
    "Guatemala",
    "Guinée",
    "Guyana",
    "Gambie",
    "Grenade",
    "Guinée-Bissau",
    "Guinée Équatoriale",
  ],
  H: ["Haïti", "Honduras", "Hongrie"],
  I: [
    "Inde",
    "Italie",
    "Iran",
    "Islande",
    "Indonésie",
    "Irak",
    "Irlande",
    "Israël",
  ],
  J: ["Japon", "Jordanie", "Jamaïque"],
  K: ["Kenya", "Koweït", "Kazakhstan", "Kirghizistan"],
  L: [
    "Liban",
    "Luxembourg",
    "Libye",
    "Laos",
    "Lesotho",
    "Lettonie",
    "Liberia",
    "Liechtenstein",
    "Lituanie",
  ],
  M: [
    "Maroc",
    "Mexique",
    "Madagascar",
    "Malaisie",
    "Mali",
    "Malte",
    "Maurice",
    "Malawi",
    "Maldives",
    "Moldavie",
    "Monaco",
    "Mongolie",
    "Monténégro",
    "Mozambique",
  ],
  N: [
    "Nigéria",
    "Norvège",
    "Népal",
    "Nouvelle-Zélande",
    "Niger",
    "Namibie",
    "Nicaragua",
  ],
  O: ["Oman", "Ouganda"],
  P: [
    "Pérou",
    "Pologne",
    "Portugal",
    "Pakistan",
    "Panama",
    "Philippines",
    "Palau",
    "Papouasie-Nouvelle-Guinée",
    "Paraguay",
    "Pays-Bas",
  ],
  Q: ["Qatar"],
  R: [
    "Russie",
    "Royaume-Uni",
    "Rwanda",
    "Roumanie",
    "République du Congo",
    "République Centrafricaine",
    "République Dominicaine",
    "République Tchèque",
  ],
  S: [
    "Sénégal",
    "Suède",
    "Suisse",
    "Syrie",
    "Soudan",
    "Somalie",
    "Serbie",
    "Salvador",
    "Sainte-Lucie",
    "Saint-Marin",
    "Sao Tomé-et-Principe",
    "Seychelles",
    "Slovaquie",
  ],
  T: [
    "Turquie",
    "Thaïlande",
    "Tunisie",
    "Tchad",
    "Tadjikistan",
    "Tanzanie",
    "Togo",
    "Trinité-et-Tobago",
  ],
  U: ["Ukraine", "Uruguay", "Ouzbékistan"],
  V: ["Vietnam", "Venezuela", "Vanuatu", "Vatican"],
  Y: ["Yémen"],
  Z: ["Zambie", "Zimbabwe"],
};

let score = 0;
let currentQuestionIndex = 0;
let questions = [];
let timerId = null;
let timeLeft = TIME_LIMIT;

const introSection = document.getElementById("intro-section");
const quizSection = document.getElementById("quiz-section");
const gameOverMessage = document.getElementById("game-over-message");
const timerDisplay = document.getElementById("timer");
const questionText = document.getElementById("question-text");
const answerInput = document.getElementById("answer-input");
const submitButton = document.getElementById("submit-button");
const scoreDisplay = document.getElementById("current-score");
const resultMessage = document.getElementById("result-message");
const quizProgress = document.getElementById("quiz-progress");

/**
 * Normalise une chaîne de caractères (supprime les accents, met en minuscules) pour la comparaison.
 * @param {string} str
 * @returns {string}
 */
function normalizeString(str) {
  return str
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}

function generateQuestions() {
  const availableLetters = Object.keys(COUNTRY_DATA);

  if (availableLetters.length < MAX_QUESTIONS) {
    console.error("Pas assez de lettres disponibles pour générer 5 questions.");
    return;
  }

  const shuffledLetters = availableLetters.sort(() => 0.5 - Math.random());
  const selectedLetters = shuffledLetters.slice(0, MAX_QUESTIONS);

  // Créer les objets questions
  questions = selectedLetters.map((letter) => ({
    letter: letter,
    question: `Nommez un pays (de la liste fournie) qui commence par la lettre : '${letter}'`,
  }));
}

function startTimer() {
  timeLeft = TIME_LIMIT;
  timerDisplay.textContent = timeLeft;
  submitButton.disabled = false;
  answerInput.disabled = false;
  answerInput.focus();

  timerId = setInterval(() => {
    timeLeft--;
    timerDisplay.textContent = timeLeft;
    timerDisplay.style.color =
      timeLeft <= 3 ? "var(--secondary-color)" : "var(--primary-color)";

    if (timeLeft <= 0) {
      clearInterval(timerId);
      handleEndOfTime();
    }
  }, 1000);
}

function displayQuestion() {
  if (currentQuestionIndex < MAX_QUESTIONS) {
    const currentQ = questions[currentQuestionIndex];
    questionText.textContent = currentQ.question;
    answerInput.value = "";
    resultMessage.textContent = "";
    updateProgress();
    startTimer();
  } else {
    endGame();
  }
}

function handleEndOfTime() {
  submitButton.disabled = true;
  answerInput.disabled = true;
  resultMessage.textContent = `Temps écoulé ! La réponse n'est pas comptée.`;
  resultMessage.style.color = "var(--secondary-color)";

  setTimeout(() => {
    currentQuestionIndex++;
    displayQuestion();
  }, 2000);
}

function checkAnswer() {
  clearInterval(timerId);
  submitButton.disabled = true;
  answerInput.disabled = true;

  const currentQ = questions[currentQuestionIndex];
  const userAnswer = normalizeString(answerInput.value.trim());
  const correctAnswers = COUNTRY_DATA[currentQ.letter].map(normalizeString);

  let isCorrect = false;
  let foundAnswer = "";

  if (userAnswer && correctAnswers.includes(userAnswer)) {
    isCorrect = true;
    const originalAnswers = COUNTRY_DATA[currentQ.letter];
    const correctIndex = correctAnswers.findIndex((a) => a === userAnswer);
    foundAnswer = originalAnswers[correctIndex];
  }

  if (isCorrect) {
    score += POINTS_PER_QUESTION;
    scoreDisplay.textContent = score;
    resultMessage.textContent = `Correct ! C'était bien '${foundAnswer}'. Vous gagnez ${POINTS_PER_QUESTION} points.`;
    resultMessage.style.color = "#059669";
  } else {
    const firstCorrect = COUNTRY_DATA[currentQ.letter][0];
    resultMessage.textContent = `Faux ! La bonne réponse était par exemple '${firstCorrect}'. Votre score reste inchangé.`;
    resultMessage.style.color = "var(--secondary-color)";
  }

  setTimeout(() => {
    currentQuestionIndex++;
    displayQuestion();
  }, 2000);
}

function updateProgress() {
  const percentage = (currentQuestionIndex / MAX_QUESTIONS) * 100;
  quizProgress.style.width = `${percentage}%`;
}

function startGame() {
  if (timerId) clearInterval(timerId);

  score = 0;
  currentQuestionIndex = 0;
  scoreDisplay.textContent = score;
  quizProgress.style.width = "0%";
  resultMessage.textContent = "";

  generateQuestions();

  introSection.style.display = "none";
  gameOverMessage.style.display = "none";
  quizSection.style.display = "block";

  displayQuestion();
}

function endGame() {
  if (timerId) clearInterval(timerId);
  quizSection.style.display = "none";
  gameOverMessage.style.display = "block";
  document.getElementById(
    "final-score"
  ).textContent = `Votre score final est de ${score}/${
    MAX_QUESTIONS * POINTS_PER_QUESTION
  }.`;
  updateProgress();
}

function resetGame() {
  if (timerId) clearInterval(timerId);
  introSection.style.display = "block";
  quizSection.style.display = "none";
  gameOverMessage.style.display = "none";
}

answerInput.addEventListener("keypress", function (event) {
  if (event.key === "Enter" && !submitButton.disabled) {
    checkAnswer();
  }
});

window.onload = resetGame;
