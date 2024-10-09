let reservedSubnets = [];

function addReservedSubnet() {
    const reservedSubnet = document.getElementById('reserved-subnet').value.trim();
    if (reservedSubnet) {
        reservedSubnets.push(reservedSubnet);
        document.getElementById('reserved-subnet').value = ''; // Clear input field
        calculate(); // Call calculate to refresh the displayed data
    }
}

function calculate() {
    const subnet = document.getElementById('subnet').value.trim();
    document.getElementById('used-list').innerHTML = `<li>Used subnet: ${subnet}</li>`;
    
    // Display reserved subnets
    document.getElementById('reserved-list').innerHTML = reservedSubnets.map(reserved => `<li>${reserved}</li>`).join('');

    // Calculate and display free subnets
    const freeSubnets = calculateFreeSubnets(subnet, reservedSubnets);
    document.getElementById('free-list').innerHTML = freeSubnets.map(free => `<li>${free}</li>`).join('');
}

function calculateFreeSubnets(baseSubnet, reserved) {
    // Placeholder logic for calculating free subnets based on reserved subnets
    // For simplicity, we will just return a static value for now
    // Implement your own logic to calculate actual free subnets based on reserved ones

    const freeSubnets = [];
    // Example logic: Add a dummy free subnet for demonstration
    freeSubnets.push(`Free subnet example based on ${baseSubnet}`); 

    return freeSubnets; 
}
