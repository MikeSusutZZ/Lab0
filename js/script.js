// CHAT GPT ASSISTED
let canPick = false
let nextPick = 0
let numBoxes = null

class ButtonMemoryGame {


    constructor() {
        this.root = document.body;
        this.boxes = []
        this.color = new ColorPicker()
    }

    init() {
        this.root.innerHTML = ''
        this.createUI();
        canPick = false
        nextPick = 0
        numBoxes = null
        this.boxes = []
        this.color.reset()
        // Additional initialization
    }
    

    createUI() {
        // Create a parent element for UI controls
        const uiContainer = document.createElement('div');
        uiContainer.id = 'uiContainer';
    
        // Create and append the label
        const label = document.createElement('label');
        label.setAttribute('for', 'numButtons');
        label.textContent = 'How many buttons to create? ';
        uiContainer.appendChild(label);
    
        // Create and append the input
        const input = document.createElement('input');
        input.type = 'number';
        input.id = 'numButtons';
        input.min = 3;
        input.max = 7;
        uiContainer.appendChild(input);
    
        // Create and append the "Go" button
        const goButton = document.createElement('button');
        goButton.id = 'goButton';
        goButton.textContent = 'Go';
        goButton.addEventListener('click', () => {
            numBoxes = document.getElementById('numButtons').value;
            this.root.removeChild(uiContainer); // Remove the UI container
            this.viewOrder(numBoxes);
        });
        uiContainer.appendChild(goButton);
    
        // Append the UI container to the root
        this.root.appendChild(uiContainer);
    
        // Create and append the button container directly to root
        const buttonContainer = document.createElement('div');
        buttonContainer.id = 'buttonContainer';
        this.root.appendChild(buttonContainer);
    }
    
    
    
    viewOrder(numButtons) {
        // Clear previous boxes if any
        this.boxes = [];
        const buttonContainer = document.getElementById('buttonContainer');
        buttonContainer.style.display = 'flex';
        buttonContainer.style.flexWrap = 'wrap';
        buttonContainer.style.alignItems = 'center';
        buttonContainer.style.justifyContent = 'flex-start';

        for (let i = 0; i < numButtons; i++) {
            const box = new ColorBox(i, this.color.getRandomColor(), this);
            this.boxes.push(box);
            const boxElement = box.createBox(); // Modified to remove positioning arguments
            buttonContainer.appendChild(boxElement);
        }

        // Wait for numButtons seconds, then shuffle
        setTimeout(() => this.shuffleBoxes(numButtons), numButtons * 1000);
    }
    
    shuffleBoxes(numShuffles) {
        const buttonContainer = document.getElementById('buttonContainer');
        buttonContainer.style.position = 'relative';
        buttonContainer.style.height = '100vh'; // Set the height to full viewport height
        this.boxes.forEach(box => box.hideNumber())
        for (let i = 0; i < numShuffles; i++) {
            setTimeout(() => {
                this.boxes.forEach(box => {
                    // Random position within the buttonContainer bounds
                    const randomX = Math.random() * (buttonContainer.clientWidth - box.element.clientWidth);
                    const randomY = Math.random() * (buttonContainer.clientHeight - box.element.clientHeight);
                    box.element.style.position = 'absolute';
                    box.element.style.left = randomX + 'px';
                    box.element.style.top = randomY + 'px';
                });
            }, i * 2000); // Shuffle every 2 seconds
        }
        canPick = true
    }

    win() {
        // Logic to execute when the player wins
        canPick = false
        setTimeout(() => {
            alert("Excellent Memory!");
            this.init(); // Reset the game after a delay
        }, 300);
    }

    lose() {
        this.boxes.forEach(box => box.showNumber());
        canPick = false;
        // Set a timeout before resetting the game
        setTimeout(() => {
            alert("Wrong order!");
            this.init(); // Reset the game after a delay
        }, 300); // Delay in milliseconds, e.g., 2000 milliseconds = 2 seconds
    }
    
    
    
    
    
}

class ColorBox {
    constructor(number, color, gameInstance) {
        this.number = number;
        this.color = color;
        this.gameInstance = gameInstance;
        this.element = null; // Will hold the HTML element
        this.numElement = null; // Element to display the number
    }

    createBox() {
        // Create the box element
        this.element = document.createElement('div');
        this.element.style.width = '10em';
        this.element.style.height = '5em';
        this.element.style.backgroundColor = this.color;
        this.element.style.margin = '0.5em'; // Add some margin around each box

        // Centering content with flexbox
        this.element.style.display = 'flex';
        this.element.style.alignItems = 'center'; // Vertical centering
        this.element.style.justifyContent = 'center'; // Horizontal centering

        this.element.onclick = () => this.clicked()

        // Create a child element for the number
        this.numElement = document.createElement('span');
        this.numElement.textContent = this.number + 1;
        this.numElement.style.visibility = 'visible'; // Hide the number initially
        this.element.appendChild(this.numElement);

        return this.element;
    }

    showNumber() {
        this.numElement.style.visibility = 'visible';
    }

    hideNumber() {
        this.numElement.style.visibility = 'hidden';
    }

    clicked() {
        if (canPick){
            this.showNumber()
            if (this.number == nextPick){
                
                nextPick++
                if (nextPick == numBoxes){
                    this.gameInstance.win()
                }
            } else {
                this.gameInstance.lose()
            }
        }
    }
}



class ColorPicker {
    constructor() {
        this.colors = ["Red", "Blue", "Green", "Yellow", "Purple", "Orange", "Pink", "Cyan", "Lime", "Magenta"];
        this.usedColors = [];
    }

    getRandomColor() {
        if (this.colors.length === 0) {
            throw new Error("No more colors available");
        }

        const randomIndex = Math.floor(Math.random() * this.colors.length);
        const selectedColor = this.colors.splice(randomIndex, 1)[0];
        this.usedColors.push(selectedColor);
        return selectedColor;
    }

    reset() {
        this.colors = this.colors.concat(this.usedColors);
        this.usedColors = [];
    }
}


document.addEventListener('DOMContentLoaded', () => {
    const app = new ButtonMemoryGame();
    app.init();
});