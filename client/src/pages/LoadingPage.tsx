import BookSVG from "../components/svgs/BookSVG";

export default function LoadingPage() {
  return (
    <main className="loading-page">
      <div className="container">
        <div className="loader">
          <BookSVG />
        </div>
        <p>Estamos preparando suas anotações. Por favor, aguarde um momento.</p>
      </div>
    </main>
  );
}
