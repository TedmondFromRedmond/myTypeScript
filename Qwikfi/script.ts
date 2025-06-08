const form = document.getElementById("userForm") as HTMLFormElement;
const jokeOutput = document.getElementById("jokeOutput") as HTMLParagraphElement;
const csvOutput = document.getElementById("csvOutput") as HTMLParagraphElement;

function generateUniqueID(): string {
  const timestamp = Date.now().toString(36);
  const randomStr = Math.random().toString(36).substring(2, 10);
  return `${timestamp}-${randomStr}`;
}

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const name = (document.getElementById("nameInput") as HTMLInputElement).value;
  const age = (document.getElementById("ageInput") as HTMLInputElement).value;
  const email = (document.getElementById("emailInput") as HTMLInputElement).value;
  const address = (document.getElementById("addressInput") as HTMLInputElement).value;
  const unit = (document.getElementById("unitInput") as HTMLInputElement).value;
  const city = (document.getElementById("cityInput") as HTMLInputElement).value;
  const state = (document.getElementById("stateInput") as HTMLInputElement).value;
  const zip = (document.getElementById("zipInput") as HTMLInputElement).value;
  const sameAddress = (document.getElementById("sameAddressCheckbox") as HTMLInputElement).checked ? "Yes" : "No";

  jokeOutput.innerHTML = `<em>Fetching joke...</em>`;
  csvOutput.innerHTML = "";

  try {
    const response = await fetch("https://api.chucknorris.io/jokes/random");
    const data = await response.json();

    const mySubmissionUniqueID = generateUniqueID();
    const submissionCSV = `${mySubmissionUniqueID},${name},${age},${email},${address},${unit},${city},${state},${zip},${sameAddress}`;

    jokeOutput.innerHTML = `
      <strong>Here's your Chuck Norris joke:</strong><br>
      "${data.value}"`
    ;

    csvOutput.innerHTML = `
      <strong>Submission Record (CSV):</strong><br>
      ${submissionCSV}
    `;
  } catch (error) {
    jokeOutput.innerHTML = "Error retrieving joke or processing submission.";
    console.error("Error:", error);
  }
});
