let userScore = 0;
let compScore = 0;
const choices = document.querySelectorAll(".choice");
const msg = document.querySelector("#msg");
const usrscorePara = document.querySelector("#user-score");
const compscorePara = document.querySelector("#comp-score");
const genComputerChoice = () => {
    const options = ["rock", "paper", "scissors"];
    const randomIndex = Math.floor(0 + Math.random() * 3);
    return options[randomIndex];
}
const Draw = () => {
    msg.innerText = "Draw !Play Again";
    msg.style.backgroundColor = "rgb(5, 5, 52)"
}
const showWinner = (userWin, userChoice,compChoice) => {
    if (userWin) {
        msg.innerText = `You Win ! Your ${userChoice} beats ${compChoice}`;
        msg.style.backgroundColor = "green";
        userScore++;
        usrscorePara.innerText = userScore;
    } else {
        msg.innerText = `You Lose ! ${compChoice} beats Your ${userChoice}`;
        msg.style.backgroundColor = "red";
        compScore++;
        compscorePara.innerText = compScore;
    }
}
const playGame = (userChoice) => {
    const compChoice = genComputerChoice();
    if (userChoice === compChoice) {
        Draw();
    } else {
        let userWin = true;
        if (userChoice === "rock") {
            userWin = compChoice === "paper" ? false : true;
        } else if (userChoice === "paper") {
            userWin = compChoice === "scissors" ? false : true;
        } else if (userChoice === "scissors") {
            userWin = compChoice === "rock" ? false : true;
        }
        showWinner(userWin, userChoice,compChoice);
    }
    
}
choices.forEach((choice) => {
    choice.addEventListener("click", () => {
        const userChoice = choice.getAttribute("id");
        playGame(userChoice);
    });
});