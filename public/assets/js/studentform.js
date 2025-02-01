// Populate year of passing dropdown
function populateYearDropdown() {
    const yearSelect = document.getElementById('yearPassing');
    const currentYear = new Date().getFullYear();
    for (let year = currentYear; year >= 1970; year--) {
        const option = document.createElement('option');
        option.value = year;
        option.textContent = year;
        yearSelect.appendChild(option);
    }
}

// Calculate age based on date of birth
function calculateAge() {
    const dobInput = document.getElementById('dob');
    const ageInput = document.getElementById('age');
    
    if (dobInput.value) {
        const dob = new Date(dobInput.value);
        const today = new Date();
        let age = today.getFullYear() - dob.getFullYear();
        const monthDiff = today.getMonth() - dob.getMonth();
        
        if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < dob.getDate())) {
            age--;
        }
        
        ageInput.value = age;
    } else {
        ageInput.value = '';
    }
}

// Update sub-category based on selected category
function updateSubCategory() {
    const categorySelect = document.getElementById('category');
    const subCategorySelect = document.getElementById('subCategory');
    const category = categorySelect.value;
    
    // Clear existing options
    subCategorySelect.innerHTML = '<option value="">Select Sub Category</option>';
    
    // Add sub-categories based on selected category
    const subCategories = {
        'sc': ['A', 'B', 'C', 'D'],
        'st': ['Tribal', 'Non-Tribal'],
        'obc': ['A', 'B', 'C', 'D'],
        'general': ['EWS', 'Others']
    };
    
    if (subCategories[category]) {
        subCategories[category].forEach(subCat => {
            const option = document.createElement('option');
            option.value = subCat.toLowerCase();
            option.textContent = subCat;
            subCategorySelect.appendChild(option);
        });
    }
}

// Fetch location details based on pincode
async function fetchLocationDetails() {
    const pincodeInput = document.getElementById('pincode');
    const districtInput = document.getElementById('district');
    const stateInput = document.getElementById('state');
    const pincode = pincodeInput.value;

    if (pincode.length === 6) {
        try {
            const response = await fetch(`https://api.postalpincode.in/pincode/${pincode}`);
            const data = await response.json();
            
            if (data[0].Status === 'Success') {
                const location = data[0].PostOffice[0];
                districtInput.value = location.District;
                stateInput.value = location.State;
            } else {
                districtInput.value = '';
                stateInput.value = '';
                alert('Invalid PIN Code');
            }
        } catch (error) {
            console.error('Error fetching location details:', error);
            districtInput.value = '';
            stateInput.value = '';
        }
    }
}

// Form validation
function validateForm() {
    const form = document.getElementById('registrationForm');
    const formData = new FormData(form);
    const errors = {};
    let isValid = true;

    // Validate required fields
    for (let [name, value] of formData.entries()) {
        const element = document.getElementById(name);
        if (element && element.required && !value.trim()) {
            errors[name] = 'This field is required';
            isValid = false;
        }
    }

    // Validate mobile numbers
    const mobileFields = ['mobile', 'guardianContact'];
    mobileFields.forEach(field => {
        const value = formData.get(field);
        if (value && !/^\d{10}$/.test(value)) {
            errors[field] = 'Enter a valid 10-digit mobile number';
            isValid = false;
        }
    });

    // Validate email
    const email = formData.get('email');
    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        errors['email'] = 'Enter a valid email address';
        isValid = false;
    }

    // Validate Aadhar number
    const aadhar = formData.get('aadhar');
    if (aadhar && !/^\d{12}$/.test(aadhar)) {
        errors['aadhar'] = 'Enter a valid 12-digit Aadhar number';
        isValid = false;
    }

    // Validate pincode
    const pincode = formData.get('pincode');
    if (pincode && !/^\d{6}$/.test(pincode)) {
        errors['pincode'] = 'Enter a valid 6-digit PIN code';
        isValid = false;
    }

    // Display errors
    Object.keys(errors).forEach(field => {
        const errorElement = document.getElementById(`${field}Error`);
        if (errorElement) {
            errorElement.textContent = errors[field];
        }
    });

    return isValid;
}

function previewForm() {
    if (!validateForm()) {
        return;
    }

    const formData = {
        studentName: document.getElementById('studentName').value,
        phone: document.getElementById('phone').value,
        email: document.getElementById('email').value,
        qualification: document.getElementById('qualification').value,
        branch: document.getElementById('branch').value,
        cgpa: document.getElementById('cgpa').value,
        course: document.getElementById('course').value,
        dob: document.getElementById('dob').value,
        aadhar: document.getElementById('aadhar').value,
        parentName: document.getElementById('parentName').value,
        parentMobile: document.getElementById('parentMobile').value
    };

    const previewContent = document.getElementById('previewContent');
    previewContent.innerHTML = `
        <div class="preview-section">
            <h3>Student Details</h3>
            <div class="preview-item">
                <div class="preview-label">Student Name</div>
                <div class="preview-value">${formData.studentName}</div>
            </div>
            <div class="preview-item">
                <div class="preview-label">Phone Number</div>
                <div class="preview-value">${formData.phone}</div>
            </div>
            <div class="preview-item">
                <div class="preview-label">Email ID</div>
                <div class="preview-value">${formData.email}</div>
            </div>
            <div class="preview-item">
                <div class="preview-label">Qualification</div>
                <div class="preview-value">${formData.qualification}</div>
            </div>
            <div class="preview-item">
                <div class="preview-label">Branch</div>
                <div class="preview-value">${formData.branch}</div>
            </div>
            <div class="preview-item">
                <div class="preview-label">CGPA/Percentage</div>
                <div class="preview-value">${formData.cgpa}</div>
            </div>
            <div class="preview-item">
                <div class="preview-label">Course</div>
                <div class="preview-value">${formData.course}</div>
            </div>
            <div class="preview-item">
                <div class="preview-label">Date of Birth</div>
                <div class="preview-value">${formData.dob}</div>
            </div>
            <div class="preview-item">
                <div class="preview-label">Aadhar Number</div>
                <div class="preview-value">${formData.aadhar}</div>
            </div>
        </div>
        <div class="preview-section">
            <h3>Parent Details</h3>
            <div class="preview-item">
                <div class="preview-label">Parent Name</div>
                <div class="preview-value">${formData.parentName}</div>
            </div>
            <div class="preview-item">
                <div class="preview-label">Parent Mobile Number</div>
                <div class="preview-value">${formData.parentMobile}</div>
            </div>
        </div>
    `;

    document.getElementById('previewModal').style.display = 'block';
}

function closePreview() {
    document.getElementById('previewModal').style.display = 'none';
}

function confirmSubmission() {
    closePreview();
    document.getElementById('previewBtn').style.display = 'none';
    document.getElementById('submitBtn').style.display = 'block';
}

// Close modal when clicking outside
window.onclick = function(event) {
    const modal = document.getElementById('previewModal');
    if (event.target === modal) {
        closePreview();
    }
}

function handleSubmit(event) {
    event.preventDefault();
    
    if (validateForm()) {
        const formData = {
            studentName: document.getElementById('studentName').value,
            phone: document.getElementById('phone').value,
            email: document.getElementById('email').value,
            qualification: document.getElementById('qualification').value,
            branch: document.getElementById('branch').value,
            cgpa: document.getElementById('cgpa').value,
            course: document.getElementById('course').value,
            dob: document.getElementById('dob').value,
            aadhar: document.getElementById('aadhar').value,
            parentName: document.getElementById('parentName').value,
            parentMobile: document.getElementById('parentMobile').value
        };

        console.log('Form submitted:', formData);
        alert('Registration successful!');
        event.target.reset();
        document.getElementById('previewBtn').style.display = 'block';
        document.getElementById('submitBtn').style.display = 'none';
    }
}

// Initialize form
document.addEventListener('DOMContentLoaded', () => {
    populateYearDropdown();
    
    // Add input event listeners to clear errors
    const inputs = document.querySelectorAll('input, select');
    inputs.forEach(input => {
        input.addEventListener('input', () => {
            const errorElement = document.getElementById(`${input.name}Error`);
            if (errorElement) {
                errorElement.textContent = '';
            }
        });
    });
});