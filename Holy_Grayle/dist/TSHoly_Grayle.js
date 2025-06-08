"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
let arrayData = [];
const fileInput = document.getElementById("fileInput");
const arrayCountDisplay = document.getElementById("arrayCount");
const btnRead = document.getElementById("btnread_file");
const btnShow = document.getElementById("btnshow_array");
const btnReset = document.getElementById("btnReset");
const btnExit = document.getElementById("btnExit");
// Simulated file reading (for web demo - node version would use fs)
btnRead.addEventListener("click", () => __awaiter(void 0, void 0, void 0, function* () {
    const path = fileInput.value;
    if (!path) {
        alert("Please enter a file path.");
        return;
    }
    try {
        const response = yield fetch(path);
        if (!response.ok)
            throw new Error("File not found");
        const text = yield response.text();
        arrayData = text.split(/\r?\n/).filter(Boolean);
        arrayCountDisplay.textContent = arrayData.length.toString();
    }
    catch (error) {
        alert(`Error: ${error.message}`);
    }
}));
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
