type Step3Props = {
  onBack: () => void;
};

export default function Step3({ onBack }: Step3Props) {
  return (
    <div>
      <h1>Step 3</h1>

      <button onClick={onBack}>Back</button>
      <button>Login</button>
      <button>Sign up</button>
    </div>
  );
}