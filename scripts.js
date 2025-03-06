document.addEventListener('DOMContentLoaded', async () => {
    // Project data
    const projects = [
        {
            id: 'minigame',
            title: 'This Minigame Idea Does Not Exist',
            url: 'https://websim.ai/@api/this-minigame-idea-does-not-exist',
            description: 'An AI-generated minigame concept brought to life in a single prompt.'
        },
        {
            id: 'programming-language',
            title: 'This Programming Language Does Not Exist',
            url: 'https://websim.ai/@api/this-programming-language-does-not-exist',
            description: 'A fictional programming language with syntax highlighting and examples.'
        },
        {
            id: 'date',
            title: 'This Date Does Not Exist',
            url: 'https://websim.ai/@api/this-date-does-not-exist',
            description: 'A date simulator generating non-existent romantic encounters.'
        },
        {
            id: 'soda',
            title: 'This Soda Does Not Exist',
            url: 'https://websim.ai/@api/this-soda-does-not-exist',
            description: 'An imaginary soda brand generator with fictional flavors and packaging.'
        },
        {
            id: 'cat',
            title: 'This Cat Does Not Exist',
            url: 'https://websim.ai/@api/this-cat-does-not-exist',
            description: 'Generate cats that never existed with unique traits and personalities.'
        },
        {
            id: 'wireframe',
            title: 'This Wireframe Does Not Exist',
            url: 'https://websim.ai/@api/this-wireframe-does-not-exist/1',
            description: 'AI-generated wireframes for imaginary websites and applications.'
        },
        {
            id: 'arcade',
            title: 'This Classic Arcade Game Does Not Exist',
            url: 'https://websim.ai/@api/this-classic-arcade-game-does-not-exist/',
            description: 'Fictional arcade games that could have existed in the golden era of gaming.'
        },
        {
            id: 'slideshow',
            title: 'This Slideshow Cartoon Does Not Exist',
            url: 'https://websim.ai/@api/this-slideshow-cartoon-does-not-exist',
            description: 'AI-generated cartoon stories in slideshow format.'
        },
        {
            id: 'fridge',
            title: 'This Fridge Does Not Exist',
            url: 'https://websim.ai/@api/this-fridge-does-not-exist/',
            description: 'Generate imaginary refrigerators with unusual features and contents.'
        },
        {
            id: 'planet',
            title: 'This Planet Does Not Exist',
            url: 'https://websim.ai/@api/this-planet-does-not-exist',
            description: 'Explore fictional planets with unique characteristics and environments.'
        },
        {
            id: 'tetris',
            title: 'This Tetris Game Does Not Exist',
            url: 'https://websim.ai/@api/this-tetris-game-does-not-exist',
            description: 'A Tetris-inspired game with a unique twist that never actually existed.'
        },
        {
            id: 'snake',
            title: 'This Snake Game Does Not Exist',
            url: 'https://websim.ai/@api/this-snake-game-does-not-exist',
            description: 'A reimagined version of the classic Snake game with fictional elements.'
        }
    ];

    // Function to generate thumbnail images with AI
    async function generateThumbnailForProject(project) {
        try {
            const result = await websim.imageGen({
                prompt: `A clean, modern UI thumbnail for a web application called "${project.title}". Style: minimalist, digital, UI design, flat colors, web interface preview.`,
                aspect_ratio: "16:9"
            });
            return result.url;
        } catch (error) {
            console.error(`Failed to generate image for ${project.title}:`, error);
            // Fallback to generating SVG placeholder
            return generatePlaceholderSVG(project.id, project.title);
        }
    }

    // Function to generate a placeholder SVG
    function generatePlaceholderSVG(id, title) {
        // Generate a deterministic color based on the ID
        const hash = id.split('').reduce((acc, char) => char.charCodeAt(0) + acc, 0);
        const hue = hash % 360;
        const saturation = 60 + (hash % 30);
        const lightness = 65 + (hash % 20);
        const backgroundColor = `hsl(${hue}, ${saturation}%, ${lightness}%)`;
        
        // Get first letters of each word for initials
        const initials = title.split(' ')
            .map(word => word.charAt(0))
            .filter(char => char.match(/[A-Za-z0-9]/))
            .slice(0, 2)
            .join('')
            .toUpperCase();
            
        return `data:image/svg+xml,${encodeURIComponent(`
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 300 200" width="300" height="200">
                <rect width="300" height="200" fill="${backgroundColor}" />
                <text x="150" y="100" font-family="Arial, sans-serif" font-size="48" text-anchor="middle" 
                      dominant-baseline="middle" fill="white">${initials}</text>
            </svg>
        `)}`;
    }

    // Function to create project cards
    async function createProjectCards() {
        const galleryGrid = document.getElementById('gallery-grid');
        
        for (const project of projects) {
            const thumbnailUrl = await generateThumbnailForProject(project);
            
            const projectCard = document.createElement('div');
            projectCard.className = 'project-card';
            projectCard.dataset.url = project.url;
            projectCard.dataset.title = project.title;
            projectCard.dataset.description = project.description;
            
            projectCard.innerHTML = `
                <img src="${thumbnailUrl}" alt="${project.title}" class="project-image">
                <div class="project-content">
                    <h3 class="project-title">${project.title}</h3>
                    <p class="project-description">${project.description}</p>
                </div>
                <div class="prompt-indicator">
                    <div class="prompt-badge">
                        <span class="prompt-number">1</span>
                    </div>
                    <span class="prompt-label">prompt</span>
                </div>
            `;
            
            galleryGrid.appendChild(projectCard);
        }
        
        // Add event listeners after all cards are created
        addEventListeners();
    }

    // Function to add event listeners
    function addEventListeners() {
        const projectCards = document.querySelectorAll('.project-card');
        const overlay = document.getElementById('overlay');
        const closeButton = document.getElementById('close-button');
        const iframe = document.getElementById('fullscreen-iframe');
        
        projectCards.forEach(card => {
            card.addEventListener('click', () => {
                const url = card.dataset.url;
                const title = card.dataset.title;
                const description = card.dataset.description;
                
                document.getElementById('project-title').textContent = title;
                document.getElementById('project-description').textContent = description;
                
                // Set iframe src and show overlay
                iframe.src = url;
                overlay.classList.remove('hidden');
                
                // Prevent scrolling when overlay is open
                document.body.style.overflow = 'hidden';
            });
        });
        
        closeButton.addEventListener('click', () => {
            // Hide overlay and clear iframe src
            overlay.classList.add('hidden');
            setTimeout(() => {
                iframe.src = '';
            }, 300); // Short delay to allow for transition
            
            // Re-enable scrolling
            document.body.style.overflow = '';
        });
    }

    // Initialize the gallery
    createProjectCards();
});

