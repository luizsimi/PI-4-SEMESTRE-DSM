/**
 * Utilitário para otimização de imagens no LeveFit
 * Reduz a carga de trabalho do navegador ao carregar imagens
 */

// Cache para imagens já carregadas
const imageCache = new Map();

/**
 * Pré-carrega uma imagem e a armazena em cache
 * @param {string} src - URL da imagem
 * @returns {Promise} - Promise resolvida quando a imagem estiver carregada
 */
export const preloadImage = (src) => {
    if (imageCache.has(src)) {
        return Promise.resolve(imageCache.get(src));
    }

    return new Promise((resolve, reject) => {
        const img = new Image();
        img.onload = () => {
            imageCache.set(src, img);
            resolve(img);
        };
        img.onerror = reject;
        img.src = src;
    });
};

/**
 * Verifica se uma imagem está no viewport
 * @param {HTMLElement} element - Elemento a ser verificado
 * @param {number} threshold - Margem extra para pré-carregamento
 * @returns {boolean} - True se o elemento estiver visível
 */
export const isInViewport = (element, threshold = 200) => {
    if (!element) return false;

    const rect = element.getBoundingClientRect();

    return (
        rect.top <= window.innerHeight + threshold &&
        rect.bottom >= -threshold &&
        rect.left <= window.innerWidth + threshold &&
        rect.right >= -threshold
    );
};

/**
 * Aplica lazy loading a todas as imagens em um container
 * @param {HTMLElement} container - Container contendo as imagens
 */
export const setupLazyLoading = (container) => {
    if (!container) return;

    // Usar IntersectionObserver quando disponível
    if ("IntersectionObserver" in window) {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        const element = entry.target;
                        const dataSrc = element.getAttribute("data-src");

                        if (dataSrc) {
                            element.setAttribute("src", dataSrc);
                            element.removeAttribute("data-src");
                            observer.unobserve(element);
                        }
                    }
                });
            },
            { rootMargin: "200px" }
        );

        // Observar todas as imagens com data-src
        const images = container.querySelectorAll("img[data-src]");
        images.forEach((img) => observer.observe(img));

        return () => images.forEach((img) => observer.unobserve(img));
    } else {
        // Fallback para navegadores sem suporte a IntersectionObserver
        const loadVisibleImages = () => {
            const images = container.querySelectorAll("img[data-src]");

            images.forEach((img) => {
                if (isInViewport(img)) {
                    img.setAttribute("src", img.getAttribute("data-src"));
                    img.removeAttribute("data-src");
                }
            });
        };

        // Carregar imagens visíveis imediatamente
        loadVisibleImages();

        // Adicionar eventos
        window.addEventListener("scroll", loadVisibleImages);
        window.addEventListener("resize", loadVisibleImages);

        return () => {
            window.removeEventListener("scroll", loadVisibleImages);
            window.removeEventListener("resize", loadVisibleImages);
        };
    }
};

/**
 * Otimiza a qualidade da imagem com base na conexão do usuário
 * @param {string} src - URL original da imagem
 * @returns {string} - URL otimizada da imagem
 */
export const getOptimizedImageUrl = (src) => {
    if (!src) return "";

    // Se a conexão for lenta, carregar versão de menor qualidade
    const connection =
        navigator.connection ||
        navigator.mozConnection ||
        navigator.webkitConnection;

    if (
        connection &&
        (connection.effectiveType === "2g" ||
            connection.effectiveType === "slow-2g")
    ) {
        // Se for uma URL externa, retornar como está
        if (src.startsWith("http")) return src;

        // Assumindo que existe uma versão de baixa qualidade da imagem
        const parts = src.split(".");
        if (parts.length > 1) {
            const ext = parts.pop();
            const base = parts.join(".");
            return `${base}-low.${ext}`;
        }
    }

    return src;
};

export default {
    preloadImage,
    isInViewport,
    setupLazyLoading,
    getOptimizedImageUrl,
};
