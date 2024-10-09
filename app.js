<script>
    const subnetTableBody = document.getElementById('subnetTableBody');
    let reservedSubnets = [];
    let reloadCount = 0;

    function reloadPage() {
        reloadCount++;
        document.getElementById('reloadButton').innerText = `Reload Page (${reloadCount})`;
        window.location.reload();
    }

    function renderTable() {
        subnetTableBody.innerHTML = ''; // Clear existing table rows

        // Add reserved subnets
        reservedSubnets.forEach(subnet => {
            const { usableRange, availableIps } = calculateSubnetDetails(subnet);
            addRow(subnet, usableRange, availableIps, 'blue-text', 'Reserved');
        });

        // Show free subnets based on reserved subnets and used subnet
        const usedSubnet = document.getElementById('subnetInput').value;
        const freeSubnets = calculateFreeSubnets(usedSubnet, reservedSubnets);
        freeSubnets.forEach(freeSubnet => {
            const { usableRange, availableIps } = calculateSubnetDetails(freeSubnet);
            addRow(freeSubnet, usableRange, availableIps, 'green-text', 'Free');
        });
    }

    function addRow(subnet, usableRange, availableIps, colorClass, status) {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td class="${colorClass}">${subnet}</td>
            <td class="${colorClass}">${usableRange}</td>
            <td class="${colorClass}">${availableIps}</td>
            <td class="${colorClass}">${status}</td>
            <td><button class="remove-btn" onclick="removeSubnet('${subnet}')">X</button></td>
        `;
        subnetTableBody.appendChild(row);
    }

    function calculateSubnetDetails(subnet) {
        const mask = parseInt(subnet.split('/')[1], 10);
        const networkAddress = subnet.split('/')[0];
        const totalHosts = Math.pow(2, (32 - mask)) - 2; // Subtracting network and broadcast addresses
        const usableRange = `${networkAddress} - ${networkAddress.split('.').slice(0, 3).join('.')}.${parseInt(networkAddress.split('.').pop()) + totalHosts}`;
        return {
            usableRange,
            availableIps: totalHosts
        };
    }

    function calculateFreeSubnets(usedSubnet, reservedSubnets) {
        // Logic to calculate free subnets based on used subnet and reserved subnets
        return ['10.228.128.0/24', '10.228.128.128/25']; // Dummy free subnets for demonstration
    }

    document.getElementById('subnetForm').addEventListener('submit', function(event) {
        event.preventDefault();
        const subnetInput = document.getElementById('subnetInput').value;
        displayIPDetails(subnetInput);
    });

    function displayIPDetails(subnet) {
        const ipDetailsDiv = document.getElementById('ipDetails');
        const details = calculateSubnetDetails(subnet);
        ipDetailsDiv.innerHTML = `
            <h2>IP Details</h2>
            <p>IP Address: ${subnet.split('/')[0]}</p>
            <p>Network Address: ${subnet.split('/')[0]}</p>
            <p>Usable Host IP Range: ${details.usableRange}</p>
            <p>Broadcast Address: ${details.usableRange.split(' - ')[1]}</p>
            <p>Number of Usable Hosts: ${details.availableIps}</p>
            <p>Subnet Mask: ${getSubnetMask(subnet)}</p>
            <p>Wildcard Mask: ${getWildcardMask(subnet)}</p>
            <p>CIDR Notation: ${subnet}</p>
        `;
        renderTable(); // Refresh table with new used subnet
    }

    function getSubnetMask(subnet) {
        const mask = subnet.split('/')[1];
        return subnetMasks[mask] || 'Unknown';
    }

    function getWildcardMask(subnet) {
        const mask = subnet.split('/')[1];
        const wildcard = (Math.pow(2, 32 - mask) - 1);
        return `${wildcard >>> 24}.${(wildcard >>> 16) & 255}.${(wildcard >>> 8) & 255}.${wildcard & 255}`;
    }

    document.getElementById('reserveSubnetForm').addEventListener('submit', function(event) {
        event.preventDefault();
        const reserveSubnetInput = document.getElementById('reserveSubnetInput').value;
        reservedSubnets.push(reserveSubnetInput);
        document.getElementById('reserveSubnetInput').value = ''; // Clear the input after adding
        renderTable();
    });

    function removeSubnet(subnet) {
        reservedSubnets = reservedSubnets.filter(reserved => reserved !== subnet);
        renderTable(); // Refresh the table
    }

    // Initial render
    renderTable();
</script>
