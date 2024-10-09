document.getElementById('calculateButton').addEventListener('click', calculateSubnetDetails);
document.getElementById('addReservedButton').addEventListener('click', addReservedSubnet);

let reservedSubnets = [];
let reloadCount = 0;

function calculateSubnetDetails() {
    const subnetInput = document.getElementById('subnetInput').value;
    const subnetParts = subnetInput.split('/');
    const ipAddress = subnetParts[0];
    const subnetMask = parseInt(subnetParts[1]);

    if (!isValidSubnet(ipAddress, subnetMask)) {
        alert('Invalid subnet. Please enter a valid subnet.');
        return;
    }

    const { networkAddress, usableHostRange, broadcastAddress, numberOfUsableHosts, wildcardMask, cidrNotation } = calculateSubnetDetailsHelper(ipAddress, subnetMask);

    // Display the results
    document.getElementById('ipAddress').textContent = ipAddress;
    document.getElementById('networkAddress').textContent = networkAddress;
    document.getElementById('usableIPRange').textContent = usableHostRange;
    document.getElementById('broadcastAddress').textContent = broadcastAddress;
    document.getElementById('usableHosts').textContent = numberOfUsableHosts;
    document.getElementById('subnetMask').textContent = getSubnetMask(subnetMask);
    document.getElementById('wildcardMask').textContent = getWildcardMask(subnetMask);
    document.getElementById('cidrNotation').textContent = cidrNotation;
}

function addReservedSubnet() {
    const reservedSubnetInput = document.getElementById('reservedSubnetInput').value;
    
    if (reservedSubnetInput === '') {
        alert('Please enter a reserved subnet.');
        return;
    }

    reservedSubnets.push(reservedSubnetInput);
    renderReservedSubnets();
    document.getElementById('reservedSubnetInput').value = ''; // Clear input after adding
}

function renderReservedSubnets() {
    const reservedSubnetsTableBody = document.getElementById('reservedSubnetsTableBody');
    reservedSubnetsTableBody.innerHTML = ''; // Clear previous entries

    reservedSubnets.forEach(subnet => {
        const row = document.createElement('tr');

        const subnetCell = document.createElement('td');
        subnetCell.textContent = subnet;
        row.appendChild(subnetCell);

        const usableRangeCell = document.createElement('td');
        usableRangeCell.textContent = getUsableRange(subnet);
        row.appendChild(usableRangeCell);

        const availableIPsCell = document.createElement('td');
        availableIPsCell.textContent = getAvailableIPs(subnet);
        row.appendChild(availableIPsCell);

        const statusCell = document.createElement('td');
        statusCell.textContent = 'Reserved';
        statusCell.style.color = 'blue';
        row.appendChild(statusCell);

        const actionCell = document.createElement('td');
        const removeButton = document.createElement('button');
        removeButton.textContent = 'X';
        removeButton.style.color = 'red';
        removeButton.style.backgroundColor = 'lightcoral';
        removeButton.style.borderRadius = '50%';
        removeButton.style.border = 'none';
        removeButton.style.cursor = 'pointer';
        removeButton.addEventListener('click', () => {
            reservedSubnets = reservedSubnets.filter(item => item !== subnet);
            renderReservedSubnets();
        });
        actionCell.appendChild(removeButton);
        row.appendChild(actionCell);

        reservedSubnetsTableBody.appendChild(row);
    });
}

function isValidSubnet(ip, mask) {
    // Basic validation for the IP and mask
    return ip.split('.').length === 4 && mask >= 0 && mask <= 32;
}

function calculateSubnetDetailsHelper(ip, mask) {
    // Add logic to calculate network address, usable IP range, etc.
    // Placeholder return values for demonstration
    return {
        networkAddress: ip, // Placeholder
        usableHostRange: `${ip} - ${ip}`, // Placeholder
        broadcastAddress: ip, // Placeholder
        numberOfUsableHosts: 0, // Placeholder
        wildcardMask: '0.0.0.0', // Placeholder
        cidrNotation: `/${mask}`
    };
}

function getSubnetMask(mask) {
    // Return subnet mask in decimal
    const masks = {
        0: '0.0.0.0',
        1: '128.0.0.0',
        2: '192.0.0.0',
        3: '224.0.0.0',
        4: '240.0.0.0',
        5: '248.0.0.0',
        6: '252.0.0.0',
        7: '254.0.0.0',
        8: '255.0.0.0',
        9: '255.128.0.0',
        10: '255.192.0.0',
        11: '255.224.0.0',
        12: '255.240.0.0',
        13: '255.248.0.0',
        14: '255.252.0.0',
        15: '255.254.0.0',
        16: '255.255.0.0',
        17: '255.255.128.0',
        18: '255.255.192.0',
        19: '255.255.224.0',
        20: '255.255.240.0',
        21: '255.255.248.0',
        22: '255.255.252.0',
        23: '255.255.254.0',
        24: '255.255.255.0',
        25: '255.255.255.128',
        26: '255.255.255.192',
        27: '255.255.255.224',
        28: '255.255.255.240',
        29: '255.255.255.248',
        30: '255.255.255.252',
        31: '255.255.255.254',
        32: '255.255.255.255',
    };
    return masks[mask];
}

function getWildcardMask(mask) {
    return `0.0.${255 - (mask / 256)}.${255 - (mask % 256)}`;
}

function getUsableRange(subnet) {
    // Add logic to determine the usable range
    return `Usable range for ${subnet}`; // Placeholder
}

function getAvailableIPs(subnet) {
    // Logic to calculate available IPs
    return 0; // Placeholder
}
