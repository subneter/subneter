let reloadCount = 0;
const reloadButton = document.getElementById("reloadButton");
const clearCacheButton = document.getElementById("clearCacheButton");
const subnetInput = document.getElementById("subnetInput");
const calculateButton = document.getElementById("calculateButton");
const reservedSubnetInput = document.getElementById("reservedSubnetInput");
const addReservedButton = document.getElementById("addReservedButton");
const subnetTableBody = document.getElementById("subnetTableBody");

// Function to calculate subnet details
function calculateSubnetDetails(subnet) {
    const [ip, prefix] = subnet.split("/");
    const ipParts = ip.split(".").map(Number);
    
    // Convert prefix to subnet mask
    const subnetMask = (0xFFFFFFFF << (32 - prefix)) >>> 0;
    const maskParts = [
        (subnetMask >>> 24) & 255,
        (subnetMask >>> 16) & 255,
        (subnetMask >>> 8) & 255,
        subnetMask & 255
    ];

    // Calculate network address
    const networkAddress = ipParts.map((part, index) => part & maskParts[index]).join(".");
    
    // Calculate broadcast address
    const broadcastAddress = ipParts.map((part, index) => (part & maskParts[index]) | (~maskParts[index] & 255)).join(".");
    
    // Calculate usable host range
    const firstUsable = `${networkAddress.split('.').slice(0, 3).join('.')}.${Number(networkAddress.split('.').pop()) + 1}`;
    const lastUsable = `${broadcastAddress.split('.').slice(0, 3).join('.')}.${Number(broadcastAddress.split('.').pop()) - 1}`;

    // Calculate number of usable hosts
    const numUsableHosts = Math.pow(2, (32 - prefix)) - 2; // Total - Network - Broadcast
    
    // Update UI
    document.getElementById("ipAddress").textContent = ip;
    document.getElementById("networkAddress").textContent = networkAddress;
    document.getElementById("usableHostRange").textContent = `${firstUsable} - ${lastUsable}`;
    document.getElementById("broadcastAddress").textContent = broadcastAddress;
    document.getElementById("usableHostsCount").textContent = numUsableHosts;
    document.getElementById("subnetMask").textContent = maskParts.join(".");
    document.getElementById("wildcardMask").textContent = getWildcardMask(prefix);
    document.getElementById("cidrNotation").textContent = `/${prefix}`;
}

// Get wildcard mask in decimal format
function getWildcardMask(prefix) {
    const mask = (0xFFFFFFFF >>> prefix) >>> 0;
    return [
        (mask >>> 24) & 255,
        (mask >>> 16) & 255,
        (mask >>> 8) & 255,
        mask & 255
    ].join(".");
}

// Handle calculate button click
calculateButton.addEventListener("click", () => {
    const subnet = subnetInput.value.trim();
    if (subnet) {
        calculateSubnetDetails(subnet);
    }
});

// Handle adding reserved subnet
addReservedButton.addEventListener("click", () => {
    const reservedSubnet = reservedSubnetInput.value.trim();
    if (reservedSubnet) {
        const newRow = document.createElement("tr");
        newRow.innerHTML = `
            <td>${reservedSubnet}</td>
            <td>Usable Range Placeholder</td>
            <td>Available IPs Placeholder</td>
            <td class="blue-text">Reserved</td>
            <td><button class="delete-button" onclick="removeRow(this)">X</button></td>
        `;
        subnetTableBody.appendChild(newRow);
        reservedSubnetInput.value = ""; // Clear input after adding
    }
});

// Remove subnet row
function removeRow(button) {
    const row = button.closest("tr");
    subnetTableBody.removeChild(row);
}

// Reload button functionality
reloadButton.addEventListener("click", () => {
    reloadCount++;
    reloadButton.textContent = `Reload (Count: ${reloadCount})`;
    location.reload();
});

// Clear cache functionality
clearCacheButton.addEventListener("click", () => {
    location.reload(true); // Force reload from server
});

// Ensure page reloads show the initial state
window.onload = () => {
    reloadButton.textContent = `Reload (Count: ${reloadCount})`;
};
