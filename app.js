function calculate() {
    const subnet = document.getElementById('subnet').value;
    // Your logic to calculate free/used subnets here
    document.getElementById('used-list').innerHTML = `<li>Used subnet: ${subnet}</li>`;
    document.getElementById('free-list').innerHTML = `<li>Free subnet: Calculated based on input</li>`;
}
