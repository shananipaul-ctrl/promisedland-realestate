// Promised Land Real Estate - Main JavaScript
document.addEventListener('DOMContentLoaded', function() {
    console.log('Promised Land Real Estate - Where your vision meets its address');
    
    // Hide loader after page loads
    setTimeout(() => {
        document.querySelector('.rainbow-loader').style.opacity = '0';
        setTimeout(() => {
            document.querySelector('.rainbow-loader').style.display = 'none';
        }, 500);
    }, 2000);
    
    // Initialize all components
    initializeComponents();
    loadProperties();
    loadAgents();
    setupEventListeners();
    initializeAnimations();
});

// Initialize all components
function initializeComponents() {
    // Initialize Swiper for agents slider
    const agentsSwiper = new Swiper('.agents-slider', {
        slidesPerView: 1,
        spaceBetween: 30,
        pagination: {
            el: '.swiper-pagination',
            clickable: true,
        },
        breakpoints: {
            768: {
                slidesPerView: 2,
            },
            1024: {
                slidesPerView: 3,
            }
        }
    });
    
    // Initialize mortgage calculator
    initializeMortgageCalculator();
}

// Sample Properties Data
const properties = [
    {
        id: 1,
        title: "Sunrise Luxury Villa",
        address: "Palm Beach Road, Goa",
        price: 25000000,
        type: "villa",
        category: "luxury",
        bedrooms: 5,
        bathrooms: 4,
        area: 3500,
        year: 2023,
        image: "https://images.unsplash.com/photo-1613490493576-7fde63acd811?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
        amenities: ["Swimming Pool", "Garden", "Gym", "Security", "Parking"],
        featured: true
    },
    {
        id: 2,
        title: "SkyHigh Penthouse",
        address: "Marine Drive, Mumbai",
        price: 85000000,
        type: "penthouse",
        category: "luxury",
        bedrooms: 4,
        bathrooms: 3,
        area: 2800,
        year: 2022,
        image: "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
        amenities: ["Sea View", "Private Terrace", "Smart Home", "Concierge"],
        featured: true
    },
    {
        id: 3,
        title: "Green Valley Apartment",
        address: "Whitefield, Bangalore",
        price: 12500000,
        type: "apartment",
        category: "apartment",
        bedrooms: 3,
        bathrooms: 2,
        area: 1800,
        year: 2021,
        image: "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
        amenities: ["Clubhouse", "Children's Play Area", "Power Backup", "24/7 Security"],
        featured: false
    },
    {
        id: 4,
        title: "Prime Commercial Space",
        address: "Connaught Place, Delhi",
        price: 32000000,
        type: "commercial",
        category: "commercial",
        area: 2200,
        year: 2020,
        image: "https://images.unsplash.com/photo-1497366754035-f200968a6e72?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
        amenities: ["Central AC", "Elevator", "Parking", "Security"],
        featured: true
    },
    {
        id: 5,
        title: "Farmhouse Retreat",
        address: "Lavasa, Pune",
        price: 45000000,
        type: "villa",
        category: "villa",
        bedrooms: 6,
        bathrooms: 5,
        area: 5000,
        year: 2024,
        image: "https://images.unsplash.com/photo-1518780664697-55e3ad937233?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
        amenities: ["Private Pool", "Farm Land", "Mountain View", "Servant Quarters"],
        featured: true
    },
    {
        id: 6,
        title: "Beachside Plot",
        address: "Alibaug, Maharashtra",
        price: 15000000,
        type: "land",
        category: "land",
        area: 2400,
        year: null,
        image: "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
        amenities: ["Beach Access", "Road Facing", "Clear Title", "Water Connection"],
        featured: false
    }
];

// Sample Agents Data
const agents = [
    {
        id: 1,
        name: "Rajesh Kumar",
        title: "Senior Property Consultant",
        image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
        rating: 4.9,
        experience: "12 years",
        phone: "+91 98765 43210",
        email: "rajesh@promisedland.com",
        specialties: ["Luxury Properties", "Commercial Real Estate"]
    },
    {
        id: 2,
        name: "Priya Sharma",
        title: "Luxury Homes Specialist",
        image: "https://images.unsplash.com/photo-1494790108755-2616b612b786?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
        rating: 4.8,
        experience: "8 years",
        phone: "+91 98765 43211",
        email: "priya@promisedland.com",
        specialties: ["Villas", "Penthouses", "Beach Properties"]
    },
    {
        id: 3,
        name: "Amit Patel",
        title: "Investment Advisor",
        image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
        rating: 4.7,
        experience: "15 years",
        phone: "+91 98765 43212",
        email: "amit@promisedland.com",
        specialties: ["Commercial", "Land Investment", "Rental Properties"]
    },
    {
        id: 4,
        name: "Sneha Reddy",
        title: "First-Time Home Consultant",
        image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
        rating: 4.9,
        experience: "6 years",
        phone: "+91 98765 43213",
        email: "sneha@promisedland.com",
        specialties: ["Apartments", "Home Loans", "Legal Assistance"]
    }
];

// Load Properties
function loadProperties(filterCategory = 'all') {
    const container = document.getElementById('properties-container');
    if (!container) return;
    
    let filteredProperties = properties;
    
    if (filterCategory !== 'all') {
        filteredProperties = properties.filter(property => 
            property.category === filterCategory
        );
    }
    
    container.innerHTML = filteredProperties.map(property => `
        <div class="property-card-promised" data-category="${property.category}">
            <div class="property-image-promised">
                <img src="${property.image}" alt="${property.title}">
                ${property.featured ? '<div class="featured-badge-promised">Featured</div>' : ''}
                <div class="property-actions-promised">
                    <button class="btn-favorite-promised" data-id="${property.id}">
                        <i class="fas fa-heart"></i>
                    </button>
                    <button class="btn-share-promised">
                        <i class="fas fa-share-alt"></i>
                    </button>
                </div>
            </div>
            <div class="property-content-promised">
                <div class="property-price-promised">
                    ₹ ${formatIndianCurrency(property.price)}
                </div>
                <h3 class="property-title-promised">${property.title}</h3>
                <p class="property-address-promised">
                    <i class="fas fa-map-marker-alt"></i> ${property.address}
                </p>
                <div class="property-features-promised">
                    ${property.bedrooms ? `
                        <div class="feature-promised">
                            <i class="fas fa-bed"></i>
                            <span>${property.bedrooms} Beds</span>
                        </div>
                    ` : ''}
                    ${property.bathrooms ? `
                        <div class="feature-promised">
                            <i class="fas fa-bath"></i>
                            <span>${property.bathrooms} Baths</span>
                        </div>
                    ` : ''}
                    <div class="feature-promised">
                        <i class="fas fa-ruler-combined"></i>
                        <span>${property.area} sq.ft</span>
                    </div>
                </div>
                <div class="property-amenities-promised">
                    ${property.amenities.slice(0, 3).map(amenity => 
                        `<span class="amenity-tag-promised">${amenity}</span>`
                    ).join('')}
                </div>
                <div class="property-buttons-promised">
                    <button class="btn-details-promised" onclick="showPropertyDetails(${property.id})">
                        <i class="fas fa-eye"></i> View Details
                    </button>
                    <button class="btn-contact-promised" onclick="contactAboutProperty(${property.id})">
                        <i class="fas fa-phone"></i> Contact
                    </button>
                </div>
            </div>
        </div>
    `).join('');
}

// Load Agents
function loadAgents() {
    const container = document.getElementById('agents-container');
    if (!container) return;
    
    container.innerHTML = agents.map(agent => `
        <div class="swiper-slide">
            <div class="agent-card-promised">
                <div class="agent-image-promised">
                    <img src="${agent.image}" alt="${agent.name}">
                    <div class="agent-rating-promised">
                        <i class="fas fa-star"></i>
                        <span>${agent.rating}</span>
                    </div>
                </div>
                <div class="agent-content-promised">
                    <h3 class="agent-name-promised">${agent.name}</h3>
                    <p class="agent-title-promised">${agent.title}</p>
                    <div class="agent-experience-promised">
                        <i class="fas fa-briefcase"></i>
                        <span>${agent.experience} experience</span>
                    </div>
                    <div class="agent-specialties-promised">
                        ${agent.specialties.map(specialty => 
                            `<span class="specialty-tag-promised">${specialty}</span>`
                        ).join('')}
                    </div>
                    <div class="agent-contact-promised">
                        <a href="tel:${agent.phone}" class="btn-agent-phone">
                            <i class="fas fa-phone"></i> Call
                        </a>
                        <a href="mailto:${agent.email}" class="btn-agent-email">
                            <i class="fas fa-envelope"></i> Email
                        </a>
                    </div>
                </div>
            </div>
        </div>
    `).join('');
}

// Initialize Mortgage Calculator
function initializeMortgageCalculator() {
    const sliders = document.querySelectorAll('.slider');
    
    sliders.forEach(slider => {
        slider.addEventListener('input', function() {
            const displayId = this.id + '-display';
            const displayElement = document.getElementById(displayId);
            
            if (displayElement) {
                if (this.id === 'property-value') {
                    displayElement.textContent = formatIndianCurrency(this.value);
                } else {
                    displayElement.textContent = this.value;
                }
            }
            
            calculateEMI();
        });
    });
    
    calculateEMI();
}

// Calculate EMI
function calculateEMI() {
    const propertyValue = parseFloat(document.getElementById('property-value').value);
    const downPaymentPercent = parseFloat(document.getElementById('down-payment').value);
    const interestRate = parseFloat(document.getElementById('interest-rate').value);
    const loanTerm = parseFloat(document.getElementById('loan-term').value);
    
    const downPayment = (propertyValue * downPaymentPercent) / 100;
    const loanAmount = propertyValue - downPayment;
    
    const monthlyInterestRate = interestRate / 12 / 100;
    const numberOfPayments = loanTerm * 12;
    
    // Calculate EMI
    const emi = loanAmount * monthlyInterestRate * 
                Math.pow(1 + monthlyInterestRate, numberOfPayments) / 
                (Math.pow(1 + monthlyInterestRate, numberOfPayments) - 1);
    
    const totalPayment = emi * numberOfPayments;
    const totalInterest = totalPayment - loanAmount;
    
    // Update display
    document.getElementById('monthly-emi').textContent = formatIndianCurrency(Math.round(emi));
    document.getElementById('total-interest').textContent = formatIndianCurrency(Math.round(totalInterest));
    document.getElementById('total-payment').textContent = formatIndianCurrency(Math.round(totalPayment));
}

// Setup Event Listeners
function setupEventListeners() {
    // Search tabs
    document.querySelectorAll('.search-tab-promised').forEach(tab => {
        tab.addEventListener('click', function() {
            document.querySelectorAll('.search-tab-promised').forEach(t => 
                t.classList.remove('active')
            );
            this.classList.add('active');
        });
    });
    
    // Property category filters
    document.querySelectorAll('.category-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const category = this.dataset.category;
            
            document.querySelectorAll('.category-btn').forEach(b => 
                b.classList.remove('active')
            );
            this.classList.add('active');
            
            loadProperties(category);
        });
    });
    
    // Calculator tabs
    document.querySelectorAll('.calc-tab').forEach(tab => {
        tab.addEventListener('click', function() {
            const calcType = this.dataset.calc;
            
            document.querySelectorAll('.calc-tab').forEach(t => 
                t.classList.remove('active')
            );
            document.querySelectorAll('.calc-form').forEach(f => 
                f.classList.remove('active')
            );
            
            this.classList.add('active');
            document.getElementById(calcType + '-calc').classList.add('active');
        });
    });
    
    // Contact form submission
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            alert('Thank you for your message! We will contact you soon.');
            this.reset();
        });
    }
    
    // Mobile menu toggle
    const menuToggle = document.querySelector('.menu-toggle');
    const navMenu = document.querySelector('.nav-menu');
    
    if (menuToggle && navMenu) {
        menuToggle.addEventListener('click', () => {
            navMenu.style.display = navMenu.style.display === 'flex' ? 'none' : 'flex';
        });
    }
    
    // List Property button
    document.querySelectorAll('.btn-list').forEach(btn => {
        btn.addEventListener('click', () => {
            showListPropertyModal();
        });
    });
    
    // Login button
    document.getElementById('login-btn').addEventListener('click', () => {
        showLoginModal();
    });
}

// Initialize Animations
function initializeAnimations() {
    // Intersection Observer for scroll animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
            }
        });
    }, observerOptions);
    
    // Observe elements for animation
    document.querySelectorAll('.feature-card-promised, .property-card-promised, .agent-card-promised').forEach(el => {
        observer.observe(el);
    });
}

// Utility Functions
function formatIndianCurrency(num) {
    if (num >= 10000000) {
        return (num / 10000000).toFixed(2) + ' Cr';
    } else if (num >= 100000) {
        return (num / 100000).toFixed(2) + ' L';
    } else {
        return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    }
}

// Show Property Details
function showPropertyDetails(propertyId) {
    const property = properties.find(p => p.id === propertyId);
    if (!property) return;
    
    const modal = createModal(`
        <div class="property-details-modal">
            <div class="property-details-images">
                <img src="${property.image}" alt="${property.title}">
                <div class="image-thumbnails">
                    <!-- Additional images would go here -->
                </div>
            </div>
            <div class="property-details-content">
                <h2>${property.title}</h2>
                <p class="property-address"><i class="fas fa-map-marker-alt"></i> ${property.address}</p>
                
                <div class="property-highlights">
                    <div class="highlight-item">
                        <i class="fas fa-rupee-sign"></i>
                        <div>
                            <span>Price</span>
                            <strong>₹ ${formatIndianCurrency(property.price)}</strong>
                        </div>
                    </div>
                    ${property.bedrooms ? `
                        <div class="highlight-item">
                            <i class="fas fa-bed"></i>
                            <div>
                                <span>Bedrooms</span>
                                <strong>${property.bedrooms}</strong>
                            </div>
                        </div>
                    ` : ''}
                    ${property.bathrooms ? `
                        <div class="highlight-item">
                            <i class="fas fa-bath"></i>
                            <div>
                                <span>Bathrooms</span>
                                <strong>${property.bathrooms}</strong>
                            </div>
                        </div>
                    ` : ''}
                    <div class="highlight-item">
                        <i class="fas fa-ruler-combined"></i>
                        <div>
                            <span>Area</span>
                            <strong>${property.area} sq.ft</strong>
                        </div>
                    </div>
                </div>
                
                <div class="property-description">
                    <h3>Description</h3>
                    <p>Beautiful ${property.type} located in prime area. Perfect for ${property.type === 'commercial' ? 'business' : 'family living'} with excellent amenities.</p>
                </div>
                
                <div class="property-amenities-list">
                    <h3>Amenities</h3>
                    <div class="amenities-grid">
                        ${property.amenities.map(amenity => 
                            `<span class="amenity-item"><i class="fas fa-check"></i> ${amenity}</span>`
                        ).join('')}
                    </div>
                </div>
                
                <div class="property-contact-actions">
                    <a href="tel:+919080581547" class="btn-call-now">
                        <i class="fas fa-phone"></i> Call Now
                    </a>
                    <a href="https://wa.me/919080581547" class="btn-whatsapp" target="_blank">
                        <i class="fab fa-whatsapp"></i> WhatsApp
                    </a>
                    <button class="btn-schedule-visit">
                        <i class="fas fa-calendar-alt"></i> Schedule Visit
                    </button>
                </div>
            </div>
        </div>
    `);
    
    document.body.appendChild(modal);
}

// Contact About Property
function contactAboutProperty(propertyId) {
    const property = properties.find(p => p.id === propertyId);
    if (!property) return;
    
    const modal = createModal(`
        <div class="contact-property-modal">
            <h2>Interested in ${property.title}</h2>
            <p>Our team will contact you shortly</p>
            
            <form class="contact-property-form">
                <div class="form-group">
                    <input type="text" placeholder="Your Name" required>
                </div>
                <div class="form-group">
                    <input type="tel" placeholder="Phone Number" required>
                </div>
                <div class="form-group">
                    <input type="email" placeholder="Email Address" required>
                </div>
                <div class="form-group">
                    <textarea placeholder="Your Message" rows="3"></textarea>
                </div>
                <button type="submit" class="btn-submit-inquiry">
                    <i class="fas fa-paper-plane"></i> Send Inquiry
                </button>
            </form>
            
            <div class="direct-contact">
                <p>Or contact us directly:</p>
                <div class="direct-buttons">
                    <a href="tel:+919080581547" class="btn-direct-call">
                        <i class="fas fa-phone"></i> +91 90805 81547
                    </a>
                    <a href="https://wa.me/919080581547" class="btn-direct-whatsapp" target="_blank">
                        <i class="fab fa-whatsapp"></i> WhatsApp
                    </a>
                </div>
            </div>
        </div>
    `);
    
    document.body.appendChild(modal);
    
    // Add form submission
    const form = modal.querySelector('.contact-property-form');
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        alert('Thank you for your inquiry! We will contact you within 24 hours.');
        modal.remove();
    });
}

// Show List Property Modal
function showListPropertyModal() {
    const modal = createModal(`
        <div class="list-property-modal">
            <h2>List Your Property with Promised Land</h2>
            <p>Get your property featured and reach genuine buyers</p>
            
            <form class="list-property-form">
                <div class="form-row">
                    <div class="form-group">
                        <input type="text" placeholder="Property Title" required>
                    </div>
                    <div class="form-group">
                        <select required>
                            <option value="">Property Type</option>
                            <option value="house">House</option>
                            <option value="apartment">Apartment</option>
                            <option value="villa">Villa</option>
                            <option value="commercial">Commercial</option>
                            <option value="land">Land</option>
                        </select>
                    </div>
                </div>
                
                <div class="form-row">
                    <div class="form-group">
                        <input type="text" placeholder="Location/Address" required>
                    </div>
                    <div class="form-group">
                        <input type="number" placeholder="Area (sq.ft)" required>
                    </div>
                </div>
                
                <div class="form-row">
                    <div class="form-group">
                        <input type="number" placeholder="Expected Price (₹)" required>
                    </div>
                    <div class="form-group">
                        <input type="tel" placeholder="Your Phone Number" required>
                    </div>
                </div>
                
                <div class="form-group">
                    <textarea placeholder="Property Description" rows="4"></textarea>
                </div>
                
                <div class="form-group">
                    <label>Upload Property Images</label>
                    <input type="file" multiple accept="image/*">
                </div>
                
                <button type="submit" class="btn-submit-listing">
                    <i class="fas fa-home"></i> List My Property
                </button>
            </form>
            
            <div class="listing-benefits">
                <h3>Why List With Us?</h3>
                <ul>
                    <li><i class="fas fa-check"></i> Reach 50,000+ genuine buyers</li>
                    <li><i class="fas fa-check"></i> Professional photography included</li>
                    <li><i class="fas fa-check"></i> Expert price evaluation</li>
                    <li><i class="fas fa-check"></i> Dedicated property consultant</li>
                </ul>
            </div>
        </div>
    `);
    
    document.body.appendChild(modal);
    
    const form = modal.querySelector('.list-property-form');
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        alert('Thank you for listing your property! Our team will contact you within 2 hours.');
        modal.remove();
    });
}

// Show Login Modal
function showLoginModal() {
    const modal = createModal(`
        <div class="login-modal">
            <div class="login-tabs">
                <button class="login-tab active" data-tab="login">Login</button>
                <button class="login-tab" data-tab="register">Register</button>
            </div>
            
            <div class="login-form-container active" id="login-form">
                <form class="login-form">
                    <div class="form-group">
                        <input type="email" placeholder="Email Address" required>
                    </div>
                    <div class="form-group">
                        <input type="password" placeholder="Password" required>
                    </div>
                    <button type="submit" class="btn-login-submit">
                        <i class="fas fa-sign-in-alt"></i> Sign In
                    </button>
                </form>
                
                <div class="login-options">
                    <a href="#" class="forgot-password">Forgot Password?</a>
                    <div class="social-login">
                        <p>Or login with:</p>
                        <div class="social-buttons">
                            <button class="btn-google">
                                <i class="fab fa-google"></i> Google
                            </button>
                            <button class="btn-facebook">
                                <i class="fab fa-facebook-f"></i> Facebook
                            </button>
                        </div>
                    </div>
                </div>
            </div>
            
            <div class="login-form-container" id="register-form">
                <form class="register-form">
                    <div class="form-row">
                        <div class="form-group">
                            <input type="text" placeholder="First Name" required>
                        </div>
                        <div class="form-group">
                            <input type="text" placeholder="Last Name" required>
                        </div>
                    </div>
                    
                    <div class="form-group">
                        <input type="email" placeholder="Email Address" required>
                    </div>
                    
                    <div class="form-group">
                        <input type="tel" placeholder="Phone Number" required>
                    </div>
                    
                    <div class="form-row">
                        <div class="form-group">
                            <input type="password" placeholder="Password" required>
                        </div>
                        <div class="form-group">
                            <input type="password" placeholder="Confirm Password" required>
                        </div>
                    </div>
                    
                    <button type="submit" class="btn-register-submit">
                        <i class="fas fa-user-plus"></i> Create Account
                    </button>
                </form>
            </div>
        </div>
    `);
    
    document.body.appendChild(modal);
    
    // Tab switching
    modal.querySelectorAll('.login-tab').forEach(tab => {
        tab.addEventListener('click', function() {
            const tabName = this.dataset.tab;
            
            modal.querySelectorAll('.login-tab').forEach(t => 
                t.classList.remove('active')
            );
            modal.querySelectorAll('.login-form-container').forEach(f => 
                f.classList.remove('active')
            );
            
            this.classList.add('active');
            modal.querySelector(`#${tabName}-form`).classList.add('active');
        });
    });
    
    // Form submissions
    const loginForm = modal.querySelector('.login-form');
    loginForm.addEventListener('submit', (e) => {
        e.preventDefault();
        alert('Login successful!');
        modal.remove();
    });
    
    const registerForm = modal.querySelector('.register-form');
    registerForm.addEventListener('submit', (e) => {
        e.preventDefault();
        alert('Registration successful! Welcome to Promised Land.');
        modal.remove();
    });
}

// Create Modal Utility Function
function createModal(content) {
    const modal = document.createElement('div');
    modal.className = 'modal-overlay';
    modal.innerHTML = `
        <div class="modal-content-promised">
            <button class="modal-close-promised">&times;</button>
            ${content}
        </div>
    `;
    
    // Close modal on X click
    modal.querySelector('.modal-close-promised').addEventListener('click', () => {
        modal.remove();
    });
    
    // Close modal on outside click
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.remove();
        }
    });
    
    return modal;
}

// Make functions globally available
window.showPropertyDetails = showPropertyDetails;
window.contactAboutProperty = contactAboutProperty;

// Add CSS for modals and additional elements
const modalStyles = document.createElement('style');
modalStyles.textContent = `
    .modal-overlay {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.8);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 10000;
        animation: fadeIn 0.3s ease;
    }
    
    .modal-content-promised {
        background: white;
        border-radius: var(--border-radius);
        padding: 40px;
        max-width: 900px;
        max-height: 90vh;
        overflow-y: auto;
        position: relative;
        animation: slideUp 0.3s ease;
    }
    
    .modal-close-promised {
        position: absolute;
        top: 20px;
        right: 20px;
        background: none;
        border: none;
        font-size: 2rem;
        color: var(--text-dark);
        cursor: pointer;
        width: 40px;
        height: 40px;
        display: flex;
        align-items: center;
        justify-content: center;
        border-radius: 50%;
        transition: all 0.3s ease;
    }
    
    .modal-close-promised:hover {
        background: var(--gradient-promised);
        color: white;
        transform: rotate(90deg);
    }
    
    @keyframes fadeIn {
        from { opacity: 0; }
        to { opacity: 1; }
    }
    
    @keyframes slideUp {
        from { transform: translateY(50px); opacity: 0; }
        to { transform: translateY(0); opacity: 1; }
    }
    
    /* Property Card Styles */
    .property-card-promised {
        background: white;
        border-radius: var(--border-radius);
        overflow: hidden;
        box-shadow: var(--shadow-promised);
        transition: all 0.3s ease;
        animation: fadeInUp 0.5s ease;
    }
    
    .property-card-promised:hover {
        transform: translateY(-10px);
        box-shadow: var(--shadow-promised-lg);
    }
    
    .property-image-promised {
        position: relative;
        height: 250px;
        overflow: hidden;
    }
    
    .property-image-promised img {
        width: 100%;
        height: 100%;
        object-fit: cover;
        transition: transform 0.5s ease;
    }
    
    .property-card-promised:hover .property-image-promised img {
        transform: scale(1.1);
    }
    
    .featured-badge-promised {
        position: absolute;
        top: 20px;
        left: 20px;
        background: var(--gradient-promised);
        color: white;
        padding: 8px 15px;
        border-radius: 20px;
        font-size: 0.8rem;
        font-weight: 600;
    }
    
    .property-actions-promised {
        position: absolute;
        top: 20px;
        right: 20px;
        display: flex;
        gap: 10px;
    }
    
    .btn-favorite-promised,
    .btn-share-promised {
        width: 40px;
        height: 40px;
        border-radius: 50%;
        background: rgba(255, 255, 255, 0.9);
        border: none;
        color: var(--text-dark);
        font-size: 1rem;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        transition: all 0.3s ease;
    }
    
    .btn-favorite-promised:hover {
        background: var(--promised-red);
        color: white;
    }
    
    .btn-share-promised:hover {
        background: var(--promised-blue);
        color: white;
    }
    
    .property-content-promised {
        padding: 25px;
    }
    
    .property-price-promised {
        font-size: 1.8rem;
        font-weight: 800;
        color: var(--promised-red);
        margin-bottom: 10px;
    }
    
    .property-title-promised {
        font-size: 1.3rem;
        margin-bottom: 10px;
        color: var(--text-dark);
    }
    
    .property-address-promised {
        color: var(--text-muted);
        font-size: 0.9rem;
        margin-bottom: 20px;
        display: flex;
        align-items: center;
        gap: 8px;
    }
    
    .property-features-promised {
        display: flex;
        gap: 20px;
        margin-bottom: 20px;
        padding-bottom: 20px;
        border-bottom: 1px solid #eee;
    }
    
    .feature-promised {
        display: flex;
        align-items: center;
        gap: 8px;
        color: var(--text-muted);
    }
    
    .feature-promised i {
        color: var(--promised-teal);
    }
    
    .property-amenities-promised {
        display: flex;
        flex-wrap: wrap;
        gap: 8px;
        margin-bottom: 20px;
    }
    
    .amenity-tag-promised {
        background: rgba(78, 205, 196, 0.1);
        color: var(--promised-teal);
        padding: 5px 10px;
        border-radius: 15px;
        font-size: 0.8rem;
        font-weight: 500;
    }
    
    .property-buttons-promised {
        display: flex;
        gap: 10px;
    }
    
    .btn-details-promised,
    .btn-contact-promised {
        flex: 1;
        padding: 12px;
        border: none;
        border-radius: 8px;
        font-weight: 600;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 8px;
        transition: all 0.3s ease;
    }
    
    .btn-details-promised {
        background: var(--gradient-promised);
        color: white;
    }
    
    .btn-contact-promised {
        background: rgba(255, 107, 107, 0.1);
        color: var(--promised-red);
        border: 2px solid var(--promised-red);
    }
    
    .btn-details-promised:hover {
        transform: translateY(-2px);
        box-shadow: var(--shadow-promised);
    }
    
    .btn-contact-promised:hover {
        background: var(--promised-red);
        color: white;
    }
    
    /* Agent Card Styles */
    .agent-card-promised {
        background: white;
        border-radius: var(--border-radius);
        overflow: hidden;
        box-shadow: var(--shadow-promised);
        transition: all 0.3s ease;
    }
    
    .agent-card-promised:hover {
        transform: translateY(-5px);
        box-shadow: var(--shadow-promised-lg);
    }
    
    .agent-image-promised {
        position: relative;
        height: 200px;
        overflow: hidden;
    }
    
    .agent-image-promised img {
        width: 100%;
        height: 100%;
        object-fit: cover;
    }
    
    .agent-rating-promised {
        position: absolute;
        bottom: 15px;
        right: 15px;
        background: rgba(255, 255, 255, 0.9);
        padding: 5px 10px;
        border-radius: 15px;
        display: flex;
        align-items: center;
        gap: 5px;
        font-weight: 600;
    }
    
    .agent-rating-promised i {
        color: var(--promised-yellow);
    }
    
    .agent-content-promised {
        padding: 25px;
    }
    
    .agent-name-promised {
        font-size: 1.3rem;
        margin-bottom: 5px;
        color: var(--text-dark);
    }
    
    .agent-title-promised {
        color: var(--promised-blue);
        font-weight: 600;
        margin-bottom: 15px;
    }
    
    .agent-experience-promised {
        display: flex;
        align-items: center;
        gap: 8px;
        color: var(--text-muted);
        margin-bottom: 15px;
        font-size: 0.9rem;
    }
    
    .agent-specialties-promised {
        display: flex;
        flex-wrap: wrap;
        gap: 8px;
        margin-bottom: 20px;
    }
    
    .specialty-tag-promised {
        background: rgba(255, 107, 107, 0.1);
        color: var(--promised-red);
        padding: 5px 10px;
        border-radius: 15px;
        font-size: 0.8rem;
        font-weight: 500;
    }
    
    .agent-contact-promised {
        display: flex;
        gap: 10px;
    }
    
    .btn-agent-phone,
    .btn-agent-email {
        flex: 1;
        padding: 10px;
        text-align: center;
        text-decoration: none;
        border-radius: 8px;
        font-weight: 600;
        font-size: 0.9rem;
        transition: all 0.3s ease;
    }
    
    .btn-agent-phone {
        background: var(--promised-blue);
        color: white;
    }
    
    .btn-agent-email {
        background: rgba(255, 107, 107, 0.1);
        color: var(--promised-red);
        border: 2px solid var(--promised-red);
    }
    
    .btn-agent-phone:hover,
    .btn-agent-email:hover {
        transform: translateY(-2px);
        box-shadow: var(--shadow-promised);
    }
    
    .btn-agent-email:hover {
        background: var(--promised-red);
        color: white;
    }
    
    /* Animation for cards */
    @keyframes fadeInUp {
        from {
            opacity: 0;
            transform: translateY(20px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }
    
    .animate-in {
        animation: fadeInUp 0.6s ease forwards;
    }
`;

document.head.appendChild(modalStyles);
