import './loading.css';

export const Loading = () => {
  return (
    <div className="loading-container" role="status">
      <span className="loading-sun" aria-hidden="true" />
      Loading…
    </div>
  );
};
