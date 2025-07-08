import { useEffect, useState } from "react";
import { Link } from 'react-router-dom';
import { AudioOutlined, UserOutlined, PlusCircleOutlined } from '@ant-design/icons';
import { Pagination } from 'antd';

const PostList = () => {
  const [posts, setPosts] = useState([]);
  const [search, setSearch] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ title: "", artist: "", genre: "", duration: "", body: "" });
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  const [currentPage, setCurrentPage] = useState(1);
  const [postsPerPage] = useState(5);

  useEffect(() => {
    fetch('http://localhost:3000/posts')
      .then(res => res.json())
      .then(data => {
        setPosts(data);
        setLoading(false);
      });
  }, []);

  const filteredPosts = posts.filter(post =>
    post.title.toLowerCase().includes(search.toLowerCase())
  );

  const indexOfLastPost = currentPage * postsPerPage;
  const indexOfFirstPost = indexOfLastPost - postsPerPage;
  const currentPosts = filteredPosts.slice(indexOfFirstPost, indexOfLastPost);

  const paginate = pageNumber => setCurrentPage(pageNumber);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError(null);

    if (!form.title.trim() || !form.body.trim()) {
      alert("Title and Description are required.");
      return;
    }

    fetch('http://localhost:3000/posts', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(form)
    })
      .then(res => {
        if (!res.ok) throw new Error("Failed to save post");
        return res.json();
      })
      .then(data => {
        if (!data.post) throw new Error("Post creation failed");
        setPosts(prev => [...prev, data.post]);
        setForm({ title: "", artist: "", genre: "", duration: "", body: "" });
        setShowForm(false);
      })
      .catch(err => setError(err.message));
  };

  if (loading) return <p>Loading posts...</p>;

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
        <input
          type="text"
          placeholder="Search music..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          style={{
            width: "100%",
            padding: "10px 12px",
            borderRadius: 6,
            border: "1px solid #b2dfb4c4",
            fontSize: 16,
            outline: "none"
          }}
        />
        <PlusCircleOutlined
          onClick={() => setShowForm(prev => !prev)}
          style={{ fontSize: 28, color: "#388e3c", marginLeft: 16, cursor: "pointer" }}
          title="Add New Track"
        />
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} style={{ background: "#f8f8f8", padding: 20, borderRadius: 8, marginBottom: 24 }}>
          <h3 style={{ marginBottom: 16 }}>Add New Track</h3>
          {["title", "artist", "genre", "duration", "audioUrl"].map((field) => (
            <div key={field} style={{ marginBottom: 12 }}>
              <input
                type="text"
                name={field}
                value={form[field]}
                onChange={handleChange}
                placeholder={field.charAt(0).toUpperCase() + field.slice(1)}
                required
                style={{ width: "100%", padding: 10, borderRadius: 6, border: "1px solid #ccc" }}
              />
            </div>
          ))}
          <textarea
            name="body"
            value={form.body}
            onChange={handleChange}
            placeholder="Description"
            required
            rows="4"
            style={{ width: "100%", padding: 10, borderRadius: 6, border: "1px solid #ccc", marginBottom: 12 }}
          ></textarea>
          {error && <p style={{ color: "red" }}>Error: {error}</p>}
          <button type="submit" style={{ padding: "8px 16px", background: "#388e3c", color: "white", border: "none", borderRadius: 6 }}>
            Save
          </button>
        </form>
      )}

      <div className="post-list-wrapper" style={{ display: "flex", flexDirection: "column", gap: 24 }}>
        {currentPosts.map((post, index) => (
          <div key={post._id || post.id} className="card post-card" style={{ marginBottom: 24, padding: 24 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <h2 style={{ margin: 0 }}>{post.title}</h2>
              <span style={{ fontSize: 16, color: "#999" }}>#{index + 1 + indexOfFirstPost}</span>
            </div>

            <div style={{ marginTop: 8, display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap" }}>
              <span><UserOutlined /> {post.artist}</span>
              <span><AudioOutlined /> {post.duration}</span>
              <span style={{ border: "1px solid #388e3c", borderRadius: 4, padding: "2px 8px", fontSize: 12, color: "#388e3c" }}>{post.genre}</span>
            </div>

            <p style={{ marginTop: 12, color: "#444" }}>{post.body?.slice(0, 160)}...</p>

            <div style={{ marginTop: 16, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span style={{ fontSize: 14, color: "#333" }}><strong>Artist:</strong> {post.artist}</span>
              <Link
                to={`/posts/${post.id}`}
                style={{ color: "#388e3c", textDecoration: "none", fontWeight: 600 }}
              >
                Listen & Read →
              </Link>
            </div>
          </div>
        ))}
      </div>

      <div style={{ textAlign: 'center', marginTop: 32 }}>
        <Pagination
          current={currentPage}
          pageSize={postsPerPage}
          total={filteredPosts.length}
          onChange={paginate}
          showSizeChanger={false}
          style={{ marginBottom: 20 }}
        />
      </div>
    </div>
  );
};

export default PostList;
