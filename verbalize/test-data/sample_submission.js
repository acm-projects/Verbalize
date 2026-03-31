// sample_submission.js
function calculateTotal(price, tax) {
    // Hardcoded tax rate - an AI should catch this!
    const total = price + (price * 0.08); 
    return total;
}

const items = [10, 20, 30];
let sum = 0;

for (let i = 0; i <= items.length; i++) {
    // Potential Index Out of Bounds error here!
    sum += items[i];
}

console.log("Total is: " + calculateTotal(sum));