import { useEffect, useState } from 'react';
import { getArticles } from '../api/getArticle';
import { Link } from 'react-router-dom';

export default function ArticlesPage() {
  const [articles, setArticles] = useState([]);

  useEffect(() => {
    getArticles().then((data) => {
      console.log("Fetched Articles:", data);
      setArticles(data);
    });
  }, []);

  return (
    <div className="container py-5">
      <section className="mb-5">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h2 className="fs-4 fw-bold">All Articles</h2>
        </div>

        <div className="row g-4">
          {articles.map((article, idx) => {
            const { title, slug, subtitle, coverImage, publishedDate, readTime, tags, authorName } = article.fields;
            return (
              <div key={idx} className="col-md-4">
                <Link to={`/articles/${slug}`} className="text-decoration-none text-dark">
                  <div className="card h-100 border-0 shadow-sm hover-shadow transition-all">
                    <img
                      src={coverImage?.fields?.file?.url}
                      className="card-img-top"
                      alt={title}
                    />
                    <div className="card-body">
                      {tags && tags.map((tag, index) => (
                        <span className= "badge bg-primary mb-2" key={index} style={{ marginRight: '8px' }}>
                          {tag}
                        </span>
                      ))}
                      <h3 className="card-title h5 fw-bold">{title}</h3>
                      <p className="card-text text-muted">{subtitle}</p>
                    </div>
                    <div className="card-footer bg-white border-0 text-muted">
                      <small>{readTime} min read • {publishedDate} • By {authorName}</small>
                    </div>
                  </div>
                </Link>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}
