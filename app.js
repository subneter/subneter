let reloadCount = 0;
const reloadButton = document.getElementById("reloadButton");
const subnetInput = document.getElementById("subnetInput");
const calculateButton = document.getElementById("calculateButton");
const reservedSubnetInput = document.getElementById("reservedSubnetInput");
const addReservedButton = document.getElementById("addReservedButton");
const subnetTableBody = document.getElementById("subnetTableBody");

// Function to calculate subnet details
function calculateSubnetDetails(subnet) {
    const [ip, prefix] = subnet.split("/");
    const ipParts = ip.split(".").map(Number);
    const subnetMask = 32 - prefix;
    const numUsableHosts = Math.pow(2, subnetMask) - 2;

    // Calculate network address
    const networkAddress = `${ipParts[0]}.${ipParts[1]}.${ipParts[2]}.${ipParts[3] & (255 << (8 - prefix % 8))}`;
    // Calculate broadcast address
    const broadcastAddress = `${ipParts[0]}.${ipParts[1]}.${ipParts[2]}.${(ipParts[3] & (255 >> (prefix % 8))) | (255 >> (8 - prefix % 8))}`;
    // Calculate usable host range
    const firstUsable = `${ipParts[0]}.${ipParts[1]}.${ipParts[2]}.${ipParts[3] + 1}`;
    const lastUsable = `${broadcastAddress.split(".")[0]}.${broadcastAddress.split(".")[1]}.${broadcastAddress.split(".")[2]}.${
        +broadcastAddress.split(".")[3] - 1
    }`;

    // Calculate subnet mask
    const subnetMaskDecimal = getSubnetMask(prefix);
    
    // Update UI
    document.getElementById("ipAddress").textContent = ip;
    document.getElementById("networkAddress").textContent = networkAddress;
    document.getElementById("usableHostRange").textContent = `${firstUsable} - ${lastUsable}`;
    document.getElementById("broadcastAddress").textContent = broadcastAddress;
    document.getElementById("usableHostsCount").textContent = numUsableHosts;
    document.getElementById("subnetMask").textContent = subnetMaskDecimal;
    document.getElementById("wildcardMask").textContent = getWildcardMask(prefix);
    document.getElementById("cidrNotation").textContent = `/${prefix}`;
}

// Get subnet mask in decimal format
function getSubnetMask(prefix) {
    const mask = (0xFFFFFFFF << (32 - prefix)) >>> 0;
    return [
        (mask >>> 24) & 255,
        (mask >>> 16) & 255,
        (mask >>> 8) & 255,
        mask & 255
    ].join(".");
}

// Get wildcard mask in decimal format
function getWildcardMask(prefix) {
    return getSubnetMask(32 - prefix);
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
});

// Ensure page reloads show the initial state
window.onload = () => {
    reloadButton.textContent = `Reload (Count: ${reloadCount})`;
};
