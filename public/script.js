const questionElement = document.getElementById('question');
const choices = document.querySelectorAll('.choice');
const submitButton = document.getElementById('submit');
const resultElement = document.getElementById('result');
const scoreElement = document.getElementById('score');
const totalElement = document.getElementById('total');
const restartButton = document.getElementById('restart');
const nextButton = document.getElementById('next'); // Add this line

let questions;
let currentQuestionIndex = 0;
let score = 0;

document.addEventListener('DOMContentLoaded', function() {
  fetchQuestions();
});

// Function to fetch the questions from JSON file
async function fetchQuestions() {
  try {
    const response = await fetch('questions.json'); 
    questions = await response.json(); 
    displayQuestion(); 
  } catch (error) {
    console.error('Error fetching questions:', error);
  }
}

// Function to display a question
function displayQuestion() {
  const currentQuestion = questions[currentQuestionIndex];
  questionElement.textContent = currentQuestion.question;
  choices.forEach((choice, index) => {
    choice.textContent = currentQuestion.choices[index];
    choice.classList.remove('selected'); // Remove selected class from all choices
    choice.addEventListener('click', () => selectAnswer(choice));
    choice.addEventListener('mouseenter', () => choice.classList.add('hovered'));
    choice.addEventListener('mouseleave', () => choice.classList.remove('hovered'));
  });
}

function selectAnswer(selectedChoice) {
  // Mark the selected choice
  choices.forEach(choice => choice.classList.remove('selected')); // Deselect all choices
  selectedChoice.classList.add('selected');

  // Disable click event listener for all choices
  choices.forEach(choice => choice.removeEventListener('click', selectAnswer));
  
  // Enable submit button
  submitButton.disabled = false;
  submitButton.addEventListener('click', submitAnswer);
}

function submitAnswer() {
  const selectedAnswer = document.querySelector('.choice.selected');
  if (selectedAnswer) {
    checkAnswer(selectedAnswer.textContent);
  } else {
    // Handle case where no answer is selected
    console.error('Please select an answer.');
  }
  
  // Remove submit button event listener
  submitButton.removeEventListener('click', submitAnswer);
  submitButton.disabled = true;
}

function checkAnswer(answer) {
  const currentQuestion = questions[currentQuestionIndex];
  if (answer === currentQuestion.correctAnswer) {
    score++;
  }
  currentQuestionIndex++;
  if (currentQuestionIndex < questions.length) {
    displayQuestion();
  } else {
    displayResult();
  }
}
function displayResult() {
  submitButton.style.display = 'none';
  resultElement.style.display = 'block';
  scoreElement.textContent = score;
  totalElement.textContent = questions.length;
  nextButton.style.display = 'none'; // Hide next button on result display
}
restartButton.addEventListener('click', () => location.reload());
nextButton.addEventListener('click', () => {
  currentQuestionIndex++;
  if (currentQuestionIndex < questions.length) {
    displayQuestion();
  } else {
    displayResult();
  }
});

displayQuestion();
