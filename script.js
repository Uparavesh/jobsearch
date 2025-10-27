// Wait for the DOM to be fully loaded before running the script
document.addEventListener('DOMContentLoaded', () => {
    
    const jobGridContainer = document.getElementById('job-grid-container');
    const searchButton = document.getElementById('search-btn');
    const searchTitle = document.getElementById('search-title');
    const searchLocation = document.getElementById('search-location');

    let allJobs = []; // To store all jobs fetched

    /**
     * Fetches job data from the jobs.json file
     */
    async function fetchJobs() {
        try {
            const response = await fetch('./jobs.json');
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            allJobs = await response.json();
            displayJobs(allJobs); // Display all jobs initially
        } catch (error) {
            console.error("Could not fetch jobs:", error);
            jobGridContainer.innerHTML = "<p>Error loading job listings. Please try again later.</p>";
        }
    }

    /**
     * Renders the list of jobs into the grid container
     * @param {Array} jobs - An array of job objects to display
     */
    function displayJobs(jobs) {
        // Clear the container first
        jobGridContainer.innerHTML = '';

        if (jobs.length === 0) {
            jobGridContainer.innerHTML = "<p>No job listings match your criteria.</p>";
            return;
        }

        // Loop through each job and create a card
        jobs.forEach(job => {
            const jobCard = document.createElement('div');
            jobCard.classList.add('job-card');

            // Truncate description for display
            const descriptionSnippet = job.description.length > 120 
                ? job.description.substring(0, 120) + '...' 
                : job.description;

            jobCard.innerHTML = `
                <div class="job-card-header">
                    <h3>${job.title}</h3>
                    <p>${job.company}</p>
                </div>
                <div class="job-card-info">
                    <p><i class="fas fa-map-marker-alt"></i> ${job.location}</p>
                    <p><i class="fas fa-calendar-alt"></i> Posted: ${job.posted_date}</p>
                </div>
                <p class="job-description">${descriptionSnippet}</p>
                <div class="job-card-footer">
                    <span class="job-type">${job.type}</span>
                    <a href="#" class="btn btn-primary">Apply Now</a>
                </div>
            `;
            
            jobGridContainer.appendChild(jobCard);
        });
    }

    /**
     * Filters jobs based on title and location input
     */
    function filterJobs() {
        const titleQuery = searchTitle.value.toLowerCase();
        const locationQuery = searchLocation.value.toLowerCase();

        const filteredJobs = allJobs.filter(job => {
            const jobTitle = job.title.toLowerCase();
            const jobCompany = job.company.toLowerCase();
            const jobLocation = job.location.toLowerCase();

            const matchesTitle = jobTitle.includes(titleQuery) || jobCompany.includes(titleQuery);
            const matchesLocation = jobLocation.includes(locationQuery);

            return matchesTitle && matchesLocation;
        });

        displayJobs(filteredJobs);
    }

    // --- Event Listeners ---
    
    // Add event listener for the search button
    searchButton.addEventListener('click', filterJobs);

    // Optional: Allow filtering by pressing Enter key
    searchTitle.addEventListener('keyup', (e) => e.key === 'Enter' && filterJobs());
    searchLocation.addEventListener('keyup', (e) => e.key === 'Enter' && filterJobs());


    // Initial fetch of jobs when the page loads
    fetchJobs();
});