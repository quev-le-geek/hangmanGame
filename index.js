

const resteCache = document.getElementById("resetCache")
const url = "./data.json"
var data = localStorage.getItem("data")
const body = document.body
const keyboard = document.getElementById("keyboard")
const key = document.getElementsByClassName("key")
console.log(key);

if (data == undefined) {
    console.log("Has just been saved");
    getData(url, 0)
}
else {
    data = JSON.parse(data)
    console.log("Already saved");

    ready()
}

//get a file
//inputs: url and the mode (look the function to learn more about the mode)
async function getData(urlSet, mode) {
    const result = await fetch(urlSet)
    var data = await result.json();

    if (mode == 0) { //mode 0: save the response in localStorage
        saveToLs(data) //ls = localstorage
    }

}

function saveToLs(data) {
    localStorage.setItem("data", JSON.stringify(data))
}

function whenDataGet() {
    console.log(data);
}

function ready() {
    // body.style.display = "block"
}

resteCache.addEventListener('click', () => {
    localStorage.clear("data")
    console.log("LocalStorage cleared");
})


function play() {

}

var letter = ["A", "Z", "E", "R", "T", "Y", "U", "I", "O", "P", "Q", "S", "D", "F", "G", "H", "J", "K", "L", "M", "W", "X", "C", "V", "B", "N"]

function createKeyboard() {
    for (let i = 0; i < letter.length; i++) {
        // console.log(letter);

        const newBtn = document.createElement("button")
        const newText = document.createTextNode(letter[i])
        newBtn.appendChild(newText)
        newBtn.setAttribute("id", letter[i].toLowerCase())
        newBtn.setAttribute("class", "key")
        keyboard.appendChild(newBtn)
        keyboard.style.border = "1px #00FF00 solid"
    }
}
// createKeyboard()