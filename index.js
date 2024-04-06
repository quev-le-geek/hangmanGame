const resteCache = document.getElementById("resetCache")
const url = "./data.json"
var data = localStorage.getItem("data")
const body = document.body
const keyboard = document.getElementById("keyboard")
const key = document.querySelectorAll(".key")
const game = document.getElementById("game")
const play = document.getElementById("play")
const hangman = document.getElementById("hangman").children;
const looseTile = document.getElementById("loose")
const winTitle = document.getElementById("win")
var word
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
    for (let i = 0; i < 26; i++) {
        key[i].addEventListener('click', () => {
            keyPress(key[i].id, i)
        })
    }
    listenerSet = true
}

function removeListeners(keyName, index) {
    var usedLetters = JSON.parse(localStorage.getItem("usedLetters"))
    usedLetters[index] = keyName
    localStorage.setItem("usedLetters", JSON.stringify(usedLetters))
    const oldAtributes = keyName[index].className
    keyName[index].className = oldAtributes + " played"
}


function init() {
    // console.log(listenerSet)
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
    localStorage.setItem("usedLetters",JSON.stringify(["", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", ""]))
    console.log(word)

    // console.log(key);

    console.timeEnd("ça prend")

}
function looseGame(word) {
    debugger
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
    console.log("usedLetters[",number,"] == ''", usedLetters[number] == "");
    if (life <= 9 && usedLetters[number] == "") {
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

function reset(word) {
    for (let i = 0; i < word.length; i++) {
        game.removeChild(game.lastElementChild)
    }
}


resteCache.addEventListener('click', () => {
    localStorage.clear("data")
    console.log("LocalStorage cleared");
})

play.addEventListener('click', () => {
    const word = JSON.parse(localStorage.getItem("word"))
    reset(word)
    init()
})

var letter = ["A", "Z", "E", "R", "T", "Y", "U", "I", "O", "P", "Q", "S", "D", "F", "G", "H", "J", "K", "L", "M", "W", "X", "C", "V", "B", "N"]