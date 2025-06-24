import { useEffect, useState } from "react";
import { Link } from 'react-router-dom';

const PostList = () => {
    const [posts, setPosts] = useState([]);
    const [search, setSearch] = useState("");
    useEffect(() => {
        fetch('https://jsonplaceholder.typicode.com/posts')
            .then(res => res.json())
            .then(data => setPosts(data))
    }, []);

    const filteredPosts = posts.filter(post =>
        post.title.toLowerCase().includes(search.toLowerCase())
    );

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
            {filteredPosts.map((post) => (
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
        </div>
    );
}

export default PostList;
