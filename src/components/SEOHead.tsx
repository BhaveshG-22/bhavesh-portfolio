import React from 'react';

interface SEOHeadProps {
  title?: string;
  description?: string;
  keywords?: string;
  url?: string;
  image?: string;
  type?: string;
}

const SEOHead: React.FC<SEOHeadProps> = ({
  title = "Bhavesh Gavali - Full-Stack Developer | React, Node.js, Python Expert",
  description = "Bhavesh Gavali - Full-Stack Developer specializing in React, Node.js, Python, and modern web technologies. View my portfolio, projects, and get in touch for development services.",
  keywords = "Full-Stack Developer, React Developer, Node.js, Python, Web Development, Portfolio, Software Engineer, JavaScript, TypeScript",
  url = "https://bhaveshg.dev/",
  image = "https://bhaveshg.dev/og-image.jpg",
  type = "website"
}) => {
  React.useEffect(() => {
    document.title = title;
    
    const metaTags = [
      { name: 'description', content: description },
      { name: 'keywords', content: keywords },
      { name: 'robots', content: 'index, follow' },
      { property: 'og:title', content: title },
      { property: 'og:description', content: description },
      { property: 'og:url', content: url },
      { property: 'og:image', content: image },
      { property: 'og:type', content: type },
      { property: 'og:site_name', content: 'Bhavesh Gavali Portfolio' },
      { property: 'og:locale', content: 'en_US' },
      { name: 'twitter:card', content: 'summary_large_image' },
      { name: 'twitter:title', content: title },
      { name: 'twitter:description', content: description },
      { name: 'twitter:image', content: image },
      { name: 'twitter:creator', content: '@bhaveshgavali' },
    ];

    metaTags.forEach(({ name, property, content }) => {
      const selector = name ? `meta[name="${name}"]` : `meta[property="${property}"]`;
      let meta = document.querySelector(selector) as HTMLMetaElement;
      
      if (!meta) {
        meta = document.createElement('meta');
        if (name) meta.name = name;
        if (property) meta.setAttribute('property', property);
        document.head.appendChild(meta);
      }
      
      meta.content = content;
    });

    const canonical = document.querySelector('link[rel="canonical"]') as HTMLLinkElement;
    if (canonical) {
      canonical.href = url;
    }
  }, [title, description, keywords, url, image, type]);

  return null;
};

export default SEOHead;