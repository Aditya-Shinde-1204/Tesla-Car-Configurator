const topBar = document.querySelector('#top-bar');
const exteriorColorSection = document.querySelector('#exterior-buttons');
const interiorColorSection = document.querySelector('#interior-buttons');
const exteriorImage = document.querySelector('#exterior-image');
const interiorImage = document.querySelector('#interior-image');
const wheelButtonSection = document.querySelector('#wheel-buttons');
const performanceBtn = document.querySelector('#performance-btn');
const totalPriceElement = document.querySelector('#total-price');
const fullSelfDrivingCheckbox = document.querySelector('#full-self-driving-checkbox');
const accessoryCheckboxes = document.querySelectorAll('.accessory-form-checkbox');
const downPaymentElement = document.querySelector('#down-payment');
const monthlyPaymentElement = document.querySelector('#monthly-payment');


const basePrice = 52490;

let currentPrice = basePrice;


let selectedColor = 'Stealth Grey';

const selectedOptions = {
    'Performance Wheel': false,
    'Performance Package': false,
    'Full Self-Driving': false,
};

const pricing = {
    'Performance Wheels': 2500,
    'Performance Package': 5000,
    'Full Self-Driving': 8500,
    'Accessories': {
        'Center Console Trays': 35,
        'Sunshade': 105,
        'All-Weather Interior Liners': 255,
    }
};

// Update Total Price And the UI

const updateTotalprice = () => {
    // Rest the current price to base price
    currentPrice = basePrice;

    // Performance Wheels
    if (selectedOptions['Performance Wheels']) {
        currentPrice += pricing['Performance Wheels'];
    }

    // Performance Wheels 
    if (selectedOptions['Performance Package']) {
        currentPrice += pricing['Performance Package'];
    }

    // Full Self-Driving
    if (selectedOptions['Full Self-Driving']) {
        currentPrice += pricing['Full Self-Driving'];
    }

    // Accessory Checkbox

    accessoryCheckboxes.forEach((checkbox) => {

        // Extract the accessory label 

        const accessoryLable = checkbox
        .closest('label')
        .querySelector('span')
        .textContent.trim();

        const accessoryPrice = pricing['Accessories'][accessoryLable];

        // Add to current Price if accessory is selected
        if (checkbox.checked) {
            currentPrice += accessoryPrice;
        }
    });


    // Update the total price in UI
    totalPriceElement.textContent =`$${currentPrice.toLocaleString()}`;

    updatePaymentBreakdown();
};

// Update payment breakdown based on current price
const updatePaymentBreakdown = () => {
    // Calculate down Payment 
    const downPayment = currentPrice * 0.1;
    downPaymentElement.textContent = `$${downPayment.toLocaleString()}`;

    // Calculate loan details (assuming 60-month loan and 3% interest rate)
    const loanTermMonths = 60;
    const interestRate = 0.03;

    const loanAmount = currentPrice - downPayment;

    // Monthly Payment Formula : P * (r(1+r)^n) / ((1+r)^n - 1)
    const monthlyInterestRate = interestRate / 12;

     const monthlyPayment =
        (loanAmount *
            (monthlyInterestRate *
            Math.pow(1 + monthlyInterestRate, loanTermMonths))) /
            (Math.pow(1 + monthlyInterestRate, loanTermMonths) - 1);

        monthlyPaymentElement.textContent = `$${monthlyPayment
        .toFixed(2)
        .toLocaleString()}`;
};

// Handle topbar and Scroll

const handleScroll = () => {
    const atTop = window.scrollY === 0;
    topBar.classList.toggle('visible-bar', atTop)
    topBar.classList.toggle('hidden-bar', atTop)
};

// Image Mapping

const exteriorImages = {
    'Stealth Grey': './images/model-y-stealth-grey.jpg',
    'Pearl White': './images/model-y-pearl-white.jpg',
    'Deep Blue Metallic': './images/model-y-deep-blue-metallic.jpg',
    'Solid Black': './images/model-y-solid-black.jpg',
    'Ultra Red': './images/model-y-ultra-red.jpg',
    'Quicksilver': './images/model-y-quicksilver.jpg',
};

const interiorImages = {
    'Dark': './images/model-y-interior-dark.jpg',
    'Light': './images/model-y-interior-light.jpg',
};

// Handle Colour Section

const handleColourButtonClick = (event) => {
    let button;

    if (event.target.tagName === 'IMG') {
        button = event.target.closest('button');
    } else if (event.target.tagName === 'BUTTON') {
        button = event.target;
    }
    
    if (button) {
        const buttons = event.currentTarget.querySelectorAll('button');
        buttons.forEach((btn) => btn.classList.remove('btn-selected'));
        button.classList.add('btn-selected');

        // change Exterior Image
        if (event.currentTarget === exteriorColorSection) {
            selectedColor = button.querySelector('img').alt;
            updateExteriorImage();
        }

        // change Interior Image
        if (event.currentTarget === interiorColorSection) {
            const color = button.querySelector('img').alt;
            interiorImage.src = interiorImages[color];
        }
    }
};

// Update exterior Image based on color and wheels

const updateExteriorImage = () => {
    const performanceSuffix = selectedOptions['Performance Wheels'] ? '-performance' : '';
    const colorkey =  selectedColor in exteriorImages ? selectedColor : 'Stealth Grey';
    exteriorImage.src = exteriorImages[colorkey].replace('.jpg', `${performanceSuffix}.jpg`);
}


// Wheel Selection

const handleWheelButtonClick = (event) => {
    if (event.target.tagName === 'BUTTON') {
        const buttons = document.querySelectorAll('#wheel-buttons button');
        buttons.forEach((btn) => btn.classList.remove('bg-gray-700', 'text-white'));

        // Add selected style to clicked button

        event.target.classList.add('bg-gray-700', 'text-white');

         selectedOptions['Performance Wheels']= event.target.textContent.includes('Performance');
        updateExteriorImage();

        updateTotalprice();
    }
};

// Performance Package Selection

const handlePerformanceButtonClick = () => {
    const isSelected = performanceBtn.classList.toggle('bg-gray-700');
    performanceBtn.classList.toggle('text-white');

    // Update selected Options

    selectedOptions['Performance Package'] = isSelected;

    updateTotalprice();
};

// Full Self-Driving Selection

const fullSelfDrivingChange = () => {
    selectedOptions['Full Self-Driving'] = fullSelfDrivingCheckbox.checked;

    updateTotalprice();
};

// Handle Accessory Checkbox Listeners

accessoryCheckboxes.forEach((checkbox) => {
    checkbox.addEventListener('change', () => updateTotalprice());
});

// Initial update total price

updateTotalprice();


// Event Listeners
window.addEventListener('scroll', () => requestAnimationFrame(handleScroll));
exteriorColorSection.addEventListener('click', handleColourButtonClick);
interiorColorSection.addEventListener('click', handleColourButtonClick);
wheelButtonSection.addEventListener('click', handleWheelButtonClick);
performanceBtn.addEventListener('click',handlePerformanceButtonClick);
fullSelfDrivingCheckbox.addEventListener('change', fullSelfDrivingChange);


