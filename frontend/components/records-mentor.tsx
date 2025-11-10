import placeholderComprovante from "@/assets/placeholderComprovante.jpg";
import Modal from "../hooks/use-modal";
import formatBRL from "./formatBRL";

interface ContributionData {
  RaUsuario: number;
  TipoDoacao: string;
  Quantidade: number;
  Meta?: number;
  Gastos?: number;
  Fonte?: string;
  comprovante?: {
    IdComprovante: number;
    Imagem: string;
  };
  IdContribuicao: number;
  DataContribuicao: string;
  alimentos?: {
    NomeAlimento: string;
    Pontuacao?: number | string;
    Quantidade?: number;
  }[];
  PontuacaoAlimento: number;
  PesoUnidade: number;
  uuid: string;
}

interface RecordsMentorProps {
  data: ContributionData;
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const RecordsMentor: React.FC<RecordsMentorProps> = ({
  data,
  isOpen,
  setIsOpen,
}) => {
  if (!data) return null;
  console.log("Dados recebidos no modal:", data);

  const toggleModal = () => {
    setIsOpen(!isOpen);
  };

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
                      {data.TipoDoacao === "Financeira" ? " reais" : " kg"}
                    </p>
                  </div>

                  {data.Meta != null && (
                    <div>
                      <p className="text-sm text-gray-600">Meta</p>
                      <p className="font-semibold">
                        {typeof data.Meta === "number" &&
                          (Number.isFinite(data.Meta)
                            ? new Intl.NumberFormat("pt-BR").format(data.Meta)
                            : "-")}
                        {data.TipoDoacao === "Financeira" ? " reais" : " kg"}
                      </p>
                    </div>
                  )}

                  {data.Gastos !== null && (
                    <div>
                      <p className="text-sm text-gray-600">Gastos</p>
                      <p className="font-semibold"> {formatBRL(data.Gastos)}</p>
                    </div>
                  )}

                  {data.TipoDoacao === "Alimenticia" &&
                  data.alimentos &&
                  data.alimentos.length > 0 ? (
                    <ul className="flex justify-between">
                      <div>
                        <p className="text-sm text-gray-600">
                          {" "}
                          Alimentos arrecadados
                        </p>
                        {data.alimentos.map((a, i) => (
                          <li key={i} className="font-semibold">
                            {" "}
                            {a.NomeAlimento}
                          </li>
                        ))}
                      </div>
                      <div>
                        <p className="text-sm text-gray-600"> Pontuação item</p>
                        {data.alimentos.map((a, i) => (
                          <li key={i} className="font-semibold">
                            {a.Pontuacao}
                          </li>
                        ))}
                      </div>
                    </ul>
                  ) : data.TipoDoacao === "Alimenticia" ? (
                    <p>Nenhum alimento registrado.</p>
                  ) : null}

                  {data.comprovante?.Imagem ? (
                    <div>
                      <p className="text-sm text-gray-600 mb-2">
                        Comprovante da doação
                      </p>
                      <a
                        href={data.comprovante.Imagem}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-black-600 underline"
                      >
                        {" "}
                        Abrir comprovante
                      </a>
                    </div>
                  ) : (
                    <div>
                      <img
                        src={placeholderComprovante.src}
                        alt="Sem comprovantes anexados"
                        className="rounded-md aspect-square max-h-[45px] object-contain border border-gray-200 mb-6"
                      />
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default RecordsMentor;
