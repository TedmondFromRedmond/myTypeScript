var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
const form = document.getElementById("userForm");
const jokeOutput = document.getElementById("jokeOutput");
const csvOutput = document.getElementById("csvOutput");
function generateUniqueID() {
    const timestamp = Date.now().toString(36);
    const randomStr = Math.random().toString(36).substring(2, 10);
    return `${timestamp}-${randomStr}`;
}
form.addEventListener("submit", (e) => __awaiter(this, void 0, void 0, function* () {
    e.preventDefault();
    const name = document.getElementById("nameInput").value;
    const age = document.getElementById("ageInput").value;
    const email = document.getElementById("emailInput").value;
    const address = document.getElementById("addressInput").value;
    const unit = document.getElementById("unitInput").value;
    const city = document.getElementById("cityInput").value;
    const state = document.getElementById("stateInput").value;
    const zip = document.getElementById("zipInput").value;
    const sameAddress = document.getElementById("sameAddressCheckbox").checked ? "Yes" : "No";
    jokeOutput.innerHTML = `<em>Fetching joke...</em>`;
    csvOutput.innerHTML = "";
    try {
        const response = yield fetch("https://api.chucknorris.io/jokes/random");
        const data = yield response.json();
        const mySubmissionUniqueID = generateUniqueID();
        const submissionCSV = `${mySubmissionUniqueID},${name},${age},${email},${address},${unit},${city},${state},${zip},${sameAddress}`;
        jokeOutput.innerHTML = `
      <strong>Here's your Chuck Norris joke:</strong><br>
      "${data.value}"`;
        csvOutput.innerHTML = `
      <strong>Submission Record (CSV):</strong><br>
      ${submissionCSV}
    `;
    }
    catch (error) {
        jokeOutput.innerHTML = "Error retrieving joke or processing submission.";
        console.error("Error:", error);
    }
}));
