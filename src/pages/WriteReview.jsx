import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Star, ArrowLeft, CheckCircle2 } from 'lucide-react';
import './WriteReview.css';

const WriteReview = () => {
  const navigate = useNavigate();
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [reviewText, setReviewText] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (rating === 0) {
      alert("Please select a rating before submitting.");
      return;
    }
    // Simulate submission
    setIsSubmitted(true);
    setTimeout(() => {
      navigate('/');
    }, 3000);
  };

  return (
    <div className="write-review-container">
      {isSubmitted ? (
        <div className="review-success animate-fade-in">
          <CheckCircle2 size={80} style={{color: '#4caf50', marginBottom: '1rem', margin: '0 auto'}} />
          <h2>Thank You!</h2>
          <p>Your review has been submitted successfully.</p>
          <p style={{fontSize: '0.8rem', color: '#666', marginTop: '1rem'}}>Redirecting to home...</p>
        </div>
      ) : (
        <div className="review-form-box animate-fade-in">
          <div className="back-btn" onClick={() => navigate(-1)}>
            <ArrowLeft size={20} /> Back
          </div>
          <h2 className="review-title">Write a Review</h2>
          <p className="review-subtitle">How was your experience at Infinity Sports Club?</p>
          
          <form onSubmit={handleSubmit}>
            <div className="star-rating">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  size={42}
                  className={`star ${star <= (hoverRating || rating) ? 'active' : ''}`}
                  onMouseEnter={() => setHoverRating(star)}
                  onMouseLeave={() => setHoverRating(0)}
                  onClick={() => setRating(star)}
                />
              ))}
            </div>
            
            <div style={{textAlign: 'center', marginBottom: '2rem', color: '#FFB800', fontWeight: 'bold', minHeight: '24px'}}>
              {rating === 1 && "Poor"}
              {rating === 2 && "Fair"}
              {rating === 3 && "Good"}
              {rating === 4 && "Very Good"}
              {rating === 5 && "Excellent!"}
            </div>

            <div className="form-group">
              <label>Tell us more about your experience</label>
              <textarea
                className="dark-input"
                rows="6"
                placeholder="What did you like or dislike? How was the ground and facilities?"
                value={reviewText}
                onChange={(e) => setReviewText(e.target.value)}
                required
              ></textarea>
            </div>
            
            <button type="submit" className="submit-btn" disabled={rating === 0}>
              Submit Review
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

export default WriteReview;
