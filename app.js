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
    const freeListTable = freeSubnets.map(free => `<tr><td>${free.subnet}</td><td>${free.usableRange}</td><td>${free.subnetMask}</td></tr>`).join('');
    document.getElementById('free-list').innerHTML = freeListTable;
}

function calculateFreeSubnets(baseSubnet, reserved) {
    const freeSubnets = [];

    // Convert the base subnet to an array of IPs
    const baseRange = getCIDRRange(baseSubnet);
    let usedIPs = [];

    // Convert reserved subnets to IPs and collect them
    usedIPs.push(baseRange.startIP, baseRange.endIP + 1); // Include used subnet IPs
    for (let r of reserved) {
        const range = getCIDRRange(r);
        usedIPs.push(range.startIP, range.endIP + 1); // Include reserved subnet IPs
    }

    // Remove duplicates and sort the used IPs
    usedIPs = [...new Set(usedIPs)].sort((a, b) => a - b);

    // Identify free subnets
    let lastIP = baseRange.startIP;

    for (let ip of usedIPs) {
        if (lastIP < ip) {
            const freeSubnet = ipToCIDR(lastIP, ip - 1);
            const usableRange = `${decimalToIP(lastIP)} to ${decimalToIP(ip - 1)}`;
            const subnetMask = getSubnetMask(freeSubnet);
            freeSubnets.push({ subnet: freeSubnet, usableRange, subnetMask });
        }
        lastIP = ip; // Move to the next IP after the reserved subnet
    }

    if (lastIP <= baseRange.endIP) {
        const freeSubnet = ipToCIDR(lastIP, baseRange.endIP);
        const usableRange = `${decimalToIP(lastIP)} to ${decimalToIP(baseRange.endIP)}`;
        const subnetMask = getSubnetMask(freeSubnet);
        freeSubnets.push({ subnet: freeSubnet, usableRange, subnetMask });
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

function getSubnetMask(cidr) {
    const prefix = parseInt(cidr.split('/')[1]);
    const mask = 0xFFFFFFFF << (32 - prefix) >>> 0; // Create mask
    return [(mask >>> 24) & 255, (mask >>> 16) & 255, (mask >>> 8) & 255, mask & 255].join('.');
}
