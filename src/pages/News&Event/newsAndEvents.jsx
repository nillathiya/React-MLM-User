import React, { useState, useEffect } from "react";
import MasterLayout from "../../masterLayout/MasterLayout";
import Breadcrumb from "../../components/Breadcrumb";
import { useSelector, useDispatch } from "react-redux";
import toast from "react-hot-toast";
import { getUserNewsAndEventsAsync } from "../../feature/user/userSlice";
import { FaAngleUp } from "react-icons/fa";
import "./newsAndEvents.css";
const API_URL = process.env.REACT_APP_API_URL;

const NewsAndEvents = () => {
  const dispatch = useDispatch();
  const { newsThumbnails, latestNews, newsEvents, isLoading } = useSelector(
    (state) => state.user
  );
  const [activeTab, setActiveTab] = useState("news");
  const [newsData, setNewsData] = useState(null);
  const [isExpanded, setIsExpanded] = useState(false);

  useEffect(() => {
    const fetchAllNewsAndEvent = async () => {
      try {
        await dispatch(getUserNewsAndEventsAsync()).unwrap();
      } catch (error) {
        toast.error(error || "Server error");
      }
    };
    if (newsEvents.length == 0) {
      fetchAllNewsAndEvent();
    }
  }, [dispatch]);

  useEffect(() => {
    if (newsEvents?.length > 0) {
      setNewsData(newsEvents[0]);
    }
  }, [newsEvents]);

  const handleNewsClick = (news) => {
    setNewsData(news);
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

                {activeTab === "news" && newsData && (
                  <div className="row">
                    <div className="col-sm-6">
                      <div className="news-wrap">
                        <div className="image_grid_lg">
                          <div className="image-container">
                            {newsData.images.length > 0 ? (
                              newsData.images.map((image, index) => (
                                <img
                                  key={index}
                                  className="news-image"
                                  src={`${API_URL}${image}`}
                                  alt={`News ${index}`}
                                />
                              ))
                            ) : (
                              <img
                                className="news-image"
                                src="#"
                                alt="No image"
                              />
                            )}
                          </div>
                        </div>
                        <div className="news-content">
                          <h5>
                            <a href="#">{newsData.title}</a>
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
                                  style={{
                                    color: "white",
                                    fontSize: "15px",
                                  }}
                                >
                                  {isExpanded ? (
                                    <>
                                      <span className="d-flex">
                                        Show less{" "}
                                        <FaAngleUp style={{ margin: "5px" }} />
                                      </span>
                                    </>
                                  ) : (
                                    "Load more..."
                                  )}
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
                          {newsEvents
                            .filter((news) => news.category === "news")
                            .map((news) => (
                              <li
                                key={news._id}
                                onClick={() => handleNewsClick(news)}
                              >
                                <div className="thumb-wrap">
                                  {news.images.length > 0 && (
                                    <div className="image-grid-container">
                                      <div className="image-grid">
                                        {news.images.map((image, index) => (
                                          <img
                                            key={index}
                                            width="60"
                                            height="60"
                                            alt="Thumb"
                                            className="img-responsive"
                                            src={`${API_URL}${image}`}
                                          />
                                        ))}
                                      </div>
                                    </div>
                                  )}
                                  <div className="grid-text">
                                    <span className="color">{news.title}</span>
                                    <p>
                                      {news.description.length > 80
                                        ? news.description.slice(0, 80) + "..."
                                        : news.description}
                                    </p>
                                    <small>{news.date}</small>{" "}
                                    {/* Display date */}
                                  </div>
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
                          {newsEvents
                            .filter((item) => item.category === "event")
                            .map((item, index) => (
                              <li key={item._id}>
                                <strong>Event Name:</strong> {item.title}
                                <br />
                                <strong>Date:</strong>{" "}
                                {new Date(item.eventDate).toLocaleDateString()}
                              </li>
                            ))}
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
                  <div className="widget_lates_box">
                    <h5 className="widget-title">
                      Latest News<span></span>
                    </h5>
                    <ul className="thumbnail_latest_widget">
                      {latestNews.length > 0 ? (
                        latestNews
                          .filter((news) => news.category === "news")
                          .slice(0, 5)
                          .map((news) => (
                            <li
                              key={news._id}
                              onClick={() => handleNewsClick(news)}
                            >
                              <div className="thumb-wrap">
                                {/* Show only if images exist */}
                                {news.images.length > 0 && (
                                  <div className="image-grid-container">
                                    <div className="image-grid">
                                      {news.images.map((image, index) => (
                                        <img
                                          key={index}
                                          width="60"
                                          height="60"
                                          alt="Thumb"
                                          className="img-responsive"
                                          src={`${API_URL}${image}`}
                                        />
                                      ))}
                                    </div>
                                  </div>
                                )}

                                {/* News title and date (always visible) */}
                                <div className="grid-text">
                                  <a href="#">{news.title}</a>
                                  <p className="latest_grid_description">
                                    {news.description.length > 60
                                      ? news.description.substring(0, 60) +
                                        "..."
                                      : news.description}
                                  </p>
                                  <span>
                                    {new Date(
                                      news.createdAt
                                    ).toLocaleDateString()}
                                  </span>
                                </div>
                              </div>
                            </li>
                          ))
                      ) : (
                        <p className="no-news-message">
                          No latest news available
                        </p>
                      )}
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
