let subnetData = {
    reservedSubnets: [],
    totalSubnets: []
};

function calculateSubnetDetails() {
    const subnetInput = document.getElementById('subnetInput').value;
    const [baseIp, prefixLength] = subnetInput.split('/');
    const network = ip2long(baseIp);
    const totalHosts = Math.pow(2, 32 - prefixLength);
    const usableHosts = totalHosts - 2;

    const ipAddress = baseIp;
    const networkAddress = long2ip(network & ~((1 << (32 - prefixLength)) - 1));
    const broadcastAddress = long2ip(network + totalHosts - 1);
    const usableHostRange = `${long2ip(network + 1)} - ${long2ip(network + totalHosts - 2)}`;
    const subnetMask = longToSubnetMask(prefixLength);
    const wildcardMask = longToWildcardMask(prefixLength);
    const cidrNotation = `/${prefixLength}`;

    // Populate the subnet details in the table
    document.getElementById('ipAddress').innerText = ipAddress;
    document.getElementById('networkAddress').innerText = networkAddress;
    document.getElementById('usableHostRange').innerText = usableHostRange;
    document.getElementById('broadcastAddress').innerText = broadcastAddress;
    document.getElementById('usableHosts').innerText = usableHosts;
    document.getElementById('subnetMask').innerText = subnetMask;
    document.getElementById('wildcardMask').innerText = wildcardMask;
    document.getElementById('cidrNotation').innerText = cidrNotation;

    // Update the subnet table
    updateSubnetTable();
}

function updateSubnetTable() {
    const subnetTableBody = document.getElementById('subnetTableBody');
    subnetTableBody.innerHTML = '';

    // Used Subnet
    subnetTableBody.innerHTML += `
        <tr>
            <td>${document.getElementById('subnetInput').value}</td>
            <td>${document.getElementById('usableHostRange').innerText}</td>
            <td>${document.getElementById('usableHosts').innerText}</td>
            <td class="blue-text">Reserved</td>
            <td><button class="delete-button" onclick="removeSubnet(this)">X</button></td>
        </tr>
    `;

    // Reserved Subnets
    for (let subnet of subnetData.reservedSubnets) {
        subnetTableBody.innerHTML += `
            <tr>
                <td>${subnet.subnet}</td>
                <td>${subnet.usableRange}</td>
                <td>${subnet.availableIps}</td>
                <td class="blue-text">Reserved</td>
                <td><button class="delete-button" onclick="removeSubnet(this)">X</button></td>
            </tr>
        `;
    }

    // Free Subnets
    for (let subnet of subnetData.totalSubnets) {
        subnetTableBody.innerHTML += `
            <tr>
                <td>${subnet.subnet}</td>
                <td>${subnet.usableRange}</td>
                <td>${subnet.availableIps}</td>
                <td class="green-text">Free</td>
                <td><button class="delete-button" onclick="removeSubnet(this)">X</button></td>
            </tr>
        `;
    }
}

function removeSubnet(btn) {
    const row = btn.parentNode.parentNode;
    row.parentNode.removeChild(row);
}

function long2ip(long) {
    return ((long >>> 24) + '.' +
            ((long >> 16) & 255) + '.' +
            ((long >> 8) & 255) + '.' +
            (long & 255));
}

function ip2long(ip) {
    return ip.split('.').reduce((acc, octet) => (acc << 8) + parseInt(octet), 0) >>> 0;
}

function longToSubnetMask(prefix) {
    const mask = (1 << 32) - (1 << (32 - prefix));
    return long2ip(mask);
}

function longToWildcardMask(prefix) {
    return long2ip((1 << 32) - (1 << (32 - prefix)));
}

document.getElementById('calculateBtn').addEventListener('click', calculateSubnetDetails);
