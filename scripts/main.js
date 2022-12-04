const colorMixingWindow = document.querySelector(".colorMixingWindow")
const firstRandomColor = document.querySelector(".firstRandomColor")
const secondRandomColor = document.querySelector(".secondRandomColor")
const mixedColor = document.querySelector(".mixedColor")
const colorPicker = document.querySelector(".colorPicker")
const pickedColor = document.querySelector(".pickedColor")
const submitModal = document.querySelector("#submitModal")
const MAX_TRIES = 5
let numOfTries = 0
let obtainedColor 

function startTheGame(){
    clearPreviousTries()
    numOfTries = 0
    window.submitModal.close()
    document.querySelector(".submitButton").disabled = false
    window.mixedColor.style.background  = ""
    let firstRandomColor = window.firstRandomColor
    let secondRandomColor = window.secondRandomColor
    firstRandomColor.style.backgroundColor = generateRandomColor()
    secondRandomColor.style.backgroundColor = generateRandomColor()
    obtainedColor = mixbox.lerp(firstRandomColor.style.backgroundColor, secondRandomColor.style.backgroundColor, 0.5)
    getPickedColor()
}

function getRandomInteger(MAX_VALUE) {
    let randomValue = Math.random()
    randomValue = randomValue * MAX_VALUE
    randomInteger = Math.floor(randomValue)
    
    return randomInteger
}

function generateRandomColor(){
    const MAX_VALUE = 256;
    let red = getRandomInteger(MAX_VALUE)
    let green = getRandomInteger(MAX_VALUE)
    let blue = getRandomInteger(MAX_VALUE)
    
    let colorString = `rgb(${red}, ${green}, ${blue})`
    return colorString
}

function getPickedColor(){
    let pickedColor = document.getElementById("pickedColor")
    let red = document.getElementById("ColorPicker_Red").value;
    let green = document.getElementById("ColorPicker_Green").value;
    let blue = document.getElementById("ColorPicker_Blue").value;
    
    let colorString = `rgb(${red}, ${green}, ${blue})`
    
    pickedColor.style.backgroundColor = colorString
}

function onSubmitButtonClicked(){
    getPickedColor()
    compareTwoColors()
}

function compareTwoColors(){
    let pickedColor = window.pickedColor.style.backgroundColor
    
    if (typeof(obtainedColor) === "string"){
        obtainedColor = sliceRgbColorString(obtainedColor)
    }
    pickedColorObject = sliceRgbColorString(pickedColor)
    
    const [L1, A1, B1] = Colour.rgba2lab(obtainedColor[0], obtainedColor[1], obtainedColor[2])
    const [L2, A2, B2] = Colour.rgba2lab(pickedColorObject['red'], pickedColorObject['green'], pickedColorObject['blue'])
    const deltaE = Colour.deltaE00(L1, A1, B1, L2, A2, B2);
    decideGameResoult(deltaE)
}

function sliceRgbColorString(rgbColor){
    let colors = ["red", "green", "blue", "alpha"]
    
    let colorArr = rgbColor.slice(
        rgbColor.indexOf("(") + 1, 
        rgbColor.indexOf(")")
        ).split(", ").map(Number);
        
        let obj = new Object();
        colorArr.forEach((k, i) => {
            obj[colors[i]] = parseInt(k)
        })
        
        return obj
    }
    
function decideGameResoult(deltaE) {
    let win = false
    let message = ""

    if (numOfTries < MAX_TRIES)
    {
        if (deltaE <= 4.0) {
            win = true
            message = `Congratulations, you know your colors!`
        } else if (deltaE <= 10.0) {
            message = "Oh too bad! You were so close!"
        } else {
            message = "You lost"
        }
        showPreviusTry(deltaE)
        numOfTries++
    }
    if (win === true || numOfTries >= MAX_TRIES)
    {
        numOfTries = 0
        window.mixedColor.style.background = 'none'
        window.mixedColor.style.backgroundColor = obtainedColor
        const resultsMessage = document.querySelector("#resultsMessage")
        const playerAnswer = document.querySelector("#playerAnswer")
        const finalDelta = document.querySelector("#finalDelta")        
        const finalColor = document.querySelector("#finalColor") 
        playerAnswer.style.backgroundColor = window.pickedColor.style.backgroundColor
        finalDelta.innerHTML = "ΔE = " + deltaE.toFixed(1)
        finalDelta.style.textAlign = "center"
        finalColor.style.backgroundColor = obtainedColor
        resultsMessage.innerHTML = message
        document.querySelector(".submitButton").disabled = true
        window.submitModal.show()
    }
}

function showPreviusTry(deltaE)
{
    const previousTry = document.createElement("div")
    previousTry.classList.add("previousTry")
    previousTry.style.cssText = `
        display: flex;
        justify-content: center; 
        align-items: center;
        height: 8vh;
        min-height: 4.6em;`
    const colorBox = document.createElement("div")
    colorBox.style.cssText = `
    margin: auto;
    padding: auto;
    width: 7vh;
    height: 7vh;
    min-height: 4em;
    min-width: 4em;
    background-color: ${window.pickedColor.style.backgroundColor};` 
    colorBox.classList = "colorBox"
    const colorDifference = document.createElement("h2")
    colorDifference.style.margin = "auto"
    colorDifference.innerHTML = `ΔE = ${deltaE.toFixed(1)}`
    previousTry.appendChild(colorBox)
    previousTry.appendChild(colorDifference)
    const colorPicker = document.querySelector(".colorPicker")
    document.querySelector(".gameScreen").insertBefore(previousTry, colorPicker)
}

function clearPreviousTries()
{
    let attempts = document.querySelectorAll(".previousTry")
    attempts.forEach( attempt => {
        attempt.remove()
    })
}