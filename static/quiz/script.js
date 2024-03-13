const optionList = document.querySelector('.option-list');
const startBtn = document.querySelector('.start-btn');
const nextBtn = document.querySelector('.next-btn');
const backbtn = document.querySelector('.back-btn');
const popupInfo = document.querySelector('.popup-info');
const exitBtn = document.querySelector('.exit-btn'); 
const main = document.querySelector('.main'); 
const continueBtn = document.querySelector('.continue-btn');  
const quizSection = document.querySelector('.quiz-section');  
const quizBox = document.querySelector('.quiz-box');
const clock = document.querySelector('.clock');  
const resultBox = document.querySelector('.result-box');  
const retryBox = document.querySelector('.retry-btn');
const goHomeButton = document.querySelector('.goHome-btn'); 

//get Question 
var questionsDataText = document.getElementById('questions-data').textContent.slice(55);

var questions = JSON.parse(questionsDataText);

// Hàm xáo trộn mảng
function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

shuffleArray(questions.questions);

console.log(questions.questions);
startBtn.onclick = () => {
    popupInfo.classList.add('active');
    main.classList.add('active');
}

backbtn.onclick = () => {
    quizSection.classList.remove('active');   
    quizBox.classList.remove('active');   
    // after 1 second
    setTimeout(() => {
        popupInfo.classList.add('active');
        main.classList.add('active');
    }, 1000); 
}

exitBtn.onclick = () => {
    popupInfo.classList.remove('active'); 
    main.classList.remove('active');
}

goHomeButton.onclick = () => {
    quizSection.classList.remove('active');   
    quizBox.classList.remove('active');   
    resultBox.classList.remove('active');
    // after 1 second
    setTimeout(() => {
        popupInfo.classList.add('active');
        main.classList.add('active');
    }, 1000); 
}

continueBtn.onclick = () => {
    shuffleArray(questions.questions);
    quizSection.classList.add('active');   
    quizBox.classList.add('active');   
    popupInfo.classList.remove('active'); 
    main.classList.remove('active');

    questionsCount = 0;
    questionsNum = 1;
    userScore = 0;

    showQuestion(0);
    questionCounter(1);
    headerScore();
}

let countdownTime = 15;
let countdown;

function startCountdown() {
    countdown = setInterval(function() {
        countdownTime--;
        if (countdownTime < 0) {
            clearInterval(countdown);
            const nullOption = document.createElement('div');
            nullOption.classList.add('option');
            nullOption.textContent = 'null';
            optionSeleceted(nullOption); // Gọi hàm khi hết thời gian
        } else {
            updateClock(countdownTime);
        }
    }, 1000);
}

function resetCountdown() {
    clearInterval(countdown);
    countdownTime = 15;
}

function updateClock(time) {
    let minutes = Math.floor(time / 60);
    let seconds = time % 60;

    let formattedTime = `${padZero(minutes)}:${padZero(seconds)}`;
    clock.innerHTML = formattedTime;
}

function padZero(number) {
    return number < 10 ? '0' + number : number;
}

nextBtn.onclick = () => {
    if (questionsCount >= questions.questions.length-1) {
        showResultBox();
        return;
    }
    nextBtn.classList.remove('active');
    showQuestion(++questionsCount);
    questionCounter(++questionsNum);
}

retryBox.onclick = () => {
    quizBox.classList.add('active');
    resultBox.classList.remove('active');
    nextBtn.classList.remove('active');
    
    questionsCount = 0;
    questionsNum = 1;
    userScore = 0;
    showQuestion(questionsCount);
    questionCounter(questionsNum);
    
    headerScore();
    shuffleArray(questions.questions);
}

let questionsCount = 0;
let questionsNum = 1;
let userScore = 0;
let correctChoice;
let answerCorrect;


function showQuestion(index) {
    resetCountdown();
    startCountdown();
    updateClock(countdownTime);
    const questionText = document.querySelector('.question-text');
    questionText.textContent = `Question ${index+1}: ${questions.questions[index].question_text} ?`;
    correctChoice = questions.questions[questionsCount].correctChoice;
    let option1234 = [questions.questions[index].option1, questions.questions[index].option2, questions.questions[index].option3, questions.questions[index].option4];
    answerCorrect = option1234[correctChoice-1];
    shuffleArray(option1234);
    // after suffle array, find the correct answer
    for (let i = 1; i <= 4; i++) {
        if(option1234[i-1] == answerCorrect) {
            correctChoice = i;
        }
    }
    let optionTag = `<div class="option"><span>A. ${option1234[0]}</span></div>
    <div class="option"><span>B. ${option1234[1]}</span></div>
    <div class="option"><span>C. ${option1234[2]}</span></div>
    <div class="option"><span>D. ${option1234[3]}</span></div>`;

    optionList.innerHTML = optionTag;

    const option = document.querySelectorAll('.option');
    for (let i = 0; i < option.length; i++) {
        option[i].setAttribute('onclick', 'optionSeleceted(this)');
    }
}

function optionSeleceted(answer) {
    resetCountdown();
    let userAnswer = answer.textContent[0].charCodeAt(0) - 'A'.charCodeAt(0) + 1;
    // correctChoice = questions.questions[questionsCount].correctChoice;
    let allOptions = optionList.children.length;

    if(userAnswer == correctChoice) {
        answer.classList.add('correct');
        ++userScore;
        headerScore();
    } else {
        answer.classList.add('incorrect');

        for (let i = 0; i < allOptions; i++) {
            if  (optionList.children[i].textContent[0].charCodeAt(0) - 'A'.charCodeAt(0) + 1 == correctChoice) {
                optionList.children[i].setAttribute('class', 'option correct');
            }
        }
    }

    for (let i = 0; i < allOptions; i++) {
        optionList.children[i].classList.add('disabled');
    }

    nextBtn.classList.add('active');
}

function questionCounter(index) {
    const questionTotal = document.querySelector('.question-total');
    questionTotal.textContent = `${index} of ${questions.questions.length} Questions`;
}

function headerScore() {
    const headerScoreText = document.querySelector('.header-score');
    headerScoreText.textContent = `Score: ${userScore} / ${questions.questions.length}`;
}

function showResultBox() {
    quizBox.classList.remove('active');
    resultBox.classList.add('active');

    const scoreText = document.querySelector('.score-text');
    const circularProgress = document.querySelector('.circular-progress');
    const progressValue = document.querySelector('.progress-value');
    let progressStartValue = -1;
    let progressEndValue = userScore/questions.questions.length*100;
    let speed = 20;

    scoreText.textContent = `Your Score: ${userScore} out of  ${questions.questions.length}`;

    let progress = setInterval(() => {
        progressStartValue++;
        progressValue.textContent = `${progressStartValue}%`;
        circularProgress.style.background = `conic-gradient(#ff00bf ${progressStartValue * 3.6 }deg, rgba(255, 255, 255, .1) 0deg)`;
        if (progressStartValue >= progressEndValue) {
            clearInterval(progress);
        }
    }, speed);
}