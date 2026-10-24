document.addEventListener("DOMContentLoaded", () => {
    const menuToggle = document.getElementById("menu-toggle");
    const nav = document.getElementById("nav");

    if (menuToggle && nav) {
        menuToggle.addEventListener("click", () => {
            const isOpen = nav.classList.toggle("open");

            menuToggle.setAttribute("aria-expanded", String(isOpen));
            menuToggle.setAttribute(
                "aria-label",
                isOpen ? "Fechar menu" : "Abrir menu"
            );
        });

        nav.querySelectorAll("a").forEach(link => {
            link.addEventListener("click", () => {
                nav.classList.remove("open");
                menuToggle.setAttribute("aria-expanded", "false");
                menuToggle.setAttribute("aria-label", "Abrir menu");
            });
        });
    }

    const year = document.getElementById("year");

    if (year) {
        year.textContent = new Date().getFullYear();
    }

    const revealElements = document.querySelectorAll(".reveal");

    if ("IntersectionObserver" in window) {
        const observer = new IntersectionObserver(entries => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add("show");
                    observer.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.12
        });

        revealElements.forEach(element => observer.observe(element));
    } else {
        revealElements.forEach(element => element.classList.add("show"));
    }

    const historyList = document.getElementById("history-list");
    const totalElement = document.getElementById("total-agendamentos");
    const upcomingElement = document.getElementById("proximos-agendamentos");

    function loadAppointments() {
        try {
            const saved = localStorage.getItem("novaOticaAgendamentos");
            const appointments = saved ? JSON.parse(saved) : [];

            return Array.isArray(appointments) ? appointments : [];
        } catch {
            return [];
        }
    }

    function formatDate(dateString) {
        const date = new Date(`${dateString}T12:00:00`);

        if (Number.isNaN(date.getTime())) {
            return {
                day: "--",
                month: "Data inválida",
                full: "Data não disponível"
            };
        }

        return {
            day: date.toLocaleDateString("pt-AO", { day: "2-digit" }),
            month: date.toLocaleDateString("pt-AO", { month: "short" }),
            full: date.toLocaleDateString("pt-AO", {
                day: "2-digit",
                month: "long",
                year: "numeric"
            })
        };
    }

    function createElement(tag, className, text) {
        const element = document.createElement(tag);

        if (className) element.className = className;
        if (text !== undefined) element.textContent = text;

        return element;
    }

    function renderHistory() {
        const appointments = loadAppointments();
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const upcoming = appointments.filter(appointment => {
            if (!appointment.date) return false;

            const date = new Date(`${appointment.date}T12:00:00`);
            return !Number.isNaN(date.getTime()) && date >= today;
        });

        totalElement.textContent = appointments.length;
        upcomingElement.textContent = upcoming.length;
        historyList.replaceChildren();

        if (appointments.length === 0) {
            const empty = createElement("div", "empty-history");
            const icon = createElement("div", "empty-icon", "↗");
            const title = createElement("h3", "", "Ainda não existem registos");
            const description = createElement(
                "p",
                "",
                "Quando os teus agendamentos forem guardados, aparecerão aqui."
            );
            const link = createElement("a", "btn btn-primary", "Marcar consulta");

            link.href = "servicos.html#agendamento";

            empty.append(icon, title, description, link);
            historyList.appendChild(empty);
            return;
        }

        appointments
            .slice()
            .sort((a, b) => String(b.date || "").localeCompare(String(a.date || "")))
            .forEach(appointment => {
                const date = formatDate(appointment.date || "");
                const item = createElement("article", "history-item");
                const main = createElement("div", "history-item-main");
                const dateBox = createElement("div", "history-date");
                const day = createElement("strong", "", date.day);
                const month = createElement("span", "", date.month);
                const details = createElement("div", "history-details");
                const title = createElement(
                    "h3",
                    "",
                    appointment.service || "Consulta"
                );
                const name = createElement(
                    "p",
                    "",
                    `Nome: ${appointment.name || "Não indicado"}`
                );
                const dateText = createElement("p", "", date.full);
                const status = createElement(
                    "span",
                    "history-status",
                    "Registo local"
                );

                dateBox.append(day, month);
                details.append(title, name, dateText);
                main.append(dateBox, details);
                item.append(main, status);
                historyList.appendChild(item);
            });
    }

    renderHistory();

    const copyButton = document.getElementById("copy-email");

    if (copyButton) {
        copyButton.addEventListener("click", async () => {
            const contact = "edvandrofilipe08@gmail.com";
            const originalText = "Copiar contacto →";

            try {
                await navigator.clipboard.writeText(contact);
                copyButton.textContent = "Contacto copiado!";
            } catch {
                copyButton.textContent = contact;
            }

            setTimeout(() => {
                copyButton.textContent = originalText;
            }, 2000);
        });
    }
});