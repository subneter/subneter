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
    // Parse base subnet
    const baseCIDR = ipToCIDR(baseSubnet);
    let freeSubnets = [];

    // Example logic to find free subnets
    // For simplicity, let's say we assume the entire range of baseSubnet is available,
    // then we remove reserved subnets from this range.
    
    // Create a function to convert CIDR to range
    const reservedRanges = reserved.map(subnet => ipToCIDR(subnet));
    
    // Logic to determine available free subnets
    // For now, we'll assume the following simple logic:
    freeSubnets.push(`${baseCIDR.start} to ${baseCIDR.end}`); // Placeholder for free subnet range
    // More logic would be needed to check against reserved ranges and actually find free subnets

    return freeSubnets;
}

function ipToCIDR(cidr) {
    // Example function to parse CIDR notation
    // Note: You'll need to implement this function to get the start and end IPs based on the CIDR
    const [ip, prefix] = cidr.split('/');
    const start = ip; // Simplified; should calculate based on prefix
    const end = ip; // Simplified; should calculate based on prefix
    return { start, end }; 
}
