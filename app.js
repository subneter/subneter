document.addEventListener("DOMContentLoaded", function() {
    let subnetData = {};
    let reservedSubnets = [];

    document.getElementById("calculate-btn").addEventListener("click", function() {
        const mainSubnet = document.getElementById("main-subnet").value;
        // Clear the previous table and data
        document.getElementById("subnet-table-body").innerHTML = '';
        reservedSubnets = [];
        // Call your calculation logic
        const details = calculateSubnetDetails(mainSubnet);
        if (details) {
            // Fill the details table
            document.getElementById("ip-address").textContent = details.ip;
            document.getElementById("network-address").textContent = details.network;
            document.getElementById("host-range").textContent = `${details.firstHost} - ${details.lastHost}`;
            document.getElementById("broadcast-address").textContent = details.broadcast;
            document.getElementById("usable-hosts").textContent = details.usableHosts;
            document.getElementById("subnet-mask").textContent = details.subnetMask;
            document.getElementById("wildcard-mask").textContent = details.wildcardMask;
            document.getElementById("cidr-notation").textContent = details.cidr;
        } else {
            alert("Invalid main subnet");
        }
    });

    document.getElementById("slice-btn").addEventListener("click", function() {
        const reservedSubnet = document.getElementById("reserved-subnet").value;
        const errorMsg = document.getElementById("error-msg");

        // Reset the error message
        errorMsg.textContent = "";

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

        // Add reserved subnets in blue
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

        // Add free subnets (placeholder for actual logic)
        const freeSubnet = "Free Subnet Example"; // Replace with actual free subnet calculation
        const freeRow = document.createElement("tr");
        freeRow.innerHTML = `
            <td class="green-text">${freeSubnet}</td>
            <td>-</td>  <!-- For simplicity, add usable host range calculation later -->
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

    function calculateSubnetDetails(subnet) {
        // Mock function - replace with your actual subnet calculation logic
        // Example: 10.228.128.0/17
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
        return null; // Invalid subnet for simplicity
    }
});
