/* ===== ANIMAÇÃO DE SCROLL EM TODA A PÁGINA ===== */

document.addEventListener("DOMContentLoaded", function () {
    // Seleciona todos os elementos visuais da página,
    // exceto scripts, estilos e elementos técnicos.
    const elements = document.querySelectorAll(
        "body *:not(script):not(style):not(link):not(meta):not(noscript)"
    );

    // Se o utilizador preferir movimento reduzido,
    // mantém todo o conteúdo visível.
    const reducedMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
    ).matches;

    if (reducedMotion || !("IntersectionObserver" in window)) {
        return;
    }

    elements.forEach(function (element) {
        // Não animar elementos vazios ou já ocultos.
        if (
            element.children.length === 0 &&
            !element.textContent.trim() &&
            !element.matches("img, video, iframe, svg, canvas, input, button")
        ) {
            return;
        }

        element.classList.add("scroll-reveal");
    });

    const observer = new IntersectionObserver(
        function (entries) {
            entries.forEach(function (entry) {
                if (entry.isIntersecting) {
                    entry.target.classList.add("visible");
                    observer.unobserve(entry.target);
                }
            });
        },
        {
            threshold: 0.05,
            rootMargin: "0px 0px 40px 0px"
        }
    );

    document.querySelectorAll(".scroll-reveal").forEach(function (element) {
        observer.observe(element);
    });
});