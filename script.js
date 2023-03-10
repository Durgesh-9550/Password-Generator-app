const inputSlider = document.querySelector('[data-lengthSlider]');
const lengthDispay = document.querySelector('[data-lengthNumber]');

const passwordDisplay = document.querySelector('[data-passwordDisplay]');

const copyBtn = document.querySelector('[data-copy]');
const copyMsg = document.querySelector('[data-copyMsg]');

const uppercaseCheck = document.querySelector('#uppercase')
const lowercaseCheck = document.querySelector('#lowercase')
const NumbersCheck = document.querySelector('#numbers')
const symbolCheck = document.querySelector('#symbol')

const indicator = document.querySelector('[data-indicator]');
const generateBtn = document.querySelector('.generateButton');
const allCheckBox = document.querySelectorAll('input[type = checkbox]');

// -----> ------> since we don't know about ascii values of symbols so here we are creating string of characters 
const symbols = '~`!@#$%^&*()_-+={[}]|:;"<,>.?/';


let password = "";
let passwordLength = 10;
let checkCount = 0;
// calling handel slider function to handel slider and the length of password
handleSlider();

// set strength circle to grey
// setIndicator("#ccc");
setIndicator("#ccc");


// set the length of password
function handleSlider() {
    // at strting point when we are just openint our project in browser
    inputSlider.value = passwordLength;
    lengthDispay.innerText = passwordLength;

    // special check this one
    const min = inputSlider.min;
    const max = inputSlider.max;
    inputSlider.style.backgroundSize = ((passwordLength-min)*100/(max-min)) + "% 100%";
}

// set indiacator function for checking strength of generated password
function setIndicator(color) {
    indicator.style.backgroundColor = color;
    // shadow
    indicator.style.boxShadow = `0px 0px 12px 1px ${color}`;
}

// get random integer function betweeen max and min
function getRandomInteger(min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
}

// generate random number function
function generateRandomNumber() {
    return getRandomInteger(0, 9);
}

// generate random upppercase letter function
function generateRandomUppercase() {
    return String.fromCharCode(getRandomInteger(65, 91));
}

// generate random lowercase letter function
function generateRandomLowercase() {
    return String.fromCharCode(getRandomInteger(97, 123));
}

// generate random symbol function
function generateSymbol() {
    const randNum = getRandomInteger(0, symbols.length);
    return symbols.charAt(randNum);
}


// caculating strength of password 
function calcStrength() {
    let hasUpper = false;
    let hasLower = false;
    let hasNum = false;
    let hasSym = false;
    if (uppercaseCheck.checked) hasUpper = true;
    if (lowercaseCheck.checked) hasLower = true;
    if (NumbersCheck.checked) hasNum = true;
    if (symbolCheck.checked) hasSym = true;

    if (hasUpper && hasLower && (hasNum || hasSym) && passwordLength >= 8) {
        setIndicator("#0f0");
    } else if (
        (hasLower || hasUpper) &&
        (hasNum || hasSym) &&
        passwordLength >= 6
    ) {
        setIndicator("#ff0");
    } else {
        setIndicator("#f00");
    }
}

// copying the password to the clipboard
async function copyContent() {
    try {
        await navigator.clipboard.writeText(passwordDisplay.value);
        copyMsg.innerText = "copied";
    }
    catch (e) {
        copyMsg.innerText = "failed";
    }
    // to make visible the content of copy
    copyMsg.classList.add("active");

    setTimeout(() => {
        copyMsg.classList.remove("active");
    }, 2000);

}


// shuffling the password
function shufflePassword(array) {
    //Fisher Yates Method
    for (let i = array.length - 1; i > 0; i--) {
        // random index j, find out using random function
        const j = Math.floor(Math.random() * (i + 1));
        // swap ith and jth element
        const temp = array[i];
        array[i] = array[j];
        array[j] = temp;
    }

    let str = "";
    array.forEach((el) => (str += el));
    return str;
}

// event listeners

// listners of check 
function handleCheckBoxChange() {
    checkCount = 0;
    allCheckBox.forEach((checkbox) => {
        if (checkbox.checked)
            checkCount++;
    });

    //special condition
    if (passwordLength < checkCount) {
        passwordLength = checkCount;
        handleSlider();
    }
}

allCheckBox.forEach((checkbox) => {
    checkbox.addEventListener('change', handleCheckBoxChange);
});

// Event Listner on input slider
inputSlider.addEventListener('input', (e) => {
    passwordLength = e.target.value;
    handleSlider();
});

copyBtn.addEventListener('click', () => {
    if (passwordDisplay.value)
        copyContent();
});

generateBtn.addEventListener('click', () => {
    // if a single box is not selected then
    if (checkCount == 0) {
        return;
    }

    if (passwordLength < checkCount) {
        passwordLength = checkCount;
        handleSlider();
    }

    // let's start our journey to find new password
    // remove old password
    password = "";

    // let's put the stuff mentioned by checkboxes
    // if(uppercaseCheck.checked){
    //     password += generateRandomUppercase();
    // }
    // if(lowercaseCheck.checked){
    //     password += generateRandomLowercase();
    // }
    // if(NumbersCheck.checked){
    //     password += generateRandomNumber();
    // }
    // if(symbolCheck.checked){
    //     password += generateSymbol();
    // }


    let funcArr = [];
    if (uppercaseCheck.checked) {
        funcArr.push(generateRandomUppercase);
    }
    if (lowercaseCheck.checked) {
        funcArr.push(generateRandomLowercase);
    }
    if (NumbersCheck.checked) {
        funcArr.push(generateRandomNumber);
    }
    if (symbolCheck.checked) {
        funcArr.push(generateSymbol);
    }

    // compulsory addition
    for (let i = 0; i < funcArr.length; i++) {
        password += funcArr[i]();
    }

    // remaining addition
    for (let i = 0; i < passwordLength - funcArr.length; i++) {
        let randIndex = getRandomInteger(0, funcArr.length);
        password += funcArr[randIndex]();
    }

    // shuffle the password
    password = shufflePassword(Array.from(password));

    // show in UI
    passwordDisplay.value = password;

    // strength calculation
    calcStrength();
});