"use client";

import React from "react";

import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogFooter,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogCancel,
  AlertDialogAction,
} from "@/components/ui/alert-dialog";

type DeleteContributionProps = {
  IdContribuicao: number;
  onDeleted?: () => void;
  apiBaseUrl?: string;
};

export default function DeleteContribution({
  IdContribuicao,
  onDeleted,
  apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:3001",
}: DeleteContributionProps) {
  const [open, setOpen] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  async function handleConfirm(e: React.MouseEvent<HTMLButtonElement>) {
    e.preventDefault();

    try {
      setLoading(true);
      setError(null);

      const res = await fetch(
        `${apiBaseUrl}/api/deleteContribution/${IdContribuicao}`,
        { method: "DELETE" }
      );

      if (!res.ok) {
        let msg = `Erro ao deletar contribuição! (status ${res.status})`;
        try {
          const data = await res.json();
          if (data?.message) msg = data.message;
        } catch {}
        throw new Error(msg);
      }

      setOpen(false);
      onDeleted?.();
    } catch (e: any) {
      setError(e?.message ?? "Erro desconhecido ao deletar");
      console.error(e);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex justify-end mt-6">
      <AlertDialog open={open} onOpenChange={setOpen}>
        <AlertDialogTrigger asChild>
          <button
            type="button"
            className={`inline-flex items-center gap-2 rounded-lg px-4 py-2
                    ${
                      loading
                        ? "bg-[#b41333]/60 cursor-not-allowed"
                        : "bg-[#b41333] hover:bg-[#f04f4f]"
                    }
                    text-white font-medium transition-colors duration-200 cursor-pointer
                    shadow-[0_6px_20px_rgba(247,201,212,0.5)] hover:shadow-[0_10px_28px_rgba(247,201,212,0.6)]`}
          >
            <svg //iconezinho de lixeira
              className="w-5 h-5"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M3 6h18" />
              <path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
              <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
              <path d="M10 11v6M14 11v6" />
            </svg>
            Deletar contribuição
          </button>
        </AlertDialogTrigger>

        <AlertDialogContent >
          <AlertDialogHeader>
            <AlertDialogTitle>Tem certeza?</AlertDialogTitle>
            <AlertDialogDescription>
              Essa ação não pode ser desfeita. Isso excluirá a contribuição
              permanentemente.
            </AlertDialogDescription>
          </AlertDialogHeader>

          {/* mudar mensagem de erro depois*/}
          {error && <p className="ml-3 text-sm text-red-600"> {error} </p>}

          <AlertDialogFooter>
            <AlertDialogCancel disabled={loading}>Cancelar</AlertDialogCancel>

            {/* Botão que EXECUTA o DELETE */}
            <AlertDialogAction
              onClick={handleConfirm}
              disabled={loading}
              className="bg-[#b41333] text-white hover:bg-[#f04f4f] focus:ring-0 cursor-pointer"
            >
              {loading ? "Excluindo..." : "Deletar"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
