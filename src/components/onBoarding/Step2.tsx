type Step2Props = {
  onNext: () => void;
  onBack: () => void;
};

export default function Step2({ onNext, onBack }: Step2Props) {
  return (
    <div>
      <h1>Step 2</h1>

      <button onClick={onBack}>Back</button>
      <button onClick={onNext}>Next</button>
    </div>
  );
}