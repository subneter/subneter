const calculateButton = document.getElementById('calculate-button');
const ipAddressField = document.getElementById('ip-address');
const networkAddressField = document.getElementById('network-address');
const usableIpRangeField = document.getElementById('usable-ip-range');
const broadcastAddressField = document.getElementById('broadcast-address');
const usableHostsField = document.getElementById('usable-hosts');
const subnetMaskField = document.getElementById('subnet-mask');
const wildcardMaskField = document.getElementById('wildcard-mask');
const cidrNotationField = document.getElementById('cidr-notation');

const reserveInput = document.getElementById('reserve-input');
const addReservedButton = document.getElementById('add-reserved-button');
const reservedSubnetsTable = document.getElementById('reserved-subnets');
const errorMessage = document.getElementById('error-message');

// History for last 5 entries
let reserveHistory = JSON.parse(localStorage.getItem('reserveHistory')) || [];
const MAX_HISTORY = 5;

// Function to validate subnet input
function validateSubnet(subnet) {
    const subnetPattern = /^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)(\/([0-2][0-9]|3[0-2]|[0-1]?[0-9]))$/;
    return subnetPattern.test(subnet);
}

// Function to calculate subnet details
function calculateSubnetDetails(subnet) {
    // Example calculation for demonstration (replace with actual logic)
    const [ip, cidr] = subnet.split('/');
    const hosts = Math.pow(2, 32 - cidr) - 2; // Usable hosts calculation
    return {
        ipAddress: ip,
        networkAddress: ip,
        usableIpRange: `${ip} - ${ip}`,
        broadcastAddress: ip,
        usableHosts: hosts,
        subnetMask: '255.255.255.0',
        wildcardMask: '0.0.0.255',
        cidrNotation: `/${cidr}`
    };
}

// Calculate button functionality
calculateButton.addEventListener('click', () => {
    const subnet = document.getElementById('subnet-input').value;
    if (validateSubnet(subnet)) {
        const details = calculateSubnetDetails(subnet);
        ipAddressField.textContent = details.ipAddress;
        networkAddressField.textContent = details.networkAddress;
        usableIpRangeField.textContent = details.usableIpRange;
        broadcastAddressField.textContent = details.broadcastAddress;
        usableHostsField.textContent = details.usableHosts;
        subnetMaskField.textContent = details.subnetMask;
        wildcardMaskField.textContent = details.wildcardMask;
        cidrNotationField.textContent = details.cidrNotation;
        errorMessage.textContent = ''; // Clear error message
    } else {
        errorMessage.textContent = 'Error: Invalid input. Input format: 10.228.128.0/17';
    }
});

// Add reserved subnet functionality
addReservedButton.addEventListener('click', () => {
    const reservedSubnet = reserveInput.value.trim();
    if (validateSubnet(reservedSubnet)) {
        if (reserveHistory.includes(reservedSubnet)) {
            alert('This subnet is already reserved.');
            return;
        }

        // Add to history
        reserveHistory.push(reservedSubnet);
        if (reserveHistory.length > MAX_HISTORY) {
            reserveHistory.shift(); // Remove oldest entry
        }
        localStorage.setItem('reserveHistory', JSON.stringify(reserveHistory));
        
        // Example Usable Host Range and Available IPs
        const usableHostRange = `Usable range for ${reservedSubnet}`;
        const availableIPs = Math.pow(2, 32 - parseInt(reservedSubnet.split('/')[1])) - 2;

        // Add row to table
        const row = reservedSubnetsTable.insertRow();
        row.innerHTML = `
            <td>${reservedSubnet}</td>
            <td>${usableHostRange}</td>
            <td>${availableIPs}</td>
            <td style="color: blue;">Reserved</td>
            <td><button class="delete-button">X</button></td>
        `;

        // Clear the input
        reserveInput.value = '';
        errorMessage.textContent = ''; // Clear error message

        // Delete button functionality
        row.querySelector('.delete-button').addEventListener('click', () => {
            reservedSubnetsTable.deleteRow(row.rowIndex - 1);
        });
    } else {
        errorMessage.textContent = 'Error: Invalid input. Input format: 10.228.128.0/17';
    }
});

// Load previous reserve history
reserveHistory.forEach(subnet => {
    reserveInput.value = subnet; // Pre-fill last entered subnet
});
