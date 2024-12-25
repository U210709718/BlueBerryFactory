// Show specific section
function showSection(sectionId) {
    const sections = document.querySelectorAll('.operations-section');
    sections.forEach(section => {
        section.style.display = section.id === sectionId ? 'block' : 'none';
    });
}

//******************************************************************* SECTION 1****************************************************************************** */

// **PART 1 : Farmer Information:


// Farmers data stored in local storage
function saveFarmersToLocalStorage(farmers) {
    localStorage.setItem("farmers", JSON.stringify(farmers));
}

function getFarmersFromLocalStorage() {
    return JSON.parse(localStorage.getItem("farmers")) || [];
}

// Farmers array
const farmers = getFarmersFromLocalStorage();

// Add a new farmer
function addFarmer(id, name, location, contact, products) {
    if (farmers.some(farmer => farmer.id === id)) {
        alert("Farmer ID must be unique!");
        return;
    }
    farmers.push({ id, name, location, contact, products });
    saveFarmersToLocalStorage(farmers);
    renderFarmers();
    alert(`Farmer ${name} added successfully!`);
}

// Update an existing farmer
function updateFarmer(id, updatedName, updatedLocation, updatedContact, updatedProducts) {
    const farmerIndex = farmers.findIndex(farmer => farmer.id === id);
    if (farmerIndex === -1) {
        alert("Farmer not found!");
        return;
    }
    farmers[farmerIndex] = {
        id,
        name: updatedName,
        location: updatedLocation,
        contact: updatedContact,
        products: updatedProducts,
    };
    saveFarmersToLocalStorage(farmers);
    renderFarmers();
    alert(`Farmer ${updatedName} updated successfully!`);
}

// Delete a farmer
function deleteFarmer(id) {
    const farmerIndex = farmers.findIndex(farmer => farmer.id === id);
    if (farmerIndex === -1) {
        alert("Farmer not found!");
        return;
    }
    farmers.splice(farmerIndex, 1);
    saveFarmersToLocalStorage(farmers);
    renderFarmers();
    alert(`Farmer with ID ${id} deleted successfully!`);
}

// Render farmers in the table
function renderFarmers() {
    const tbody = document.getElementById("farmersTable").querySelector("tbody");
    tbody.innerHTML = "";

    farmers.forEach(farmer => {
        const row = document.createElement("tr");
        row.innerHTML = `
            <td>${farmer.id}</td>
            <td>${farmer.name}</td>
            <td>${farmer.location}</td>
            <td>${farmer.contact}</td>
            <td>${farmer.products}</td>
            <td>
                <button onclick="editFarmer('${farmer.id}')">Edit</button>
                <button onclick="deleteFarmer('${farmer.id}')">Delete</button>
            </td>
        `;
        tbody.appendChild(row);
    });
}

// Handle form submission for adding a farmer
function handleAddFarmer(e) {
    e.preventDefault();
    const id = document.getElementById("farmerId").value.trim();
    const name = document.getElementById("farmerName").value.trim();
    const location = document.getElementById("farmerLocation").value.trim();
    const contact = document.getElementById("farmerContact").value.trim();
    const products = document.getElementById("farmerProducts").value.trim();

    if (!id || !name || !location || !contact || !products) {
        alert("Please fill in all fields correctly.");
        return;
    }

    addFarmer(id, name, location, contact, products);
    document.getElementById("farmerForm").reset();
}

// Handle edit farmer
function editFarmer(id) {
    const farmer = farmers.find(farmer => farmer.id === id);
    if (!farmer) {
        alert("Farmer not found!");
        return;
    }
    document.getElementById("farmerId").value = farmer.id;
    document.getElementById("farmerName").value = farmer.name;
    document.getElementById("farmerLocation").value = farmer.location;
    document.getElementById("farmerContact").value = farmer.contact;
    document.getElementById("farmerProducts").value = farmer.products;
    document.getElementById("submitFarmerButton").textContent = "Update Farmer";

    farmerForm.onsubmit = (e) => {
        e.preventDefault();
        updateFarmer(
            farmer.id,
            document.getElementById("farmerName").value.trim(),
            document.getElementById("farmerLocation").value.trim(),
            document.getElementById("farmerContact").value.trim(),
            document.getElementById("farmerProducts").value.trim()
        );
        document.getElementById("submitFarmerButton").textContent = "Add Farmer";
        farmerForm.onsubmit = handleAddFarmer;
        farmerForm.reset();
    };
}

// Search farmers by name or location
function searchFarmers() {
    const query = document.getElementById("searchInput").value.trim().toLowerCase();
    const criteria = document.getElementById("searchCriteria").value;

    const filteredFarmers = farmers.filter(farmer => 
        farmer[criteria]?.toLowerCase().includes(query)
    );

    renderFilteredFarmers(filteredFarmers);
}

function renderFilteredFarmers(filteredFarmers) {
    const tbody = document.getElementById("farmersTable").querySelector("tbody");
    tbody.innerHTML = "";

    filteredFarmers.forEach(farmer => {
        const row = document.createElement("tr");
        row.innerHTML = `
            <td>${farmer.id}</td>
            <td>${farmer.name}</td>
            <td>${farmer.location}</td>
            <td>${farmer.contact}</td>
            <td>${farmer.products}</td>
            <td>
                <button onclick="editFarmer('${farmer.id}')">Edit</button>
                <button onclick="deleteFarmer('${farmer.id}')">Delete</button>
            </td>
        `;
        tbody.appendChild(row);
    });
}

// Export farmers to Excel
function exportFarmersToCSV() {
    const csvContent = "data:text/csv;charset=utf-8," +
        "Farmer ID,Name,Location, Contact, Products\n" +
        farmers.map(farmer => `${farmer.id},${farmer.name},${farmer.location},${farmer.contact},${farmer.products}`).join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "farmers.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

// Attach event listeners
document.getElementById("farmerForm").onsubmit = handleAddFarmer;
document.getElementById("searchInput").addEventListener("input", searchFarmers);
// Initial rendering of farmers
renderFarmers();


function getFarmerFromLocalStorage(identifier) {
    const farmers = JSON.parse(localStorage.getItem("farmers")) || [];
    return farmers.find(farmer => farmer.id === identifier || farmer.name.toLowerCase() === identifier.toLowerCase());
}

// ***********PART 2: Purchase Records : 

let purchaseRecords = [];
// Function to get farmer ID from local storage

function getFarmerIdFromLocalStorage(farmerId) {
    const farmers = getFarmersFromLocalStorage();
    console.log("Searching for Farmer ID:", farmerId);
    console.log("Farmers Available:", farmers);
    const farmer = farmers.find(farmer => farmer.id === farmerId);
    console.log("Farmer Found:", farmer);
    return farmer ? farmer.id : null;
}

// Function to get farmers from local storage
function getFarmerFromLocalStorage(identifier) {
    const farmers = getFarmersFromLocalStorage();
    const farmer = farmers.find(farmer => farmer.id === identifier || farmer.name.toLowerCase() === identifier.toLowerCase());
    return farmer;
}

function loadPurchaseRecordsFromLocalStorage() {
    const savedPurchaseRecords = localStorage.getItem("purchaseRecords");
    purchaseRecords = savedPurchaseRecords ? JSON.parse(savedPurchaseRecords) : [];
    console.log("Loaded Purchase Records:", purchaseRecords); // Debug log
}


// Function to render purchase records in the table
function renderPurchaseRecords() {
    const purchases = JSON.parse(localStorage.getItem("purchaseRecords")) || [];
    const tbody = document.querySelector('#purchasesTable tbody');
    tbody.innerHTML = '';

    purchases.forEach((record, index) => {
        const row = `
            <tr>
                <td>${record.purchaseId}</td>
                <td>${record.farmerId}</td>
                <td>${record.purchaseDate}</td>
                <td>${record.quantity.toFixed(2)} kg</td>
                <td>$${record.pricePerKg.toFixed(2)}</td>
                <td>$${record.totalCost.toFixed(2)}</td>
                <td>
                    <button onclick="deletePurchase(${index})" class="btn btn-danger">Delete</button>
                </td>
            </tr>
        `;
        tbody.innerHTML += row;
    });
}



function savePurchaseRecordsToLocalStorage() {
    localStorage.setItem("purchaseRecords", JSON.stringify(purchaseRecords));
}

// Function to handle adding a new purchase record
function handleAddPurchase() {
    const purchaseId = document.getElementById('purchaseId').value.trim();
    const farmerId = document.getElementById('purchaseFarmerId').value.trim();
    const purchaseDate = document.getElementById('purchaseDate').value;
    const quantity = parseFloat(document.getElementById('purchaseQuantity').value);
    const pricePerKg = parseFloat(document.getElementById('purchasePricePerKg').value);

    if (!purchaseId || !farmerId || !purchaseDate || isNaN(quantity) || isNaN(pricePerKg)) {
        alert("Please fill in all fields correctly.");
        return;
    }

    const farmer = getFarmerFromLocalStorage(farmerId);
    if (!farmer) {
        alert("Farmer not found. Please ensure the farmer is registered.");
        return;
    }

    const totalCost = quantity * pricePerKg;

    // Load existing purchase records
    loadPurchaseRecordsFromLocalStorage();

    // Check for duplicate purchase IDs
    if (purchaseRecords.some(record => record.purchaseId === purchaseId)) {
        alert("Purchase ID must be unique!");
        return;
    }

    // Add the new purchase record
    const purchase = {
        purchaseId,
        farmerId: farmer.id,
        farmerName: farmer.name,
        farmerContact: farmer.contact,
        purchaseDate,
        quantity,
        pricePerKg,
        totalCost,
        isProcessed: false,
    };
    purchaseRecords.push(purchase);

    // Save the updated purchase records to localStorage
    savePurchaseRecordsToLocalStorage();
    renderPurchaseRecords();

    // Reset the form
    document.getElementById("purchaseForm").reset();
    alert("Purchase added successfully!");
    renderPurchaseRecords();
}

// function updateInventoryFromPurchases(purchaseId, quantity, category = "Fresh") {
//     const inventory = JSON.parse(localStorage.getItem("inventory")) || [];

//     // Find if the purchase already exists in inventory
//     let inventoryItem = inventory.find(item => item.itemId === purchaseId);

//     if (inventoryItem) {
//         // Update the quantity of the existing item
//         inventoryItem.quantity += quantity;
//     } else {
//         // Create a new inventory item
//         inventory.push({
//             itemId: purchaseId,
//             category: category, // Default to "Fresh"
//             quantity: quantity,
//             reorderLevel: "undefined", // Add appropriate defaults
//             restockDate: "Not set",
//             storageLocation: "undefined",
//             farmerName: "undefined",
//             contactInformation: "undefined",
//         });
//     }

//     localStorage.setItem("inventory", JSON.stringify(inventory));
//     renderInventoryTable(); // Update the inventory table UI
// }
    


// Function to delete a purchase record
function deletePurchase(index) {
    const purchaseRecords = JSON.parse(localStorage.getItem("purchaseRecords")) || [];
    const inventory = JSON.parse(localStorage.getItem("inventory")) || [];
    const purchase = purchaseRecords[index];

    if (!purchase) {
        alert("Purchase not found!");
        return;
    }

    // Find corresponding inventory item
    const inventoryItem = inventory.find(item => item.itemId === purchase.itemId); // Ensure the correct linking attribute is used
    if (inventoryItem) {
        inventoryItem.quantity += purchase.quantity; // Add back the quantity from the deleted purchase
    } else {
        alert("Matching inventory item not found.");
    }

    // Save updated inventory to localStorage
    localStorage.setItem("inventory", JSON.stringify(inventory));

    // Remove the purchase from purchase records
    purchaseRecords.splice(index, 1);
    localStorage.setItem("purchaseRecords", JSON.stringify(purchaseRecords));

    // Re-render the inventory and purchase tables
    renderInventoryTable();
    renderPurchaseRecords(); // Make sure this function exists and properly renders the purchases
    alert("Purchase deleted successfully and inventory updated.");
}





// Function to sort purchase records
function sortPurchases(criteria) {
    purchaseRecords.sort((a, b) => {
        if (criteria === 'date') {
            return new Date(a.purchaseDate) - new Date(b.purchaseDate);
        } else if (criteria === 'farmerId') {
            return a.farmerId.localeCompare(b.farmerId);
        } else if (criteria === 'totalCost') {
            return a.totalCost - b.totalCost;
        }
    });
    renderPurchaseRecords();
}

// Function to generate purchase summaries
function generateSummary(farmerId) {
    const farmerRecords = purchaseRecords.filter(record => record.farmerId === farmerId);

    const totalQuantity = farmerRecords.reduce((sum, record) => sum + record.quantity, 0);
    const totalCost = farmerRecords.reduce((sum, record) => sum + record.totalCost, 0);

    console.log(`Summary for Farmer ${farmerId}:`);
    console.log(`Total Quantity: ${totalQuantity} kg`);
    console.log(`Total Cost: $${totalCost.toFixed(2)}`);
}

// Function to apply changes in inventory based on unprocessed purchases
function updateInventoryFromUnprocessedPurchases() {
    const purchaseRecords = JSON.parse(localStorage.getItem("purchaseRecords")) || [];
    const inventory = JSON.parse(localStorage.getItem("inventory")) || [];
    const farmers = JSON.parse(localStorage.getItem("farmers")) || [];

    purchaseRecords.forEach((purchase) => {
        if (!purchase.isProcessed) {
            const farmer = farmers.find((f) => f.id === purchase.farmerId);

            // Check if the purchase is already in the inventory
            const existingItem = inventory.find((item) => item.itemId === purchase.purchaseId);

            if (existingItem) {
                // Update existing item
                existingItem.quantity += purchase.quantity; // Increment quantity
            } else {
                // Add new item to the inventory
                inventory.push({
                    itemId: purchase.purchaseId,
                    category: "Fresh", // Default to "Fresh"
                    quantity: purchase.quantity,
                    reorderLevel: 50, // Default reorder level
                    restockDate: purchase.purchaseDate,
                    storageLocation: farmer ? farmer.location : "Unknown",
                    farmerName: farmer ? farmer.name : "Unknown",
                    farmerContact: farmer ? farmer.contact : "Unknown",
                });
            }

            // Mark the purchase as processed
            purchase.isProcessed = true;
        }
    });

    // Save updated data to localStorage
    localStorage.setItem("inventory", JSON.stringify(inventory));
    localStorage.setItem("purchaseRecords", JSON.stringify(purchaseRecords));

    // Re-render inventory table
    renderInventoryTable();
}

// Call this function during the DOMContentLoaded event
document.addEventListener("DOMContentLoaded", () => {
    try {
        console.log("Starting DOMContentLoaded Initialization...");

        loadFarmers();
        attachEventListenersToFarmers();

        initializePurchaseRecords();
        loadPurchaseRecordsFromLocalStorage();
        updateInventoryFromUnprocessedPurchases(); // Only update inventory for unprocessed purchases

        initializeCategorySummary();
        updateCategorySummaryTable();

        renderPurchaseRecords();
        renderInventoryTable();
        renderOrdersTables();
        attachAdditionalListeners();

        const chartContainer = document.getElementById("section3SalesChart");
        if (chartContainer) {
            renderSalesChartSection3();
        } else {
            console.warn("Sales Chart container not found.");
        }

        console.log("DOMContentLoaded Initialization Completed Successfully.");
    } catch (error) {
        console.error("Error during DOMContentLoaded Initialization:", error);
    }
});






function initializePurchaseRecords() {
    const purchases = JSON.parse(localStorage.getItem("purchaseRecords")) || [];
    purchases.forEach(purchase => {
        if (purchase.isProcessed === undefined) {
            purchase.isProcessed = false; // Default to false for unprocessed records
        }
    });
    localStorage.setItem("purchaseRecords", JSON.stringify(purchases));
}





function saveInventory() {
    localStorage.setItem("inventory", JSON.stringify(inventory));
}

function addInventoryItem(newItem) {
    inventory.push(newItem);
    saveInventory(); // Save changes to localStorage
}

function deleteInventoryItem(itemId) {
    inventory = inventory.filter(item => item.itemId !== itemId);
    saveInventory(); // Save changes to localStorage
}




function handleInventoryUpdate(itemId, newQuantity) {
    const purchases = JSON.parse(localStorage.getItem("purchaseRecords")) || [];
    const inventoryItem = inventory.find(item => item.itemId === itemId);

    if (inventoryItem) {
        inventoryItem.quantity = newQuantity;

        // Find the corresponding purchase record and update its quantity and total cost
        const purchase = purchases.find(p => p.purchaseId === itemId);
        if (purchase) {
            purchase.quantity = newQuantity;
            purchase.totalCost = purchase.quantity * purchase.pricePerKg; // Recalculate total cost
        }

        // Save updates
        localStorage.setItem("purchaseRecords", JSON.stringify(purchases));
        saveInventory();
        renderInventoryTable();
        renderPurchaseRecords(); // Re-render purchase records
        updateInventoryQuantity(itemId, newQuantity); // Update inventory data
        calculateInventoryTurnover(); // Recalculate turnover rates
    }
}




window.onload = function () {
    
    loadPurchaseRecordsFromLocalStorage(); // Load existing 
    renderInventoryTable(); // Render the inventory table with updated data
    renderPurchaseRecords(); // Populate the table
};


//***************************************************************** SECTION 2 ********************************************************************* */
// Define the weights for each category in grams
const categoryWeights = {
    small: 100,
    medium: 250,
    large: 500,
    extraLarge: 1000,
    familyPack: 2000,
    bulkPack: 5000,
    premium: 0, // Custom, needs user input
};

// Initialize inventory data
let inventoryData = {
    small: { stock: 100, threshold: 20 },
    medium: { stock: 50, threshold: 15 },
    large: { stock: 30, threshold: 10 },
    extraLarge: { stock: 20, threshold: 5 },
    familyPack: { stock: 10, threshold: 3 },
    bulkPack: { stock: 5, threshold: 2 },
    premium: { stock: 0, threshold: 0 }, // Custom restock logic
};

localStorage.setItem("inventoryData", JSON.stringify(inventoryData));

// Populate the Farmer ID dropdown
function loadFarmers() {
    const farmers = JSON.parse(localStorage.getItem("farmers")) || [];
    const farmerSelect = document.getElementById("farmerSelect");

    farmerSelect.innerHTML = "<option value=''>Select Farmer</option>";
    farmers.forEach(farmer => {
        const option = document.createElement("option");
        option.value = farmer.id;
        option.textContent = farmer.name; // Display name for better clarity
        farmerSelect.appendChild(option);
    });
}

// Populate the Purchase ID dropdown based on the selected Farmer ID
function loadPurchaseIds() {
    const farmerId = document.getElementById("farmerSelect").value.trim();
    const purchaseRecords = JSON.parse(localStorage.getItem("purchaseRecords")) || [];
    const purchaseSelect = document.getElementById("purchaseSelect");

    purchaseSelect.innerHTML = "<option value=''>Select Purchase</option>";
    purchaseRecords
        .filter(record => record.farmerId === farmerId)
        .forEach(record => {
            const option = document.createElement("option");
            option.value = record.purchaseId;
            option.textContent = `ID: ${record.purchaseId} - ${record.quantity}kg`;
            purchaseSelect.appendChild(option);
        });
}

// Fetch and display details of the selected purchase
function updatePurchaseDetails() {
    const purchaseId = document.getElementById("purchaseSelect").value.trim();
    const purchaseRecords = JSON.parse(localStorage.getItem("purchaseRecords")) || [];
    const selectedPurchase = purchaseRecords.find(record => record.purchaseId === purchaseId);

    if (selectedPurchase) {
        const formattedDate = new Date(selectedPurchase.purchaseDate).toLocaleDateString();
        document.getElementById("purchaseDetails").textContent =
            `Farmer: ${selectedPurchase.farmerId}, Quantity: ${selectedPurchase.quantity}kg, Date: ${formattedDate}`;
    } else {
        document.getElementById("purchaseDetails").textContent = "No purchase selected.";
    }

}

function handlePackaging() {
    const farmerId = document.getElementById("farmerSelect").value.trim();
    const purchaseId = document.getElementById("purchaseSelect").value.trim();
    const category = document.getElementById("categorySelect").value.trim();
    const numberOfPackages = parseInt(document.getElementById("quantity").value.trim(), 10);


    if (!farmerId || !purchaseId || !category || isNaN(numberOfPackages) || numberOfPackages <= 0) {
        document.getElementById("packagingStatus").textContent = "Please fill in all fields correctly.";
        return;
    }

    let packageWeight = categoryWeights[category];
    if (category === 'premium') {
        packageWeight = parseInt(prompt("Enter the weight for the premium category (in grams):"));
        if (!packageWeight) {
            document.getElementById("packagingStatus").textContent = "Invalid weight entered for premium category.";
            return;
        }
    }

    const totalWeightToPackage = (packageWeight / 1000) * numberOfPackages;
    const purchaseRecords = JSON.parse(localStorage.getItem("purchaseRecords")) || [];
    const purchaseRecord = purchaseRecords.find(record => record.purchaseId === purchaseId);

    if (!purchaseRecord) {
        document.getElementById("packagingStatus").textContent = "Purchase not found.";
        return;
    }

    const availableQuantity = purchaseRecord.quantity;

    if (totalWeightToPackage > availableQuantity) {
        // Handle exceeded order
        const exceededOrders = JSON.parse(localStorage.getItem("exceededOrders")) || [];
        exceededOrders.push({
            farmerId,
            purchaseId,
            category,
            requestedQuantity: totalWeightToPackage,
            availableStock: availableQuantity
        });
        localStorage.setItem("exceededOrders", JSON.stringify(exceededOrders));
        document.getElementById("packagingStatus").textContent = "Packaging request exceeds available stock.";
    } else {
        // Handle normal order
        purchaseRecord.quantity -= totalWeightToPackage;
        const normalOrders = JSON.parse(localStorage.getItem("normalOrders")) || [];
        normalOrders.push({
            farmerId,
            purchaseId,
            category,
            quantity: totalWeightToPackage,
            numPackages: numberOfPackages
        });
        localStorage.setItem("normalOrders", JSON.stringify(normalOrders));
        localStorage.setItem("purchaseRecords", JSON.stringify(purchaseRecords));
        document.getElementById("packagingStatus").textContent = "Packaging successful and purchase record updated.";
    }

    renderOrdersTables(); // Refresh the orders tables display
    document.getElementById("packagingForm").reset(); // Reset the form fields
}





// Render tables for Normal and Exceeded Orders
function renderOrdersTables() {
    const normalOrders = JSON.parse(localStorage.getItem("normalOrders")) || [];

    // Remove duplicates before rendering
    const uniqueOrders = Array.from(
        new Map(
            normalOrders.map(order => [`${order.farmerId}-${order.purchaseId}-${order.category}`, order])
        ).values()
    );

    console.log("Rendering Normal Orders:", normalOrders); // Ensure data integrity here

    const normalTableBody = document.querySelector("#normalOrdersTable tbody");
    normalTableBody.innerHTML = normalOrders.map(order => `
        <tr>
            <td>${order.farmerId}</td>
            <td>${order.purchaseId}</td>
            <td>${order.category}</td>
            <td>${order.quantity.toFixed(2)}</td>
            <td>${order.numPackages}</td>
        </tr>
    `).join("");

    const exceededOrders = JSON.parse(localStorage.getItem("exceededOrders")) || [];
    const exceededTableBody = document.querySelector("#exceededOrdersTable tbody");
    exceededTableBody.innerHTML = exceededOrders.map(order => `
        <tr>
            <td>${order.farmerId}</td>
            <td>${order.purchaseId}</td>
            <td>${order.category}</td>
            <td>${order.requestedQuantity.toFixed(2)}kg</td>
            <td>${order.availableStock.toFixed(2)}kg</td>
        </tr>
    `).join("");
}



function removeDuplicateNormalOrders() {
    const normalOrders = JSON.parse(localStorage.getItem("normalOrders")) || [];

    const uniqueOrders = Array.from(
        new Map(
            normalOrders.map(order => [`${order.farmerId}-${order.purchaseId}-${order.category}`, order])
        ).values()
    );

    localStorage.setItem("normalOrders", JSON.stringify(uniqueOrders));
    renderOrdersTables();

}

document.addEventListener("DOMContentLoaded", function() {
     // Ensure this function fetches and displays orders upon page load
    updateCategorySummaryTable();  // Update summary table on page load
});




//************************************************************SECTION 3********************************************************************************************************************** */
// JavaScript for Sales Management Module
// JavaScript for Section 3: Sales Management Module


let orders = JSON.parse(localStorage.getItem("orders")) || [];
let normalOrders = JSON.parse(localStorage.getItem("normalOrders")) || [];
let categorySummary = {};
let editingOrderId = null; // Track if an order is being edited
const inventory = JSON.parse(localStorage.getItem("inventory")) || [];
console.log("Current Inventory:", JSON.stringify(inventory));



//started here 


// Initialize Category Summary with data from normalOrders
function initializeCategorySummary() {
    console.log("Initializing Category Summary...");

    // Check if `categorySummary` already exists in localStorage
    const existingSummary = JSON.parse(localStorage.getItem("categorySummary"));

    if (existingSummary && Object.keys(existingSummary).length > 0) {
        console.log("Category Summary loaded from localStorage:", existingSummary);
        categorySummary = existingSummary; // Use existing data
    } else {
        // If no existing data, create a new summary based on normalOrders
        const summary = {};
        const normalOrders = JSON.parse(localStorage.getItem("normalOrders")) || [];

        normalOrders.forEach(order => {
            const { category, purchaseId, numPackages } = order;

            if (!summary[category]) {
                summary[category] = {
                    purchaseId: purchaseId || "N/A",
                    count: numPackages || 0,
                };
            } else {
                summary[category].count += numPackages || 0;
            }
        });

        console.log("New Category Summary Initialized:", summary);
        categorySummary = summary;
        localStorage.setItem("categorySummary", JSON.stringify(summary)); // Save to localStorage
    }

    updateCategorySummaryTable(); // Render the table with the summary
}


function updateCategorySummary(category, numPackages, isAddition = true) {
    const summary = JSON.parse(localStorage.getItem("categorySummary")) || {};

    // Ensure the category exists in the summary
    if (!summary[category]) {
        console.error(`Category ${category} not found in categorySummary.`);
        return;
    }

    // Adjust the count based on isAddition flag
    summary[category].count += isAddition ? numPackages : -numPackages;

    // Ensure the count doesn't go below zero
    if (summary[category].count < 0) {
        summary[category].count = 0;
    }

    localStorage.setItem("categorySummary", JSON.stringify(summary));
    console.log("Category Summary Updated:", summary);

    // Update the category summary table to reflect changes
    updateCategorySummaryTable();
}



function updateCategorySummaryTable() {
    console.log("Updating Category Summary Table...");

    const summary = JSON.parse(localStorage.getItem("categorySummary")) || {};
    const normalOrders = JSON.parse(localStorage.getItem("normalOrders")) || [];
    const summaryTableBody = document.getElementById("summaryTable").querySelector("tbody");

    // Clear the table
    summaryTableBody.innerHTML = "";

    // Render each category
    Object.entries(summary).forEach(([category, details]) => {
        const row = document.createElement("tr");
        row.innerHTML = `
            <td>${details.purchaseId || "N/A"}</td>
            <td>${category}</td>
            <td>${details.count || 0}</td>
        `;
        summaryTableBody.appendChild(row);
    });
     // Populate the dropdown after updating the table
     populateProductCategoryDropdown();
}


function saveCategorySummaryToLocalStorage() {
    localStorage.setItem("categorySummary", JSON.stringify(categorySummary));
    console.log("Category summary saved to localStorage:", categorySummary);
}


document.addEventListener("DOMContentLoaded", () => {
    try {
        console.log("Initializing on DOMContentLoaded...");
        initializeCategorySummary(); // Ensure this runs only once
        updateCategorySummaryTable();
    } catch (error) {
        console.error("Error during initialization:", error);
    }
});

function populateProductCategoryDropdown() {
    const productCategorySelect = document.getElementById("productCategory");
    productCategorySelect.innerHTML = ""; // Clear existing options

    // Load the updated categorySummary from localStorage
    const categorySummary = JSON.parse(localStorage.getItem("categorySummary")) || {};

    // Handle empty categorySummary
    if (Object.keys(categorySummary).length === 0) {
        const option = document.createElement("option");
        option.value = "";
        option.textContent = "No categories available";
        productCategorySelect.appendChild(option);
        return;
    }

    // Populate dropdown with categories and purchase IDs
    Object.entries(categorySummary).forEach(([category, details]) => {
        const option = document.createElement("option");
        option.value = category; // Use the category as the value
        option.textContent = `${category} (Purchase ID: ${details.purchaseId}, Packages: ${details.count})`;
        productCategorySelect.appendChild(option);
    });

    console.log("Dropdown populated with:", categorySummary);
}


document.addEventListener("DOMContentLoaded", populateProductCategoryDropdown);


function refreshOrdersTable() {
    const ordersTableBody = document.getElementById("ordersTable").querySelector("tbody");
    if (!ordersTableBody) {
        console.error("Cannot find the table body for orders.");
        return;
    }
    ordersTableBody.innerHTML = ""; // Clear the table

    orders.forEach(order => addOrderToTable(order)); // Add each order to the table
}



// Deduct inventory when an order is placed
// Function to deduct inventory quantity
function deductInventory(category, quantityKg) {
    const inventory = JSON.parse(localStorage.getItem('inventory')) || [];
    const inventoryItem = inventory.find(item => item.category === category);

    if (inventoryItem && inventoryItem.quantity >= quantityKg) {
        inventoryItem.quantity -= quantityKg; // Deduct the quantity in kg
        localStorage.setItem('inventory', JSON.stringify(inventory));
        return true;
    }
    return false;
}


function updateInventoryAfterOrder(purchaseId, quantity, isAddition = false) {
    const inventory = JSON.parse(localStorage.getItem("inventory")) || [];
    const index = inventory.findIndex(item => item.itemId === purchaseId);

    if (index !== -1) {
        if (isAddition) {
            inventory[index].quantity += quantity;
        } else {
            inventory[index].quantity -= quantity;
        }

        if (inventory[index].quantity < 0) inventory[index].quantity = 0;

        localStorage.setItem("inventory", JSON.stringify(inventory));
        renderInventoryTable(); // Assuming you have a function that refreshes the UI
    }
}


// Function to handle adding an order
function handleOrderSubmission(event) {
    event.preventDefault();

    const customerName = document.getElementById("customerName").value.trim();
    const contactInfo = document.getElementById("contactInfo").value.trim();
    const shippingInfo = document.getElementById("shippingInfo").value.trim();
    const productCategory = document.getElementById("productCategory").value;
    const numPackages = parseInt(document.getElementById("orderQuantity").value.trim(), 10);
    const unitPrice = parseFloat(document.getElementById("unitPrice").value.trim());

    const categorySummary = JSON.parse(localStorage.getItem("categorySummary")) || {};
    const purchaseId = categorySummary[productCategory]?.purchaseId;

    if (!purchaseId) {
        alert("Selected category does not have a valid purchase ID.");
        return;
    }

    if (!productCategory || isNaN(numPackages) || numPackages <= 0 || isNaN(unitPrice)) {
        alert("Please fill in all fields correctly.");
        return;
    }

    // Check inventory using purchaseId
    const canFulfillOrder = checkInventory(productCategory, numPackages);
    if (!canFulfillOrder) {
        alert("Cannot fulfill order due to insufficient inventory.");
        return;
    }

    const totalPrice = numPackages * unitPrice;
    const newOrder = {
        orderId: `ORD-${Date.now()}`,
        purchaseId, // Use Purchase ID to link with inventory
        customerName,
        contactInfo,
        shippingInfo,
        category: productCategory,
        quantity: numPackages,
        totalPrice,
        status: 'Processed',
    };

    orders.push(newOrder);
    saveOrdersToLocalStorage();
    refreshOrdersTable();

    // Deduct inventory using purchaseId
    deductInventoryOnOrder(productCategory, numPackages);

    // Update category summary by subtracting the count
    updateCategorySummary(productCategory, numPackages, false);

    saveCategorySummaryToLocalStorage();

    document.getElementById("orderForm").reset();
}



function deductInventoryOnOrder(category, quantityNeeded) {
    const categorySummary = JSON.parse(localStorage.getItem("categorySummary")) || {};
    const inventory = JSON.parse(localStorage.getItem("inventory")) || [];

    // Get the purchaseId for the selected category
    const purchaseId = categorySummary[category]?.purchaseId;

    if (!purchaseId) {
        console.error(`No purchase ID found for category: ${category}`);
        return;
    }

    // Find the inventory item using purchaseId (itemId)
    const inventoryItem = inventory.find(item => item.itemId === purchaseId);

    if (!inventoryItem) {
        console.error(`Inventory for purchase ID: ${purchaseId} not found.`);
        return;
    }

    // Deduct the required quantity
    inventoryItem.quantity -= quantityNeeded;
    if (inventoryItem.quantity < 0) inventoryItem.quantity = 0;

    // Save the updated inventory back to localStorage
    localStorage.setItem("inventory", JSON.stringify(inventory));
    console.log(`Inventory updated for purchase ID ${purchaseId}:`, inventoryItem.quantity);
}



function canFulfillOrder(quantityNeeded) {
    const inventory = JSON.parse(localStorage.getItem('inventory')) || [];
    const totalAvailable = inventory.reduce((acc, item) => acc + item.quantity, 0); // Sum up all quantities regardless of category

    if (totalAvailable < quantityNeeded) {
        alert("Cannot fulfill order due to insufficient inventory.");
        return false;
    }
    return true;
}


function checkInventory(category, quantityNeeded) {
    const categorySummary = JSON.parse(localStorage.getItem("categorySummary")) || {};
    const inventory = JSON.parse(localStorage.getItem("inventory")) || [];

    // Get the purchaseId for the selected category
    const purchaseId = categorySummary[category]?.purchaseId;

    if (!purchaseId) {
        console.error(`No purchase ID found for category: ${category}`);
        return false;
    }

    // Find the inventory item using purchaseId (itemId)
    const inventoryItem = inventory.find(item => item.itemId === purchaseId);

    if (!inventoryItem) {
        console.error(`Inventory for purchase ID: ${purchaseId} not found or is undefined.`);
        return false;
    }

    console.log(`Inventory available for purchase ID ${purchaseId}: ${inventoryItem.quantity}`);
    return inventoryItem.quantity >= quantityNeeded;
}


function updateCategorySummary(category, numPackages, isAddition = true) {
    const summary = JSON.parse(localStorage.getItem("categorySummary")) || {};

    if (!summary[category]) {
        console.error(`Category ${category} not found in categorySummary.`);
        return;
    }

    summary[category].count += isAddition ? numPackages : -numPackages;

    // Ensure count is not negative
    if (summary[category].count < 0) {
        summary[category].count = 0;
    }

    localStorage.setItem("categorySummary", JSON.stringify(summary));
    categorySummary = summary; // Update the in-memory object
    console.log("Category Summary Updated:", summary);

    updateCategorySummaryTable();
}



// Example usage after an order is processed
function processOrder(category, quantity) {
    console.log(`Processing order: ${quantity} units for ${category}`);
    updateCategorySummary(category, -quantity); // Deduct the ordered quantity
    // Additional order processing logic...
}

function addOrderToTable(order) {
    const tableBody = document.getElementById("ordersTable").querySelector("tbody");
    const row = document.createElement("tr");
    row.innerHTML = `
        <td>${order.orderId}</td>
        <td>${order.purchaseId || 'N/A'}</td>
        <td>${order.customerName}</td>
        <td>${order.contactInfo}</td>
        <td>${order.shippingInfo}</td>
        <td>${order.category}</td>
        <td>${order.quantity}</td>
        <td>${order.totalPrice?.toFixed(2) || '0.00'}</td>
        <td>${order.status}</td>
        <td>
            <button onclick="updateOrder('${order.orderId}')">Update</button>
            <button onclick="deleteOrder('${order.orderId}')">Delete</button>
        </td>
    `;
    tableBody.appendChild(row);
}


function saveOrdersToLocalStorage() {
    console.log("Saving orders to localStorage", orders);
    localStorage.setItem("orders", JSON.stringify(orders));
}


function recalculateCategorySummary() {
    categorySummary = {}; // Reset the category summary

    normalOrders.forEach(order => {
        categorySummary[order.category] = (categorySummary[order.category] || 0) + order.numPackages;
    });

    saveCategorySummaryToLocalStorage();
}



// Function to delete an order and restore the quantity to the category summary
function deleteOrder(orderId) {
    const orderIndex = orders.findIndex(order => order.orderId === orderId);
    if (orderIndex !== -1) {
        const deletedOrder = orders[orderIndex];

        // Restore the quantity to the category summary
        categorySummary[deletedOrder.category] += deletedOrder.quantity;
        saveCategorySummaryToLocalStorage(); // Save the updated summary

        orders.splice(orderIndex, 1); // Remove order
        updateInventoryAfterOrder(deletedOrder.purchaseId, deletedOrder.quantity, true); // Add back inventory on order deletion
        saveOrdersToLocalStorage();
        refreshOrdersTable();
        updateCategorySummaryTable();
    }
}

// Function to calculate the total price
function calculateTotalPrice(category, quantity) {
    const pricing = {
        small: 5,
        medium: 10,
        large: 15,
        extraLarge: 20,
        familyPack: 30,
        bulkPack: 50,
        premium: 100,
    };
    return (pricing[category] || 0) * quantity; // Default to 0 if category doesn't exist
}

// Function to handle updating an order
function updateOrder(orderId) {
    const order = orders.find(o => o.orderId === orderId);

    if (!order) {
        alert("Order not found.");
        return;
    }

    // Restore previous quantity to the stock
    categorySummary[order.category] += order.quantity;

    // Populate the form for editing
    document.getElementById("customerName").value = order.customerName;
    document.getElementById("contactInfo").value = order.contactInfo;
    document.getElementById("shippingInfo").value = order.shippingInfo;
    document.getElementById("productCategory").value = order.category;
    document.getElementById("orderQuantity").value = order.quantity;
    document.getElementById("unitPrice").value = order.totalPrice / order.quantity;
    document.getElementById("orderStatus").value = order.status;

    // Set editing state
    editingOrderId = orderId;
    const submitButton = document.querySelector("#orderForm button[type='submit']");
    submitButton.textContent = "Update Order";
}


// Updated form submission handler to handle both adding and updating
document.getElementById("orderForm").onsubmit = function (event) {
    event.preventDefault();

    const customerName = document.getElementById("customerName").value.trim();
    const contactInfo = document.getElementById("contactInfo").value.trim();
    const shippingInfo = document.getElementById("shippingInfo").value.trim();
    const productCategory = document.getElementById("productCategory").value;
    const orderQuantity = parseInt(document.getElementById("orderQuantity").value.trim(), 10);
    const unitPrice = parseFloat(document.getElementById("unitPrice").value.trim());
    const orderStatus = document.getElementById("orderStatus").value;

    if (!productCategory || isNaN(orderQuantity) || orderQuantity <= 0) {
        alert("Please fill in all fields correctly.");
        return;
    }

    if (editingOrderId) {
        const order = orders.find(o => o.orderId === editingOrderId);

        if (order) {
            // Update the order
            order.customerName = customerName;
            order.contactInfo = contactInfo;
            order.shippingInfo = shippingInfo;
            order.category = productCategory;
            order.quantity = orderQuantity;
            order.totalPrice = unitPrice * orderQuantity;
            order.status = orderStatus;

            // Save to localStorage and refresh UI
            saveOrdersToLocalStorage();
            refreshOrdersTable();

            // Reset editing state
            editingOrderId = null;
            document.querySelector("#orderForm button[type='submit']").textContent = "Add Order";
        }
    } else {
        // Add a new order
        const newOrder = {
            orderId: `ORD-${Date.now()}`,
            customerName,
            contactInfo,
            shippingInfo,
            category: productCategory,
            quantity: orderQuantity,
            totalPrice: unitPrice * orderQuantity,
            status: orderStatus,
        };

        orders.push(newOrder);
        saveOrdersToLocalStorage();
        refreshOrdersTable();
    }

    // Reset the form
    document.getElementById("orderForm").reset();
};




// Function to dynamically filter orders in Section 3
function searchOrdersSection3() {
    const criteria = document.getElementById("section3SearchCriteria").value;
    const searchText = document.getElementById("section3SearchInput").value.trim().toLowerCase();

    // Filter orders based on the selected criteria
    const filteredOrders = orders.filter(order => {
        if (criteria === "productCategory") {
            // Ensure productCategory comparison is case-insensitive
            return order.category?.toLowerCase().includes(searchText);
        } else if (criteria === "orderStatus") {
            // Ensure orderStatus comparison is case-insensitive
            return order.status?.toLowerCase().includes(searchText);
        } else {
            // Default to customerName search
            return order.customerName?.toLowerCase().includes(searchText);
        }
    });

    // Refresh the table with filtered orders
    const tableBody = document.getElementById("ordersTable").querySelector("tbody");
    tableBody.innerHTML = ""; // Clear existing rows

    if (filteredOrders.length > 0) {
        filteredOrders.forEach(addOrderToTable); // Reuse the existing function
    } else {
        tableBody.innerHTML = `
            <tr>
                <td colspan="9" style="text-align: center;">No matching orders found</td>
            </tr>`;
    }
}

// Attach dynamic search functionality for Section 3
document.getElementById("section3SearchInput").addEventListener("keyup", searchOrdersSection3);
document.getElementById("section3SearchCriteria").addEventListener("change", () => {
    document.getElementById("section3SearchInput").value = ""; // Clear search input when changing criteria
    searchOrdersSection3(); // Trigger search to reset results
});

function calculateSalesData() {
    const salesData = {
        unitsSold: {},
        revenuePerCategory: {},
        overallRevenue: 0,
    };

    // Iterate through orders to calculate sales data
    orders.forEach(order => {
        // Initialize category in salesData if not present
        if (!salesData.unitsSold[order.category]) {
            salesData.unitsSold[order.category] = 0;
            salesData.revenuePerCategory[order.category] = 0;
        }

        // Accumulate units sold and revenue per category
        salesData.unitsSold[order.category] += order.quantity;
        salesData.revenuePerCategory[order.category] += order.totalPrice;

        // Accumulate overall revenue
        salesData.overallRevenue += order.totalPrice;
    });

    return salesData;
}


// Function to export orders to a CSV file (specific to Section 3)
function exportOrdersToCSVSection3() {
    if (orders.length === 0) {
        alert("No orders available to export.");
        return;
    }

    // Create CSV headers and rows
    let csvContent = "data:text/csv;charset=utf-8,";
    csvContent += "Order ID,Customer Name,Contact Information,Shipping Address,Category,Quantity,Total Price,Status\n";

    orders.forEach(order => {
        csvContent += `${order.orderId},${order.customerName},${order.contactInfo},${order.shippingInfo},${order.category},${order.quantity},${order.totalPrice.toFixed(2)},${order.status}\n`;
    });

    // Create a downloadable link
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "section3_orders.csv");
    document.body.appendChild(link);

    // Trigger download
    link.click();

    // Remove the link after download
    document.body.removeChild(link);
}

// Attach event listener to the Export button for Section 3
document.getElementById("section3ExportCSVButton").addEventListener("click", exportOrdersToCSVSection3);

// Function to export sales reports to CSV (specific to Section 3)
function exportOrdersReportToCSVSection3() {
    const salesData = calculateSalesData();

    // Create CSV headers and rows
    let csvContent = "data:text/csv;charset=utf-8,";
    csvContent += "Category,Units Sold,Revenue\n";

    Object.keys(salesData.unitsSold).forEach(category => {
        csvContent += `${category},${salesData.unitsSold[category]},${salesData.revenuePerCategory[category].toFixed(2)}\n`;
    });

    csvContent += `\nOverall Revenue,,${salesData.overallRevenue.toFixed(2)}\n`;

    // Create a downloadable link
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "section3_sales_report.csv");
    document.body.appendChild(link);

    // Trigger download
    link.click();

    // Remove the link after download
    document.body.removeChild(link);
}
function renderSalesChartSection3() {
    const salesData = calculateSalesData();

    if (!salesData || Object.keys(salesData.unitsSold).length === 0) {
        console.warn("No sales data available to render the chart.");
        return;
    }

    const categories = Object.keys(salesData.unitsSold);
    const unitsSold = categories.map(category => salesData.unitsSold[category]);
    const revenue = categories.map(category => salesData.revenuePerCategory[category]);

    const chartContainer = document.getElementById("section3SalesChart");
    if (!chartContainer) {
        console.error("Sales chart container not found!");
        return;
    }

    const ctx = chartContainer.getContext("2d");

    // Destroy existing chart instance, if any
    if (chartContainer.chart) {
        chartContainer.chart.destroy();
    }

    // Create a new chart instance and attach it to the container
    chartContainer.chart = new Chart(ctx, {
        type: "bar",
        data: {
            labels: categories,
            datasets: [
                {
                    label: "Units Sold",
                    data: unitsSold,
                    backgroundColor: "rgba(75, 192, 192, 0.6)",
                    borderColor: "rgba(75, 192, 192, 1)",
                    borderWidth: 1,
                },
                {
                    label: "Revenue",
                    data: revenue,
                    backgroundColor: "rgba(153, 102, 255, 0.6)",
                    borderColor: "rgba(153, 102, 255, 1)",
                    borderWidth: 1,
                },
            ],
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                y: {
                    beginAtZero: true,
                },
            },
        },
    });
}





function exportOrdersReportToCSVSection3() {
    const salesData = calculateSalesData();

    if (!salesData || Object.keys(salesData.unitsSold).length === 0) {
        alert("No sales data available to export.");
        return;
    }

    let csvContent = "data:text/csv;charset=utf-8,";
    csvContent += "Category,Units Sold,Revenue\n";

    Object.keys(salesData.unitsSold).forEach(category => {
        csvContent += `${category},${salesData.unitsSold[category]},${salesData.revenuePerCategory[category].toFixed(2)}\n`;
    });

    csvContent += `\nOverall Revenue,,${salesData.overallRevenue.toFixed(2)}\n`;

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "section3_sales_report.csv");
    document.body.appendChild(link);

    link.click();
    document.body.removeChild(link);
}

document.addEventListener("DOMContentLoaded", () => {
    initializeCategorySummary();
    updateCategorySummaryTable();
    loadAndDisplayOrders();
});

function loadAndDisplayOrders() {
    orders = JSON.parse(localStorage.getItem("orders")) || [];
    refreshOrdersTable(); // This function should render the orders table based on the 'orders' array
}



//******************************************************************* SECTION 4****************************************************************************** */
// Constants
const TAX_RATE = 0.15; // 15% Tax Rate

// Mock data for purchases (expenses) and sales (income)
const financialPurchaseRecords = JSON.parse(localStorage.getItem("purchaseRecords")) || [];
const financialOrders = JSON.parse(localStorage.getItem("orders")) || [];

// Function to calculate total income, expenses, tax, and net profit
function calculateFinancialAnalysis() {
    // Calculate total income from sales
    const totalIncome = financialOrders.reduce((sum, order) => sum + order.totalPrice, 0);

    // Calculate total expenses from purchases
    const totalExpenses = financialPurchaseRecords.reduce((sum, purchase) => sum + purchase.totalCost, 0);

    // Calculate tax on total income
    const totalTax = totalIncome * TAX_RATE;

    // Calculate net profit
    const netProfit = totalIncome - totalExpenses - totalTax;

    // Update the financial summary table
    document.getElementById("totalIncome").textContent = `$${totalIncome.toFixed(2)}`;
    document.getElementById("totalExpenses").textContent = `$${totalExpenses.toFixed(2)}`;
    document.getElementById("totalTax").textContent = `$${totalTax.toFixed(2)}`;
    document.getElementById("netProfit").textContent = `$${netProfit.toFixed(2)}`;
}



//***************************************************************** SECTION 5 ********************************************************************* */
// Inventory Management Module Data

// item id , category, Quantity available , reorder level , restock date, storage location!

document.getElementById("inventoryForm").addEventListener("submit", function (e) {
    e.preventDefault();

    const itemId = document.getElementById("itemId").value.trim();
    const category = document.getElementById("category").value.trim();
    const newQuantity = parseInt(document.getElementById("quantityAvailable").value, 10);
    const reorderLevel = parseInt(document.getElementById("reorderLevel").value, 10);
    const restockDate = document.getElementById("restockDate").value;
    const storageLocation = document.getElementById("storageLocation").value.trim();

    const inventoryIndex = inventory.findIndex(item => item.itemId === itemId);

    if (inventoryIndex > -1) {
        const oldQuantity = inventory[inventoryIndex].quantity; // Store the old quantity
        const quantityDifference = newQuantity - oldQuantity; // Calculate the difference

        // Update the inventory
        inventory[inventoryIndex] = {
            itemId,
            category,
            quantity: newQuantity,
            reorderLevel,
            restockDate,
            storageLocation,
        };

        // Update the corresponding purchase record
        updateLinkedPurchaseRecord(itemId, newQuantity);

        showAlert("Inventory updated successfully.", "success");
    } else {
        alert("Item not found in inventory!");
    }

    saveInventory();
    renderInventoryTable();
    document.getElementById("inventoryForm").reset();
});

function updateLinkedPurchaseRecord(itemId, newInventoryQuantity) {
    const purchaseRecords = JSON.parse(localStorage.getItem("purchaseRecords")) || [];
    const purchase = purchaseRecords.find(record => record.purchaseId === itemId);

    if (purchase) {
        // Update the purchase quantity to match the inventory quantity
        purchase.quantity = newInventoryQuantity;

        // Recalculate the total cost
        purchase.totalCost = purchase.quantity * purchase.pricePerKg;

        // Save the updated purchase records
        localStorage.setItem("purchaseRecords", JSON.stringify(purchaseRecords));
        renderPurchaseRecords();
    } else {
        console.warn(`No purchase record found for item ID: ${itemId}`);
    }
}






// Function to adjust inventory based on purchase record changes
function adjustInventoryForPurchase(purchaseId, quantity, isAdding = false) {
    const inventory = JSON.parse(localStorage.getItem("inventory")) || [];
    const farmers = JSON.parse(localStorage.getItem("farmers")) || [];
    const purchaseRecords = JSON.parse(localStorage.getItem("purchaseRecords")) || [];
    const purchase = purchaseRecords.find(p => p.purchaseId === purchaseId);

    if (purchase) {
        const inventoryItem = inventory.find(item => item.itemId === purchase.farmerId);
        const farmer = farmers.find(f => f.id === purchase.farmerId);

        if (inventoryItem) {
            inventoryItem.quantity += isAdding ? quantity : -quantity;

            // Ensure quantity doesn't drop below zero
            inventoryItem.quantity = Math.max(inventoryItem.quantity, 0);

            // Re-link farmer details
            inventoryItem.farmerName = farmer ? farmer.name : "Unknown";
            inventoryItem.farmerContact = farmer ? farmer.contact : "Unknown";

            localStorage.setItem("inventory", JSON.stringify(inventory));
            renderInventoryTable();
        } else {
            console.error("No matching inventory item found for this purchase.");
        }
    } else {
        console.error("No matching purchase record found.");
    }
}




// Function to Render Inventory Table
function renderInventoryTable() {
    const inventory = JSON.parse(localStorage.getItem("inventory")) || [];
    const farmers = JSON.parse(localStorage.getItem("farmers")) || []; // Fetch farmers data
    const tableBody = document.querySelector('#inventoryTable tbody');
    tableBody.innerHTML = ''; // Clear current rows

    inventory.forEach(item => {
        // Find the corresponding farmer details
        const farmer = farmers.find(f => f.id === item.itemId); // Assuming `itemId` matches the farmer ID
        const farmerName = farmer ? farmer.name : "Unknown";
        const farmerContact = farmer ? farmer.contact : "Unknown";

        const row = `
            <tr>
                <td>${item.itemId || "Unknown"}</td>
                <td>${item.category || "Unknown"}</td>
                <td>${item.quantity || 0} kg</td>
                <td>${item.reorderLevel || "Not set"}</td>
                <td>${item.restockDate || "Not set"}</td>
                <td>${item.storageLocation || "Unknown"}</td>
                <td>${farmerName}</td>
                <td>${farmerContact}</td>
                <td><button onclick="deleteInventory('${item.itemId}')">Delete</button></td>
            </tr>
        `;
        tableBody.innerHTML += row;
    });

    checkReorderLevels(); // Optional: Show alerts for low stock
}



function validatePurchaseRecord(purchase) {
    const farmers = JSON.parse(localStorage.getItem("farmers")) || [];
    const farmer = farmers.find(f => f.id === purchase.farmerId);

    if (!farmer) {
        console.warn(`Invalid Farmer ID: ${purchase.farmerId}. Please ensure the farmer is registered.`);
        return false;
    }
    return true;
}






// Function to Delete Inventory Item
function deleteInventory(itemId) {
    let inventory = JSON.parse(localStorage.getItem("inventory")) || [];
    inventory = inventory.filter(item => item.itemId !== itemId);
    localStorage.setItem("inventory", JSON.stringify(inventory));
    renderInventoryTable();
    alert("Inventory item deleted successfully.");
}

// Function to Check Reorder Levels and Alert
function checkReorderLevels() {
    const alertBox = document.getElementById("inventoryAlerts");
    if (!alertBox) return;
    alertBox.innerHTML = "";

    inventory.forEach(item => {
        if (item.quantity < item.reorderLevel) {
            alertBox.innerHTML += `
                <p>⚠️ Reorder Alert: ${item.category} (Item ID: ${item.itemId}) is below the reorder level.
                Contact Farmer: ${item.farmerName} (${item.farmerContact}) to restock.</p>
            `;
        }
    });
}

function generateRestockingRequest(item) {
    const restockingRequest = {
        itemId: item.itemId,
        category: item.category,
        quantityRequested: item.reorderLevel * 2, // Example: Order twice the reorder level
        farmerName: item.farmerName,
        farmerContact: item.farmerContact,
        requestDate: new Date().toISOString(),
    };

    const restockingRequests = JSON.parse(localStorage.getItem("restockingRequests")) || [];
    restockingRequests.push(restockingRequest);
    localStorage.setItem("restockingRequests", JSON.stringify(restockingRequests));

    console.log(`Restocking request generated for ${item.category} (Item ID: ${item.itemId})`);
}

function renderRestockingRequests() {
    const restockingRequests = JSON.parse(localStorage.getItem("restockingRequests")) || [];
    const tableBody = document.getElementById("restockingRequestsTable").querySelector("tbody");
    tableBody.innerHTML = "";

    restockingRequests.forEach(request => {
        const row = `
            <tr>
                <td>${request.itemId}</td>
                <td>${request.category}</td>
                <td>${request.quantityRequested} kg</td>
                <td>${request.farmerName}</td>
                <td>${request.farmerContact}</td>
                <td>${new Date(request.requestDate).toLocaleDateString()}</td>
            </tr>
        `;
        tableBody.innerHTML += row;
    });
}


// Function to Show Alerts
function showAlert(message, type) {
    const alertBox = document.getElementById("inventoryAlerts");
    alertBox.innerHTML = `<p class="${type}">${message}</p>`;
    setTimeout(() => alertBox.innerHTML = "", 3000);
}


function updateInventory(itemID, quantityOrdered) {
    let item = inventory.find(item => item.id === itemID);
    if (item) {
        if (item.quantity >= quantityOrdered) {
            item.quantity -= quantityOrdered;
            saveInventory(); // Save the updated inventory to local storage or database
        } else {
            console.error("Not enough inventory to fulfill the order");
            // Handle error, e.g., notify the user or rollback the transaction
        }
    } else {
        console.error("Item not found in inventory");
        // Handle error, e.g., notify the user or log an internal error
    }
}





function adjustInventoryForPurchase(purchase, isAdding = true) {
    const index = inventory.findIndex(item => item.itemId === purchase.purchaseId);
    if (index !== -1) {
        if (isAdding) {
            inventory[index].quantity += purchase.quantity;
        } else {
            inventory[index].quantity -= purchase.quantity;
        }
    } else if (isAdding) {
        // Assuming a new item should be added if not found
        inventory.push({
            itemId: purchase.purchaseId,
            category: purchase.category,
            quantity: purchase.quantity,
            reorderLevel: 50, // Example default
            restockDate: purchase.purchaseDate,
            storageLocation: "Default Warehouse",
            farmerName: purchase.farmerName,
            farmerContact: purchase.farmerContact
        });
    }
    localStorage.setItem('inventory', JSON.stringify(inventory));
    renderInventoryTable();
}

function restockInventory(itemId, quantityToAdd) {
    const inventory = JSON.parse(localStorage.getItem("inventory")) || [];
    const farmers = JSON.parse(localStorage.getItem("farmers")) || [];
    const item = inventory.find(item => item.itemId === itemId);
    const farmer = farmers.find(f => f.id === itemId);

    if (item) {
        item.quantity += quantityToAdd;

        // Re-link farmer details
        item.farmerName = farmer ? farmer.name : "Unknown";
        item.farmerContact = farmer ? farmer.contact : "Unknown";

        localStorage.setItem("inventory", JSON.stringify(inventory));
        renderInventoryTable();
        alert("Inventory restocked successfully.");
    } else {
        alert("Item not found in inventory!");
    }
}

function generateOrderSummaries(interval) {
    const currentDate = new Date();
    currentDate.setHours(0, 0, 0, 0);  // Normalize the current date
    const orders = JSON.parse(localStorage.getItem("orders")) || [];
    let filteredOrders;
    console.log("Current Date:", currentDate);

    switch (interval) {
        case 'daily':
            filteredOrders = orders.filter(order => new Date(order.date).setHours(0, 0, 0, 0) === currentDate.getTime());
            break;
        case 'weekly':
            let weekAgo = new Date(currentDate.getTime() - 7 * 24 * 60 * 60 * 1000);
            console.log("Week Ago:", weekAgo);
            filteredOrders = orders.filter(order => new Date(order.date) >= weekAgo);
            break;
        case 'monthly':
            let monthAgo = new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, currentDate.getDate());
            console.log("Month Ago:", monthAgo);
            filteredOrders = orders.filter(order => new Date(order.date) >= monthAgo);
            break;
    }

    console.log("Filtered Orders:", filteredOrders);
    // further code to display results...
}

function renderInventorySummary() {
    const interval = document.getElementById("summaryInterval").value; // Get the selected interval
    const inventory = JSON.parse(localStorage.getItem("inventory")) || [];
    const currentDate = new Date();

    const filteredInventory = inventory.filter(item => {
        const restockDate = new Date(item.restockDate);
        const diffTime = Math.abs(currentDate - restockDate);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); // Convert to days

        if (interval === "daily") {
            return diffDays <= 1;
        } else if (interval === "weekly") {
            return diffDays <= 7;
        } else if (interval === "monthly") {
            return diffDays <= 30;
        }
    });

    let summaryHTML = "<h3>Inventory Summary:</h3><table><tr><th>Item ID</th><th>Category</th><th>Quantity</th><th>Reorder Level</th><th>Restock Date</th><th>Storage Location</th></tr>";

    filteredInventory.forEach(item => {
        summaryHTML += `
            <tr>
                <td>${item.itemId}</td>
                <td>${item.category}</td>
                <td>${item.quantity}</td>
                <td>${item.reorderLevel}</td>
                <td>${item.restockDate}</td>
                <td>${item.storageLocation}</td>
            </tr>
        `;
    });

    summaryHTML += "</table>";
    document.getElementById("summaryResults").innerHTML = summaryHTML;
}


                // <td>${farmer.farmerName}</td>
                // <td>${farmer.contactInformation}</td>

function exportInventoryTableToCSV() {
    const inventory = JSON.parse(localStorage.getItem("inventory")) || [];
    // const farmers = JSON.parse(localStorage.getItem("farmers")) || []; // Check this structure for correctness
    let csvContent = "data:text/csv;charset=utf-8," +
        "Item ID,Category,Quantity Available (kg),Reorder Level,Restock Date,Storage Location,\r\n";

    inventory.forEach(item => {
        const farmer = farmers.find(f => f.id === item.farmerId) || {}; // Ensure the farmer ID is correctly referenced
        const rowData = [
            item.itemId || '',
            item.category || '',
            item.quantity || '0', // Ensure you are accessing the correct property
            item.reorderLevel || '',
            item.restockDate || '',
            item.storageLocation || '',
            // farmer.name || 'N/A', // Handle missing farmer name
            // farmer.contact || 'N/A' // Handle missing contact information
        ];
        csvContent += rowData.join(",") + "\r\n";
    });

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "inventory_summary.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}


function calculateInventoryTurnover() {
    const inventory = JSON.parse(localStorage.getItem('inventory')) || [];
    const purchaseRecords = JSON.parse(localStorage.getItem('purchaseRecords')) || [];
    
    let totalCOGS = 0;
    purchaseRecords.forEach(purchase => {
        totalCOGS += purchase.quantity * purchase.pricePerKg;
    });

    let totalInventoryValue = 0;
    inventory.forEach(item => {
        // Assuming you have a way to get the cost per kg for inventory items, add it here
        const costPerKg = getCostPerKgForItem(item.itemId); // You will need to define this function based on your cost logic
        totalInventoryValue += item.quantity * costPerKg;
    });

    const averageInventory = totalInventoryValue / 2; // Simplified average inventory calculation

    const turnoverRate = totalCOGS / averageInventory;
    const turnoverResultsDiv = document.getElementById('turnoverResults');
    turnoverResultsDiv.innerHTML = `Inventory Turnover Rate: ${turnoverRate.toFixed(2)}`;

    function getCostPerKgForItem(itemId) {
        // Placeholder for cost fetching logic, replace with actual logic
        return 10; // Example cost per kg
    }
}

// document.getElementById('calculateTurnoverButton').addEventListener('click', calculateInventoryTurnover);
 /* The turnover rate is typically calculated with the formula:

    Turnover Rate = Cost of Goods Sold (COGS) / Average Inventory
​
 */

function updateInventoryQuantity(itemId, newQuantity) {
    const inventory = JSON.parse(localStorage.getItem("inventory")) || [];
    const purchaseRecords = JSON.parse(localStorage.getItem("purchaseRecords")) || [];

    // Find the inventory item
    const inventoryItem = inventory.find(item => item.itemId === itemId);

    if (inventoryItem) {
        // Capture the current quantity as originalQuantity
        const originalQuantity = inventoryItem.quantity;

        // Update the inventory quantity
        inventoryItem.quantity = newQuantity;

        // Find the corresponding purchase record
        const purchase = purchaseRecords.find(record => record.purchaseId === itemId);

        if (purchase) {
            // Set originalQuantity only if it is not set yet
            if (purchase.originalQuantity === undefined) {
                purchase.originalQuantity = originalQuantity;  // Initialize only if it's undefined
                console.log(`Setting originalQuantity for Purchase ID ${purchase.purchaseId} to ${originalQuantity}`);
            }

            // Recalculate the total cost
            purchase.totalCost = purchase.quantity * purchase.pricePerKg;
        }

        // Save the updated inventory and purchase records to localStorage
        localStorage.setItem("inventory", JSON.stringify(inventory));
        localStorage.setItem("purchaseRecords", JSON.stringify(purchaseRecords));

        console.log("Inventory updated successfully!");
        renderInventoryTable();  // Re-render inventory table
    } else {
        console.warn("Inventory item not found.");
    }
}







function renderTurnoverRates(turnoverRates) {
    const turnoverResultsDiv = document.getElementById("turnoverResults");

    // Build the HTML table
    let html = `
        <h3>Turnover Rates</h3>
        <table>
            <thead>
                <tr>
                    <th>Inventory ID</th>
                    <th>Purchase ID</th>
                    <th>Turnover Rate</th>
                </tr>
            </thead>
            <tbody>
    `;

    turnoverRates.forEach(rate => {
        html += `
            <tr>
                <td>${rate.inventoryId}</td>
                <td>${rate.purchaseId}</td>
                <td>${rate.turnoverRate}</td>
            </tr>
        `;
    });

    html += `
            </tbody>
        </table>
    `;

    turnoverResultsDiv.innerHTML = html;
}






function calculateTotalSold(itemId) {
    const orders = JSON.parse(localStorage.getItem("orders")) || [];
    return orders
        .filter(order => order.itemId === itemId) // Match orders by item ID
        .reduce((acc, order) => acc + order.quantity, 0); // Sum up quantities
}







//***************************************************************** SECTION 6 ********************************************************************* */


function generateComprehensiveReport() {
    const totalIncome = orders.reduce((acc, order) => acc + order.totalPrice, 0);
    const totalExpenses = purchaseRecords.reduce((acc, record) => acc + record.totalCost, 0);
    const taxRate = 0.15;  // Assuming a 15% tax rate
    const taxApplied = totalIncome * taxRate;
    const netProfit = totalIncome - totalExpenses - taxApplied;

    const salesByCategory = {};
    orders.forEach(order => {
        if (salesByCategory[order.category]) {
            salesByCategory[order.category] += order.quantity;
        } else {
            salesByCategory[order.category] = 1;
        }
    });

    const remainingStockByCategory = {};
    inventory.forEach(item => {
        remainingStockByCategory[item.category] = item.quantity;
    });

    const reportDiv = document.getElementById('reportOutput');
    reportDiv.innerHTML = `
        <h4>Report Summary</h4>
        <p>Total Income: $${totalIncome.toFixed(2)}</p>
        <p>Total Expenses: $${totalExpenses.toFixed(2)}</p>
        <p>Tax Applied: $${taxApplied.toFixed(2)}</p>
        <p>Net Profit: $${netProfit.toFixed(2)}</p>
        <h4>Sales By Category:</h4>
        ${Object.keys(salesByCategory).map(category => `<p>${category}: ${salesByCategory[category]}</p>`).join('')}
        <h4>Remaining Stock By Category:</h4>
        ${Object.keys(remainingStockByCategory).map(category => `<p>${category}: ${remainingStockByCategory[category]}</p>`).join('')}
    `;
}






document.addEventListener("DOMContentLoaded", () => {
    try {
        console.log("Starting DOMContentLoaded Initialization...");

        // Load Farmers and Attach Event Listeners
        loadFarmers();
        attachEventListenersToFarmers();

        // Initialize Purchases and Inventory
        initializePurchaseRecords(); // Ensure purchases are marked as processed
        loadPurchaseRecordsFromLocalStorage(); // Load existing purchase records from localStorage

        const purchaseRecords = JSON.parse(localStorage.getItem("purchaseRecords")) || [];
        if (purchaseRecords.length === 0) {
            console.warn("No purchase records found. Inventory will not be updated.");
        } else {
            purchaseRecords.forEach(purchase => {
                updateInventoryFromUnprocessedPurchases(purchase);
            });
        }

        // Initialize and Render Category Summary
        initializeCategorySummary(); // Calculate and store the initial category summary
        updateCategorySummaryTable(); // Render the category summary table

        // Render Tables and Attach Listeners
        renderPurchaseRecords(); // Display the purchase records table
        renderInventoryTable(); // Display the inventory table
        renderOrdersTables(); // Display the orders (normal and exceeded) tables
        attachAdditionalListeners(); // Attach other required event listeners
        refreshOrdersTable(); // Render the order table with loaded orders

        // Optional: Render Charts if Required
        const chartContainer = document.getElementById("section3SalesChart");
        if (chartContainer) {
            renderSalesChartSection3();
        } else {
            console.warn("Sales Chart container not found.");
        }

        console.log("DOMContentLoaded Initialization Completed Successfully.");
    } catch (error) {
        console.error("Error during DOMContentLoaded Initialization:", error);
    }
});


function attachEventListenersToFarmers() {
    const farmerSelect = document.getElementById("farmerSelect");
    const purchaseSelect = document.getElementById("purchaseSelect");

    if (farmerSelect && !farmerSelect.dataset.listenerAdded) {
        farmerSelect.addEventListener("change", loadPurchaseIds);
        farmerSelect.dataset.listenerAdded = true; // Prevent duplicate listeners
    }

    if (purchaseSelect && !purchaseSelect.dataset.listenerAdded) {
        purchaseSelect.addEventListener("change", updatePurchaseDetails);
        purchaseSelect.dataset.listenerAdded = true; // Prevent duplicate listeners
    }
}


function attachAdditionalListeners() {
    const searchInput = document.getElementById("searchInput");
    const orderForm = document.getElementById("orderForm");

    if (searchInput) {
        searchInput.addEventListener("input", searchFarmers);
    }

    if (orderForm) {
        orderForm.onsubmit = (e) => {
            e.preventDefault();
            handleOrderSubmission(e);
        };
    }

    // Render the Sales Chart
    const chartContainer = document.getElementById("section3SalesChart");
    if (chartContainer) {
        renderSalesChartSection3(); // Ensure the chart renders after DOM is loaded
    } else {
        console.warn("Sales Chart container not found.");
    }
}

renderInventoryTable(); // Call directly to ensure it executes

