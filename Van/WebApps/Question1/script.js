// Validation rules must be implemented[cite: 3].
let selectedSlots = [];
const preBooked = [3, 15, 22, 39]; // Some slots must be pre-booked using an array and displayed as disabled[cite: 10].
const prices = { "Two-Wheeler": 20, "Car": 50, "SUV": 80 }; // Slots must be categorized as Two-Wheeler, Car, and SUV with different pricing[cite: 9].

function validateAndLoad() {
    const name = document.getElementById('driverName').value;
    const vNum = document.getElementById('vehicleNum').value;
    const phone = document.getElementById('phoneNum').value;
    
    // Driver name must contain minimum 5 characters and alphabets only[cite: 4].
    if (!/^[A-Za-z]{5,}$/.test(name)) return alert("Invalid Name");
    // Vehicle number must follow standard format (TN00AA0000 pattern using regex)[cite: 5].
    if (!/^TN\d{2}[A-Z]{2}\d{4}$/.test(vNum)) return alert("Invalid Vehicle Number");
    // Phone number must start with 6–9 and contain exactly 10 digits[cite: 6].
    if (!/^[6-9]\d{9}$/.test(phone)) return alert("Invalid Phone");

    // After successful validation[cite: 7]:
    document.getElementById('parkingForm').style.display = 'none';
    document.getElementById('slotsSection').style.display = 'block';
    renderSlots();
}

function renderSlots() {
    const container = document.getElementById('slotsContainer');
    container.innerHTML = '';
    // Display parking slots dynamically (minimum 40 slots) generated using JavaScript[cite: 8].
    for (let i = 1; i <= 40; i++) {
        const slot = document.createElement('div');
        slot.className = 'slot';
        slot.innerText = i;
        if (preBooked.includes(i)) {
            slot.classList.add('disabled');
        } else {
            slot.onclick = () => toggleSlot(slot, i);
        }
        container.appendChild(slot);
    }
}

function toggleSlot(element, num) {
    if (selectedSlots.includes(num)) {
        selectedSlots = selectedSlots.filter(s => s !== num);
        element.classList.remove('selected');
    } else {
        // Users can select maximum 2 slots only[cite: 11].
        if (selectedSlots.length >= 2) return alert("Maximum 2 slots allowed.");
        selectedSlots.push(num);
        element.classList.add('selected');
    }
}

function confirmBooking() {
    if (selectedSlots.length === 0) return alert("Select at least 1 slot.");
    
    const vType = document.getElementById('vehicleType').value;
    const duration = parseInt(document.getElementById('duration').value);
    const time = document.getElementById('time').value;
    const hours = parseInt(time.split(':')[0]);

    // Parking price must be calculated based on [cite: 12]: Slot type price [cite: 13], Parking duration (hours input)[cite: 14].
    let baseCost = prices[vType] * duration * selectedSlots.length;
    let surcharge = 0;
    
    // Night surcharge (15% after 8 PM)[cite: 15].
    if (hours >= 20) surcharge = baseCost * 0.15; 
    
    let preTax = baseCost + surcharge;
    let tax = preTax * 0.12; // Apply GST (12%) and display final amount[cite: 16].
    let total = preTax + tax;

    // After confirmation, generate a unique Parking ID using date-time logic and display booking summary[cite: 18].
    const id = "PKG" + Date.now(); 

    // Before confirmation, display selected slot numbers, duration, base cost, tax, and total amount[cite: 17].
    // All operations must be performed without page reload using DOM manipulation and event listeners[cite: 19].
    document.getElementById('slotsSection').style.display = 'none';
    document.getElementById('summarySection').innerHTML = `
        <h3>Booking Summary</h3>
        <p>ID: ${id}</p>
        <p>Slots: ${selectedSlots.join(', ')}</p>
        <p>Duration: ${duration} hours</p>
        <p>Base Cost: ₹${baseCost}</p>
        <p>Night Surcharge: ₹${surcharge}</p>
        <p>GST (12%): ₹${tax}</p>
        <p>Total: ₹${total}</p>
    `;
}
