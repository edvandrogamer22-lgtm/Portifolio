
const menuToggle = document.getElementById("menu-toggle");
const nav = document.getElementById("nav");
const form = document.getElementById("appointment-form");
const dateInput = document.getElementById("date");

const whatsappNumber = "244931254513";

// MENU MOBILE
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

    document.addEventListener("click", event => {
        if (
            nav.classList.contains("open") &&
            !nav.contains(event.target) &&
            !menuToggle.contains(event.target)
        ) {
            nav.classList.remove("open");
            menuToggle.setAttribute("aria-expanded", "false");
            menuToggle.setAttribute("aria-label", "Abrir menu");
        }
    });

    document.addEventListener("keydown", event => {
        if (event.key === "Escape") {
            nav.classList.remove("open");
            menuToggle.setAttribute("aria-expanded", "false");
            menuToggle.setAttribute("aria-label", "Abrir menu");
        }
    });
}

// DATA ACTUAL
function getLocalDate() {
    const now = new Date();

    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, "0");
    const day = String(now.getDate()).padStart(2, "0");

    return `${year}-${month}-${day}`;
}

if (dateInput) {
    dateInput.min = getLocalDate();

    dateInput.addEventListener("change", () => {
        dateInput.setCustomValidity("");
    });
}

// ANO AUTOMÁTICO
const yearElement = document.getElementById("year");

if (yearElement) {
    yearElement.textContent = new Date().getFullYear();
}

// AGENDAMENTO PELO WHATSAPP
if (form && dateInput) {
    form.addEventListener("submit", event => {
        event.preventDefault();

        if (!form.reportValidity()) {
            return;
        }

        const name = document.getElementById("name").value.trim();
        const service = document.getElementById("service").value;
        const date = dateInput.value;
        const message = document.getElementById("message").value.trim();

        if (date < getLocalDate()) {
            dateInput.setCustomValidity(
                "Selecciona a data de hoje ou uma data futura."
            );

            dateInput.reportValidity();
            return;
        }

        dateInput.setCustomValidity("");

        const [year, month, day] = date.split("-");
        const formattedDate = `${day}/${month}/${year}`;

        const whatsappMessage = [
            "Olá, NØVA ÓTICA! Gostaria de agendar um atendimento.",
            "",
            `Nome: ${name}`,
            `Serviço pretendido: ${service}`,
            `Data preferida: ${formattedDate}`,
            message ? `Mensagem adicional: ${message}` : "",
            "",
            "Aguardo a confirmação do atendimento. Obrigado!"
        ].filter(Boolean).join("\n");

        const whatsappURL =
            `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(whatsappMessage)}`;

        window.open(
            whatsappURL,
            "_blank",
            "noopener,noreferrer"
        );
    });
}
