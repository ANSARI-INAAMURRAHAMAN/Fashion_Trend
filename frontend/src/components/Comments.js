import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Avatar } from '../ui/avatar';
import { Button } from '../ui/button';
import { formatDistanceToNow } from 'date-fns';

const Comments = ({ taskId, trendId }) => {
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    fetchComments();
  }, [taskId, trendId]);

  const fetchComments = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get(`/api/comments`, {
        params: { taskId, trendId }
      });
      setComments(response.data.data);
    } catch (error) {
      console.error('Error fetching comments:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('/api/comments', {
        content: newComment,
        taskId,
        trendId
      });
      setNewComment('');
      fetchComments();
    } catch (error) {
      console.error('Error posting comment:', error);
    }
  };

  return (
    <div className="comments-section">
      <form onSubmit={handleSubmit} className="comment-form">
        <textarea
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          placeholder="Add a comment..."
          className="comment-input"
        />
        <Button type="submit" disabled={!newComment.trim()}>
          Post Comment
        </Button>
      </form>

      <div className="comments-list">
        {comments.map((comment) => (
          <div key={comment._id} className="comment-card">
            <div className="comment-header">
              <div className="flex items-center gap-2">
                <Avatar>{comment.author.name[0]}</Avatar>
                <span className="comment-author">{comment.author.name}</span>
              </div>
              <span className="comment-date">
                {formatDistanceToNow(new Date(comment.createdAt), { addSuffix: true })}
              </span>
            </div>
            <p className="comment-content">{comment.content}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Comments;