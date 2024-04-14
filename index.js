const restart = document.getElementById("replay")
const restartIcon = document.getElementById("replayIcon")
// const gameMode = document.getElementById("gameMode")
const url = "./data.json"
var data = localStorage.getItem("data")
const body = document.body
const keyboard = document.getElementById("keyboard")
const key = document.querySelectorAll(".key")
let nbKeyUsed = 0
const game = document.getElementById("guess")
const hangman = document.getElementById("hangman").children;
const looseTile = document.getElementById("loose")
const winTitle = document.getElementById("win")
const themeSelector = document.getElementById("themeSelector")
const moon = document.getElementById("moon")
const sun = document.getElementById("sun")

let word
let dbLength = 1000
let listenerSet = false
let life = 0

function changeTheme(){
    if (darkMode == true) {
        body.setAttribute("data-theme", "light")
    }
    else{
        body.setAttribute("data-theme", "dark")
    }
}

let darkMode = JSON.parse(localStorage.getItem("darkMode"))
if (darkMode == undefined) {
    darkMode = true
    localStorage.setItem("darkMode", darkMode)
}
changeTheme()

const actualTimeStamp = Date.now()
const lastUpdate = JSON.parse(localStorage.getItem("lastUpdate"))
const timeElapsed = (actualTimeStamp - lastUpdate) / 1000 / 60 / 60
const updateFreq = 24

console.log("Update", Math.floor(timeElapsed * 100) / 100, "hours ago");
if (data == undefined) {
    getData(url, 0)
}

else if (actualTimeStamp == undefined) {
    getData(url, 0)
}

else if (Math.floor(timeElapsed) >= (updateFreq)) {
    getData(url, 0)
}

else if (Math.floor(timeElapsed) <= (updateFreq)) {
    data = JSON.parse(data)
    console.log("Already saved");
    init()
}

//get a file
//inputs: url and the mode (look the function to learn more about the mode)
async function getData(urlSet, mode) {
    localStorage.setItem("lastUpdate", JSON.stringify(actualTimeStamp))
    console.log("Has just been saved");
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

//different style of keys

function setListerners() {
    document.addEventListener("keypress", (e) => {
        keyPress(e.key, e.key.charCodeAt(0) - 97)
    })

    key.forEach((element, index) => {
        element.addEventListener('click', () => {
            keyPress(element.id, index)
            nbKeyUsed++
        })
    })

    listenerSet = true
}

function removeListeners(keyName, index) {
    var usedLetters = JSON.parse(localStorage.getItem("usedLetters"))
    usedLetters[index] = keyName[index].id
    localStorage.setItem("usedLetters", JSON.stringify(usedLetters))
}

function init() {
    for (const element of key) {
        element.setAttribute("data-state","playble")
    }
    if (listenerSet == false) {
        setListerners()
    }
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

}
function looseGame(word) {
    reset(word)
    write(word)
    looseTile.style.display = "flex"

}

function looseLife() {
    hangman[life].style.display = "block"
    life++

}

function winGame() {
    winTitle.style.display = "flex"
}

function keyPress(keyName, number) {
    key[number].setAttribute("data-state","used")
    var usedLetters = JSON.parse(localStorage.getItem("usedLetters"))
    var found = false
    var foundLetters = JSON.parse(localStorage.getItem("foundLetters"))
    var numberOfFoundLetters = JSON.parse(localStorage.getItem("numberOfFoundLetters"))
    const word = JSON.parse(localStorage.getItem("word"))
    if (usedLetters[number] == "") {
        if (life <= 9) {
            for (let i = 0; i < word.length; i++) {
                const letter = word[i];
                if (keyName == letter) {
                    foundLetters[i] = keyName
                    found = true
                    numberOfFoundLetters++
                }
            }
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

restart.addEventListener('click', () => {
    const word = JSON.parse(localStorage.getItem("word"))
    for (const element of hangman) {
        element.style.display = "none"
    }
    reset(word)
    winTitle.style.display = "none"
    looseTile.style.display = "none"
    life = 0
    init()
})


themeSelector.addEventListener('click', () => {
    darkMode = !darkMode
    localStorage.setItem("darkMode", JSON.stringify(darkMode))
    changeTheme()
})