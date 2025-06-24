import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

const PostDetails = () => {
  const { postId } = useParams();
  const [post, setPost] = useState(null);
  const [comments, setComments] = useState([]);

  useEffect(() => {
    fetch(`https://jsonplaceholder.typicode.com/posts/${postId}`)
      .then(res => res.json())
      .then(data => setPost(data));

    fetch(`https://jsonplaceholder.typicode.com/posts/${postId}/comments`)
      .then(res => res.json())
      .then(data => setComments(data));
  }, [postId]);

  if (!post) return <p>Loading...</p>;

  return (
    <div style={{ padding: '20px', fontFamily: 'sans-serif' }}>
      {/* Post Card */}
      <div style={{
        background: '#fff',
        borderRadius: '6px',
        boxShadow: '0 1px 4px #388e3c',
        padding: '20px',
        marginBottom: '32px'
      }}>
        <h2 style={{ margin: 0, fontSize: '20px' }}>{post.title}</h2>
        <p style={{ marginTop: '12px', color: '#444' }}>{post.body}</p>
      </div>
      {/* Comments */}
      <h3 style={{ marginBottom: '16px' }}>Comments</h3>
      <div>
        {comments.map(comment => (
          <div key={comment.id} style={{
            background: '#fafafa',
            borderRadius: '4px',
            padding: '12px 16px',
            marginBottom: '12px',
            border: '1px solid #eee',
            boxShadow: '0 1px 4px #388e3c'
          }}>
            <div style={{ fontWeight: 'bold', marginBottom: '4px' }}>{comment.name}</div>
            <div style={{ color: '#388e3c' }}>{comment.body}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default PostDetails;
