/* feedreader.js
 *
 * This is the spec file that Jasmine will read and contains
 * all of the tests that will be run against your application.
 */

/* We're placing all of our tests within the $() function,
 * since some of these tests may require DOM elements. We want
 * to ensure they don't run until the DOM is ready.
 */
$(function () {

    describe('RSS Feeds', () => {

        // The feeds list should be defined
        it('are defined', () => {
            expect(allFeeds).toBeDefined();
            expect(allFeeds.length).not.toBe(0);
        });

        // Loop thru the list of feeds and make sure that they all have a url property and it's not an empty string
        it('all have a defined URL which is not empty', () => {
            allFeeds.forEach((feed) => {
                expect(feed.url).toBeDefined();
                expect(feed.url.trim()).not.toBe('');
            });
        });

        // Loop thru the list of feeds and make sure that they all have a name property and it's not an empty string
        it('all have a name defined which is not empty', () => {
            allFeeds.forEach((feed) => {
                expect(feed.name).toBeDefined();
                expect(feed.name.trim()).not.toBe('');
            });
        });
    });

    describe('The menu', () => {

        it('should be hidden by default', () => {
            // Grab the classList for the body. Should contain menu-hidden initially
            let classList = document.querySelector('body').classList;
            expect(classList).toContain('menu-hidden');
        });

        it('should show the menu show when icon is clicked and then hide when icon is clicked again', () => {
            // After the menu item is clicked, the body classList should no longer contain menu-hidden
            let menuIcon = $('.menu-icon-link');
            menuIcon.click();
            let classList = document.querySelector('body').classList;
            expect(classList).not.toContain('menu-hidden');

            // After the menu item is clicked a second time, the body classList should contain menu-hidden
            menuIcon.click();
            classList = document.querySelector('body').classList;
            expect(classList).toContain('menu-hidden');
        });
    });

    describe('Initial Entries', () => {

        // Call the loadFeed with the zero item and pass in done as the callback so we know when we can check the results
        beforeEach((done) => {
            loadFeed(0, () => {
                done();
            });
        });

        it('should include at least one entry within the feed container', (done) => {
            // Grab the feed container element
            let feed = document.querySelector('.feed');

            // Grab an array of elements from within the feed element with a class of 'entry'.
            let entries = feed.getElementsByClassName('entry');

            // Test to ensure that the length of the entries array is greater than zero. i.e. there is at least one entry
            expect(entries.length).toBeGreaterThan(0);
            done();
        });
    });

    describe('New Feed Selection', () => {

        // Initialize variables for feed zero and feed one
        let feedZero, feedOne;

        beforeEach((done) => {
            // Call the loadFeed, first with the zero feed and then have loadFeed call itself from the callback function
            // with the 1 feed, and capture the html that is produced each time.
            loadFeed(0, () => {
                feedZero = document.querySelector('.feed').innerHTML;
                loadFeed(1, () => {
                    feedOne = document.querySelector('.feed').innerHTML;
                    done();
                });
            });
        });

        it('changes when a new feed loads', (done) => {
            // Expect the zero feed and the one feed not to be equal
            expect(feedZero).not.toEqual(feedOne);
            done();
        });

    });
}());
