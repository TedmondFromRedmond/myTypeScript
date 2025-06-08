let arrayData: string[] = [];

const fileInput = document.getElementById("fileInput") as HTMLInputElement;
const arrayCountDisplay = document.getElementById("arrayCount") as HTMLSpanElement;

const btnRead = document.getElementById("btnread_file")!;
const btnShow = document.getElementById("btnshow_array")!;
const btnReset = document.getElementById("btnReset")!;
const btnExit = document.getElementById("btnExit")!;

// Simulated file reading (for web demo - node version would use fs)
btnRead.addEventListener("click", async () => {
  const path = fileInput.value;
  if (!path) {
    alert("Please enter a file path.");
    return;
  }

  try {
    const response = await fetch(path);
    if (!response.ok) throw new Error("File not found");

    const text = await response.text();
    arrayData = text.split(/\r?\n/).filter(Boolean);
    arrayCountDisplay.textContent = arrayData.length.toString();
} catch (error) {
    alert(`Error: ${(error as Error).message}`);
  }
  
});

btnShow.addEventListener("click", () => {
  if (arrayData.length === 0) {
    alert("Array is empty.");
    return;
  }

  const blob = new Blob([arrayData.join("\n")], { type: "text/plain" });
  const url = URL.createObjectURL(blob);
  window.open(url, "_blank"); // Simulates notepad open
});

btnReset.addEventListener("click", () => {
  fileInput.value = "";
  arrayData = [];
  arrayCountDisplay.textContent = "0";
});

btnExit.addEventListener("click", () => {
  alert("Closing the form.");
  window.close(); // Might be blocked by browsers
});
