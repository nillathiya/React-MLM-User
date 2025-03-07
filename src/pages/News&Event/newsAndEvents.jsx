import React, { useState } from "react";
import MasterLayout from "../../masterLayout/MasterLayout";
import "./newsAndEvents.css";
import Breadcrumb from "../../components/Breadcrumb";

const initialNewsData = {
  id: 1,
  image: "assets/news/3.jpg",
  title:
    "DIY and interior design tips: Decorating to celebrating the great indoors",
  description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
  date: "Jan 02 - 2025",
  link: "news-single.html",
};

const newsThumbnails = [
  {
    id: 1,
    image: "assets/news/news-thumb-01.jpg",
    title: "Today News",
    date: "Dec 02, 2016",
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Curabitur pellentesque Lorem ipsum dolor sit amet, consectetur adipiscing elit. Curabitur pellentesque Lorem ipsum dolor sit amet, consectetur adipiscing elit. Curabitur pellentesque",
  },
  {
    id: 2,
    image: "assets/news/news-thumb-02.jpg",
    title: "Breaking News",
    date: "Dec 05, 2016",
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Curabitur pellentesque Lorem ipsum dolor sit amet, consectetur adipiscing elit. Curabitur pellentesque Lorem ipsum dolor sit amet, consectetur adipiscing elit. Curabitur pellentesque",
  },
  {
    id: 3,
    image: "assets/news/news-thumb-01.jpg",
    title: "today news",
    date: "Dec 02, 2016",
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Curabitur pellentesque",
  },
  {
    id: 4,
    image: "assets/news/news-thumb-02.jpg",
    title: "today news",
    date: "Dec 02, 2016",
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Curabitur pellentesque",
  },
  {
    id: 5,
    image: "assets/news/news-thumb-01.jpg",
    title: "today news",
    date: "Dec 02, 2016",
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Curabitur pellentesque",
  },
  {
    id: 6,
    image: "assets/news/news-thumb-02.jpg",
    title: "today news",
    date: "Dec 02, 2016",
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Curabitur pellentesque",
  },
];

const latestNews = [
  {
    id: 1,
    image: "assets/news/thumb3.jpg",
    title: "About Freelancing",
    date: "March 10, 2016",
  },
  {
    id: 2,
    image: "assets/news/thumb2.jpg",
    title: "Need a Help?",
    date: "March 15, 2016",
  },
  {
    id: 3,
    image: "assets/news/thumb2.jpg",
    title: "Need a Help?",
    date: "March 10, 2016",
  },
  {
    id: 4,
    image: "assets/news/thumb2.jpg",
    title: "Need a Help?",
    date: "March 10, 2016",
  },
  {
    id: 5,
    image: "assets/news/thumb2.jpg",
    title: "Need a Help?",
    date: "March 10, 2016",
  },
  {
    id: 6,
    image: "assets/news/thumb2.jpg",
    title: "Need a Help?",
    date: "March 10, 2016",
  },
];

const NewsAndEvents = () => {
  const [activeTab, setActiveTab] = useState("news");
  const [newsData, setNewsData] = useState(initialNewsData);
  const [isExpanded, setIsExpanded] = useState(false);

  // Function to update newsData on click
  const handleNewsClick = (news) => {
    setNewsData({
      id: news.id,
      image: news.image,
      title: news.title,
      description: news.description || "No description available",
      date: news.date,
      link: "#", // Assuming no specific link is provided
    });
  };

  const handleLoadMore = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <MasterLayout>
      <Breadcrumb title="News and Events" />
      <section className="bg-grey typo-dark">
        <div className="container">
          <div className="row">
            <div className="col-md-9">
              <div className="tab-news">
                <div className="title-bg-line">
                  <h6
                    className={`title ${activeTab === "news" ? "active" : ""}`}
                    onClick={() => setActiveTab("news")}
                  >
                    <a href="#">News</a>
                  </h6>
                  <h6
                    className={`title ${
                      activeTab === "events" ? "active" : ""
                    }`}
                    onClick={() => setActiveTab("events")}
                  >
                    <a href="#">Events</a>
                  </h6>
                </div>

                {activeTab === "news" && (
                  <div className="row">
                    <div className="col-sm-6">
                      <div className="news-wrap">
                        <a href={newsData.link}>
                          <img
                            className="img-responsive"
                            src={newsData.image}
                            alt="News"
                            height="700"
                            width="800"
                          />
                        </a>
                        <div className="news-content">
                          <h5>
                            <a href={newsData.link}>{newsData.title}</a>
                          </h5>
                          <span className="news-cat">
                            {newsData.description.length > 80 ? (
                              <>
                                {isExpanded
                                  ? newsData.description
                                  : `${newsData.description.slice(0, 80)}... `}
                                <a
                                  href="#"
                                  onClick={handleLoadMore}
                                  style={{ color: "white", fontSize: "15px" }}
                                >
                                  {isExpanded ? "Show less..." : "Load more..."}
                                </a>
                              </>
                            ) : (
                              newsData.description
                            )}
                          </span>
                          <span className="news-meta">{newsData.date}</span>
                        </div>
                      </div>
                    </div>
                    <div className="col-sm-6">
                      <div className="widget_no_box">
                        <ul className="thumbnail-widget">
                          {newsThumbnails.map((thumb) => (
                            <li
                              key={thumb.id}
                              onClick={() => handleNewsClick(thumb)}
                            >
                              <div className="thumb-wrap">
                                <img
                                  width="100"
                                  height="100"
                                  alt="Thumb"
                                  className="img-responsive"
                                  src={thumb.image}
                                />
                              </div>
                              <div className="thumb-content">
                                <span className="color">{thumb.date}</span>
                                <p>
                                  {thumb.description.length > 80
                                    ? thumb.description.slice(0, 80) + "..."
                                    : thumb.description}
                                </p>
                              </div>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === "events" && (
                  <div className="row">
                    <div className="col-sm-12">
                      <div className="events-wrap">
                        <h5>Upcoming Events</h5>
                        <ul className="events-list">
                          <li>
                            <strong>Event Name:</strong> Tech Conference 2024
                            <br />
                            <strong>Date:</strong> April 15, 2024
                          </li>
                          <li>
                            <strong>Event Name:</strong> Health & Wellness Expo
                            <br />
                            <strong>Date:</strong> May 10, 2024
                          </li>
                        </ul>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {activeTab !== "events" && (
              <div className="col-md-3">
                <aside className="right_sidebar">
                  <div className="widget_no_box">
                    <h5 className="widget-title">
                      Latest News<span></span>
                    </h5>
                    <ul className="thumbnail-widget">
                      {latestNews.map((news) => (
                        <li key={news.id} onClick={() => handleNewsClick(news)}>
                          <div className="thumb-wrap">
                            <img
                              width="60"
                              height="60"
                              alt="Thumb"
                              className="img-responsive"
                              src={news.image}
                            />
                          </div>
                          <div className="thumb-content">
                            <a href="#">{news.title}</a>
                            <span>{news.date}</span>
                          </div>
                        </li>
                      ))}
                    </ul>
                  </div>
                </aside>
              </div>
            )}
          </div>
        </div>
      </section>
    </MasterLayout>
  );
};

export default NewsAndEvents;
