import { NextSeo } from 'next-seo';

interface SEOProps {
  title?: string;
  description?: string;
  canonical?: string;
  openGraph?: {
    title?: string;
    description?: string;
    images?: Array<{ url: string; alt: string }>;
  };
}

export const SEO = ({
  title = 'AI News & Version Tracker - 最新AI资讯和版本追踪',
  description = '追踪最新AI产品更新和行业新闻，为您提供及时的人工智能发展动态',
  canonical,
  openGraph,
}: SEOProps) => {
  return (
    <NextSeo
      title={title}
      description={description}
      canonical={canonical}
      openGraph={{
        type: 'website',
        locale: 'zh_CN',
        url: canonical,
        siteName: 'AI News & Version Tracker',
        title: openGraph?.title || title,
        description: openGraph?.description || description,
        images: openGraph?.images || [
          {
            url: '/og-image.png',
            alt: 'AI News & Version Tracker',
          },
        ],
      }}
      twitter={{
        handle: '@ainewstracker',
        site: '@ainewstracker',
        cardType: 'summary_large_image',
      }}
    />
  );
}; 