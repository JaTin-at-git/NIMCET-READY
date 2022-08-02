let limits = {
    "Permutation_and_combination": 0,
    "Probability": 0,
    "Sets_and_relations": 77
}

let nDisplay = document.querySelector(".n");
let xInput = document.querySelector("#x");
let notoficationPannel = document.querySelector("#warning");
let checkboxes = document.querySelectorAll("input[type='checkbox']");
let generateQuestionsButton = document.querySelector("#getQuestionsButton");

let x = 0;
let n = 0;
let topicsSelected = {};
let questionNodes = [];

/////////////////

function main() {
    addListnerToCheckboxes();
    addListenerToGenerateQuestions();
}

main();


///////////////

function addListnerToCheckboxes() {
    for (const checkbox of checkboxes) {
        checkbox.addEventListener('change', function () {
            if (this.checked) {
                n++;
                topicsSelected[this.id] = 1;
            } else {
                n--;
                delete topicsSelected[this.id];
            }
            nDisplay.innerHTML = "&nbsp;" + n + " +&nbsp;";
            console.log(topicsSelected);
        });
    }
}

function addListenerToGenerateQuestions() {
    generateQuestionsButton.addEventListener('click', () => {
        x = parseInt(xInput.value); //reinitialize the value of x
        var sum = 0;
        for (const [key] of Object.entries(topicsSelected)) {
            sum += limits[key]
        }
        if (n === 0) {
            slideNotification("Please select at least one topic.")
        } else if (sum < x + n) {
            slideNotification("Please select more topics or reduce the question count to " + sum + ". ")
        } else {
            //reinitialize the dictionary
            for (const [key] of Object.entries(topicsSelected)) {
                topicsSelected[key] = 1;
            }
            //reinitialize the questions node
            questionNodes = [];
            //divide the questions
            divideQuestionCounts();
            //create question nodes
            createQuestionNodes();
            shuffleArray(questionNodes);
            addImageNodesToPage();
        }
    });
}

function divideQuestionCounts() {
    for (const [key] of Object.entries(topicsSelected)) {
        if (topicsSelected[key] >= limits[key]) {
            x += topicsSelected[key] - limits[key];
            topicsSelected[key] = limits[key];
            continue;
        }
        if (Math.random() < 0.5) {
            topicsSelected[key]++;
            x--;
        }
        if (x === 0) break;
    }
    if (x !== 0) divideQuestionCounts();
}

function createQuestionNodes() {
    for (const [key, value] of Object.entries(topicsSelected)) {
        // create two differnt qnos
        let qnos = [];
        while (qnos.length < value) {
            var r = Math.floor(Math.random() * limits[key]) + 1;
            if (qnos.indexOf(r) === -1) qnos.push(r);
        }
        for (const qno of qnos) {
            questionNodes.push(key + "/q%20(" + qno + ").png");
        }
    }
}

function addImageNodesToPage() {
    var html = "<h2>Here are some questions for you to solve:</h2>\n" +
        "    <div class=\"questionsID1\">" +
        "";

    var index = 0;
    for (const questionNode of questionNodes) {
        html += ` <div class="question">
            <span>${++index}</span>
            <img src=${questionNode} loading="lazy">
        </div>
        `;
    }
    html += `</div></div>`
    document.querySelector(".questionsDiv").innerHTML = html;

    for (const qstn of document.querySelectorAll(".question")) {
        setTimeout(() => {
            qstn.style.opacity = "1";
        }, 100)
    }
}

///utility
function slideNotification(message) {
    notoficationPannel.innerHTML = message;
    notoficationPannel.parentNode.style.top = "50px";
    setTimeout(() => {
        notoficationPannel.parentNode.style.top = "-100%";
    }, 3000);
}

function shuffleArray(array) {
    for (var i = array.length - 1; i > 0; i--) {
        var j = Math.floor(Math.random() * (i + 1));
        var temp = array[i];
        array[i] = array[j];
        array[j] = temp;
    }
}
