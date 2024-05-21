import { CiCircleChevLeft } from "react-icons/ci";

export default function Buttons(){
    return <>
    <button class="bg-purple-500 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded-full">
        <a href="/" >{<CiCircleChevLeft />}Go back</a> 
    </button>
    </>
}