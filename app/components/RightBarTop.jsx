"use client";

import { useState, useEffect } from "react";

export default function News() {
  const [news, setNews] = useState([]);
  const [articleNum, setArticleNum] = useState(3);
  
  useEffect(() => {
    fetch("/api/news?country=us&category=business")
      .then((res) => res.json())
      .then((data) => setNews(data.articles))
      .catch(console.error);
  }, []);
  
  return (
    <div className="flex flex-col space-y-3 rounded-xl border border-gray-200 bg-gray-50 pt-2 text-gray-800">
      <h4 className="px-4 pt-2 text-xl font-bold">Whats happening</h4>
      {news.slice(0, articleNum).map((article) => (
        <div key={article.url}>
          <a href={article.url} target="_blank">
            <div className="flex items-center justify-between space-x-1 px-4 py-2 transition duration-200 hover:bg-blue-50">
              <div className="space-y-0.5">
                <h6 className="text-sm font-bold">{article.title}</h6>
                <p className="text-xs font-medium text-gray-500">
                  {article.source.name}
                </p>
              </div>
              <img src={article.urlToImage} width={70} className="rounded-xl" />
            </div>
          </a>
        </div>
      ))}
      <button
        onClick={() => setArticleNum(articleNum + 3)}
        className="cursor-pointer pb-3 pl-4 text-sm font-semibold text-gray-700 hover:text-cyan-500"
      >
        Load more
      </button>
    </div>
  );
}
