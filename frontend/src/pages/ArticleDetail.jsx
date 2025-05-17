import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import client from '../lib/contentful';
import { documentToReactComponents } from '@contentful/rich-text-react-renderer';

export default function ArticleDetail() {
  const { slug } = useParams();
  const [article, setArticle] = useState(null);

  useEffect(() => {
    async function getArticle() {
      const res = await client.getEntries({
        content_type: 'blogPost',
        'fields.slug': slug,
      });
      setArticle(res.items[0]);
    }
    getArticle();
  }, [slug]);

  if (!article) return <p className="text-center mt-5">Loading...</p>;

  const {
    title,
    subtitle,
    coverImage,
    content,
    authorName,
    publishedDate,
    tags,
    readTime,
  } = article.fields;

  // Format published date nicely
  const formattedDate = publishedDate
    ? new Date(publishedDate).toLocaleDateString(undefined, {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })
    : '';

  return (
    <div className="container py-5">
      <h1 className="display-4 mb-2">{title}</h1>

      {subtitle && <h4 className="text-muted mb-4">{subtitle}</h4>}

      {coverImage && (
        <img
          src={coverImage.fields.file.url}
          alt={title}
          className="img-fluid rounded mb-4"
        />
      )}

      <div className="mb-3 text-muted">
        {authorName && <span>By {authorName}</span>}
        {formattedDate && <span> | {formattedDate}</span>}
        {readTime && <span> | {readTime} min read</span>}
      </div>

      {tags && tags.length > 0 && (
        <div className="mb-4">
          {tags.map((tag) => (
            <span
              key={tag}
              className="badge bg-secondary me-2"
            >
              {tag}
            </span>
          ))}
        </div>
      )}

      <div className="content fs-5 lh-lg">{documentToReactComponents(content)}</div>
    </div>
  );
}
