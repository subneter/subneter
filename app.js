document.addEventListener("DOMContentLoaded", function() {
    let reservedSubnets = [];
    let mainSubnet = '';

    document.getElementById("calculate-btn").addEventListener("click", function() {
        mainSubnet = document.getElementById("main-subnet").value;
        
        // Reset subnets and table on new calculation
        reservedSubnets = [];
        document.getElementById("subnet-table-body").innerHTML = '';

        const details = calculateSubnetDetails(mainSubnet);
        if (details) {
            updateDetailsTable(details);
            renderTable();
        } else {
            alert("Invalid main subnet");
        }
    });

    document.getElementById("slice-btn").addEventListener("click", function() {
        const reservedSubnet = document.getElementById("reserved-subnet").value;
        const errorMsg = document.getElementById("error-msg");

        errorMsg.textContent = ""; // Reset the error message

        if (validateSubnet(reservedSubnet)) {
            reservedSubnets.push(reservedSubnet);
            renderTable();
        } else {
            errorMsg.textContent = "Error: Invalid input. Example: 10.228.128.0/17";
        }
    });

    function validateSubnet(subnet) {
        // Simple regex check for valid subnet
        const subnetPattern = /^(\d{1,3}\.){3}\d{1,3}\/\d{1,2}$/;
        return subnetPattern.test(subnet);
    }

    function renderTable() {
        const tableBody = document.getElementById("subnet-table-body");
        tableBody.innerHTML = "";  // Clear previous entries

        reservedSubnets.forEach(subnet => {
            const row = document.createElement("tr");
            row.innerHTML = `
                <td class="blue-text">${subnet}</td>
                <td>-</td>  <!-- For simplicity, add usable host range calculation later -->
                <td>-</td>
                <td>Reserved</td>
                <td><button class="delete-button" onclick="removeSubnet('${subnet}')">X</button></td>
            `;
            tableBody.appendChild(row);
        });

        // Placeholder free subnet logic, this should include actual calculation
        const freeSubnet = mainSubnet; // For now, display main subnet as free
        const freeRow = document.createElement("tr");
        freeRow.innerHTML = `
            <td class="green-text">${freeSubnet}</td>
            <td>-</td>  <!-- Usable host range -->
            <td>-</td>
            <td>Free</td>
            <td></td>
        `;
        tableBody.appendChild(freeRow);
    }

    function removeSubnet(subnet) {
        reservedSubnets = reservedSubnets.filter(s => s !== subnet);
        renderTable();
    }

    function updateDetailsTable(details) {
        document.getElementById("ip-address").textContent = details.ip;
        document.getElementById("network-address").textContent = details.network;
        document.getElementById("host-range").textContent = `${details.firstHost} - ${details.lastHost}`;
        document.getElementById("broadcast-address").textContent = details.broadcast;
        document.getElementById("usable-hosts").textContent = details.usableHosts;
        document.getElementById("subnet-mask").textContent = details.subnetMask;
        document.getElementById("wildcard-mask").textContent = details.wildcardMask;
        document.getElementById("cidr-notation").textContent = details.cidr;
    }

    function calculateSubnetDetails(subnet) {
        // Example logic - replace with actual calculations as needed
        if (subnet === "10.228.128.0/17") {
            return {
                ip: "10.228.128.0",
                network: "10.228.128.0",
                firstHost: "10.228.128.1",
                lastHost: "10.228.255.254",
                broadcast: "10.228.255.255",
                usableHosts: "32,766",
                subnetMask: "255.255.128.0",
                wildcardMask: "0.0.127.255",
                cidr: "/17"
            };
        }
        return null; // Invalid subnet
    }
});
