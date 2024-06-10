const { JSDOM } = require('jsdom');
const { bookDesk } = require('../script'); // Adjust the path as needed

describe('Desk Booking System', () => {
  let document, window, bookingMessage, durationInput, individualDeskButton, collaborationDeskButton, basicTierButton, premiumTierButton, executiveTierButton, bookNowButton;

  beforeEach(() => {
    const dom = new JSDOM(`
      <!DOCTYPE html>
      <html lang="en">
        <body>
          <div id="membership-tier-section" style="display: none;"></div>
          <input id="duration" type="number">
          <div id="booking-message"></div>
          <button id="individual-desk"></button>
          <button id="collaboration-desk"></button>
          <button id="basic-tier"></button>
          <button id="premium-tier"></button>
          <button id="executive-tier"></button>
          <button id="book-now"></button>
          ${Array(15).fill().map((_, i) => `<div id="desk${i + 1}" class="desk"></div>`).join('')}
        </body>
      </html>
    `);
    window = dom.window;
    document = window.document;
    global.document = document;

    bookingMessage = document.getElementById('booking-message');
    durationInput = document.getElementById('duration');
    individualDeskButton = document.getElementById('individual-desk');
    collaborationDeskButton = document.getElementById('collaboration-desk');
    basicTierButton = document.getElementById('basic-tier');
    premiumTierButton = document.getElementById('premium-tier');
    executiveTierButton = document.getElementById('executive-tier');
    bookNowButton = document.getElementById('book-now');

    // Attach the script functions to the DOM elements
    document.getElementById('individual-desk').addEventListener('click', () => selectDeskType('individual'));
    document.getElementById('collaboration-desk').addEventListener('click', () => selectDeskType('collaboration'));
    document.getElementById('basic-tier').addEventListener('click', () => selectTier('basic'));
    document.getElementById('premium-tier').addEventListener('click', () => selectTier('premium'));
    document.getElementById('executive-tier').addEventListener('click', () => selectTier('executive'));
    document.getElementById('book-now').addEventListener('click', bookDesk);
  });

  afterEach(() => {
    // Cleanup the global document object
    delete global.document;
  });

  test('should show error message if duration is not valid', () => {
    durationInput.value = 0;
    bookNowButton.click();
    expect(bookingMessage.textContent).toBe('Please enter a valid duration (minimum 1 hour).');
  });

  test('should show error message if no desks are available', () => {
    durationInput.value = 1;
    desks.fill(false); // All desks are booked
    bookNowButton.click();
    expect(bookingMessage.textContent).toBe('Sorry, no desks are currently available.');
  });

  test('should show error message if individual desk type is selected but no tier is selected', () => {
    durationInput.value = 1;
    individualDeskButton.click();
    bookNowButton.click();
    expect(bookingMessage.textContent).toBe('Please select a membership tier.');
  });

  test('should book an individual desk with correct tier and show booking message', () => {
    durationInput.value = 1;
    individualDeskButton.click();
    basicTierButton.click();
    bookNowButton.click();
    expect(bookingMessage.textContent).toBe('Desk 1 booked successfully! Total cost: $10.00');
    expect(document.getElementById('desk1').classList.contains('booked')).toBe(true);
  });

  test('should book a collaboration desk and show booking message', () => {
    durationInput.value = 1;
    collaborationDeskButton.click();
    bookNowButton.click();
    expect(bookingMessage.textContent).toBe('Desk 1 booked successfully! Total cost: $25.00');
    expect(document.getElementById('desk1').classList.contains('booked')).toBe(true);
  });

  test('should apply discount for bookings over 3 hours', () => {
    durationInput.value = 4;
    individualDeskButton.click();
    basicTierButton.click();
    bookNowButton.click();
    expect(bookingMessage.textContent).toBe('Desk 1 booked successfully! Total cost: $36.00');
    expect(document.getElementById('desk1').classList.contains('booked')).toBe(true);
  });
});
