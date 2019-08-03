const MemoryGame = (() => {

    /*
     * Create a list that holds all of your cards
     */

    // Add the font awesome classes for each symbol to an array of 8 items.
    let cards = [
        "fa-diamond",
        "fa-paper-plane-o",
        "fa-anchor",
        "fa-bolt",
        "fa-cube",
        "fa-leaf",
        "fa-bicycle",
        "fa-bomb"];

    // Cancat the cards array with itself so each card has a duplicate for the deck
    cards = [...cards, ...cards];

    let openCards = [];
    let moveCounter = 0;
    let timeTaken = 0;
    let intervalTimer = null;
    let matchedCardCount = 0;
    let starCount = 3;

    /*
     * Display the cards on the page
     *   - shuffle the list of cards using the provided "shuffle" method below
     *   - loop through each card and create its HTML
     *   - add each card's HTML to the page
     */

    // Shuffle function from http://stackoverflow.com/a/2450976
    function shuffle(array) {
        let currentIndex = array.length, temporaryValue, randomIndex;

        while (currentIndex !== 0) {
            randomIndex = Math.floor(Math.random() * currentIndex);
            currentIndex -= 1;
            temporaryValue = array[currentIndex];
            array[currentIndex] = array[randomIndex];
            array[randomIndex] = temporaryValue;
        }

        return array;
    }

    function generateCardHTML() {

        // Build the HTML for the cards in the card deck. Set a data-name which will be used for comparing
        // cards and data-id which will be used for rejecting the comparison where the user clicks the same card twice
        let index = 0;
        return cards.map((card) => {
            let html = `<li class="card" data-name="${card}" data-id="${index}">
              <i class="fa ${card}"></i>
        </li>`;
            index++;
            return html;
        });
    }

    function resetStarHTML() {

        // Build the star HTML to show a list of three stars
        return `<li><i class="fa fa-star"></i></li>
            <li><i class="fa fa-star"></i></li>
            <li><i class="fa fa-star"></i></li>`;
    }

    function showCard(card) {

        // Show the card's face by adding the show and open classes
        card.classList.add("show", "open");
    }

    function lockMatchedCards() {

        // Lock the cards in the open position by adding the match class to the open cards
        if (openCards.length === 2) {
            openCards[0].classList.add("match");
            openCards[1].classList.add("match");
            openCards.length = 0;
            matchedCardCount++;
        }
    }

    function resetUnmatchedCards() {

        // Flip cards that are unmatched back to their hidden position by removing open and show classes after 1 second
        if (openCards.length === 2) {

            openCards.forEach((card) => {
                card.classList.add("nomatch");
            });

            setTimeout(() => {
                openCards[0].classList.remove("open", "show", "nomatch");
                openCards[1].classList.remove("open", "show", "nomatch");
                openCards.length = 0;
            }, 1000);
        }
    }

    function incrementMoveCounter() {

        // Increment the move count and set the visual element
        moveCounter++;
        document.getElementById("moves").innerText = moveCounter;
    }

    function updateStarCounter() {

        // Set the starCount depending on moves taken. Less than 16 moves and you get 3*. Between 16 and 25 you get 2*. Anything above 25 moves and you get 1*.
        switch (true) {
            case (moveCounter < 16) :
                starCount = 3;
                break;
            case (moveCounter > 15 && moveCounter < 26) :
                starCount = 2;
                break;
            default :
                starCount = 1;
        }

        // Set the visual element for the number of stars depending on the starCount and the number of
        // visual star elements left on screen
        let starElement = document.getElementById("stars");
        if (starElement.children.length > 0) {
            switch (true) {
                case (starCount === 2 && starElement.children.length === 3) :
                    starElement.children[0].remove();
                    break;
                case (starCount === 1 && starElement.children.length === 2) :
                    starElement.children[0].remove();
                    break;
                default :
            }
        }

    }

    function addCardToOpenList(card) {

        // Add the card to the openCards array if the card array is empty or the card is not already in the list
        if (openCards.length !== 1 || openCards[0].dataset.id !== card.dataset.id) {
            openCards.push(card);

            // If there are two cards in the list, check to make sure that they match
            if (openCards.length === 2) {
                // If they match call lockMatchedCards else call resetUnmatchedCards()
                (openCards[0].dataset.name === openCards[1].dataset.name) ? lockMatchedCards() : resetUnmatchedCards();

                // Add 1 to the move counter
                incrementMoveCounter();

                // Potentially update the number of stars depending on moves taken
                updateStarCounter();
            }
        }
    }

    function showCongratulationsPage() {

        // Hide the card deck HTML and show the game results HTML
        document.getElementById("deck").style.display = "none";
        document.getElementById("congratulations-page").style.display = "block";

        // Based on the remaining star count, we might want to use 'star' verses 'stars' in the result task... i.e. with 2 stars verses qith 1 star
        const description = starCount !== 1 ? 'stars' : 'star';

        // Set the visual elements result text
        document.getElementById("result").innerHTML = `With ${moveCounter} moves and ${starCount} ${description} in ${timeTaken} seconds<div>Woooooooo!!!</div>`;
    }

    function showCardDeckPage() {

        // Hide the game results HTML and show the card deck HTML
        document.getElementById("deck").style.display = "flex";
        document.getElementById("congratulations-page").style.display = "none";
    }

    function start() {

        // Hide the game results HTML and show the card deck HTML
        showCardDeckPage();

        // Re-in initialize all the game counters and visual elements
        openCards.length = 0;
        moveCounter = -1;
        timeTaken = 0;
        matchedCardCount = 0;
        starCount = 3;

        document.getElementById("time-taken").innerText = `Time : ${timeTaken}`;
        document.getElementById("stars").innerHTML = resetStarHTML();

        // Stop the timer in case it's running from the previous game
        clearInterval(intervalTimer);

        // Start the game timer, and update the visual element once a second with the game time
        intervalTimer = setInterval(() => {
            timeTaken += 1;
            document.getElementById("time-taken").innerText = `Time : ${timeTaken}`;
        }, 1000);

        // Set the move counter to zero (from -1)
        incrementMoveCounter();

        // Shuffle the card array for the new game
        cards = shuffle(cards);

        // Generate HTML based on the cards array.
        const generatedHTML = generateCardHTML().join('');

        // Append the generated <li> items to the deck
        const deckElement = document.getElementById("deck");
        deckElement.innerHTML = generatedHTML;

    }

    function init() {

        // When the game loads initially, hide the HTML for the winning congartulations page. This will only be displayed when the user finishes the game
        document.getElementById("congratulations-page").style.display = "none";

        // Set the click event listener on the deck. Sewtting this on the deck will improve performance rather than setting a listener for each card
        document.getElementById("deck").addEventListener("click", (e) => {

            // Make sure that the clicked element is a 'card' and the number of cards 'open' in the array is less than two. If the clicked element is
            // not a card or we have more than two cards open, then ignore the click
            if (e.target.classList.contains("card") && openCards.length < 2) {

                // Grab the card from the target
                let card = e.target;

                // Flip the card
                showCard(card);

                // Add the card to the list of open cards. The max number of cards in the list will be 2. This function will also identify a successful match,
                // update the star rating, move counters, and reset non-matched cards.
                addCardToOpenList(card);

                // Check to see if we have eight matches. If we do, the game is won
                if (matchedCardCount === 8) {

                    // The game is won. After 1 second, show the congratulations pop up modal with the game results
                    clearInterval(intervalTimer);
                    setTimeout(() => {
                        showCongratulationsPage();
                    }, 1000);
                }
            }
        });

        // Set the click listener for the restart element
        document.getElementById("restart").addEventListener("click", start);

        // Set the click listener for the play again button
        document.getElementById("play-again").addEventListener("click", start);

        // Start the game
        start();
    }

    return {
        init: () => {
            init();
        }
    };
})();

MemoryGame.init();


