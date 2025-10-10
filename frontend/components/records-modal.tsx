// records-modal.tsx (popup) - fica na pasta /components

import placeholderComprovante from '@/assets/placeholderComprovante.jpg'
import Modal from "../hooks/use-modal";
import DeleteContribution from '@/components/delete-contribution'
 

interface ContributionData {
  RaUsuario: number;
  TipoDoacao: string;
  Quantidade: number;
  Meta?: number;
  Gastos?: number;
  Fonte?: string;
  Comprovante?: string;
  IdContribuicao: number;
  DataContribuicao: string;
}

interface RecordsModalProps {
  data: ContributionData;
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const RecordsModal: React.FC<RecordsModalProps> = ({
  data,
  isOpen,
  setIsOpen,
}) => {
  if (!data) return null;

  const toggleModal = () => {
    setIsOpen(!isOpen);
  };

  return (
    <Modal isActive={isOpen} onClose={toggleModal}>
      <div className="overscroll-none grid grid-cols-1 md:grid-cols-1 overflow-hidden  drop-shadow-2xl items-center relative bg-[#FFFDF5]">
        <div className="col-span-full md:col-span-3 ">
          <div className="flex max-w-[95vw] flex-col gap-5 z-10 px-7 py-10">
            <div>
              <h2 className="text-xl font-semibold">{data.Fonte}</h2>
              <div>
                <p className="text-sm text-gray-600 mt-3 mb-0">
                  Data da Contribuição -{" "}
                  {new Date(data.DataContribuicao).toLocaleDateString()}{" "}
                </p>
              </div>
              <button
                onClick={toggleModal}
                className="text-white text-2xl leading-none"
              ></button>

              <div className="flex flex-col gap-4 text-gray-800">
                <div className="grid grid-cols-1 md:grid-cols-1 gap-3">
                  <div>
                    <p className="text-sm text-gray-600">Tipo de Doação</p>
                    <p className="font-semibold">{data.TipoDoacao}</p>
                  </div>

                  <div>
                    <p className="text-sm text-gray-600">Quantidade</p>
                    <p className="font-semibold">{data.Quantidade}</p>
                  </div>

                  {data.Meta && (
                    <div>
                      <p className="text-sm text-gray-600">Meta</p>
                      <p className="font-semibold">{data.Meta}</p>
                    </div>
                  )}

                  {data.Gastos && (
                    <div>
                      <p className="text-sm text-gray-600">Gastos</p>
                      <p className="font-semibold">{data.Gastos}</p>
                    </div>
                  )}
                </div>

                {data.Comprovante && (
                  <div className="mt-4 ">
                    <p className="text-sm text-gray-600 mb-2">Comprovante</p>
                    <div className='flex items-start'> 
                    {/* {data.Comprovante ? (
                      <img
                        src={data.Comprovante}
                        alt="Anexo de comprovante"
                        className="rounded-md w-full max-h-[300px] object-contain border border-gray-300"
                      />
                    ) : ( */}
                      <img src={placeholderComprovante.src} alt="Anexo de comprovante" className="rounded-md aspect-square max-h-[50px] object-contain border border-gray-300" />
                    </div>
                  </div>
                )}
              </div>
            </div>
            <DeleteContribution/>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default RecordsModal;
