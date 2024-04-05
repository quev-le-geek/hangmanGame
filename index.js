const resteCache = document.getElementById("resetCache")
const url = "./data.json"
var data = localStorage.getItem("data")
const body = document.body
const keyboard = document.getElementById("keyboard")
const key = document.querySelectorAll(".key")
const game = document.getElementById("game")
const play = document.getElementById("play")
const hangman = document.getElementById("hangman").children;
var word
var lastWordLenght
var dbLength = 1000
var listenerSet = false
var life = 0

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
    console.log(random >= data.data.length == false);
    while (random <= data.data.length == false) {
        random = Math.round(Math.random() * dbLength)
    }
    console.log(random);
    const word = data.data[random]
    return word
    console.log(word);
}

function write(word, foundLetters) {
    console.log(word.length);
    for (let i = 0; i < word.length; i++) {
        var newP = document.createElement("p")
        newP.setAttribute("class", "letter")
        var newText = document.createTextNode(foundLetters[i].toUpperCase())
        newP.appendChild(newText)
        game.appendChild(newP)
    }
}

function setListerners() {
    document.addEventListener("keypress", (e) => {
        keyPress(e.key)
    })
    for (let i = 0; i < 26; i++) {
        key[i].addEventListener('click', () => {
            keyPress(key[i].id)
        })
    }
    listenerSet = true
}


function init() {
    console.log(listenerSet)
    if (listenerSet == false) {
        setListerners()
    }
    console.time("ça prend")
    console.log(data.data.length);
    var foundLetters = []
    const word = chooseWord().split("")
    localStorage.setItem("word", JSON.stringify(word))
    lastWordLenght = word.length
    for (let i = 0; i < word.length; i++) {
        foundLetters.push(" ")
    }
    write(word, foundLetters)
    localStorage.setItem("foundLetters", JSON.stringify(foundLetters))

    // console.log(key);

    console.log(word);
    console.timeEnd("ça prend")

}
function looseGame() {
    console.log("you loose");
}

function looseLife() {
    hangman[life].style.display = "block"
    life++

}

function keyPress(key) {
    console.log("key", key);
    var found = false
    var foundLetters = JSON.parse(localStorage.getItem("foundLetters"))
    const word = JSON.parse(localStorage.getItem("word"))
    if (life < 10) {
        for (let i = 0; i < word.length; i++) {
            const letter = word[i];
            if (key == letter) {
                foundLetters[i] = key
                console.log(foundLetters);
                found = true
            }
        }
    }

    localStorage.setItem("foundLetters", JSON.stringify(foundLetters))
    reset()
    console.log(word, foundLetters);
    write(word, foundLetters)

    if (found == false && life < 10) {
        looseLife()
    }
    else {
        looseGame()
    }
}

function reset() {
    for (let i = 0; i < lastWordLenght; i++) {
        game.removeChild(game.lastElementChild)
    }
}


resteCache.addEventListener('click', () => {
    localStorage.clear("data")
    console.log("LocalStorage cleared");
})

play.addEventListener('click', () => {
    reset()
    init()
})

var letter = ["A", "Z", "E", "R", "T", "Y", "U", "I", "O", "P", "Q", "S", "D", "F", "G", "H", "J", "K", "L", "M", "W", "X", "C", "V", "B", "N"]