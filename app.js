function calculateSubnetDetails(subnet) {
    const [ip, cidr] = subnet.split('/');
    const subnetMask = getSubnetMask(parseInt(cidr));
    const wildcardMask = getWildcardMask(subnetMask);
    const networkAddress = calculateNetworkAddress(ip, subnetMask);
    const broadcastAddress = calculateBroadcastAddress(networkAddress, subnetMask);
    const usableHostRange = calculateUsableHostRange(networkAddress, broadcastAddress);
    const usableHosts = calculateUsableHosts(parseInt(cidr));

    subnetDetails = {
        ipAddress: ip,
        networkAddress: networkAddress,
        usableHostRange: usableHostRange,
        broadcastAddress: broadcastAddress,
        usableHosts: usableHosts,
        subnetMask: subnetMask,
        wildcardMask: wildcardMask,
        cidrNotation: `/${cidr}`,
    };

    renderDetails();
    renderFreeSubnets();
}

function getSubnetMask(cidr) {
    let mask = (0xFFFFFFFF << (32 - cidr)) >>> 0;
    return [
        (mask >>> 24) & 0xFF,
        (mask >>> 16) & 0xFF,
        (mask >>> 8) & 0xFF,
        mask & 0xFF
    ].join('.');
}

function getWildcardMask(subnetMask) {
    return subnetMask
        .split('.')
        .map(octet => 255 - parseInt(octet))
        .join('.');
}

function calculateNetworkAddress(ip, subnetMask) {
    const ipArray = ipToArray(ip);
    const maskArray = ipToArray(subnetMask);
    const networkArray = ipArray.map((octet, index) => octet & maskArray[index]);
    return networkArray.join('.');
}

function calculateBroadcastAddress(networkAddress, subnetMask) {
    const networkArray = ipToArray(networkAddress);
    const maskArray = ipToArray(subnetMask).map(octet => 255 - octet);
    const broadcastArray = networkArray.map((octet, index) => octet | maskArray[index]);
    return broadcastArray.join('.');
}

function calculateUsableHostRange(networkAddress, broadcastAddress) {
    const ipRangeStart = increaseIpByOne(networkAddress);
    const ipRangeEnd = decreaseIpByOne(broadcastAddress);
    return `${ipRangeStart} - ${ipRangeEnd}`;
}

function calculateUsableHosts(cidr) {
    return Math.pow(2, 32 - cidr) - 2;
}

function increaseIpByOne(ip) {
    const ipArray = ip.split('.').map(Number);
    for (let i = ipArray.length - 1; i >= 0; i--) {
        if (ipArray[i] < 255) {
            ipArray[i]++;
            break;
        } else {
            ipArray[i] = 0;
        }
    }
    return ipArray.join('.');
}

function decreaseIpByOne(ip) {
    const ipArray = ip.split('.').map(Number);
    for (let i = ipArray.length - 1; i >= 0; i--) {
        if (ipArray[i] > 0) {
            ipArray[i]--;
            break;
        } else {
            ipArray[i] = 255;
        }
    }
    return ipArray.join('.');
}

function ipToArray(ip) {
    return ip.split('.').map(Number);
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
