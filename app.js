let subnetDetails = {};
let slices = [];
let freeSubnets = [];

function calculateSubnetDetails(subnet) {
    // Replace with logic to calculate subnet details
    // Here, we're just setting some dummy values for demonstration
    subnetDetails = {
        ipAddress: subnet,
        networkAddress: subnet.split('/')[0],
        usableHostRange: `${subnet.split('/')[0]} - ${subnet.split('/')[0]}`, // Placeholder
        broadcastAddress: subnet.split('/')[0],
        usableHosts: 0, // Placeholder
        subnetMask: '255.255.255.0', // Placeholder
        wildcardMask: '0.0.0.255', // Placeholder
        cidrNotation: subnet
    };

    // Example of calculating free subnets
    freeSubnets = [{ subnet: subnet, usableHostRange: `${subnet.split('/')[0]} - ${subnet.split('/')[0]}`, availableIPs: 0 }];

    renderDetails();
    renderFreeSubnets();
}

function renderDetails() {
    document.getElementById('ipAddress').innerText = subnetDetails.ipAddress;
    document.getElementById('networkAddress').innerText = subnetDetails.networkAddress;
    document.getElementById('usableHostRange').innerText = subnetDetails.usableHostRange;
    document.getElementById('broadcastAddress').innerText = subnetDetails.broadcastAddress;
    document.getElementById('usableHosts').innerText = subnetDetails.usableHosts;
    document.getElementById('subnetMask').innerText = subnetDetails.subnetMask;
    document.getElementById('wildcardMask').innerText = subnetDetails.wildcardMask;
    document.getElementById('cidrNotation').innerText = subnetDetails.cidrNotation;
}

function renderFreeSubnets() {
    const tableBody = document.getElementById('subnetTableBody');
    tableBody.innerHTML = '';

    freeSubnets.forEach((slice, index) => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${slice.subnet}</td>
            <td>${slice.usableHostRange}</td>
            <td>${slice.availableIPs}</td>
            <td>Free</td>
            <td><button class="delete-button" data-index="${index}">X</button></td>
        `;
        tableBody.appendChild(row);
    });
}

document.getElementById('calculateButton').addEventListener('click', function () {
    const subnetInput = document.getElementById('subnetInput').value;
    if (subnetInput) {
        calculateSubnetDetails(subnetInput);
        document.getElementById('sliceErrorMessage').innerText = '';
    } else {
        document.getElementById('errorMessage').innerText = 'Error: Invalid input. Input format: 10.228.128.0/17';
    }
});

document.getElementById('addSliceButton').addEventListener('click', function () {
    const sliceInput = document.getElementById('sliceInput').value;
    if (sliceInput) {
        // Add logic to check if sliceInput is valid and not exceeding the main subnet
        slices.push(sliceInput);
        document.getElementById('sliceErrorMessage').innerText = '';
        renderFreeSubnets(); // Update free subnets after adding slice
    } else {
        document.getElementById('sliceErrorMessage').innerText = 'Error: Invalid input. Input format: 10.228.128.0/20';
    }
});

// Optional: Add functionality to remove slices and update free subnets accordingly
document.getElementById('subnetTableBody').addEventListener('click', function (event) {
    if (event.target.classList.contains('delete-button')) {
        const index = event.target.getAttribute('data-index');
        slices.splice(index, 1);
        renderFreeSubnets(); // Update free subnets after removing slice
    }
});
