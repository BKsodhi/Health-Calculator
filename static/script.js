document.addEventListener('DOMContentLoaded', function () {
    const bmiForm = document.getElementById('bmiForm');
    const popup = document.querySelector('.popup');
    const closeBtn = document.querySelector('.close-btn');
    const unitToggle = document.getElementById('unit-toggle');

    bmiForm.addEventListener('submit', function (e) {
        e.preventDefault();

        const heightInput = document.querySelector('.height');
        const weightInput = document.querySelector('.weight');

        let height = parseFloat(heightInput.value);
        let weight = parseFloat(weightInput.value);

        if (height > 0 && weight > 0) {
            const unitToggle = document.getElementById('unit-toggle');
            if (unitToggle.value === 'imperial') {
                // Convert height from feet/inches to meters
                const feet = parseInt(height);
                const inches = parseInt(heightInput.value.split(" ")[1]);
                height = ((feet * 12) + inches) * 0.0254; // Convert height to meters
                // Convert weight from pounds to kilograms
                weight = weight * 0.453592;
            }

            const bmi = weight / (height * height);

            // Display BMI result
            popup.style.display = 'block';
            document.querySelector('.bmi-score').innerHTML = bmi.toFixed(2);
            document.querySelector('.bmi-text').innerHTML = `Your BMI is ${bmi.toFixed(2)}.<br>${getBmiClassification(bmi)}`;

            // Clear form inputs
            heightInput.value = '';
            weightInput.value = '';

            // Get username
            const username = getUsernameForDelete();
            console.log("user is "+username);

            // Save BMI data
            const saveInfoCheckbox = document.getElementById('save-info-checkbox').checked;
            if (saveInfoCheckbox) {
                saveBMI(username, height, weight, bmi);
            }

            // Show motivational message
            showMotivationalMessage(bmi);

            // Display BMI chart
            displayBMIChart(bmi);
        } else {
            alert("Please enter valid positive numeric values for height and weight");
        }
    });

    // Set initial placeholders
    const heightInput = document.querySelector('.height');
    const weightInput = document.querySelector('.weight');
    heightInput.placeholder = 'Enter height in m';
    weightInput.placeholder = 'Enter weight in kg';
    unitToggle.addEventListener('change', function () {
        const heightInput = document.querySelector('.height');
        const weightInput = document.querySelector('.weight');

        if (unitToggle.value === 'metric') {
            heightInput.placeholder = 'Enter height in m';
            weightInput.placeholder = 'Enter weight in kg';
        } else {
            heightInput.placeholder = 'Enter height in ft/in';
            weightInput.placeholder = 'Enter weight in lbs';
        }
    });

    function getBmiClassification(bmi) {
        if (bmi < 18.5) {
            return 'Underweight - You may be at risk for health problems such as weakened immune system and osteoporosis. It is important to consult a healthcare professional for advice on how to reach a healthy weight.';
        } else if (bmi >= 18.5 && bmi < 24.9) {
            return 'Normal weight - Congratulations! Your weight is within the healthy range.';
        } else if (bmi >= 25 && bmi < 29.9) {
            return 'Overweight - Excess weight may increase the risk of developing various health conditions such as heart disease and type 2 diabetes. Consider adopting a healthier lifestyle, including a balanced diet and regular exercise.';
        } else if (bmi >= 30 && bmi < 34.9) {
            return 'Obesity (Class 1) - Obesity significantly increases the risk of serious health conditions. It is recommended to seek guidance from a healthcare professional to develop a personalized plan for weight management and overall health improvement.';
        } else if (bmi >= 35 && bmi < 39.9) {
            return 'Obesity (Class 2) - Severe obesity can lead to serious health complications. It is crucial to seek medical advice and consider treatment options, including lifestyle changes, medications, or surgical interventions, to manage weight and improve health.';
        } else {
            return 'Extreme Obesity - Extreme obesity is associated with a significantly increased risk of morbidity and mortality. Immediate medical attention and intervention are necessary to address health risks and improve overall well-being.';
        }
    }

    function saveBMI(username, height, weight, bmi) {
        const requestData = {
            username: username,
            height: height,
            weight: weight,
            bmi: bmi
        };
        console.log(" req"+requestData)

        fetch('/save_bmi', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(requestData),
        })
        .then(response => response.json())
        .then(data => {
            console.log(data);
            // Handle response here if needed
        })
        .catch(error => {
            console.error('Error:', error);
        });
    }

    function showMotivationalMessage(bmi) {
        // Generate motivational message based on BMI classification
        //const classification = getBmiClassification(bmi);
        //const description = getBmiDescription(bmi);
        //const message = `${classification} - ${description}`;
        // Display the message
        //document.querySelector('.bmi-description').innerHTML = message;
    }

    function getUsername() {
        const usernameElement = document.querySelector('.username');
        if (usernameElement) {
            return usernameElement.getAttribute('data-username');
        }
        return null;
    }



    // Close popup when close button is clicked
    closeBtn.addEventListener('click', function () {
        popup.style.display = 'none';
    });

    // Share button click events
    document.getElementById('shareFacebook').addEventListener('click', function () {
        window.open('https://www.facebook.com/sharer/sharer.php?u=https://example.com', '_blank');
    });

    document.getElementById('shareTwitter').addEventListener('click', function () {
        window.open('https://twitter.com/intent/tweet?url=https://example.com&text=Check%20out%20this%20awesome%20website!', '_blank');
    });

    document.getElementById('shareInstagram').addEventListener('click', function () {
        window.open('https://www.instagram.com', '_blank');
    });

    // Event listener for the Advice button
    document.getElementById('showAdvice').addEventListener('click', function() {
        var bmiText = document.querySelector('.bmi-text').innerText;
        var bmi = parseFloat(bmiText.split(':')[1]);

        displayAdvice(bmi);
    });

    // Event listener for the Close Advice button
    document.getElementById('closeAdvice').addEventListener('click', function() {
        document.getElementById('adviceSection').style.display = 'none';
    });
});

function displayAdvice(bmi) {
    var bmiText = document.querySelector('.bmi-score').innerText; // Corrected line to extract the BMI value
    var bmi = parseFloat(bmiText);

    var adviceText = document.getElementById('adviceText');
    var advice = '';

    if (bmi < 18.5) {
        advice = "Eat a variety of vegetables and fruits, preferably fresh and local, several times per day (at least 400g per day). Maintain body weight between the recommended limits (a BMI of 18.5–25) by taking moderate to vigorous levels of physical activity, preferably daily.";
    } else if (bmi >= 18.5 && bmi < 24.9) {
        advice = "Congratulations! Your BMI is in the healthy range. Keep up the good work with your diet and exercise.";
    } else if (bmi >= 25 && bmi < 29.9) {
        advice = "Remember, adopting a healthy diet is just one component of achieving and maintaining a healthy weight. Regular physical activity, adequate sleep, and stress management are also important factors in overall health and weight management.";
    } else if (bmi >= 30 && bmi < 34.9) {
        advice = "You are obese. It's important to prioritize your health. Please consult a healthcare professional for personalized advice on managing your weight.Focus on Nutrient-Dense foods, portion control, reduce sugary and processed foods etc.";
    } else if (bmi >= 35 && bmi < 39.9) {
        advice = "Plan your meals and snacks in advance to avoid impulsive eating choices. Prepare healthy meals at home whenever possible, as this gives you more control over ingredients and portion sizes.Keep track of your food intake, physical activity, and progress towards your weight loss goals. This can help you identify areas for improvement and stay motivated on your journey to better health. You have severe obesity. Immediate medical attention is necessary to address health risks and improve overall well-being.";
    } else {
        advice = "Consider joining a weight loss program or seeking support from a healthcare professional, support group, or online community. Having accountability and support can increase motivation and help you stay on track with your dietary and lifestyle changes.You have extreme obesity. Immediate medical attention and intervention are necessary to address health risks and improve overall well-being.";
    }
    adviceText.innerText = advice;
    document.getElementById('adviceSection').style.display = 'block';
}

// Function to display BMI chart
// function displayBMIChart(bmi) {
//     // Implementation of displayBMIChart function to show chart based on user's BMI
//     const bmiChartCanvas = document.getElementById('bmiChart');
//     const bmiChartCtx = bmiChartCanvas.getContext('2d');

//     // Sample chart data (replace with your own logic)
//     const bmiData = {
//         labels: ['Underweight', 'Healthy weight', 'Overweight', 'Obesity'],
//         datasets: [{
//             label: 'BMI',
//             data: [18.5, 24.9, 29.9, 100], // Sample data for illustration
//             backgroundColor: [
//                 'rgba(255, 99, 132, 0.5)',
//                 'rgba(54, 162, 235, 0.5)',
//                 'rgba(255, 206, 86, 0.5)',
//                 'rgba(75, 192, 192, 0.5)'
//             ],
//             borderColor: [
//                 'rgba(255, 99, 132, 1)',
//                 'rgba(54, 162, 235, 1)',
//                 'rgba(255, 206, 86, 1)',
//                 'rgba(75, 192, 192, 1)'
//             ],
//             borderWidth: 1
//         }]
//     };

//     const bmiChart = new Chart(bmiChartCtx, {
//         type: 'bar',
//         data: bmiData,
//         options: {
//             scales: {
//                 y: {
//                     beginAtZero: true
//                 }
//             }
//         }
//     });
// }
    // Function to display BMI chart
function displayBMIChart(bmi) {
    // Implementation of displayBMIChart function to show chart based on user's BMI
    const bmiChartCanvas = document.getElementById('bmiChart');
    const bmiChartCtx = bmiChartCanvas.getContext('2d');

    // Sample chart data (replace with your own logic)
    const bmiData = {
        labels: ['Underweight', 'Healthy weight', 'Overweight', 'Obesity'],
        datasets: [{
            label: 'BMI',
            data: [18.5, 24.9, 29.9, 100], // Sample data for illustration
            backgroundColor: [
                'rgba(255, 99, 132, 0.5)',
                'rgba(54, 162, 235, 0.5)',
                'rgba(255, 206, 86, 0.5)',
                'rgba(75, 192, 192, 0.5)'
            ],
            borderColor: [
                'rgba(255, 99, 132, 1)',
                'rgba(54, 162, 235, 1)',
                'rgba(255, 206, 86, 1)',
                'rgba(75, 192, 192, 1)'
            ],
            borderWidth: 1
        }]
    };

    const bmiChart = new Chart(bmiChartCtx, {
        type: 'bar',
        data: bmiData,
        options: {
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });
}
// Event listener for delete button
// Function to retrieve username for deletion
function getUsernameForDelete() {
    const welcomeMessageElement = document.querySelector('.welcome-message');
    if (welcomeMessageElement) {
        return welcomeMessageElement.getAttribute('data-username');
    }
    return null;
}

const deleteBtn = document.getElementById('delete-btn');
if (deleteBtn) {
    deleteBtn.addEventListener('click', function () {
    console.log("Delete button clicked"); // Check if this log appears
    const username = getUsernameForDelete();
    console.log("Username for delete: ", username); // Check if username is retrieved correctly
    const confirmation = confirm('Are you sure you want to delete your account?');
    if (confirmation) {
        // Send request to delete user
        fetch('/delete_user', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                username: username
            })
        })
        .then(response => response.json())
        .then(data => {
            alert(data.message);
            location.reload(); // Reload the page after successful deletion
        })
        .catch(error => console.error('Error:', error));
    }
});
}
document.addEventListener('DOMContentLoaded', function () {
    const calorieForm = document.getElementById('calorieForm');
    const popup = document.querySelector('.popup');
    const closeBtn = document.querySelector('.close-btn');

    calorieForm.addEventListener('submit', function (e) {
        e.preventDefault();

        const ageInput = document.getElementById('age');
        const weightInput = document.getElementById('weight');
        const heightInput = document.getElementById('height');
        const activityLevel = document.getElementById('activityLevel').value;

        let age = parseInt(ageInput.value);
        let weight = parseFloat(weightInput.value);
        let height = parseFloat(heightInput.value);

        if (age > 0 && weight > 0 && height > 0) {
            let bmr = calculateBMR(age, weight, height);
            let tdee = calculateTDEE(bmr, activityLevel);

            popup.style.display = 'block';
            document.querySelector('.calorie-result').innerHTML = `Your Total Daily Energy Expenditure (TDEE) is ${tdee.toFixed(2)} calories per day.`;

            // Clear form inputs
            ageInput.value = '';
            weightInput.value = '';
            heightInput.value = '';
        } else {
            alert("Please enter valid positive numeric values for age, weight, and height");
        }
    });

    closeBtn.addEventListener('click', function () {
        popup.style.display = 'none';
    });


    function calculateBMR(age, weight, height) {
        // Calculate Basal Metabolic Rate (BMR) using Mifflin-St Jeor Equation
        let bmr = 10 * weight + 6.25 * height - 5 * age + 5;
        return bmr;
    }

    function calculateTDEE(bmr, activityLevel) {
        // Calculate Total Daily Energy Expenditure (TDEE) based on activity level
        let tdee;
        switch (activityLevel) {
            case 'sedentary':
                tdee = bmr * 1.2;
                break;
            case 'lightlyActive':
                tdee = bmr * 1.375;
                break;
            case 'moderatelyActive':
                tdee = bmr * 1.55;
                break;
            case 'veryActive':
                tdee = bmr * 1.725;
                break;
            case 'extraActive':
                tdee = bmr * 1.9;
                break;
            default:
                tdee = bmr * 1.2; // Default to sedentary
        }
        return tdee;
    }
});
