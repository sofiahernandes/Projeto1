import { SetStateAction } from "react";

interface Properties {
  buttonSelected: boolean;
  setButtonSelected: (arg: SetStateAction<boolean>) => void;
}

export default function SwitchViewButton({ buttonSelected, setButtonSelected }: Properties) {

  return (
      <button
      type="button"
      onClick={() => setButtonSelected((prev) => !prev)}
      className={`px-3 py-1 rounded border transition
        ${buttonSelected ? "bg-gray-200 text-black" : "bg-white text-primary"}`}
      aria-pressed={buttonSelected}
       >
      {buttonSelected ? "Tabela" : "Grid"}
    </button>
  )
}

  