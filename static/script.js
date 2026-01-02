function zoomCategory(category) {
    const items = document.querySelectorAll('.item-card');
    
    items.forEach(item => {
        // We use a CSS class to hide/show for smoother transitions
        if (category === 'all') {
            item.classList.remove('hidden');
        } else {
            if (item.classList.contains(category)) {
                item.classList.remove('hidden');
            } else {
                item.classList.add('hidden');
            }
        }
    });
}
function updatePrice(selectElement) {
    // Find the price display span in the same card as this select menu
    const priceDisplay = selectElement.parentElement.querySelector('.price-display');
    priceDisplay.innerText = "$ " + selectElement.value;
}
function verifyAge(isOldEnough) {
    const overlay = document.getElementById('age-overlay');
    
    if (isOldEnough) {
        // Hides the black screen
        overlay.style.display = 'none';
    } else {
        // Hides the screen but locks the site features
        overlay.style.display = 'none';
        document.body.classList.add('restricted');
        alert("ACCESS GRANTED FOR VIEWING ONLY. PURCHASING IS DISABLED.");
    }
}