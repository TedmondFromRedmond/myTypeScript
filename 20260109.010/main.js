const table = document.querySelector("#csvTable");
const tableHead = table?.querySelector("thead");
const tableBody = table?.querySelector("tbody");
const statusMessage = document.querySelector("#statusMessage");
const searchInput = document.querySelector("#searchInput");
const searchButton = document.querySelector("#searchButton");
const prevMatchButton = document.querySelector("#prevMatchButton");
const nextMatchButton = document.querySelector("#nextMatchButton");
const clearSearchButton = document.querySelector("#clearSearchButton");
const searchResults = document.querySelector("#searchResults");

if (!table || !tableHead || !tableBody || !statusMessage) {
  throw new Error("Required elements are missing from the page.");
}

let currentMatchIndex = -1;
let matchingRows = [];

// Hardcoded CSV file path (relative to current page location)
// Server should be running from CIONational/ directory
// Page location: TypeScript/AIList/Sandbox/index.html
// CSV location: ArtificialIntelligence/AritificalIntelligenceMasterList/Final_v3AI_Tools_With_Websites_Descriptions_UTF8_PROCESSED.csv
// From Sandbox/ go up 3 levels (../../../) to CIONational/, then into ArtificialIntelligence/
// Hardcoded CSV file path (relative to web server root at CIONational/)
// The file is located in: TypeScript/AIList/Sandbox/Final_v3AI_Tools_With_Websites_Descriptions_UTF8_PROCESSED.csv
// If server is running from Sandbox/: use just the filename
// If server is running from CIONational/: use TypeScript/AIList/Sandbox/Final_v3AI_Tools_With_Websites_Descriptions_UTF8_PROCESSED.csv
const HARDCODED_CSV_FILENAME = "Final_v3AI_Tools_With_Websites_Descriptions_UTF8_PROCESSED.csv";


const formatStatus = (message) => {
  statusMessage.textContent = message;
};

const clearTable = () => {
  tableHead.innerHTML = "";
  tableBody.innerHTML = "";
  formatStatus("No file selected yet.");
  if (typeof clearSearch === 'function') {
    clearSearch();
  }
};

const parseCsv = (input, delimiter = ",") => {
  const rows = [];
  let currentRow = [];
  let currentCell = "";
  let inQuotes = false;
  
  for (let i = 0; i < input.length; i++) {
    const char = input[i];
    const nextChar = input[i + 1];
    const prevChar = input[i - 1];
    
    if (char === '"') {
      if (inQuotes && nextChar === '"') {
        // Escaped quote (double quote inside quoted field)
        currentCell += '"';
        i++; // Skip next quote
      } else {
        // Toggle quote state
        inQuotes = !inQuotes;
      }
    } else if (!inQuotes && char === delimiter) {
      // End of cell (not in quotes)
      currentRow.push(currentCell);
      currentCell = "";
    } else if (!inQuotes && (char === '\n' || (char === '\r' && nextChar !== '\n'))) {
      // End of row (not in quotes)
      if (char === '\r' && nextChar === '\n') {
        i++; // Skip the \n in \r\n
      }
      currentRow.push(currentCell);
      if (currentRow.length > 0 && currentRow.some(cell => cell.trim().length > 0)) {
        rows.push(currentRow.map(cell => cell.trim()));
      }
      currentRow = [];
      currentCell = "";
    } else {
      // Regular character
      currentCell += char;
    }
  }
  
  // Handle last row if file doesn't end with newline
  if (currentCell.length > 0 || currentRow.length > 0) {
    currentRow.push(currentCell);
    if (currentRow.length > 0 && currentRow.some(cell => cell.trim().length > 0)) {
      rows.push(currentRow.map(cell => cell.trim()));
    }
  }
  
  return rows;
};

const renderTable = (rows) => {
  tableHead.innerHTML = "";
  tableBody.innerHTML = "";

  if (rows.length === 0) {
    formatStatus("No rows found in the CSV.");
    return;
  }

  const headerRow = rows[0];
  
  // Debug: Header row information
  console.log("=== HEADER ROW DEBUG ===");
  console.log("Header row:", headerRow);
  console.log("Header row type:", typeof headerRow);
  console.log("Header row is array:", Array.isArray(headerRow));
  console.log("Number of headers:", headerRow?.length);
  if (Array.isArray(headerRow)) {
    console.log("Header breakdown:");
    headerRow.forEach((col, i) => {
      console.log(`  Col ${i}: type=${typeof col}, value="${col}", length=${col?.length || 0}`);
    });
  }
  console.log("========================");
  
  // Create header row
  const headerTr = document.createElement("tr");
  for (let index = 0; index < headerRow.length; index++) {
    const th = document.createElement("th");
    th.scope = "col";
    th.textContent = headerRow[index] || `Column ${index + 1}`;
    headerTr.appendChild(th);
    console.log(`Created header ${index}: "${headerRow[index] || `Column ${index + 1}`}"`);
  }
  tableHead.appendChild(headerTr);
  
  // Debug: Verify headers are in DOM
  console.log("=== DOM VERIFICATION ===");
  console.log("tableHead element:", tableHead);
  console.log("tableHead children count:", tableHead.children.length);
  console.log("headerTr element:", headerTr);
  console.log("headerTr children count:", headerTr.children.length);
  const thElements = tableHead.querySelectorAll("th");
  console.log("Total th elements in thead:", thElements.length);
  thElements.forEach((th, i) => {
    console.log(`  th[${i}]: textContent="${th.textContent}", innerHTML="${th.innerHTML}"`);
  });
  console.log("========================");

  // Process all data rows
  const bodyRows = rows.slice(1);
  
  // Find the Website column index
  const websiteColumnIndex = headerRow.findIndex(header => 
    header.toLowerCase().includes('website') || header.toLowerCase().includes('url')
  );
  
  bodyRows.forEach((row) => {
    const tr = document.createElement("tr");
    // Create cells for all columns, matching the header count
    for (let index = 0; index < headerRow.length; index++) {
      const td = document.createElement("td");
      const cellValue = row[index] ?? "";
      
      // If this is the Website column and the value looks like a URL, make it a link
      if (index === websiteColumnIndex && cellValue.trim() !== "") {
        // Check if it's already a full URL or needs http:// prefix
        let url = cellValue.trim();
        if (!url.match(/^https?:\/\//i)) {
          url = `https://${url}`;
        }
        
        const link = document.createElement("a");
        link.href = url;
        link.target = "_blank";
        link.rel = "noopener noreferrer";
        link.textContent = cellValue;
        td.appendChild(link);
      } else {
        td.textContent = cellValue;
      }
      
      tr.appendChild(td);
    }
    tableBody.appendChild(tr);
  });

  formatStatus(""); // Clear status message after loading
  
  // Debug: Final table structure check
  console.log("=== FINAL TABLE CHECK ===");
  console.log("Table HTML structure:", table.outerHTML.substring(0, 500));
  console.log("thead innerHTML:", tableHead.innerHTML);
  console.log("Number of th elements:", tableHead.querySelectorAll("th").length);
  
  // Check visibility of header elements
  const thElementsFinal = tableHead.querySelectorAll("th");
  console.log(`Total th elements found: ${thElementsFinal.length}`);
  thElementsFinal.forEach((th, i) => {
    const styles = window.getComputedStyle(th);
    const rect = th.getBoundingClientRect();
    console.log(`th[${i}] "${th.textContent}":`, {
      display: styles.display,
      visibility: styles.visibility,
      opacity: styles.opacity,
      width: styles.width,
      height: styles.height,
      color: styles.color,
      backgroundColor: styles.backgroundColor,
      position: styles.position,
      top: styles.top,
      boundingRect: {
        left: rect.left,
        top: rect.top,
        right: rect.right,
        bottom: rect.bottom,
        width: rect.width,
        height: rect.height,
        visible: rect.width > 0 && rect.height > 0
      }
    });
  });
  
  // Check table dimensions
  const tableRect = table.getBoundingClientRect();
  const wrapperRect = table.closest('.table-wrapper')?.getBoundingClientRect();
  console.log("Table dimensions:", {
    tableWidth: tableRect.width,
    tableHeight: tableRect.height,
    wrapperWidth: wrapperRect?.width,
    wrapperHeight: wrapperRect?.height
  });
  
  console.log("=========================");
};

const handleFileSelection = async () => {
  const file = fileInput.files?.[0];

  if (!file) {
    formatStatus("No file selected.");
    clearTable();
    return;
  }

  formatStatus(`Loading ${file.name}... (Expected: ${HARDCODED_CSV_FILENAME})`);

  try {
    const text = await file.text();
    const rows = parseCsv(text);
    console.log(`Parsed ${rows.length} rows from CSV`);
    
    // Debug: Check what was parsed
    if (rows.length > 0) {
      console.log("First row (raw):", rows[0]);
      console.log("First row type:", typeof rows[0]);
      console.log("First row is array:", Array.isArray(rows[0]));
      console.log("First row length:", rows[0]?.length);
      if (Array.isArray(rows[0])) {
        rows[0].forEach((val, idx) => {
          console.log(`  Header[${idx}]: type=${typeof val}, value="${val}", length=${val?.length}`);
        });
      }
    }
    
    renderTable(rows);
  } catch (error) {
    console.error("Error processing file:", error);
    formatStatus(`Error loading file: ${error.message}`);
    clearTable();
  }
};

const loadHardcodedCsv = async () => {
  // Use the hardcoded filename variable to load the file directly
  // The filename is stored in HARDCODED_CSV_FILENAME constant
  formatStatus(`Loading ${HARDCODED_CSV_FILENAME}...`);
  
  try {
    const response = await fetch(HARDCODED_CSV_FILENAME);
    if (!response.ok) {
      throw new Error(`Failed to load CSV: ${response.status} ${response.statusText}`);
    }
    const text = await response.text();
    const rows = parseCsv(text);
    console.log(`Parsed ${rows.length} rows from ${HARDCODED_CSV_FILENAME}`);
    formatStatus(`Loaded ${rows.length} rows from ${HARDCODED_CSV_FILENAME}`);
    renderTable(rows);
  } catch (error) {
    console.error("Error loading CSV file:", error);
    formatStatus(`Error loading CSV: ${error.message}`);
    clearTable();
  }
};

// CSV file loads automatically on page load (see DOMContentLoaded event below)

// Search functionality
const clearSearch = () => {
  // Remove all search highlights
  const allRows = tableBody.querySelectorAll("tr");
  allRows.forEach(row => {
    row.classList.remove("search-match", "search-current");
  });
  
  matchingRows = [];
  currentMatchIndex = -1;
  searchInput.value = "";
  searchResults.textContent = "";
  clearSearchButton.style.display = "none";
  prevMatchButton.style.display = "none";
  nextMatchButton.style.display = "none";
};

const performSearch = () => {
  const searchTerm = searchInput.value.trim().toLowerCase();
  
  if (searchTerm === "") {
    clearSearch();
    return;
  }
  
  // Clear previous highlights
  const allRows = tableBody.querySelectorAll("tr");
  allRows.forEach(row => {
    row.classList.remove("search-match", "search-current");
  });
  
  matchingRows = [];
  
  // Search through all rows
  allRows.forEach((row, rowIndex) => {
    const cells = row.querySelectorAll("td");
    let rowMatches = false;
    
    cells.forEach(cell => {
      const cellText = cell.textContent.toLowerCase();
      if (cellText.includes(searchTerm)) {
        rowMatches = true;
      }
    });
    
    if (rowMatches) {
      row.classList.add("search-match");
      matchingRows.push(row);
    }
  });
  
  // Update search results display
  if (matchingRows.length > 0) {
    currentMatchIndex = 0;
    updateMatchDisplay();
    clearSearchButton.style.display = "inline-block";
    
    // Show navigation buttons if more than one match
    if (matchingRows.length > 1) {
      prevMatchButton.style.display = "inline-block";
      nextMatchButton.style.display = "inline-block";
    } else {
      prevMatchButton.style.display = "none";
      nextMatchButton.style.display = "none";
    }
    
    // Scroll to first match
    scrollToMatch(matchingRows[0]);
  } else {
    searchResults.textContent = "No matches found";
    searchResults.classList.remove("highlight");
    clearSearchButton.style.display = "none";
    prevMatchButton.style.display = "none";
    nextMatchButton.style.display = "none";
  }
};

const updateMatchDisplay = () => {
  if (matchingRows.length === 0) return;
  
  // Remove current class from all rows
  matchingRows.forEach(row => row.classList.remove("search-current"));
  
  // Add current class to active match
  matchingRows[currentMatchIndex].classList.add("search-current");
  
  // Update display text
  searchResults.textContent = `Match ${currentMatchIndex + 1} of ${matchingRows.length}`;
  searchResults.classList.add("highlight");
  
  // Scroll to current match
  scrollToMatch(matchingRows[currentMatchIndex]);
};

const navigateToPrevious = () => {
  if (matchingRows.length === 0) return;
  currentMatchIndex = (currentMatchIndex - 1 + matchingRows.length) % matchingRows.length;
  updateMatchDisplay();
};

const navigateToNext = () => {
  if (matchingRows.length === 0) return;
  currentMatchIndex = (currentMatchIndex + 1) % matchingRows.length;
  updateMatchDisplay();
};

const scrollToMatch = (rowElement) => {
  // Get the table wrapper to scroll within
  const tableWrapper = table.closest(".table-wrapper");
  if (!tableWrapper) return;
  
  // Calculate position
  const wrapperRect = tableWrapper.getBoundingClientRect();
  const rowRect = rowElement.getBoundingClientRect();
  const wrapperScrollTop = tableWrapper.scrollTop;
  
  // Calculate the position relative to the wrapper
  const rowTop = rowRect.top - wrapperRect.top + wrapperScrollTop;
  const headerHeight = tableHead.offsetHeight || 50; // Account for sticky header
  
  // Scroll to the row, accounting for the header
  tableWrapper.scrollTo({
    top: rowTop - headerHeight - 10, // 10px padding
    behavior: "smooth"
  });
};

// Event listeners for search
searchButton.addEventListener("click", performSearch);

searchInput.addEventListener("keydown", (e) => {
  if (e.key === "Enter") {
    e.preventDefault();
    performSearch();
  } else if (e.key === "ArrowUp" && matchingRows.length > 0) {
    e.preventDefault();
    navigateToPrevious();
  } else if (e.key === "ArrowDown" && matchingRows.length > 0) {
    e.preventDefault();
    navigateToNext();
  }
});

prevMatchButton.addEventListener("click", navigateToPrevious);
nextMatchButton.addEventListener("click", navigateToNext);
clearSearchButton.addEventListener("click", clearSearch);

// Auto-load the hardcoded CSV file when page loads
window.addEventListener("DOMContentLoaded", () => {
  loadHardcodedCsv();
});
