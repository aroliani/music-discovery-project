import { useEffect, useState } from "react";
import { Link } from 'react-router-dom';

const PostList = () => {
    const [posts, setPosts] = useState([]);
    const [search, setSearch] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const postsPerPage = 10;

    useEffect(() => {
        fetch('https://jsonplaceholder.typicode.com/posts')
            .then(res => res.json())
            .then(data => setPosts(data))
    }, []);

    const filteredPosts = posts.filter(post =>
        post.title.toLowerCase().includes(search.toLowerCase())
    );

    // Pagination 
    const indexOfLastPost = currentPage * postsPerPage;
    const indexOfFirstPost = indexOfLastPost - postsPerPage;
    const currentPosts = filteredPosts.slice(indexOfFirstPost, indexOfLastPost);
    const totalPages = Math.ceil(filteredPosts.length / postsPerPage);

    const pageNumbers = [];
    for (let i = 1; i <= totalPages; i++) {
        pageNumbers.push(i);
    }

    return (
        <div>
            <input
                type="text"
                placeholder="Search post..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                style={{
                    width: "100%",
                    padding: "10px 14px",
                    marginBottom: 24,
                    borderRadius: 6,
                    border: "1px solid #b2dfb4c4",
                    fontSize: 16,
                    outline: "none",
                    boxSizing: "border-box"
                }}
            />
            {currentPosts.map((post) => (
                <div
                    className="card post-card"
                    key={post.id}
                    style={{ marginBottom: 16 }}
                >
                    <Link className="post-link" to={`/posts/${post.id}`}>
                        {post.title}
                    </Link>
                </div>
            ))}
            {/* Pagination numbers */}
            <div style={{ display: "flex", gap: 8, justifyContent: "center", marginTop: 24 }}>
                {pageNumbers.map(number => (
                    <button
                        key={number}
                        onClick={() => setCurrentPage(number)}
                        style={{
                            padding: "6px 14px",
                            borderRadius: 4,
                            border: number === currentPage ? "2px solid #388e3c" : "1px solid #b2dfb4c4",
                            background: number === currentPage ? "#e8f5e9" : "#fff",
                            color: number === currentPage ? "#388e3c" : "#222",
                            fontWeight: number === currentPage ? "bold" : "normal",
                            cursor: "pointer"
                        }}
                        disabled={number === currentPage}
                    >
                        {number}
                    </button>
                ))}
            </div>
        </div>
    );
}

export default PostList;
