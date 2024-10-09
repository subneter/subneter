let reservedSubnets = [];

function addReservedSubnet() {
    const reservedSubnet = document.getElementById('reserved-subnet').value;
    if (reservedSubnet) {
        reservedSubnets.push(reservedSubnet);
        calculate();
        document.getElementById('reserved-subnet').value = ''; // Clear input field
    }
}

function calculate() {
    const subnet = document.getElementById('subnet').value;
    document.getElementById('used-list').innerHTML = `<li>Used subnet: ${subnet}</li>`;
    
    // Display reserved subnets
    document.getElementById('reserved-list').innerHTML = reservedSubnets.map(reserved => `<li>${reserved}</li>`).join('');

    // Calculate and display free subnets
    const freeSubnets = calculateFreeSubnets(subnet, reservedSubnets);
    document.getElementById('free-list').innerHTML = freeSubnets.map(free => `<li>${free}</li>`).join('');
}

function calculateFreeSubnets(baseSubnet, reserved) {
    // Placeholder for actual subnet calculation logic
    const freeSubnets = [];
    
    // Example: You need to implement actual logic based on reserved subnets
    // For now, let's assume we're just returning an example
    freeSubnets.push('Free subnet example: 10.228.128.0/24');

    // Implement logic here to calculate free subnets based on baseSubnet and reserved
    return freeSubnets; 
}
