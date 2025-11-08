import placeholderComprovante from "@/assets/placeholderComprovante.jpg";
import Modal from "../hooks/use-modal";
import DeleteContribution from "@/components/delete-contribution";
import formatBRL from "./formatBRL";

interface ContributionData {
  RaUsuario: number;
  TipoDoacao: string;
  Quantidade: number;
  Meta?: number;
  Gastos?: number;
  Fonte?: string;
  Comprovante?: {
    IdComprovante: number;
    Imagem: string;
  };
  IdContribuicao: number;
  DataContribuicao: string;
  NomeAlimento?: string;
  PontuacaoAlimento: number;
  PesoUnidade: number;
  uuid: string;
}

interface RecordsModalProps {
  data: ContributionData;
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  onDeleted?: () => void;
}

const RecordsModal: React.FC<RecordsModalProps> = ({
  data,
  isOpen,
  setIsOpen,
  onDeleted,
}) => {
  if (!data) return null;

  const toggleModal = () => {
    setIsOpen(!isOpen);
  };
  console.log("Comprovante recebido:", data.Comprovante);

  return (
    <Modal isActive={isOpen} onClose={toggleModal}>
      <div className="overflow-y-scroll max-h-300  drop-shadow-2xl items-center relative bg-[#FFFDF5] rounded-2xl ">
        <div className="flex max-w-[95vw] flex-col gap-5 z-10 px-10 py-8 w-90 text-left">
          <div className="">
            <div>
              <h2 className="text-xl font-semibold">{data.Fonte}</h2>
              <div>
                <p className="text-base text-gray-600 mt-3 mb-0">
                  Data da Contribuição -{" "}
                  {new Date(data.DataContribuicao).toLocaleDateString()}{" "}
                </p>
              </div>
              <button
                onClick={toggleModal}
                className="text-white text-4xl leading-none"
              ></button>

              <div className="flex flex-col gap-4 text-gray-800">
                <div className="grid grid-cols-1 md:grid-cols-1 gap-3">
                  <div>
                    <p className="text-sm text-gray-600">Tipo de Doação</p>
                    <p className="font-semibold">{data.TipoDoacao}</p>
                  </div>

                  <div>
                    <p className="text-sm text-gray-600">Quantidade</p>
                    <p className="font-semibold">
                      {Intl.NumberFormat("pt-BR").format(data.Quantidade)}
                    </p>
                  </div>

                  {data.Meta !== null && (
                    <div>
                      <p className="text-sm text-gray-600">Meta</p>
                      <p className="font-semibold">
                        {typeof data.Meta === "number" &&
                        Number.isFinite(data.Meta)
                          ? new Intl.NumberFormat("pt-BR").format(data.Meta)
                          : "-"}
                      </p>
                    </div>
                  )}

                  {data.Gastos !== null && (
                    <div>
                      <p className="text-sm text-gray-600">Gastos</p>
                      <p className="font-semibold"> {formatBRL(data.Gastos)}</p>
                    </div>
                  )}

                  {data.NomeAlimento && (
                    <div className="flex justify-between">
                      <div>
                        <p className="text-sm text-gray-600"> Alimentos: </p>
                        <p className="font-semibold ">{data.NomeAlimento} </p>
                      </div>

                      <div>
                        <p className="text-sm text-gray-600">Peso unitário:</p>
                        <p className="font-semibold ">
                          {data.PesoUnidade} kg/g
                        </p>
                      </div>
                    </div>
                  )}

                  {data.Comprovante?.Imagem ? (
                    <div>
                      <p className="text-sm text-gray-600 mb-2">Comprovante</p>
                      <a
                        href={data.Comprovante.Imagem}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 underline"
                      >
                        Abrir comprovante
                      </a>
                    </div>
                  ) : (
                    <div>
                      <p className="text-sm text-gray-600 mb-2">Comprovante</p>
                      <p className="text-gray-500">
                        Nenhum comprovante foi anexado
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
            <DeleteContribution
              IdContribuicao={data.IdContribuicao}
              TipoDoacao={data.TipoDoacao}
              onDeleted={() => {
                setIsOpen(false);
                onDeleted?.();
              }}
            />
          </div>
        </div>
      </div>
    </Modal>
  );
};
export default RecordsModal;
