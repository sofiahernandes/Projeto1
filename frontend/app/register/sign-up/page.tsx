"use client";

import React from "react";
import BackHome from "@/components/back-home";
import SigninTabs from "@/components/tabs-sign";

export default function Cadastro() {
  
  return (
    <div className="w-full">
      <div className="absolute left-0 top-0">
        <BackHome />
      </div>

      <div className="min-h-screen flex justify-center items-center p-6">
        <div className="flex flex-col md:flex-row w-full max-w-3xl">
          <section className="bg-primary h-120 m-1 flex flex-col rounded-lg items-center justify-center md:w-1/2 p-6 text-white">
            <h1 className="flex text-center font-bold text-[#fff] text-[22px] mb-1">
              Cadastro de
              <br />
              Alunos-mentores
            </h1>
            <img
              src="https://assets.zyrosite.com/cdn-cgi/image/format=auto,w=180,fit=crop,q=95/dOq4lP0kVLiEl8Z3/lideranaas-empaticas-logo-AoPWG9oBrrt3QGv0.png"
              alt="logo lideranças empáticas"
              className="mb-6 w-28 md:w-36"
            />
          </section>

          <section className="border border-[#b4b4b4] rounded-lg m-1 flex flex-col items-center justify-center md:w-1/2">
        <SigninTabs
        />
        </section>
        
        </div>
      </div>
    </div>
    
  );
}
