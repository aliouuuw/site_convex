interface Testimonial {
  _id: string;
  quote: string;
  author: string;
  role: string;
  imageUrl?: string;
  imageName?: string;
  imageSize?: number;
  imageUploadedAt?: string;
  featured?: boolean;
  order?: number;
}

interface TestimonialsCarouselProps {
  testimonials: Testimonial[];
}

export default function TestimonialsCarousel({ testimonials }: TestimonialsCarouselProps) {
  return (
    <div className="testimonials-carousel">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {testimonials.map((testimonial) => (
          <div key={testimonial._id} className="testimonial-card">
            <div className="testimonial-content">
              <div className="quote-mark">"</div>
              <blockquote className="testimonial-quote">
                {testimonial.quote}
              </blockquote>
              <div className="testimonial-author">
                {testimonial.imageUrl ? (
                  <img
                    src={testimonial.imageUrl}
                    alt={testimonial.author}
                    className="author-avatar"
                  />
                ) : (
                  <div className="author-avatar-placeholder">
                    {testimonial.author.charAt(0).toUpperCase()}
                  </div>
                )}
                <div className="author-info">
                  <h4 className="author-name">{testimonial.author}</h4>
                  <p className="author-role">{testimonial.role}</p>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
