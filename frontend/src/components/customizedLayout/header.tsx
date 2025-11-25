"use client";
import React from "react";
import { Bell } from "lucide-react";

const CustomizedHeader: React.FC = () => {

  return (
    <section className="h-[8vh] py-6 px-6 flex items-center justify-between bg-primary">
      <div>
        <h1 className="text-white text-sm">
          <span className="text-white">Admin</span>{" "}
          <span className="font-light">Dashboard</span>
        </h1>
      </div>
      <div>
        <div className="flex items-center gap-4">
          <div className="relative">
            <Bell className="w-4 h-4 text-white" />
            <span className="absolute -top-2 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white">
              2
            </span>
          </div>
          <div className="flex items-center gap-2 text-white">
            <span className="bg-secondary h-6 w-6 text-sm flex items-center justify-center rounded-full">
              M
            </span>
            <span className="text-sm">Marcos</span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CustomizedHeader;
