import { SetStateAction } from "react";
import { Grip, Rows3 } from "lucide-react";

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
        ${buttonSelected ? "bg-[#f4f3f1] hover:bg-[#426E55]/80 border border-gray-300 shadow-md duration-300 cursor-pointer" : " hover:bg-[#426E55]/80 border border-gray-300 shadow-md duration-300 cursor-pointer"}`}
      aria-pressed={buttonSelected}
       >
      {buttonSelected ? (<Grip/>) : (<Rows3/>)}
    </button>
  )
}

  