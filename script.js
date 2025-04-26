// Modal Management
function openCalculator(calculatorId) {
  const calculatorModal = document.getElementById("calculatorModal");
  calculatorModal.style.display = "flex"; // Show the modal

  const calculators = document.querySelectorAll(".calculator-tool");
  calculators.forEach((calc) => (calc.style.display = "none")); // Hide all calculators

  const selectedCalculator = document.getElementById(calculatorId);
  if (selectedCalculator) {
    selectedCalculator.style.display = "block"; // Show the selected calculator
  }
}

function closeCalculator() {
  const calculatorModal = document.getElementById("calculatorModal");
  calculatorModal.style.display = "none"; // Hide the modal
}

function closeModal() {
  const modal = document.querySelector('.modal'); // Select the modal
  if (modal) {
    modal.style.display = 'none'; // Hide the modal
  }
}

// Show Spinner
function showSpinner() {
  document.getElementById("loadingSpinner").style.display = "block";
}

// Hide Spinner
function hideSpinner() {
  document.getElementById("loadingSpinner").style.display = "none";
}

// Basic Calculator Functions
let basicInput = document.getElementById("basicInput");

function appendToBasicInput(value) {
  const basicInput = document.getElementById("basicInput");
  basicInput.value += value;
}

function clearBasicInput() {
  basicInput.value = "";
}

function calculateBasic() {
  try {
    basicInput.value = eval(basicInput.value);
  } catch (error) {
    basicInput.value = "Error";
  }
}

// Scientific Calculator Functions
function appendToScientificInput(value) {
  const scientificInput = document.getElementById("scientificInput");
  scientificInput.value += value;
}

function clearScientificInput() {
  const input = document.getElementById('scientificInput');
  input.value = '';
}

function calculateScientific() {
  const input = document.getElementById('scientificInput');
  try {
    input.value = eval(input.value); // Evaluate the expression
  } catch (error) {
    input.value = 'Error';
  }
}

// Enable manual typing for both calculators
document.getElementById("basicInput").addEventListener("input", function (event) {
  this.value = this.value.replace(/[^0-9+\-*/.]/g, ""); // Allow only numbers and basic operators
});

document.getElementById("scientificInput").addEventListener("input", function (event) {
  this.value = this.value.replace(/[^0-9+\-*/().sqrtMathsinlogPI]/g, ""); // Allow numbers, operators, and scientific functions
});

// Age Calculator Functions
function calculateAge() {
  const birthDate = document.getElementById('birthDate').value;
  const todaysDate = document.getElementById('todaysDate').value || new Date().toISOString().split('T')[0]; // Default to today's date if empty
  const ageResult = document.getElementById('ageResult');

  if (birthDate && todaysDate) {
    const birth = new Date(birthDate);
    const today = new Date(todaysDate);

    if (birth > today) {
      ageResult.textContent = 'Birth date cannot be in the future.';
      return;
    }

    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();
    const dayDiff = today.getDate() - birth.getDate();

    if (monthDiff < 0 || (monthDiff === 0 && dayDiff < 0)) {
      age--;
    }

    ageResult.textContent = `Your age is ${age} years.`;
  } else {
    ageResult.textContent = 'Please select both dates.';
  }
}

// BMI Calculator Functions
function calculateBMI() {
  const weight = parseFloat(document.getElementById('bmiWeight').value);
  const height = parseFloat(document.getElementById('bmiHeight').value) / 100; // Convert cm to meters
  const bmiResult = document.getElementById('bmiResult');
  if (weight > 0 && height > 0) {
    const bmi = (weight / (height * height)).toFixed(2);
    bmiResult.textContent = `Your BMI is ${bmi}.`;
  } else {
    bmiResult.textContent = 'Please enter valid weight and height.';
  }
}

// Global variable to store exchange rates
let exchangeRates = {};
let currencyNames = {}; // To store currency codes and their full names

// Fetch currency data from the API once
async function fetchCurrencies() {
  const apiKey = 'e81c437e379f3494f4f6302b'; // Your API key
  const apiUrl = `https://v6.exchangerate-api.com/v6/${apiKey}/latest/USD`;
  try {
    const response = await fetch(apiUrl);
    if (!response.ok) {
      throw new Error('Failed to fetch currency data');
    }
    const data = await response.json();
    exchangeRates = data.conversion_rates; // Save rates in memory
    return data;
  } catch (error) {
    console.error('Error fetching currency data:', error);
    alert('Failed to fetch currency data. Please try again later.');
  }
}

// Fetch currency names (optional, for full names)
async function fetchCurrencyNames() {
  const apiUrl = 'https://openexchangerates.org/api/currencies.json'; // Replace with your API endpoint
  try {
    const response = await fetch(apiUrl);
    if (!response.ok) {
      throw new Error('Failed to fetch currency names');
    }
    const data = await response.json();
    currencyNames = data; // Save currency names in memory
  } catch (error) {
    console.error('Error fetching currency names:', error);
    alert('Failed to fetch currency names. Please try again later.');
  }
}

// Filter currencies in the dropdown based on the search input
function filterCustomDropdown(dropdownId, searchInputId) {
  const searchValue = document.getElementById(searchInputId).value.toLowerCase();
  const dropdown = document.getElementById(dropdownId);

  // Loop through all options in the dropdown
  for (const option of dropdown.options) {
    const currencyName = option.textContent.toLowerCase();
    const currencyCode = option.value.toLowerCase();

    // Show the option if it matches the search value
    if (currencyName.includes(searchValue) || currencyCode.includes(searchValue)) {
      option.style.display = '';
    } else {
      option.style.display = 'none';
    }
  }
}

// Reset the search input when the dropdown is clicked
function resetSearch(searchInputId) {
  document.getElementById(searchInputId).value = '';
  const event = new Event('input');
  document.getElementById(searchInputId).dispatchEvent(event);
}

// Populate currency dropdowns
async function populateCurrencyDropdowns() {
  await fetchCurrencyNames(); // Fetch currency names first
  const data = await fetchCurrencies();
  if (!data) return;

  const currencyFrom = document.getElementById('currencyFrom');
  const currencyTo = document.getElementById('currencyTo');

  // Populate dropdowns with currency codes and full names
  for (const currency in exchangeRates) {
    const optionFrom = document.createElement('option');
    const optionTo = document.createElement('option');
    optionFrom.value = currency;
    optionTo.value = currency;

    // Use full name if available, otherwise fallback to the currency code
    optionFrom.textContent = currencyNames[currency] || currency;
    optionTo.textContent = currencyNames[currency] || currency;

    currencyFrom.appendChild(optionFrom);
    currencyTo.appendChild(optionTo);
  }

  // Set default values
  currencyFrom.value = 'USD'; // Default to US Dollar
  currencyTo.value = 'EUR'; // Default to Euro
}

// Convert currency using stored rates
function convertCurrency() {
  const amount = parseFloat(document.getElementById('currencyAmount').value);
  const fromCurrency = document.getElementById('currencyFrom').value;
  const toCurrency = document.getElementById('currencyTo').value;
  const convertedAmountElement = document.getElementById('convertedAmount');

  if (isNaN(amount) || amount <= 0) {
    convertedAmountElement.value = 'Invalid amount';
    return;
  }

  const fromRate = exchangeRates[fromCurrency];
  const toRate = exchangeRates[toCurrency];

  if (!fromRate || !toRate) {
    convertedAmountElement.value = 'Conversion failed';
    return;
  }

  const convertedAmount = (amount / fromRate) * toRate;
  convertedAmountElement.value = convertedAmount.toFixed(4); // Show up to 4 decimal places
}

// Populate dropdowns on page load
window.addEventListener('DOMContentLoaded', populateCurrencyDropdowns);

// Temperature Converter
function convertTemperature() {
  const tempInput = parseFloat(document.getElementById("tempInput").value);
  const tempFrom = document.getElementById("tempFrom").value;
  const tempTo = document.getElementById("tempTo").value;
  let result;

  if (tempFrom === tempTo) {
    result = tempInput;
  } else if (tempFrom === "C" && tempTo === "F") {
    result = (tempInput * 9) / 5 + 32;
  } else if (tempFrom === "C" && tempTo === "K") {
    result = tempInput + 273.15;
  } else if (tempFrom === "F" && tempTo === "C") {
    result = ((tempInput - 32) * 5) / 9;
  } else if (tempFrom === "F" && tempTo === "K") {
    result = ((tempInput - 32) * 5) / 9 + 273.15;
  } else if (tempFrom === "K" && tempTo === "C") {
    result = tempInput - 273.15;
  } else if (tempFrom === "K" && tempTo === "F") {
    result = ((tempInput - 273.15) * 9) / 5 + 32;
  }

  document.getElementById("tempResult").textContent = `Result: ${result.toFixed(2)} ${tempTo}`;
}

// Length Converter
function convertLength() {
  const lengthInput = parseFloat(document.getElementById("lengthInput").value);
  const lengthFrom = document.getElementById("lengthFrom").value;
  const lengthTo = document.getElementById("lengthTo").value;
  const conversionRates = {
    m: { m: 1, km: 0.001, ft: 3.28084, mi: 0.000621371 },
    km: { m: 1000, km: 1, ft: 3280.84, mi: 0.621371 },
    ft: { m: 0.3048, km: 0.0003048, ft: 1, mi: 0.000189394 },
    mi: { m: 1609.34, km: 1.60934, ft: 5280, mi: 1 },
  };

  const result = lengthInput * conversionRates[lengthFrom][lengthTo];
  document.getElementById("lengthResult").textContent = `Result: ${result.toFixed(2)} ${lengthTo}`;
}

// Weight Converter
function convertWeight() {
  const weightInput = parseFloat(document.getElementById("weightInput").value);
  const weightFrom = document.getElementById("weightFrom").value;
  const weightTo = document.getElementById("weightTo").value;
  const conversionRates = {
    kg: { kg: 1, lb: 2.20462, g: 1000 },
    lb: { kg: 0.453592, lb: 1, g: 453.592 },
    g: { kg: 0.001, lb: 0.00220462, g: 1 },
  };

  const result = weightInput * conversionRates[weightFrom][weightTo];
  document.getElementById("weightResult").textContent = `Result: ${result.toFixed(2)} ${weightTo}`;
}

// Date Difference Calculator
function calculateDateDifference() {
  const startDate = new Date(document.getElementById("startDate").value);
  const endDate = new Date(document.getElementById("endDate").value);
  const resultElement = document.getElementById("dateDifferenceResult");

  if (isNaN(startDate) || isNaN(endDate)) {
    resultElement.textContent = "Please select valid dates.";
    return;
  }

  const differenceInTime = Math.abs(endDate - startDate); // Absolute difference in milliseconds
  const differenceInDays = Math.ceil(differenceInTime / (1000 * 60 * 60 * 24)); // Convert to days

  resultElement.textContent = `Difference: ${differenceInDays} days`; // Display the result
}

// Discount Calculator
function calculateDiscount() {
  const originalPrice = parseFloat(document.getElementById("originalPrice").value);
  const discountPercentage = parseFloat(document.getElementById("discountPercentage").value);

  if (!isNaN(originalPrice) && !isNaN(discountPercentage)) {
    const discountAmount = (originalPrice * discountPercentage) / 100;
    const finalPrice = originalPrice - discountAmount;

    // Update this line to remove the dollar sign
    document.getElementById("discountResult").textContent = `Final Price: ${finalPrice.toFixed(2)}`;
  } else {
    document.getElementById("discountResult").textContent = "Please enter valid numbers.";
  }
}

// Loan/EMI Calculator
function calculateEMI() {
  const loanAmount = parseFloat(document.getElementById("loanAmount").value);
  const interestRate = parseFloat(document.getElementById("interestRate").value) / 12 / 100; // Monthly interest rate
  const loanDuration = parseInt(document.getElementById("loanDuration").value); // Loan duration in months

  // Validate inputs
  if (isNaN(loanAmount) || isNaN(interestRate) || isNaN(loanDuration) || loanAmount <= 0 || loanDuration <= 0) {
    document.getElementById("emiResult").textContent = "Please enter valid numbers.";
    return;
  }

  // EMI Calculation Formula
  const emi = (loanAmount * interestRate * Math.pow(1 + interestRate, loanDuration)) /
              (Math.pow(1 + interestRate, loanDuration) - 1);

  // Display the result
  document.getElementById("emiResult").textContent = `Monthly EMI: ${emi.toFixed(2)}`;
}

// Unit Converter
function convertUnit() {
  const unitInput = parseFloat(document.getElementById("unitInput").value);
  const unitFrom = document.getElementById("unitFrom").value;
  const unitTo = document.getElementById("unitTo").value;
  const conversionRates = {
    kmh: { kmh: 1, mph: 0.621371 },
    mph: { kmh: 1.60934, mph: 1 },
    sqm: { sqm: 1, sqft: 10.7639 },
    sqft: { sqm: 0.092903, sqft: 1 },
    liters: { liters: 1, gallons: 0.264172 },
    gallons: { liters: 3.78541, gallons: 1 },
    kb: { kb: 1, mb: 0.001, gb: 0.000001 },
    mb: { kb: 1000, mb: 1, gb: 0.001 },
    gb: { kb: 1000000, mb: 1000, gb: 1 },
  };

  const result = unitInput * conversionRates[unitFrom][unitTo];
  document.getElementById("unitResult").textContent = `Result: ${result.toFixed(2)} ${unitTo}`;
}

// Delete and Clear Input Functions
let holdTimeout; // Variable to track the hold timeout
let isHolding = false; // Track if the button is being held

function deleteCharacter() {
  const input = document.getElementById("basicInput"); // Replace with your input field's ID
  input.value = input.value.slice(0, -1); // Remove the last character
}

function clearInput() {
  const input = document.getElementById("basicInput"); // Replace with your input field's ID
  input.value = ""; // Clear the input field
}

function handleDeleteButton(event) {
  event.preventDefault(); // Prevent default behavior (e.g., text selection)
  isHolding = false; // Reset holding state

  // Start the hold timeout
  holdTimeout = setTimeout(() => {
    isHolding = true; // Set holding state
    clearInput(); // Clear all input if the button is held
  }, 500); // Adjust the hold duration (500ms in this case)
}

function handleDeleteButtonRelease(event) {
  event.preventDefault(); // Prevent default behavior
  clearTimeout(holdTimeout); // Clear the timeout when the button is released

  if (!isHolding) {
    deleteCharacter(); // Delete one character if the button is clicked
  }

  isHolding = false; // Reset holding state
}
