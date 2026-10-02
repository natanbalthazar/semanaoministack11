/** Mensagem de erro de formulário. Sem mensagem → não renderiza nada. */
export function FieldError({ message, className = "" }: { message?: string; className?: string }) {
  if (!message) return null;
  return (
    <p role="alert" className={`text-red-500 text-sm ${className}`}>
      {message}
    </p>
  );
}
