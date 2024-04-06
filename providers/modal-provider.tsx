'use client'

import { StoreModal } from "@/components/modals/store-modal";
import { useEffect, useState } from "react"


export const ModalProvider = () => {
    const [isMounted, setIsMounted] = useState(false);

    useEffect(()=>{
        setIsMounted(true);
    },[]);

    if(!isMounted){
        return null;
    }
    return(
         <>
         <StoreModal/>
         </>
    )
}

//if(!false) -> if(true){return null}
//untill the life cycle has run (only something happens in client comp)
//means change in useState
//it return null

