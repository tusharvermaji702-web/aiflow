export default function Pipeline({ steps }: { steps: string[] }) {
  return (
    <div className="pipeline">
      {steps.map((step, i) => (
        <span key={step}>
          <span className="pipeline-step">{step}</span>
          {i < steps.length - 1 && <span className="pipeline-arrow">→</span>}
        </span>
      ))}
    </div>
  );
}
