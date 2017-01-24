javascript:(function () {

    function displayDialog(pageLastLoggedInText) {
        var cookieData = getCookieData();
        var pageFormattedLastLoggedInText = formatDateAndTimeForDisplay(pageLastLoggedInText);
        var cookieFormattedLastLoggedInText = formatDateAndTimeForDisplay(cookieData);
        var differenceInLastLoggedInMessage = getDifferenceInLastLoggedIn(pageLastLoggedInText, cookieData);

        var logInConfirm = confirm(
            "\nYOUR LAST LOGIN\n\n" +
            "Page says:      " + pageFormattedLastLoggedInText.dateStr + " at " + pageFormattedLastLoggedInText.timeStr + "\n\n" +
            "Cookie says:   " + cookieFormattedLastLoggedInText.dateStr + " at " + cookieFormattedLastLoggedInText.timeStr + "\n\n" +
            differenceInLastLoggedInMessage + "\n\n\n" +
            "Press OK to store the current time as your log in time."
        );
        if (logInConfirm == true) {
            writeCookie();
        }
    }

    function init() {
        var pageLastLoggedInText = getPageLastLoggedInText();
        displayDialog(pageLastLoggedInText);
    }

    function getCookieData() {
        var cookieValue = document.cookie.replace(/(?:(?:^|.*;\s*)cookieLastLoggedIn\s*\=\s*([^;]*).*$)|^.*$/, "$1");
        if (cookieValue) {
            return cookieValue;
        } else {
            return "No cookie data found.";
        }
    }

    function getPageLastLoggedInText() {
        var elem = document.querySelectorAll('a.menulink')[0].parentNode;
        var text = elem.textContent.slice(-21);
        text = text.replace(" ", "");
        return text;
    }

    function writeCookie() {
        document.cookie = "cookieLastLoggedIn=" + getDateTime()
            + ";domain=service.oneaccount.com"
            + ";path=/onlineV2"
            + ";expires=Thu, 19 Jun 2036 12:00:00 UTC";
    }

    function getDateTime() {
        var monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "June", "July", "Aug", "Sept", "Oct", "Nov", "Dec"];
        var currentDate = new Date();
        var dateObj;
        var returnDate;

        dateObj = {
            day: currentDate.getDate(),
            month: monthNames[currentDate.getMonth()],
            year: currentDate.getFullYear(),
            hours: currentDate.getHours(),
            minutes: currentDate.getMinutes(),
            seconds: currentDate.getSeconds()
        };

        for (var prop in dateObj) {
            if (typeof dateObj[prop] === "number" && dateObj[prop] < 10) {
                dateObj[prop] = '0' + dateObj[prop];
            }
        }

        returnDate = dateObj.day + '-' + dateObj.month + '-' + dateObj.year + " ";
        returnDate += dateObj.hours + ":" + dateObj.minutes + ":" + dateObj.seconds;

        return returnDate;
    }

    function formatDateAndTimeForDisplay(rawText) {
        var loggedInText = {};
        rawText = rawText.split(" ");
        loggedInText.dateStr = rawText[0].replace(/-/g, " ");
        loggedInText.timeStr = rawText[1].replace(/-/g, " ");
        return loggedInText;
    }

    function getDifferenceInLastLoggedIn(pageLastLoggedInText, cookieLastLoggedInText) {
        var allowedDiff = 600000;
        pageLastLoggedInText = new Date(pageLastLoggedInText);
        cookieLastLoggedInText = new Date(cookieLastLoggedInText);
        if (cookieLastLoggedInText < pageLastLoggedInText) {
            cookieLastLoggedInText.setDate(cookieLastLoggedInText.getDate() + 1);
        }
        var diff = cookieLastLoggedInText - pageLastLoggedInText;
        if(diff < allowedDiff) {
            return "PASSED. The difference between page and cookie time is less than 10 minutes."
        } else {
            return "FAILED! The difference between page and cookie time is greater than 10 minutes.\n\n" +
                "This may be because:\n\n" +
                "• There is a bug in the bookmarklet.\n" +
                "• You forgot to set the cookie on last login.\n" +
                "• Someone else has accessed your account since last login.";
        }
    }

    init();


})();