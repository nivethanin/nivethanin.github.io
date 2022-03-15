var plural = 0;
var possInflection = 0;
var pluralAndInflection = 0;
var thirdPersonSingular = 0;
var pastTense = 0;
var pastParticiple = 0;
var progressiveVerb = 0;
var negativeContractions = 0;
var contracted = 0;
var ommittedWords = 0;

var numLines = 0;
var examinerUtterances = 0;
var clientUtterances = 0;
var totalMorphemes = 0;

let boundMorphemes = 0;
let mazeWords = 0;

let actionStatements = 0;


function parser() {
    let fullDocument = document.getElementById("textBox").value;
    //splits the text into an array for each line
    let lines = fullDocument.split("\n");

    // checks if each line is a child utterance or examiner utterance
    lines.forEach(function (entry) {
        numLines++;
        if (entry.toLowerCase().charAt(0) == 'c' && 
        entry.toLowerCase().charAt(entry.length-1) != 'q' &&
        entry.toLowerCase().charAt(entry.length-2) != 'q'){
            clientUtterances++; // increment child utterance
            boundOmmittedMorphemeParser(entry); //checks for double morphemes
            mazeWordCounter(entry);
            actionStatementCounter(entry);

            var clientMorphemePerLine = entry.split(" "); // counts total morphemes

            //adds to the  child morpheme count per line and subtracts one to account for
            //the speaker indication (examiner or child)
            totalMorphemes += clientMorphemePerLine.length - 1;
        }

        // increments examiner utterances
        else if (entry.toLowerCase().charAt(0) == 'e') {
            examinerUtterances++;
        }

    });

    results();
}

function boundOmmittedMorphemeParser(text) {
    for (var i = 0; i < text.length; i++) {
        if (text.charAt(i) === '*'){
            ommittedWords++;
            totalMorphemes--;
        }
        if (text.charAt(i) == '/') {

            switch (text.toLowerCase().charAt(i + 1)) {
                case 's':
                    if (text.toLowerCase().charAt(i + 2) == '/') {
                        pluralAndInflection++; break;
                    }
                    else
                        plural++; break;

                case 'z': possInflection++; break;
                case '3': thirdPersonSingular++; break;
                case 'e':
                    if (text.toLowerCase().charAt(i + 2) == 'd')
                        pastTense++;
                    else
                        pastParticiple++; break;
                case 'i': progressiveVerb++; break;
                case 'n': negativeContractions++; break;

                case '’':
                    if (text.toLowerCase().charAt(i + 2) == 'l' ||
                        text.toLowerCase().charAt(i + 2) == 'm' ||
                        text.toLowerCase().charAt(i + 2) == 'd' ||
                        text.toLowerCase().charAt(i + 2) == 'r' ||
                        text.toLowerCase().charAt(i + 2) == 's' ||
                        text.toLowerCase().charAt(i + 2) == 'u' ||
                        text.toLowerCase().charAt(i + 2) == 'v') {
                        contracted++; break;
                    }
                    else if (text.toLowerCase().charAt(i + 2) == 't') {
                        negativeContractions++; break;
                    }
                    else break;

                case '\'':
                    if (text.toLowerCase().charAt(i + 2) == 'l' ||
                        text.toLowerCase().charAt(i + 2) == 'm' ||
                        text.toLowerCase().charAt(i + 2) == 'd' ||
                        text.toLowerCase().charAt(i + 2) == 'r' ||
                        text.toLowerCase().charAt(i + 2) == 's' ||
                        text.toLowerCase().charAt(i + 2) == 'u' ||
                        text.toLowerCase().charAt(i + 2) == 'v') {
                        contracted++; break;
                    }
                    else if (text.toLowerCase().charAt(i + 2) == 't') {
                        negativeContractions++; break;
                    }
                    else break;

                case 'h': contracted++; break;
                case 'd': contracted++; break;
                default: break;
            }
        }
    }
}

function mazeWordCounter(text){
    let inBracket = false;
    for (var i = 0; i < text.length; i++) {
        if (text.charAt(i) == '('){
            inBracket = true;
            mazeWords++;
        }

        if (text.charAt(i) == ')')
            inBracket = false;

        if (inBracket && text.charAt(i)==' ')
            mazeWords++;
    }
}

function actionStatementCounter(text){
    let inCurlyBrace = false;
    for (var i = 0; i < text.length; i++) {
        if (text.charAt(i) == '{'){
            inCurlyBrace = true;
            actionStatements++;
        }

        if (text.charAt(i) == '}')
            inCurlyBrace = false;

        if (inCurlyBrace && text.charAt(i)==' ')
        actionStatements++;
    }
}

function results() {
    //total double morphemes
    boundMorphemes = plural + possInflection + pluralAndInflection +
        thirdPersonSingular + pastTense + pastParticiple +
        progressiveVerb + negativeContractions + contracted;

    totalMorphemes = boundMorphemes + totalMorphemes - mazeWords - actionStatements;

    // calculate MLU then represent it with two decimal places
    let mlu = totalMorphemes / clientUtterances;
    mlu = (Math.round(mlu * 100) / 100).toFixed(2);

    let brownsStage = '';
    let ageRange = '';

    switch (true) {
        case (1 <= mlu && mlu < 2.0):
            brownsStage = 'Stage I';
            ageRange = '12 - 26';
            break;
        case (2.0 <= mlu && mlu < 2.5):
            brownsStage = 'Stage II';
            ageRange = '27 - 30';
            break;
        case (2.5 <= mlu && mlu < 3.0):
            brownsStage = 'Stage III';
            ageRange = '31 - 34';
            break;
        case (3.0 <= mlu && mlu < 3.75):
            brownsStage = 'Stage IV';
            ageRange = '35 -4 0';
            break;
        case (3.75 <= mlu && mlu <= 4.5):
            brownsStage = 'Stage V';
            ageRange = '41 - 46+';
            break;
        case (4.5 <= mlu):
            brownsStage = 'Stage V+';
            ageRange = '46+';
            break;
        default:
            brownsStage = 'Invalid';
            ageRange = 'Invalid';
            break;
    }

    $("#plural").text(plural);
    $("#possInflection").text(possInflection);
    $("#pluralAndInflection").text(pluralAndInflection);
    $("#thirdPersonSingular").text(thirdPersonSingular);
    $("#pastTense").text(pastTense);
    $("#pastParticiple").text(pastParticiple);
    $("#progressiveVerb").text(progressiveVerb);
    $("#negativeContractions").text(negativeContractions);
    $("#contracted").text(contracted);

    $("#totalMorphemes").text(totalMorphemes);
    $("#examinerUtterances").text(examinerUtterances);
    $("#clientUtterances").text(clientUtterances);
    $("#mlu").text(mlu);
    $("#brownsStage").text(brownsStage);
    $("#ageRange").text(ageRange);
    $("#boundMorphemes").text(boundMorphemes);
    $("#mazeWords").text(mazeWords);
    $("#omittedWords").text(ommittedWords);

}   