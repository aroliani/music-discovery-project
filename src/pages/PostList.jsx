import { useEffect, useState } from "react";
import { Link } from 'react-router-dom';

const PostList = () => {
    const [posts, setPosts] = useState([]);
    useEffect(() => {
        fetch('https://jsonplaceholder.typicode.com/posts')
            .then(res => res.json())
            .then(data => setPosts(data))
    }, []);
    return (
        <div>
            {posts.map((item) => (
                <div key={item.id} style={{marginBottom: '10px'}}>
                    <Link to={`/posts/${item.id}`}>
                        {`${item.id} ${item.title}`}
                    </Link>
                </div>
            ))}
        </div>
    );
}

export default PostList;