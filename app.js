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
    const freeSubnets = [];

    // Convert the base subnet to an array of IPs
    const baseRange = getCIDRRange(baseSubnet);
    let usedIPs = [];

    // Convert reserved subnets to IPs and collect them
    for (let r of reserved) {
        const range = getCIDRRange(r);
        usedIPs = usedIPs.concat(range);
    }

    // Identify free subnets
    let lastIP = baseRange.startIP;

    for (let ip of usedIPs.sort()) {
        if (lastIP < ip) {
            freeSubnets.push(`${ipToCIDR(lastIP + 1, ip - 1)}`); // Free range found
        }
        lastIP = ip + 1; // Move to the next IP after the reserved subnet
    }

    if (lastIP <= baseRange.endIP) {
        freeSubnets.push(`${ipToCIDR(lastIP, baseRange.endIP)}`); // Add remaining free range
    }

    return freeSubnets;
}

function getCIDRRange(cidr) {
    const [ip, prefix] = cidr.split('/');
    const startIP = ipToDecimal(ip);
    const numIPs = Math.pow(2, 32 - prefix);
    const endIP = startIP + numIPs - 1;
    return { startIP, endIP };
}

function ipToDecimal(ip) {
    return ip.split('.').reduce((acc, octet) => (acc << 8) + parseInt(octet), 0);
}

function decimalToIP(decimal) {
    return [(decimal >>> 24) & 255, (decimal >>> 16) & 255, (decimal >>> 8) & 255, decimal & 255].join('.');
}

function ipToCIDR(start, end) {
    return `${decimalToIP(start)}/${32 - Math.floor(Math.log2(end - start + 1))}`;
}
