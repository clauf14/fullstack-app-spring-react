import { VscAccount } from "react-icons/vsc";
import { VscAdd } from "react-icons/vsc";

export default function Buttons( {loginInfo} ){
    return <>
    <a href="/shop/add">
                <button className="bg-indigo-600 hover:bg-indigo-800 text-white font-bold rounded-full py-2 mx-5 px-4 my-2">
                    <span style={{ display: 'flex', alignItems: 'center' }}>
                        <VscAdd style={{ fontSize: '1.2em', marginRight: '7px' }}/>
                        Add a product
                    </span>
                </button>
    </a>
    <a href={`/users/${loginInfo.id}`}>
        <button className="bg-indigo-600 hover:bg-indigo-800 text-white font-bold rounded-full py-2 mx-5 px-4 my-2">
            <span style={{ display: 'flex', alignItems: 'center' }}>
                <VscAccount style={{ fontSize: '1.2em', marginRight: '7px' }} />
                See my profile
            </span>
        </button>
    </a>
    </>
}