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

    // Example of displaying free subnets (modify this logic as needed)
    const freeSubnets = calculateFreeSubnets(subnet, reservedSubnets);
    document.getElementById('free-list').innerHTML = freeSubnets.map(free => `<li>${free}</li>`).join('');
}

function calculateFreeSubnets(baseSubnet, reserved) {
    // Placeholder for actual logic to calculate free subnets
    // For now, returning a static value
    return ['Free subnet example: 10.228.128.0/24']; 
}
