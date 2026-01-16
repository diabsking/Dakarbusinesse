import { BsPatchCheckFill } from "react-icons/bs";

export default function CertificationSuccess() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center text-center p-6">
      <BsPatchCheckFill size={64} className="text-blue-500 mb-4" />
      <h1 className="text-2xl font-bold mb-2">Paiement réussi 🎉</h1>
      <p className="text-gray-600 mb-6">
        Votre demande de certification est en cours de validation.
      </p>
      <a
        href="/dashboard"
        className="bg-blue-600 text-white px-6 py-2 rounded-lg"
      >
        Retour au tableau de bord
      </a>
    </div>
  );
}
