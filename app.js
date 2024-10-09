let reservedSubnets = [];
let reloadCount = 0;

document.getElementById('calculateButton').addEventListener('click', function() {
    const subnetInput = document.getElementById('subnetInput').value;
    if (subnetInput) {
        calculateSubnetDetails(subnetInput);
        renderTable(); // Update the table
    }
});

document.getElementById('addReservedButton').addEventListener('click', function() {
    const reservedSubnetInput = document.getElementById('reservedSubnetInput').value;
    if (reservedSubnetInput) {
        reservedSubnets.push(reservedSubnetInput);
        document.getElementById('reservedSubnetInput').value = ''; // Clear input field
        renderTable(); // Update the table
    }
});

document.getElementById('reloadButton').addEventListener('click', function() {
    reloadCount++;
    this.textContent = `Reload (Count: ${reloadCount})`;
    location.reload();
});

function calculateSubnetDetails(subnet) {
    // Example subnet details, replace with actual calculations
    document.getElementById('ipAddress').textContent = "10.228.128.0";
    document.getElementById('networkAddress').textContent = "10.228.128.0";
    document.getElementById('usableHostRange').textContent = "10.228.128.1 - 10.228.255.254";
    document.getElementById('broadcastAddress').textContent = "10.228.255.255";
    document.getElementById('usableHostsCount').textContent = "32,766";
    document.getElementById('subnetMask').textContent = "255.255.128.0";
    document.getElementById('wildcardMask').textContent = "0.0.127.255";
    document.getElementById('cidrNotation').textContent = "/17";
}

function renderTable() {
    const subnetTableBody = document.getElementById('subnetTableBody');
    subnetTableBody.innerHTML = ''; // Clear existing table rows

    reservedSubnets.forEach(subnet => {
        addRow(subnet, "10.228.128.0 - 10.228.128.254", "254", 'blue-text', 'Reserved');
    });

    // Add free subnet example
    if (reservedSubnets.length > 0) {
        addRow("10.228.128.128/25", "10.228.128.128 - 10.228.128.254", "126", 'green-text', 'Free');
    }
}

function addRow(subnet, usableRange, availableIps, statusColor, status) {
    const subnetTableBody = document.getElementById('subnetTableBody');
    const row = subnetTableBody.insertRow();

    const subnetCell = row.insertCell(0);
    const usableRangeCell = row.insertCell(1);
    const availableIpsCell = row.insertCell(2);
    const statusCell = row.insertCell(3);
    const actionCell = row.insertCell(4);

    subnetCell.textContent = subnet;
    usableRangeCell.textContent = usableRange;
    availableIpsCell.textContent = availableIps;
    statusCell.textContent = status;
    statusCell.className = statusColor;

    const deleteButton = document.createElement('button');
    deleteButton.textContent = 'X';
    deleteButton.className = 'delete-button';
    deleteButton.onclick = function() {
        row.remove();
        reservedSubnets = reservedSubnets.filter(rs => rs !== subnet);
    };
    actionCell.appendChild(deleteButton);
}
