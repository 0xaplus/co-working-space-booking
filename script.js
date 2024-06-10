const desks = Array(15).fill(true); // All desks initially available
const individualPrices = { basic: 10, premium: 15, executive: 20 };
const collaborationPrice = 25;
let selectedDeskType;
let selectedTier;

const individualTierSection = document.getElementById('membership-tier-section');
const bookingMessage = document.getElementById('booking-message');

const toggleMembershipTier = () => {
  individualTierSection.style.display = selectedDeskType === 'individual' ? 'block' : 'none';
  selectedTier = undefined;
};

const bookDesk = () => {
  const duration = document.getElementById('duration').value;
  if (!duration || duration <= 0) {
    bookingMessage.textContent = 'Please enter a valid duration (minimum 1 hour).';
    return;
  }

  const availableDesk = desks.findIndex(available => available);
  if (availableDesk === -1) {
    bookingMessage.textContent = 'Sorry, no desks are currently available.';
    return;
  }

  let price = 0;
  if (selectedDeskType === 'individual') {
    if (!selectedTier) {
      bookingMessage.textContent = 'Please select a membership tier.';
      return;
    }
    price = individualPrices[selectedTier] * duration;
  } else {
    price = collaborationPrice * duration;
  }

  if (duration > 3) {
    price *= 0.9; // Apply 10% discount for bookings over 3 hours
  }

  desks[availableDesk] = false; // Mark desk as booked
  document.getElementById(`desk${availableDesk + 1}`).classList.add('booked');

  bookingMessage.textContent = `Desk ${availableDesk + 1} booked successfully! Total cost: $${price.toFixed(2)}`;
};

const selectDeskType = (type) => {
  selectedDeskType = type;
  toggleMembershipTier();
};

const selectTier = (tier) => {
  selectedTier = tier;
};

document.getElementById('individual-desk').addEventListener('click', () => selectDeskType('individual'));
document.getElementById('collaboration-desk').addEventListener('click', () => selectDeskType('collaboration'));
document.getElementById('basic-tier').addEventListener('click', () => selectTier('basic'));
document.getElementById('premium-tier').addEventListener('click', () => selectTier('premium'));
document.getElementById('executive-tier').addEventListener('click', () => selectTier('executive'));
document.getElementById('book-now').addEventListener('click', bookDesk);

module.exports = {bookDesk}