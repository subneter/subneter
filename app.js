document.getElementById('calculateButton').addEventListener('click', calculateSubnetDetails);
document.getElementById('addReservedButton').addEventListener('click', addReservedSubnet);

let reservedSubnets = [];

function calculateSubnetDetails() {
    const subnetInput = document.getElementById('subnetInput').value.trim();
    const subnetParts = subnetInput.split('/');

    if (subnetParts.length !== 2) {
        alert('Please enter a valid subnet in the format x.x.x.x/y');
        return;
    }

    const ipAddress = subnetParts[0];
    const subnetMaskLength = parseInt(subnetParts[1], 10);

    // Call the function to calculate subnet details
    const subnetDetails = calculateSubnet(ipAddress, subnetMaskLength);
    
    if (subnetDetails) {
        displaySubnetDetails(subnetDetails);
    } else {
        alert('Invalid subnet details.');
    }
}

function calculateSubnet(ipAddress, subnetMaskLength) {
    // Convert IP address to a number
    const ipParts = ipAddress.split('.').map(Number);
    const ipNumber = (ipParts[0] << 24) | (ipParts[1] << 16) | (ipParts[2] << 8) | ipParts[3];

    // Calculate subnet mask
    const subnetMask = ~((1 << (32 - subnetMaskLength)) - 1);
    const networkAddress = ipNumber & subnetMask;
    const broadcastAddress = networkAddress | ~subnetMask;
    
    // Calculate usable hosts
    const usableHosts = (1 << (32 - subnetMaskLength)) - 2;
    const usableRangeStart = networkAddress + 1;
    const usableRangeEnd = broadcastAddress - 1;

    // Calculate subnet mask in dotted decimal notation
    const subnetMaskDotted = [
        (subnetMask >>> 24) & 255,
        (subnetMask >>> 16) & 255,
        (subnetMask >>> 8) & 255,
        subnetMask & 255
    ].join('.');

    // Calculate wildcard mask
    const wildcardMask = ~subnetMask >>> 0;
    const wildcardMaskDotted = [
        (wildcardMask >>> 24) & 255,
        (wildcardMask >>> 16) & 255,
        (wildcardMask >>> 8) & 255,
        wildcardMask & 255
    ].join('.');

    return {
        ipAddress: ipAddress,
        networkAddress: convertToDottedDecimal(networkAddress),
        usableHostRange: `${convertToDottedDecimal(usableRangeStart)} - ${convertToDottedDecimal(usableRangeEnd)}`,
        broadcastAddress: convertToDottedDecimal(broadcastAddress),
        usableHosts: usableHosts,
        subnetMask: subnetMaskDotted,
        wildcardMask: wildcardMaskDotted,
        cidrNotation: `/${subnetMaskLength}`
    };
}

function convertToDottedDecimal(num) {
    return [
        (num >>> 24) & 255,
        (num >>> 16) & 255,
        (num >>> 8) & 255,
        num & 255
    ].join('.');
}

function displaySubnetDetails(details) {
    document.getElementById('ipAddress').innerText = details.ipAddress;
    document.getElementById('networkAddress').innerText = details.networkAddress;
    document.getElementById('usableIPRange').innerText = details.usableHostRange;
    document.getElementById('broadcastAddress').innerText = details.broadcastAddress;
    document.getElementById('usableHosts').innerText = details.usableHosts;
    document.getElementById('subnetMask').innerText = details.subnetMask;
    document.getElementById('wildcardMask').innerText = details.wildcardMask;
    document.getElementById('cidrNotation').innerText = details.cidrNotation;
}

function addReservedSubnet() {
    const reservedInput = document.getElementById('reservedSubnetInput').value.trim();
    const reservedParts = reservedInput.split('/');

    if (reservedParts.length !== 2) {
        alert('Please enter a valid reserved subnet in the format x.x.x.x/y');
        return;
    }

    const reservedSubnet = reservedParts[0];
    const reservedMaskLength = parseInt(reservedParts[1], 10);

    // Add the reserved subnet to the table
    reservedSubnets.push({ subnet: reservedInput, usableRange: 'N/A', availableIPs: 'N/A', status: 'Reserved' });
    renderReservedSubnets();
}

function renderReservedSubnets() {
    const tableBody = document.getElementById('reservedSubnetsTableBody');
    tableBody.innerHTML = ''; // Clear existing entries

    reservedSubnets.forEach((item, index) => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${item.subnet}</td>
            <td>${item.usableRange}</td>
            <td>${item.availableIPs}</td>
            <td style="color: blue;">${item.status}</td>
            <td><button class="deleteButton" onclick="removeReservedSubnet(${index})">X</button></td>
        `;
        tableBody.appendChild(row);
    });
}

function removeReservedSubnet(index) {
    reservedSubnets.splice(index, 1); // Remove the reserved subnet
    renderReservedSubnets(); // Re-render the table
}
