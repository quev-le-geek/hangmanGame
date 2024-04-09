// const resteCache = document.getElementById("resetCache")
// const play = document.getElementById("play")
const url = "./data.json"
var data = localStorage.getItem("data")
const body = document.body
const keyboard = document.getElementById("keyboard")
const key = document.querySelectorAll(".key")
const game = document.getElementById("game")
const hangman = document.getElementById("hangman").children;
// const hangmanColor = querySelectorAll("rect")
const looseTile = document.getElementById("loose")
const winTitle = document.getElementById("win")
const themeSelector = document.getElementById("themeSelector")
let themeSelectorCollaped = true
const brush = document.getElementById("brush")
const content = document.getElementById("content")
const inputColors = document.querySelectorAll(".inputColor")
const actualColors = document.querySelectorAll(".actualColor")
const apply = document.getElementById("apply")
let colors = {
    "background": "#313338",
    "guess": {
        "bg": "#5865f2",
        "letters": "#ffffff",
        "underline": "#ffffff"
    },
    "hangman": "#ffffff",
    "keyboard": {
        "bg": "#23272a",
        "hover": "#2c2f33",
        "key": "#ffffff",
        "letterUsed": "#555555"
    },
    "letters": "#ffffff"
}
let word
let dbLength = 1000
let listenerSet = false
let life = 0

console.log(key);

if (data == undefined) {
    console.log("Has just been saved");
    getData(url, 0)
}
else {
    data = JSON.parse(data)
    console.log("Already saved");
    init()
}

//get a file
//inputs: url and the mode (look the function to learn more about the mode)
async function getData(urlSet, mode) {
    const result = await fetch(urlSet)
    data = await result.json();

    if (mode == 0) { //mode 0: save the response in localStorage
        saveToLs(data) //ls = localstorage
    }
    init()
}

function saveToLs(data) {
    localStorage.setItem("data", JSON.stringify(data))
}

function chooseWord() { //return a random word from the list
    var random
    // console.log(random >= data.data.length == false);
    while (random <= data.data.length == false) {
        random = Math.round(Math.random() * dbLength)
    }
    // console.log(random);
    const word = data.data[random]
    return word
    console.log(word);
}

function write(wordToWrite) {
    // console.log(wordToWrite.length);
    for (let i = 0; i < wordToWrite.length; i++) {
        var newP = document.createElement("p")
        newP.setAttribute("class", "letter")
        var newText = document.createTextNode(wordToWrite[i].toUpperCase())
        newP.appendChild(newText)
        game.appendChild(newP)
    }
}


function setListerners() {
    document.addEventListener("keypress", (e) => {
        keyPress(e.key, e.key.charCodeAt(0) - 97)
    })

    document.addEventListener("load", () => {
        changeColors()
    })

    key.forEach((element, index) => {
        element.addEventListener('click', () => {
            keyPress(element.id, index)
        })
        element.addEventListener('mouseenter', () => {
            element.setAttribute("class", "key keyHover")
            element.style.backgroundColor = colors.keyboard.hover
        })

        element.addEventListener('mouseleave', () => {
            element.setAttribute("class", "key")
            element.style.backgroundColor = colors.keyboard.bg
        })
    })

    brush.addEventListener("click", () => {
        if (themeSelectorCollaped == true) {
            themeSelector.setAttribute("class", "deployed")
            content.style.display = "flex"
            themeSelectorCollaped = !themeSelectorCollaped
        }
        else {
            themeSelector.setAttribute("class", "collapsed")
            content.style.display = "none"
            themeSelectorCollaped = !themeSelectorCollaped
        }
    })

    apply.addEventListener('click', () => {
        setColors()
    })

    listenerSet = true
}

function removeListeners(keyName, index) {
    var usedLetters = JSON.parse(localStorage.getItem("usedLetters"))
    usedLetters[index] = keyName
    localStorage.setItem("usedLetters", JSON.stringify(usedLetters))
    const oldAtributes = keyName[index].className
    keyName[index].className = oldAtributes + " played"
}

function displayActualColors(){
    actualColors[0].innerHTML = colors.background
    actualColors[1].innerHTML = colors.guess.bg
    actualColors[2].innerHTML = colors.guess.letters
    actualColors[3].innerHTML = colors.guess.underline
    actualColors[4].innerHTML = colors.hangman
    actualColors[5].innerHTML = colors.keyboard.bg
    actualColors[6].innerHTML = colors.keyboard.hover
    actualColors[7].innerHTML = colors.keyboard.key
    actualColors[8].innerHTML = colors.keyboard.letterUsed
    actualColors[9].innerHTML = colors.letters
}

function setColors() {
    console.log(inputColors, colors[0])
    let atLeastOneColorChange = false
    if (inputColors[0].value != "") {
        colors.background = inputColors[0].value
        atLeastOneColorChange = true
    }
    if (inputColors[1].value != "") {
        colors.guess.bg = inputColors[1].value
        atLeastOneColorChange = true
    }
    if (inputColors[2].value != "") {
        colors.guess.letters = inputColors[2].value
        atLeastOneColorChange = true
    }
    if (inputColors[3].value != "") {
        colors.guess.underline = inputColors[3].value
        atLeastOneColorChange = true
    }
    if (inputColors[4].value != "") {
        colors.hangman = inputColors[4].value
        atLeastOneColorChange = true
    }
    if (inputColors[5].value != "") {
        colors.keyboard.bg = inputColors[5].value
        atLeastOneColorChange = true
    }
    if (inputColors[6].value != "") {
        colors.keyboard.hover = inputColors[6].value
        atLeastOneColorChange = true
    }
    if (inputColors[7].value != "") {
        colors.keyboard.key = inputColors[7].value
        atLeastOneColorChange = true
    }
    if (inputColors[8].value != "") {
        colors.keyboard.letterUsed = inputColors[8].value
        atLeastOneColorChange = true
    }
    if (inputColors[9].value != "") {
        colors.letters = inputColors[9].value
        atLeastOneColorChange = true
    }

    if(atLeastOneColorChange == true){
        changeColors()
        displayActualColors()
        atLeastOneColorChange = false
    }
}

function changeColors() {
    body.style.backgroundColor = colors.background;
    game.style.backgroundColor = colors.guess.bg;

    for (const element of game.children) {
        element.style.color = colors.guess.letters;
        element.style.borderColor = colors.guess.underline;
    }

    for (const element of hangman) {
        console.log(element);
        element.setAttribute("fill", colors.hangman)
    }

    for (const element of key) {
        element.style.backgroundColor = colors.keyboard.bg
        element.style.color = colors.keyboard.key
    }


}



function init() {
    displayActualColors()
    changeColors()
    if (listenerSet == false) {
        setListerners()
    }
    console.time("ça prend")
    // console.log(data.data.length);
    var foundLetters = []
    const word = chooseWord().split("")
    localStorage.setItem("word", JSON.stringify(word))
    for (let i = 0; i < word.length; i++) {
        foundLetters.push(" ")
    }
    write(foundLetters)
    localStorage.setItem("foundLetters", JSON.stringify(foundLetters))
    localStorage.setItem("numberOfFoundLetters", JSON.stringify(0))
    localStorage.setItem("usedLetters", JSON.stringify(["", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", ""]))
    console.log(word)

    // console.log(key);
    console.timeEnd("ça prend")

}
function looseGame(word) {
    reset(word)
    write(word)
    looseTile.style.display = "block"

}

function looseLife() {
    hangman[life].style.display = "block"
    life++

}

function winGame() {
    winTitle.style.display = "block"
}

function keyPress(keyName, number) {
    var usedLetters = JSON.parse(localStorage.getItem("usedLetters"))
    var found = false
    var foundLetters = JSON.parse(localStorage.getItem("foundLetters"))
    var numberOfFoundLetters = JSON.parse(localStorage.getItem("numberOfFoundLetters"))
    const word = JSON.parse(localStorage.getItem("word"))
    if (usedLetters[number] == "") {
        console.log("usedLetters[", number, "] == ''", usedLetters[number] == "");
        if (life <= 9) {
            for (let i = 0; i < word.length; i++) {
                const letter = word[i];
                if (keyName == letter) {
                    foundLetters[i] = keyName
                    console.log(foundLetters);
                    found = true
                    numberOfFoundLetters++
                }
            }
            console.log(word == foundLetters, word[1] === foundLetters[1]);
            console.log(life);
            if (found == false) {
                looseLife()
            }

            // console.log("numberOfFoundLetters",numberOfFoundLetters)
            if (numberOfFoundLetters == word.length) {
                winGame()
            }
        }
        if (life == 10) {
            looseGame(word)
        }
        else {
            reset(foundLetters)
            write(foundLetters)
        }

        localStorage.setItem("foundLetters", JSON.stringify(foundLetters))
        localStorage.setItem("numberOfFoundLetters", JSON.stringify(numberOfFoundLetters))
        localStorage.setItem("usedLetters", JSON.stringify(usedLetters))
        removeListeners(key, number)

    }

}

function reset(word) {
    for (let i = 0; i < word.length; i++) {
        game.removeChild(game.lastElementChild)
    }
}

// play.addEventListener('click', () => {
//     const word = JSON.parse(localStorage.getItem("word"))
//     reset(word)
//     init()
// })