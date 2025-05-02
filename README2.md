# LeveFit - Documentação Técnica

Este documento contém informações técnicas detalhadas sobre o LeveFit, focando na implementação, componentes personalizados, animações e otimizações.

## Arquitetura do Projeto

O LeveFit utiliza uma arquitetura moderna que combina Laravel (backend) com React (frontend) através do Inertia.js, permitindo:

1. **Desenvolvimento SPA sem API separada** - Comunicação fluida entre frontend e backend
2. **Manutenção simplificada** - Um único repositório para toda a aplicação
3. **Melhor experiência de usuário** - Navegação rápida sem recarregar a página inteira

## Componentes Personalizados

### AnimatedTitle

Componente de título animado que aplica efeitos de entrada suaves:

```jsx
const AnimatedTitle = ({ children }) => (
  <h2 className="text-3xl font-bold text-gray-800 mt-4 mb-3 animate-slidein">
    {children}
  </h2>
);
```

### AnimatedBox

Componente para animação de entrada de blocos de conteúdo com delay customizável:

```jsx
const AnimatedBox = ({ children, className, delay = 0 }) => {
  const [isVisible, setIsVisible] = useState(false);
  const boxRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );

    if (boxRef.current) {
      observer.observe(boxRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={boxRef}
      className={`${className} ${
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
      } transition-all duration-700 ease-out`}
      style={{ transitionDelay: `${delay}s` }}
    >
      {children}
    </div>
  );
};
```

## Efeitos Visuais e Animações

### Efeito de Digitação

Implementação de efeito de "typewriter" que digita o texto letra por letra:

```jsx
const [textoDigitado, setTextoDigitado] = useState("");
const [indice, setIndice] = useState(0);
const fraseCompleta = "Eleve sua saúde a cada mordida";

useEffect(() => {
  if (indice < fraseCompleta.length) {
    const timer = setTimeout(() => {
      setTextoDigitado((prev) => prev + fraseCompleta[indice]);
      setIndice((prev) => prev + 1);
    }, 130);
    return () => clearTimeout(timer);
  }
}, [indice]);
```

### Otimizações do Carrossel

Configurações personalizadas do Slick Carousel para melhor desempenho:

```jsx
// Configurações do carrossel
const carrosselSettings = {
  dots: true,
  infinite: true,
  speed: 500,
  slidesToShow: 3,
  slidesToScroll: 1,
  autoplay: true,
  autoplaySpeed: 4000,
  pauseOnHover: true,
  responsive: [
    // Configurações responsivas...
  ],
};
```

## CSS Customizado

CSS customizado para animar elementos e criar efeitos visuais:

```css
@keyframes slidein {
  0% {
    opacity: 0;
    transform: translateX(-50px);
  }
  100% {
    opacity: 1;
    transform: translateX(0);
  }
}

.animate-slidein {
  animation: slidein 0.8s ease-out forwards;
}

@keyframes glow {
  0% {
    text-shadow: 0 0 5px #38a169;
  }
  50% {
    text-shadow: 0 0 10px #38a169;
  }
  100% {
    text-shadow: 0 0 5px #38a169;
  }
}

.glow {
  animation: glow 3s ease-in-out infinite;
}
```

## Otimizações de Carregamento

### Lazy Loading de Imagens

O sistema utiliza carregamento otimizado de imagens através do `loading="lazy"` nativo e otimizações manuais:

```jsx
<img
  src={imagem}
  alt={titulo}
  className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
  loading="lazy"
/>
```

### CSS Otimizado para Carrossel

CSS específico para melhorar a performance do carrossel, evitando problemas comuns:

```css
.slick-slide {
  padding: 0 10px;
  height: auto;
}

.slick-list {
  margin: 0 -10px;
  padding-bottom: 0 !important;
  overflow: hidden;
}

.slick-track {
  display: flex !important;
  align-items: stretch !important;
  justify-content: flex-start !important;
}
```

## Integração com Laravel

O sistema utiliza Inertia.js para integrar React com Laravel sem necessidade de uma API tradicional:

1. **Rotas** - Definidas em `routes/web.php`
2. **Controladores** - Manipulação de dados em `app/Http/Controllers`
3. **Views** - Componentes React em `resources/js/Pages`

## Considerações de Performance

Várias técnicas são aplicadas para garantir um site rápido e responsivo:

1. **Animações CSS em vez de JavaScript** - Melhor performance de renderização
2. **Minimização de rerenderizações** - Controle cuidadoso do estado
3. **Estilos de transição otimizados** - Uso de propriedades que não causam reflow
4. **Carregamento sob demanda** - Componentes animados aparecem conforme o usuário rola a página

## Desenvolvimento e Contribuição

Para contribuir com o projeto:

1. Clone o repositório
2. Instale as dependências seguindo as instruções em INSTRUCOES_EXECUCAO.md
3. Crie uma branch para sua funcionalidade (`git checkout -b feature/nova-funcionalidade`)
4. Faça commit das alterações (`git commit -am 'Adiciona nova funcionalidade'`)
5. Envie para a branch (`git push origin feature/nova-funcionalidade`)
6. Crie um Pull Request

## Recursos Adicionais

- [Documentação do Laravel](https://laravel.com/docs)
- [Documentação do React](https://react.dev)
- [Documentação do Inertia.js](https://inertiajs.com)
- [Documentação do Tailwind CSS](https://tailwindcss.com/docs)
- [Documentação do React Slick](https://react-slick.neostack.com)
