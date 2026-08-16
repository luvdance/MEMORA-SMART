import BookCover from "./BookCover";

export default function FreeBookCard({ book }) {
  return (
    <a href={book.route} className="fcard">
      <BookCover image={book.cover} icon={book.icon} title={book.title} size="sm" />
      <div className="fcard-body">
        <span className="fcard-tag">Free Preview</span>
        <h3>{book.title}</h3>
        <p className="fcard-parent">From: {book.parentBook}</p>
        <p className="fcard-desc">{book.description}</p>
        <span className="fcard-cta">
          Get it free <i className="fa-solid fa-arrow-right" />
        </span>
      </div>
    </a>
  );
}
