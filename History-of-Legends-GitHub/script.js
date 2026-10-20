document.addEventListener("DOMContentLoaded", function () {
    const form = document.getElementById("media-form");
    const nameInput = document.getElementById("feed-name");
    const legendInput = document.getElementById("feed-legend");
    const messageInput = document.getElementById("feed-message");
    const feedList = document.getElementById("feed-list");

    const STORAGE_KEY = "historyOfLegendsFeeds";
    const MAX_FEEDS = 2;

    // Carregar os feeds guardados
    function loadFeeds() {
        try {
            const saved = JSON.parse(localStorage.getItem(STORAGE_KEY));
            return Array.isArray(saved) ? saved.slice(0, MAX_FEEDS) : [];
        } catch (error) {
            return [];
        }
    }

    let feeds = loadFeeds();

    // Criar um elemento de texto com segurança
    function createElement(tag, className, text) {
        const element = document.createElement(tag);
        element.className = className;
        element.textContent = text;
        return element;
    }

    // Mostrar os feeds do lado direito
    function renderFeeds() {
        feedList.replaceChildren();

        if (feeds.length === 0) {
            const empty = document.createElement("div");
            empty.className = "media-empty";

            empty.append(
                createElement("h4", "", "The story starts with you."),
                createElement(
                    "p",
                    "",
                    "Be the first to share your thoughts about your favourite legends."
                )
            );

            feedList.appendChild(empty);
            return;
        }

        feeds.forEach(function (feed) {
            const card = document.createElement("article");
            card.className = "media-feed-card";

            const header = document.createElement("div");
            header.className = "media-feed-header";

            const author = document.createElement("div");
            author.className = "media-feed-author";

            author.append(
                createElement("h4", "media-feed-name", feed.name),
                createElement("span", "media-feed-legend", feed.legend)
            );

            header.appendChild(author);

            const message = createElement(
                "p",
                "media-feed-message",
                feed.message
            );

            card.append(header, message);
            feedList.appendChild(card);
        });
    }

    // Enviar feedback
    form.addEventListener("submit", function (event) {
        event.preventDefault();

        const name = nameInput.value.trim();
        const legend = legendInput.value;
        const message = messageInput.value.trim();

        if (!name || !legend || !message) {
            alert("Please complete all fields.");
            return;
        }

        const newFeed = {
            name: name,
            legend: legend,
            message: message
        };

        // Os mais recentes aparecem primeiro; guardar apenas 2
        feeds.unshift(newFeed);
        feeds = feeds.slice(0, MAX_FEEDS);

        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(feeds));
        } catch (error) {
            alert("Unable to save the feedback in this browser.");
            feeds.shift();
            renderFeeds();
            return;
        }

        renderFeeds();
        form.reset();
    });

    renderFeeds();
});

// Efeito de revelação para elementos ao rolar a página
document.addEventListener("DOMContentLoaded", function () {
    const elements = document.querySelectorAll(
        "section h2, section h3, section p, .about-card, .video-post, .contact-card, .media-panel, .media-community"
    );

    elements.forEach(function (element) {
        element.classList.add("reveal");
    });

    const observer = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
            if (entry.isIntersecting) {
                entry.target.classList.add("active");
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.15
    });

    elements.forEach(function (element) {
        observer.observe(element);
    });
});
 
document.addEventListener("DOMContentLoaded", function () {
    const elements = document.querySelectorAll(
        ".media-header, .media-panel, .media-community, " +
        ".media-feed-card, .about-card, .video-post, .contact-card"
    );

    // Evita problemas em navegadores sem suporte.
    if (!("IntersectionObserver" in window)) {
        return;
    }

    elements.forEach(function (element) {
        element.classList.add("reveal");
    });

    const observer = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
            if (entry.isIntersecting) {
                entry.target.classList.add("active");
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.08,
        rootMargin: "0px 0px 40px 0px"
    });

    elements.forEach(function (element) {
        observer.observe(element);
    });
});